import { Button } from "@nukta-solutions/ui";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

/** Shown when a page throws or a lazy page fails to load. */
export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Something went wrong.";

  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <title>Error · Nukta Starter</title>
      <div className="grid max-w-md gap-4">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">{message}</p>
        <Button asChild className="justify-self-center">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
