"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"breathing" | "zooming" | "complete">("breathing")

  useEffect(() => {
    // Phase 1: Breathing animation for 2 seconds
    const breathingTimer = setTimeout(() => {
      setPhase("zooming")
      // Notify header to prepare for logo transition
      window.dispatchEvent(new CustomEvent("splashZoomStart"))
    }, 2000)

    // Phase 2: Zoom out animation for 1 second
    const zoomTimer = setTimeout(() => {
      setPhase("complete")
      // Notify header that splash is complete
      window.dispatchEvent(new CustomEvent("splashComplete"))
      onComplete()
    }, 3000) // 2000ms breathing + 1000ms zoom

    return () => {
      clearTimeout(breathingTimer)
      clearTimeout(zoomTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-black transition-opacity duration-500 ${
        phase === "complete" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
          phase === "breathing"
            ? "animate-breathe"
            : phase === "zooming"
              ? "animate-zoom-to-header"
              : ""
        }`}
      >
        <Image
          src="/home.png"
          alt="ELIDZ-STP"
          width={600}
          height={200}
          className={`w-auto object-contain transition-all duration-1000 ${
            phase === "breathing"
              ? "h-48 md:h-64 lg:h-80"
              : phase === "zooming"
                ? "h-10"
                : "h-10"
          }`}
          priority
          id="splash-logo"
        />
      </div>
    </div>
  )
}

