import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plug, CheckCircle2 } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    { name: "Supabase", status: "active", description: "Database and authentication" },
    { name: "OpenAI API", status: "active", description: "AI-powered matching and application completion" },
    { name: "Email Service", status: "active", description: "Transactional email notifications" },
    { name: "Payment Gateway", status: "coming-soon", description: "Secure payment processing" },
    { name: "CRM Integration", status: "coming-soon", description: "Customer relationship management" },
  ]

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Third-Party Integrations</h1>
          <p className="text-lg text-muted-foreground">
            Connect ELIDZ-STP with your favorite tools and services
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.name}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Plug className="h-8 w-8 text-primary" />
                  {integration.status === "active" && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                </div>
                <CardTitle>{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={integration.status === "active" ? "default" : "outline"}
                  disabled={integration.status === "coming-soon"}
                  className="w-full"
                >
                  {integration.status === "active" ? "Configure" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

