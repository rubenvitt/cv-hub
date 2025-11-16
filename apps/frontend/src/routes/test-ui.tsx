import { createFileRoute } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

export const Route = createFileRoute('/test-ui')({
  component: TestUIPage,
});

function TestUIPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">UI Component Test Page</h1>
          <p className="text-muted-foreground">
            Demonstriert shadcn/ui Komponenten mit Tailwind CSS v4
          </p>
        </div>

        {/* Dark Mode Toggle Skeleton (UI-only) */}
        <Card>
          <CardHeader>
            <CardTitle>Dark Mode Toggle</CardTitle>
            <CardDescription>UI-Skeleton für Post-MVP (noch keine Funktionalität)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" disabled>
              🌙 Toggle Dark Mode (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Component</h2>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Alle verfügbaren Button-Varianten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
              <CardDescription>Verschiedene Button-Größen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🚀</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badge Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badge Component</h2>
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>Alle verfügbaren Badge-Varianten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badge Use Cases</CardTitle>
              <CardDescription>Praktische Anwendungsbeispiele</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Badge variant="default">Active</Badge>
                  <Badge variant="secondary">Pending</Badge>
                  <Badge variant="destructive">Error</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Tags:</span>
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Card Component</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Nur Header und Content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dies ist ein einfaches Beispiel einer Card-Komponente mit Header und Content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>Header, Content und Footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Diese Card hat zusätzlich einen Footer-Bereich.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Action</CardTitle>
                <CardDescription>Header mit Action-Button</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Diese Card hat einen Action-Button im Header.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Complex Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Kombinierte Beispiele</h2>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Feature Card</CardTitle>
                  <CardDescription>Card mit Badges und Buttons</CardDescription>
                </div>
                <Badge variant="default">New</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Dieses Beispiel zeigt die Kombination aller drei Komponenten in einer realistischen
                Anwendung.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React 19</Badge>
                <Badge variant="outline">TanStack Start</Badge>
                <Badge variant="outline">Tailwind v4</Badge>
                <Badge variant="outline">shadcn/ui</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Learn More</Button>
              <Button variant="default">Get Started</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Accessibility Info */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility (WCAG AA)</CardTitle>
            <CardDescription>Alle Komponenten erfüllen WCAG AA Standards</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Farbkontraste: ≥4.5:1 für normalen Text</li>
              <li>✅ Keyboard-Navigation: Alle interaktiven Elemente erreichbar</li>
              <li>✅ Focus-States: Sichtbare Focus-Indikatoren</li>
              <li>✅ Semantic HTML: Korrekte ARIA-Rollen und Labels</li>
              <li>✅ Dark Mode Ready: CSS-Variablen vorbereitet</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
