import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Book, Key, Webhook, FileText } from "lucide-react"
import Link from "next/link"

export default function APIDocsPage() {
  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">API Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Integrate ELIDZ-STP Funding Platform with your systems using our RESTful API
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Quick start guide for API integration</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Guide</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Key className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Authentication</CardTitle>
              <CardDescription>API keys and authentication methods</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Webhook className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Set up webhooks for real-time updates</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/webhooks">
                <Button variant="outline" className="w-full">Configure</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-6 w-6" />
              API Endpoints
            </CardTitle>
            <CardDescription>Complete API reference documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <code className="text-sm">GET /api/v1/opportunities</code>
                <p className="text-sm text-muted-foreground mt-2">Retrieve funding opportunities</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <code className="text-sm">POST /api/v1/applications</code>
                <p className="text-sm text-muted-foreground mt-2">Submit funding applications</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <code className="text-sm">GET /api/v1/matches</code>
                <p className="text-sm text-muted-foreground mt-2">Get AI-matched opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

