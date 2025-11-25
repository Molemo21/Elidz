import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              ELIDZ-STP collects information necessary to provide funding application services, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Business and personal contact information</li>
              <li>Financial and business profile data</li>
              <li>Funding requirements and preferences</li>
              <li>Application and match history</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We use collected information to match you with funding opportunities, process applications, 
              improve our AI matching algorithms, and provide customer support.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We implement industry-standard security measures including encryption, secure authentication, 
              and regular security audits to protect your data.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You have the right to access, update, or delete your personal information at any time 
              through your account settings or by contacting our support team.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

