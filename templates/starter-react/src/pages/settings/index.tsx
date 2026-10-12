import { PageHeader } from "@nukta-solutions/ui";
import { SettingsForm } from "./settings-form";

export function SettingsPage() {
  return (
    <div className="grid gap-8">
      <title>Settings · Nukta Starter</title>
      <PageHeader title="Settings" description="Manage your profile and preferences." />
      <SettingsForm />
    </div>
  );
}
