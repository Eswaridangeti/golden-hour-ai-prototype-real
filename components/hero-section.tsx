"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-muted">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-foreground">Every Second Saves a Life</h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          AI-powered accident detection that alerts emergency services in real-time, reducing response time and saving
          lives.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/demo">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8">
              Try Demo →
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
