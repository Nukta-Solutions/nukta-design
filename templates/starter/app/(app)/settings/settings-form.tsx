"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@nukta-solutions/ui";

export function SettingsForm() {
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success("Settings saved");
  }

  return (
    <Tabs defaultValue="profile" className="max-w-2xl">
      <TabsList aria-label="Settings sections">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <form onSubmit={save}>
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>This is how others see you.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Nukta Solutions" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="hello@nuktasolutions.com" />
              </div>
              <fieldset className="grid gap-3">
                <legend className="mb-3 text-sm font-medium">Default view</legend>
                <RadioGroup defaultValue="dashboard" name="view">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="dashboard" id="view-dashboard" />
                    <Label htmlFor="view-dashboard">Dashboard</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="projects" id="view-projects" />
                    <Label htmlFor="view-projects">Projects</Label>
                  </div>
                </RadioGroup>
              </fieldset>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit">Save changes</Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>

      <TabsContent value="notifications">
        <form onSubmit={save}>
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what we email you about.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="notify-projects">Project updates</Label>
                <Switch id="notify-projects" defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="notify-billing">Billing alerts</Label>
                <Switch id="notify-billing" defaultChecked />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="notify-digest" />
                <Label htmlFor="notify-digest">Send me a weekly digest</Label>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit">Save preferences</Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
    </Tabs>
  );
}
