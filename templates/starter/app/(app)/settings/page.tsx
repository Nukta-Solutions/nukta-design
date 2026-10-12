import { PageHeader } from "@nukta-solutions/ui";
import type { Metadata } from "next";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="grid gap-8">
      <PageHeader title="Settings" description="Manage your profile and preferences." />
      <SettingsForm />
    </div>
  );
}
