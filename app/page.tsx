"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Target, FileCheck, TrendingUp, Shield, Users } from "lucide-react"

export default function HomePage() {
  const [showImage, setShowImage] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      // Fade to image after video ends
      setShowImage(true)
    }

    video.addEventListener("ended", handleVideoEnd)

    return () => {
      video.removeEventListener("ended", handleVideoEnd)
    }
  }, [])

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop={false}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            showImage ? "opacity-0" : "opacity-100"
          }`}
        >
          <source src="/vid.mp4" type="video/mp4" />
          <source src="/vid.webm" type="video/webm" />
          {/* Fallback if video doesn't load */}
        </video>

        {/* Background Image - fades in after video */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            showImage ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: 'url(/land.jpg)',
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
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
      <section className="border-y border-border bg-accent/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Why Choose ELIDZ-STP?</h2>
            <p className="text-lg text-muted-foreground">The smarter way to find and apply for business funding</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Secure & Trusted</h3>
              <p className="leading-relaxed text-muted-foreground">
                Enterprise-grade security with admin oversight and approval workflows
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">AI-Powered</h3>
              <p className="leading-relaxed text-muted-foreground">
                Smart matching algorithms find opportunities you'd never discover manually
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Expert Support</h3>
              <p className="leading-relaxed text-muted-foreground">
                Comprehensive admin tools and user support throughout your funding journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join hundreds of successful SMMEs who have secured funding through our platform
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Create Your Free Account
              <Sparkles className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
