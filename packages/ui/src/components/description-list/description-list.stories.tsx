import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { StatusIndicator } from "../status-indicator";
import {
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
} from "./description-list";

const meta = {
  title: "Components/Description List",
  component: DescriptionList,
  decorators: [(Story) => <div className="w-xl">{Story()}</div>],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

function Items() {
  return (
    <>
      <DescriptionItem>
        <DescriptionTerm>Domain</DescriptionTerm>
        <DescriptionDetails className="font-medium">nukta.app</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>
          <StatusIndicator status="operational" label="Active" size="sm" />
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Expires</DescriptionTerm>
        <DescriptionDetails>12 Mar 2027 · auto-renew on</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Nameservers</DescriptionTerm>
        <DescriptionDetails className="font-mono">ns1.nukta.app, ns2.nukta.app</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Protection</DescriptionTerm>
        <DescriptionDetails className="flex gap-1">
          <Badge variant="secondary">Transfer lock</Badge>
          <Badge variant="secondary">WHOIS privacy</Badge>
        </DescriptionDetails>
      </DescriptionItem>
    </>
  );
}

export const Horizontal: Story = {
  render: () => (
    <DescriptionList>
      <Items />
    </DescriptionList>
  ),
};

export const Vertical: Story = {
  render: () => (
    <DescriptionList layout="vertical">
      <Items />
    </DescriptionList>
  ),
};

export const GridInCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Server</CardTitle>
      </CardHeader>
      <CardContent>
        <DescriptionList layout="grid">
          <DescriptionItem>
            <DescriptionTerm>IP address</DescriptionTerm>
            <DescriptionDetails className="font-mono">203.0.113.10</DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Region</DescriptionTerm>
            <DescriptionDetails>Singapore</DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Plan</DescriptionTerm>
            <DescriptionDetails>Business · 4 vCPU · 8 GB</DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>PHP</DescriptionTerm>
            <DescriptionDetails>8.4</DescriptionDetails>
          </DescriptionItem>
        </DescriptionList>
      </CardContent>
    </Card>
  ),
};
