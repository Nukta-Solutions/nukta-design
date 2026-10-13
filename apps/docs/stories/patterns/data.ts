/** Shared sample data for pattern stories. Fixed values keep docs and screenshots stable. */

export type DomainStatus = "active" | "expiring" | "expired" | "pending";

export interface Domain {
  id: string;
  name: string;
  status: DomainStatus;
  expires: Date;
  autoRenew: boolean;
  nameservers: string[];
  registrar: string;
}

const names = [
  "nukta.app",
  "nuktasolutions.com",
  "nusend.io",
  "renova.com.bd",
  "itqaan.com",
  "littlelegacy.org",
  "gateway.com.bd",
  "imtr.net",
  "eperfect.shop",
  "nupem.io",
  "financial.com.bd",
  "ld.dev",
];
const statuses: DomainStatus[] = ["active", "active", "expiring", "active", "expired", "pending"];

export const domains: Domain[] = names.map((name, i) => ({
  id: `dom_${i + 1}`,
  name,
  status: statuses[i % statuses.length]!,
  expires: new Date(2026, 9 + i, 3 + ((i * 5) % 24)),
  autoRenew: i % 3 !== 1,
  nameservers: ["ns1.nukta.app", "ns2.nukta.app"],
  registrar: "Nukta Domain",
}));

export const domainStatus = {
  active: { status: "operational", label: "Active" },
  expiring: { status: "degraded", label: "Expiring soon" },
  expired: { status: "down", label: "Expired" },
  pending: { status: "pending", label: "Pending transfer" },
} as const;

export const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
