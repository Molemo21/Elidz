import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By accessing and using the ELIDZ-STP Funding Platform, you agree to be bound by these 
              Terms of Service and all applicable laws and regulations.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Platform Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ELIDZ-STP provides an AI-powered platform for matching SMMEs with funding opportunities 
              and facilitating application processes. We do not guarantee funding approval.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Users are responsible for providing accurate information, maintaining account security, 
              and complying with all applicable laws and regulations.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ELIDZ-STP is not liable for funding decisions made by third-party funders or any 
              consequences arising from application submissions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

