import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Handshake, Building2 } from "lucide-react"

export default function PartnersPage() {
  const partners = [
    { name: "Small Enterprise Development Agency", type: "Government Agency" },
    { name: "Industrial Development Corporation", type: "Development Finance" },
    { name: "National Empowerment Fund", type: "Funding Institution" },
    { name: "Technology Innovation Agency", type: "Innovation Support" },
  ]

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Partner Systems</h1>
          <p className="text-lg text-muted-foreground">
            ELIDZ-STP integrates with leading funding and business support organizations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {partners.map((partner) => (
            <Card key={partner.name}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>{partner.name}</CardTitle>
                    <CardDescription>{partner.type}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Seamlessly integrated funding opportunities and application processes
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-6 w-6" />
              Become a Partner
            </CardTitle>
            <CardDescription>
              Interested in integrating your funding system with ELIDZ-STP?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Contact us to discuss partnership opportunities and system integration.
            </p>
            <a href="mailto:partners@elidz-stp.co.za">
              <Button>Contact Partnership Team</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

