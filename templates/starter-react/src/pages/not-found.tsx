import { Button } from "@nukta-solutions/ui";
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <title>Page not found · Nukta Starter</title>
      <div className="grid gap-4">
        <p className="font-display text-accent text-5xl font-semibold">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist.</p>
        <Button asChild className="justify-self-center">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
