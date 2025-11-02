"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [username, setUsername] = useState("")
  const [tempUsername, setTempUsername] = useState("")
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [message, setMessage] = useState("")

  const indianLanguages = {
    en: "English",
    hi: "हिंदी (Hindi)",
    ta: "தமிழ் (Tamil)",
    te: "తెలుగు (Telugu)",
    kn: "ಕನ್ನಡ (Kannada)",
    ml: "മലയാളം (Malayalam)",
    mr: "मराठी (Marathi)",
    gu: "ગુજરાતી (Gujarati)",
    bn: "বাংলা (Bengali)",
    pa: "ਪੰਜਾਬੀ (Punjabi)",
    or: "ଓଡିଆ (Odia)",
    as: "অসমীয়া (Assamese)",
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setUsername(userData.fullName)
      setTempUsername(userData.fullName)
    } else {
      router.push("/auth/signin")
    }

    const storedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(storedDarkMode)
    if (storedDarkMode) {
      document.documentElement.classList.add("dark")
    }

    const storedLanguage = localStorage.getItem("language") || "en"
    setLanguage(storedLanguage)
  }, [router])

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const handleUsernameChange = () => {
    if (tempUsername.trim().length < 2) {
      setMessage("Username must be at least 2 characters long")
      return
    }

    const updatedUser = { ...user, fullName: tempUsername }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setUsername(tempUsername)
    setShowUsernameForm(false)
    setMessage("Username updated successfully!")

    setTimeout(() => setMessage(""), 3000)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4">
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Account Information</h2>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-foreground font-medium">{user.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Username</p>
            <p className="text-foreground font-medium">{username}</p>
          </div>
        </div>

        {/* Username Change Form */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Change Username</h2>
          {!showUsernameForm ? (
            <button
              onClick={() => setShowUsernameForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium"
            >
              Edit Username
            </button>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter new username"
                className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUsernameChange}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowUsernameForm(false)
                    setTempUsername(username)
                  }}
                  className="px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Language Preference</h2>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.entries(indianLanguages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground mt-2">
            Current: {indianLanguages[language as keyof typeof indianLanguages]}
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Display Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                {darkMode ? "Dark mode is enabled" : "Light mode is active"}
              </p>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                darkMode ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  darkMode ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div
            className={`p-4 rounded-md text-sm font-medium ${
              message.includes("successfully")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
