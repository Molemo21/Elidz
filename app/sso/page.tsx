import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Key, Users } from "lucide-react"

export default function SSOPage() {
  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Single Sign-On (SSO)</h1>
          <p className="text-lg text-muted-foreground">
            Enable secure single sign-on for your organization
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>Enterprise-grade SSO security</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Key className="h-8 w-8 text-primary mb-2" />
              <CardTitle>SAML 2.0</CardTitle>
              <CardDescription>Industry-standard protocol</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Centralized user access</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configure SSO</CardTitle>
            <CardDescription>Set up single sign-on for your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                To enable SSO for your organization, please contact our support team with your SAML 2.0 metadata.
              </p>
              <div className="flex gap-4">
                <a href="mailto:sso@elidz-stp.co.za">
                  <Button>Contact SSO Support</Button>
                </a>
                <Button variant="outline">Download Setup Guide</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

