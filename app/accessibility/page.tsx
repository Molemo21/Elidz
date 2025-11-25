import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accessibility } from "lucide-react"

export default function AccessibilityPage() {
  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Accessibility className="h-10 w-10 text-primary" />
            Accessibility Statement
          </h1>
          <p className="text-muted-foreground">
            ELIDZ-STP is committed to ensuring digital accessibility for all users
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ELIDZ-STP strives to ensure that our platform is accessible to all users, including 
              those with disabilities. We are continuously working to improve the accessibility 
              of our platform and comply with WCAG 2.1 Level AA standards.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Accessibility Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>High contrast mode</li>
              <li>Text size adjustment options</li>
              <li>Alt text for images</li>
              <li>Semantic HTML structure</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you encounter any accessibility barriers, please contact us at{" "}
              <a href="mailto:accessibility@elidz-stp.co.za" className="text-primary hover:underline">
                accessibility@elidz-stp.co.za
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

