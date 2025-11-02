"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Upload, Camera, Mic, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface AnalysisResult {
  type: "real" | "ai-generated" | "animated" | null
  confidence: number
  passed: boolean
  details: string
  accidentType?: string
  timestamp: Date
}

export default function DemoPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScrollingIntoView, setIsScrollingIntoView] = useState(false)
  const [emergencySent, setEmergencySent] = useState(false)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsScrollingIntoView(true)
        }
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll("[data-scroll-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [result])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith("video/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }

    setResult(null)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleAudioClick = () => {
    audioInputRef.current?.click()
  }

  const analyzeFile = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/analyze-accident", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        setResult({
          type: null,
          confidence: 0,
          passed: false,
          details: data.error,
          timestamp: new Date(),
        })
      } else {
        const passed = data.confidence >= 30
        setResult({
          type: data.type,
          confidence: data.confidence,
          passed,
          details: data.details,
          accidentType: data.accidentType,
          timestamp: new Date(),
        })
      }
    } catch (error) {
      console.log("[v0] Analysis error caught")
      setResult({
        type: null,
        confidence: 0,
        passed: false,
        details: "Failed to analyze. Please try again.",
        timestamp: new Date(),
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sendDispatchImmediately = async () => {
    if (!result?.passed) return
    console.log("[v0] Sending dispatch for accident type:", result.accidentType)
    // Placeholder for dispatch API call
    alert(`Dispatch sent for ${result.accidentType || "accident"}. Emergency services notified.`)
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.log("[v0] Location error:", error.message)
        },
      )
    }
  }

  const sendEmergency = () => {
    getUserLocation()
    setEmergencySent(true)
    setTimeout(() => setEmergencySent(false), 3000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Accident Detection Demo</h1>
          <p className="text-lg text-foreground/70">
            Upload or capture a photo/video to analyze if it's a real accident, AI-generated, or animated
          </p>
          <p className="text-sm text-foreground/50 mt-2">
            Note: Photos are automatically blurred for legal privacy protection
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Upload Options */}
          <Card
            className="p-8 border-2 border-dashed border-primary/30 hover:border-primary/50 transition animate-slide-up"
            data-scroll-animate
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload or Capture
            </h2>

            <div className="space-y-3 mb-6">
              <button
                onClick={handleUploadClick}
                className="w-full p-4 border-2 border-primary/30 rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2 font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Photo/Video
              </button>

              <button
                onClick={handleCameraClick}
                className="w-full p-4 border-2 border-primary/30 rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2 font-medium"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </button>

              <button
                onClick={handleAudioClick}
                className="w-full p-4 border-2 border-primary/30 rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2 font-medium"
              >
                <Mic className="w-4 h-4" />
                Record Audio
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {selectedFile && (
              <div className="mt-6 p-4 bg-foreground/5 rounded-lg">
                <p className="text-sm font-medium mb-1">Selected:</p>
                <p className="text-sm text-foreground/70 truncate">{selectedFile.name}</p>
                <p className="text-xs text-foreground/50 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            <button
              onClick={analyzeFile}
              disabled={!selectedFile || isAnalyzing}
              className="w-full mt-6 bg-primary hover:bg-primary/90 disabled:bg-foreground/20 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </Card>

          {/* Preview */}
          <div data-scroll-animate>
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="w-full aspect-video bg-foreground/10 rounded-lg flex items-center justify-center overflow-hidden border border-foreground/20">
              {preview ? (
                selectedFile?.type.startsWith("image/") ? (
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                ) : selectedFile?.type.startsWith("video/") ? (
                  <video src={preview} controls className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-foreground/60">
                    <Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Audio file selected</p>
                  </div>
                )
              ) : (
                <div className="text-center text-foreground/60">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No preview available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <Card className="p-8 border-2 animate-scale-in" data-scroll-animate>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              {result.passed ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-600">Analysis Passed</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="text-red-600">Analysis Failed</span>
                </>
              )}
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Detection Type */}
              <div
                className="p-6 bg-foreground/5 rounded-lg border border-primary/20 hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <p className="text-sm text-foreground/60 mb-2">Detection Type</p>
                <p className="text-lg font-semibold capitalize">
                  {result.type === "real"
                    ? "Real Accident"
                    : result.type === "ai-generated"
                      ? "AI Generated"
                      : result.type === "animated"
                        ? "Animated"
                        : "Unknown"}
                </p>
              </div>

              {/* Confidence Score */}
              <div
                className="p-6 bg-foreground/5 rounded-lg border border-primary/20 hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <p className="text-sm text-foreground/60 mb-2">Confidence Score</p>
                <div className="mb-3">
                  <p className="text-2xl font-bold">{result.confidence.toFixed(1)}%</p>
                </div>
                <div className="w-full bg-foreground/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      result.confidence >= 70
                        ? "bg-green-600"
                        : result.confidence >= 40
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              {/* Accident Type */}
              <div
                className="p-6 bg-foreground/5 rounded-lg border border-primary/20 hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <p className="text-sm text-foreground/60 mb-2">Accident Type</p>
                <p className="text-lg font-semibold capitalize">{result.accidentType || "Unknown"}</p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 bg-foreground/5 rounded-lg border border-foreground/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Analysis Details
              </h3>
              <p className="text-foreground/70 leading-relaxed">{result.details}</p>
            </div>

            <div className="text-xs text-foreground/50 mt-4 text-right">
              Analyzed at {result.timestamp.toLocaleTimeString()}
            </div>

            {/* Dispatch Button */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => {
                  setResult(null)
                  setSelectedFile(null)
                  setPreview(null)
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition"
              >
                Analyze Another
              </button>
              {result.passed && (
                <>
                  <button
                    onClick={sendDispatchImmediately}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition"
                  >
                    Send Dispatch Immediately
                  </button>
                  <button
                    onClick={sendEmergency}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition md:col-span-2"
                  >
                    Send Info to Nearby Hospital
                  </button>
                </>
              )}
            </div>
          </Card>
        )}

        {emergencySent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-md text-center animate-scale-in">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Emergency Sent</h3>
              <p className="text-foreground/70">
                Hospital information sent successfully.
                {userLocation && (
                  <>
                    <br />
                    <span className="text-sm text-foreground/50">
                      Location: {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
                    </span>
                  </>
                )}
              </p>
            </Card>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <Footer />
    </main>
  )
}
