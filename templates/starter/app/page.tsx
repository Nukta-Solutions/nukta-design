import { Button } from "@nukta-solutions/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-10">
      <h1 className="text-4xl font-semibold">Nukta UI is wired up</h1>
      <p className="text-muted-foreground">Buttons below come from @nukta-solutions/ui.</p>
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="link">Link</Button>
        <Button loading>Saving</Button>
      </div>
    </main>
  );
}
