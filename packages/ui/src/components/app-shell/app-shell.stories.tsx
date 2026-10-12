import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderKanban, LayoutDashboard, Plus, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "../avatar";
import { Button } from "../button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellMobileNav,
  AppShellSidebar,
  AppShellSidebarHeader,
  NavItem,
  NavList,
  PageHeader,
  SkipLink,
} from "./app-shell";

const meta = {
  title: "Deprecated/App Shell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function Logo() {
  return <span className="font-display text-lg font-semibold">Nukta</span>;
}

function Nav() {
  return (
    <NavList>
      <NavItem href="#dashboard" active>
        <LayoutDashboard aria-hidden="true" /> Dashboard
      </NavItem>
      <NavItem href="#projects">
        <FolderKanban aria-hidden="true" /> Projects
      </NavItem>
      <NavItem href="#settings">
        <Settings aria-hidden="true" /> Settings
      </NavItem>
    </NavList>
  );
}

export const Default: Story = {
  render: (args) => (
    <AppShell {...args}>
      <SkipLink />
      <AppShellSidebar>
        <AppShellSidebarHeader>
          <Logo />
        </AppShellSidebarHeader>
        <Nav />
      </AppShellSidebar>
      <AppShellBody>
        <AppShellHeader>
          <AppShellMobileNav>
            <AppShellSidebarHeader>
              <Logo />
            </AppShellSidebarHeader>
            <Nav />
          </AppShellMobileNav>
          <div className="ml-auto">
            <Avatar size="sm">
              <AvatarFallback>NS</AvatarFallback>
            </Avatar>
          </div>
        </AppShellHeader>
        <AppShellMain>
          <div className="grid gap-8">
            <PageHeader
              title="Dashboard"
              description="An overview of how things are going."
              actions={
                <Button>
                  <Plus /> New project
                </Button>
              }
            />
            <Card>
              <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>
                  Resize the viewport below 768px to see the mobile navigation sheet.
                </CardDescription>
              </CardHeader>
              <CardContent>Page content goes here.</CardContent>
            </Card>
          </div>
        </AppShellMain>
      </AppShellBody>
    </AppShell>
  ),
};
