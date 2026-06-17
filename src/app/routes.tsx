import { createHashRouter as createBrowserRouter } from "react-router";
import { InternPortal } from "./components/InternPortal";
import { AdminDashboard } from "./components/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: InternPortal,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
