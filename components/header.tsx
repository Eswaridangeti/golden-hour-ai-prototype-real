"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setShowDropdown(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Image src="/logo.png" alt="GoldenHour AI Logo" width={40} height={40} />
            <span>GoldenHour AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition">
              Home
            </Link>
            <Link href="/demo" className="text-foreground hover:text-primary transition">
              Demo
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition">
              Dashboard
            </Link>
            <Link href="/partners" className="text-foreground hover:text-primary transition">
              Partners
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition">
              Contact
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
                >
                  <span className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-semibold">
                    {user.fullName?.charAt(0).toUpperCase() || "U"}
                  </span>
                  {user.fullName}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-border z-10">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-foreground hover:text-primary transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
