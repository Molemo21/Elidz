"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Target, FileCheck, TrendingUp, Shield, Users } from "lucide-react"
import { SplashScreen } from "@/components/splash-screen"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentVideo, setCurrentVideo] = useState<1 | 2>(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem("splashShown")
    if (splashShown === "true") {
      setShowSplash(false)
    }
  }, [])

  useEffect(() => {
    // Don't initialize videos if splash screen is showing
    if (showSplash) return

    let timeoutId: NodeJS.Timeout
    let video1: HTMLVideoElement | null = null
    let video2: HTMLVideoElement | null = null
    let handleVideo1End: (() => void) | null = null
    let handleVideo2End: (() => void) | null = null
    let handleCanPlay: (() => void) | null = null

    // Small delay to ensure videos are in the DOM after splash screen transition
    timeoutId = setTimeout(() => {
      video1 = videoRef.current
      video2 = video2Ref.current

      if (!video1 || !video2) return

      // Check if videos are still connected to the DOM
      if (!video1.isConnected || !video2.isConnected) return

      handleVideo1End = () => {
        // Check if video2 is still connected before playing
        if (video2 && video2.isConnected) {
          setCurrentVideo(2)
          video2.play().catch((error) => {
            // Silently handle play errors (e.g., video removed from DOM)
            console.debug("Video2 play error:", error)
          })
        }
      }

      handleVideo2End = () => {
        // Check if video1 is still connected before playing
        if (video1 && video1.isConnected) {
          setCurrentVideo(1)
          video1.play().catch((error) => {
            // Silently handle play errors (e.g., video removed from DOM)
            console.debug("Video1 play error:", error)
          })
        }
      }

      // Ensure videos start loading
      video1.load()
      video2.load()

      // Wait for videos to be ready before playing
      const initializeVideos = () => {
        // Only start playing if videos are still connected
        if (video1 && video2 && video1.isConnected && video2.isConnected) {
          video1.play().catch((error) => {
            // Log error for debugging (autoplay restrictions, video removed, etc.)
            console.debug("Video1 initial play error:", error)
          })
        }
      }

      // Handler for when videos can play
      let hasInitialized = false
      handleCanPlay = () => {
        // Check if both videos have enough data to play (readyState >= 2 means HAVE_CURRENT_DATA)
        if (!hasInitialized && video1 && video2 && video1.readyState >= 2 && video2.readyState >= 2) {
          hasInitialized = true
          initializeVideos()
          if (video1 && video1.isConnected) {
            video1.removeEventListener("canplaythrough", handleCanPlay!)
            video1.removeEventListener("canplay", handleCanPlay!)
            video1.removeEventListener("loadeddata", handleCanPlay!)
          }
          if (video2 && video2.isConnected) {
            video2.removeEventListener("canplaythrough", handleCanPlay!)
            video2.removeEventListener("canplay", handleCanPlay!)
            video2.removeEventListener("loadeddata", handleCanPlay!)
          }
        }
      }

      // Try to play immediately if videos are already loaded
      if (video1.readyState >= 2 && video2.readyState >= 2) {
        initializeVideos()
      } else {
        // Wait for videos to load - use multiple events for better compatibility
        video1.addEventListener("canplaythrough", handleCanPlay)
        video2.addEventListener("canplaythrough", handleCanPlay)
        video1.addEventListener("canplay", handleCanPlay)
        video2.addEventListener("canplay", handleCanPlay)
        video1.addEventListener("loadeddata", handleCanPlay)
        video2.addEventListener("loadeddata", handleCanPlay)

        // Fallback: try to play after 2 seconds regardless of readyState
        setTimeout(() => {
          if (!hasInitialized && video1 && video2 && video1.isConnected && video2.isConnected) {
            hasInitialized = true
            initializeVideos()
          }
        }, 2000)
      }

      if (handleVideo1End) video1.addEventListener("ended", handleVideo1End)
      if (handleVideo2End) video2.addEventListener("ended", handleVideo2End)
    }, 100) // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timeoutId)
      // Clean up event listeners
      if (video1 && video1.isConnected && handleVideo1End) {
        video1.removeEventListener("ended", handleVideo1End)
      }
      if (video2 && video2.isConnected && handleVideo2End) {
        video2.removeEventListener("ended", handleVideo2End)
      }
      if (video1 && video1.isConnected && handleCanPlay) {
        video1.removeEventListener("canplaythrough", handleCanPlay)
        video1.removeEventListener("canplay", handleCanPlay)
        video1.removeEventListener("loadeddata", handleCanPlay)
      }
      if (video2 && video2.isConnected && handleCanPlay) {
        video2.removeEventListener("canplaythrough", handleCanPlay)
        video2.removeEventListener("canplay", handleCanPlay)
        video2.removeEventListener("loadeddata", handleCanPlay)
      }
    }
  }, [showSplash])

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true")
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className={`bg-background -mt-20 transition-opacity duration-500 ${showSplash ? "opacity-0" : "opacity-100"}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border min-h-screen flex items-center">
        {/* First Video Background */}
        <video
          ref={videoRef}
          muted
          playsInline
          loop={false}
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            currentVideo === 1 ? "opacity-50 z-10" : "opacity-0 z-0"
          }`}
          style={{ filter: "brightness(0.6)" }}
        >
          <source src="/vid.mp4" type="video/mp4" />
          <source src="/vid.webm" type="video/webm" />
        </video>

        {/* Second Video Background */}
        <video
          ref={video2Ref}
          muted
          playsInline
          loop={false}
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            currentVideo === 2 ? "opacity-50 z-10" : "opacity-0 z-0"
          }`}
          style={{ filter: "brightness(0.6)" }}
        >
          <source src="/vid2.mp4" type="video/mp4" />
          <source src="/vid2.webm" type="video/webm" />
        </video>

        {/* Dark Overlay - increased darkness for better text readability */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 pt-32 md:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Find the Perfect Funding for Your Business
            </h1>

            <p className="mb-8 text-pretty text-lg leading-relaxed text-white/90 md:text-xl">
              Our AI matches you with the best funding opportunities, auto-completes applications, and guides you
              through every step of the process.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-orange-500 text-white hover:bg-orange-600">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">How It Works</h2>
          <p className="text-lg text-muted-foreground">Four simple steps to secure funding for your business</p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Image on the left */}
          <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
            <Image 
              src="/elidz.png" 
              alt="ELIDZ-STP" 
              fill
              className="object-cover"
            />
          </div>

          {/* Information on the right */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                <Target className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">1. Tell Us Your Needs</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Share your business details and funding requirements. Our AI learns what you need.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                <Sparkles className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">2. Get Matched</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Our AI searches thousands of funding opportunities and finds the perfect matches for you.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                <FileCheck className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">3. Review & Submit</h3>
                <p className="leading-relaxed text-muted-foreground">
                  AI auto-completes applications using your profile. Review, edit, sign, and submit.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">4. Track Progress</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Monitor your applications and receive real-time updates on approvals and outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative overflow-hidden border-y border-border py-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/proliink meet.png')",
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Why Choose ELIDZ-STP?</h2>
            <p className="text-lg text-white/90">The smarter way to find and apply for business funding</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Secure & Trusted</h3>
              <p className="leading-relaxed text-white/90">
                Enterprise-grade security with admin oversight and approval workflows
              </p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">AI-Powered</h3>
              <p className="leading-relaxed text-white/90">
                Smart matching algorithms find opportunities you'd never discover manually
              </p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Expert Support</h3>
              <p className="leading-relaxed text-white/90">
                Comprehensive admin tools and user support throughout your funding journey
              </p>
            </div>
          </div>
        </div>
      </section>

      </div>
    </>
  )
}
