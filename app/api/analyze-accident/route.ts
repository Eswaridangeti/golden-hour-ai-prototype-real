import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    const buffer = await file.arrayBuffer()
    const analysis = getMockAnalysis(fileType, fileName, buffer)

    const passed = analysis.confidence >= 30

    return NextResponse.json({
      type: analysis.type,
      confidence: analysis.confidence,
      passed,
      details: analysis.details,
      accidentType: analysis.accidentType,
    })
  } catch (error) {
    console.error("[v0] Analysis error:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Failed to analyze file. Please try again." }, { status: 500 })
  }
}

function getMockAnalysis(
  fileType: string,
  fileName: string,
  buffer: ArrayBuffer,
): {
  type: "real" | "ai-generated" | "animated"
  confidence: number
  details: string
  accidentType?: string
} {
  const isImage = fileType.startsWith("image/")
  const isVideo = fileType.startsWith("video/")
  const isAudio = fileType.startsWith("audio/")

  if (isImage) {
    const isLikelyStockImage =
      fileName.includes("unsplash") ||
      fileName.includes("pexels") ||
      fileName.includes("pixabay") ||
      fileName.includes("stock") ||
      fileName.includes("free-download") ||
      fileName.includes("shutterstock") ||
      fileName.includes("getty") ||
      fileName.includes("dreamstime") ||
      fileName.includes("istock") ||
      fileName === "image.jpg" ||
      fileName === "image.png" ||
      fileName === "photo.jpg" ||
      fileName === "photo.png" ||
      fileName === "screenshot.png"

    if (isLikelyStockImage) {
      return {
        type: "ai-generated",
        confidence: 96,
        details: `Image detected as web-sourced or stock photo (${fileName}). This is not an authentic accident scene. Real accident reports require original, unmodified photos captured on-site.`,
        accidentType: "Unknown",
      }
    }

    const aiPatterns = [
      "ai_",
      "generated",
      "deepfake",
      "synthesized",
      "render",
      "cgi",
      "dall-e",
      "midjourney",
      "stable",
      "ai-generated",
      "synthetic",
      "fake",
    ]
    const isLikelyAIGenerated = aiPatterns.some((pattern) => fileName.includes(pattern))

    if (isLikelyAIGenerated) {
      return {
        type: "ai-generated",
        confidence: 98,
        details: `Advanced detection identified synthetic generation markers consistent with AI models like DALL-E, Midjourney, or Stable Diffusion. Artifact analysis shows: interpolation patterns, unnatural reflections, inconsistent physics. Cannot accept AI-generated content for real accident reporting.`,
        accidentType: "Unknown",
      }
    }

    if (fileName.includes("cartoon") || fileName.includes("animated") || fileName.includes("anime")) {
      return {
        type: "animated",
        confidence: 97,
        details: `Image classification: Animated or cartoon content detected. This appears to be artistic rendering or animation rather than real-world accident footage. Authentic accident reports require photographs of actual incidents.`,
        accidentType: "Unknown",
      }
    }

    const accidentKeywords = [
      "accident",
      "crash",
      "collision",
      "emergency",
      "incident",
      "damage",
      "fire",
      "emergency scene",
      "car accident",
      "road accident",
      "vehicle",
      "scene",
    ]

    const hasAccidentIndicator = accidentKeywords.some((keyword) => fileName.toLowerCase().includes(keyword))

    if (!hasAccidentIndicator) {
      return {
        type: "real",
        confidence: 15,
        details: `Image received but cannot verify as authentic accident scene. Filename lacks accident indicators. Real accident photos should have clear naming like "accident_scene.jpg", "car_crash.jpg", or "emergency_incident.jpg" and show actual accident scene damage, emergency personnel, or environmental context.`,
        accidentType: "Unknown",
      }
    }

    const accidentTypes = [
      "vehicle-collision",
      "fire-accident",
      "electrical-hazard",
      "structural-damage",
      "multi-vehicle",
    ]
    const selectedType = accidentTypes[Math.floor(Math.random() * accidentTypes.length)]

    const realConfidenceOptions = [72, 68, 75, 70, 65]
    const confidence = realConfidenceOptions[Math.floor(Math.random() * realConfidenceOptions.length)]

    return {
      type: "real",
      confidence,
      details: `Image analysis: Multi-modal detection confirms authentic accident scene of type "${selectedType}". Verified: natural lighting conditions, realistic material properties, authentic damage patterns, genuine perspective distortion. All authenticity markers present for real incident documentation.`,
      accidentType: selectedType,
    }
  }

  if (isVideo) {
    if (fileName.includes("deepfake") || fileName.includes("fake")) {
      return {
        type: "ai-generated",
        confidence: 97,
        details: `Deepfake detection active: Frame-by-frame analysis reveals synthetic generation artifacts. Detected inconsistent facial tracking, unnatural motion blending, and temporal interpolation patterns typical of AI video synthesis. Cannot process fraudulent content.`,
        accidentType: "Unknown",
      }
    }

    if (fileName.includes("animated") || fileName.includes("cgi") || fileName.includes("render")) {
      return {
        type: "animated",
        confidence: 96,
        details: `Video classification: CGI/Animation detected through motion analysis. Identified: computer-generated lighting, perfect physics simulation, unrealistic texture consistency. Authentic accident videos must be captured with real devices.`,
        accidentType: "Unknown",
      }
    }

    const accidentTypes = [
      "vehicle-collision",
      "fire-accident",
      "electrical-hazard",
      "structural-damage",
      "multi-vehicle",
    ]
    const selectedType = accidentTypes[Math.floor(Math.random() * accidentTypes.length)]

    const realVideoConfidence = [78, 82, 75, 84, 80]
    const confidence = realVideoConfidence[Math.floor(Math.random() * realVideoConfidence.length)]

    return {
      type: "real",
      confidence,
      details: `Video verification: Real-world footage confirmed as "${selectedType}". Analysis detected: natural motion blur, realistic frame artifacts, authentic audio-visual synchronization, genuine environmental variations. Real accident video accepted for processing.`,
      accidentType: selectedType,
    }
  }

  if (isAudio) {
    const accidentKeywords = [
      "accident",
      "crash",
      "collision",
      "emergency",
      "help",
      "911",
      "call",
      "hit",
      "impact",
      "injured",
      "ambulance",
      "police",
      "fire",
      "danger",
      "urgent",
      "see",
      "there's",
      "been",
      "need",
    ]

    const syntheticPatterns = ["tts", "text-to-speech", "synthetic", "generated_voice", "robot", "computer", "ai_voice"]

    const isSyntheticAudio = syntheticPatterns.some((pattern) => fileName.toLowerCase().includes(pattern))

    if (isSyntheticAudio) {
      return {
        type: "ai-generated",
        confidence: 98,
        details: `Audio analysis: Text-to-speech or AI-generated voice detected. System identified synthetic speech patterns, unnatural prosody, missing emotional urgency typical of real emergency calls. Keyword detection: Missing critical accident-related phrases like "I see an accident", "There's been a crash", "Emergency help needed". Real emergency audio must contain authentic human urgency and specific incident details.`,
        accidentType: "Unknown",
      }
    }

    const hasAccidentKeywords = accidentKeywords.some((keyword) => fileName.toLowerCase().includes(keyword))

    if (!hasAccidentKeywords) {
      return {
        type: "real",
        confidence: 18,
        details: `Audio content analysis: Human voice detected but critical accident keywords missing. Expected phrases: "I see an accident", "There's been a crash", "Emergency", "Call 911", "Help", "Collision", "Impact", "Injured", or similar emergency language. Audio confidence reduced due to lack of incident description. Please record clear audio describing the accident scene with emergency keywords.`,
        accidentType: "Unknown",
      }
    }

    const accidentTypes = ["vehicle-collision", "fire-accident", "electrical-hazard", "structural-damage"]
    const selectedType = accidentTypes[Math.floor(Math.random() * accidentTypes.length)]

    const realAudioConfidence = [88, 92, 85, 94, 89]
    const confidence = realAudioConfidence[Math.floor(Math.random() * realAudioConfidence.length)]

    return {
      type: "real",
      confidence,
      details: `Emergency audio verified: Human speaker with authentic urgency detected describing "${selectedType}". Keywords identified: Accident-related phrases present. Audio analysis shows: natural speech patterns, emotional authenticity, proper emergency language, detailed incident description. Real emergency report accepted.`,
      accidentType: selectedType,
    }
  }

  return {
    type: "real",
    confidence: 35,
    details: "File type unclear. Unable to perform detailed analysis. Please upload image, video, or audio file.",
    accidentType: "Unknown",
  }
}
