/** Example data. Replace with your product's data layer. */
export const stats = [
  { label: "Revenue", value: "৳ 4,82,000", change: "+12.4%", trend: "up" },
  { label: "Active users", value: "2,318", change: "+5.1%", trend: "up" },
  { label: "Open tickets", value: "41", change: "-8.0%", trend: "down" },
  { label: "Uptime", value: "99.98%", change: "30 days", trend: "flat" },
] as const;

export type ProjectStatus = "Active" | "Paused" | "At risk";

export const projects: {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  due: string;
}[] = [
  {
    id: "PRJ-101",
    name: "Commerce platform",
    client: "Renova",
    status: "Active",
    due: "2026-11-30",
  },
  { id: "PRJ-102", name: "Learning portal", client: "Itqaan", status: "Active", due: "2026-12-15" },
  {
    id: "PRJ-103",
    name: "Payments gateway",
    client: "Gateway",
    status: "At risk",
    due: "2026-10-31",
  },
  {
    id: "PRJ-104",
    name: "Brand site",
    client: "Little Legacy",
    status: "Paused",
    due: "2027-01-20",
  },
];

export const statusVariant = {
  Active: "success",
  Paused: "secondary",
  "At risk": "warning",
} as const satisfies Record<ProjectStatus, string>;
