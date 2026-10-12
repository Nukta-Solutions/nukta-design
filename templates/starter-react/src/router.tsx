import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/app-layout";
import { RouteError } from "./components/route-error";
import { DashboardPage } from "./pages/dashboard";
import { NotFoundPage } from "./pages/not-found";

/** Add pages here. `lazy` keeps each page in its own chunk, loaded on first visit. */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: DashboardPage },
      {
        path: "projects",
        lazy: async () => ({ Component: (await import("./pages/projects")).ProjectsPage }),
      },
      {
        path: "settings",
        lazy: async () => ({ Component: (await import("./pages/settings")).SettingsPage }),
      },
    ],
  },
  { path: "*", Component: NotFoundPage },
]);
