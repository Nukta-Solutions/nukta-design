import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nukta-solutions/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { projects, stats, statusVariant } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="grid gap-8">
      <PageHeader title="Dashboard" description="An overview of how things are going." />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-2">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  stat.trend === "up" ? "success" : stat.trend === "down" ? "info" : "secondary"
                }
              >
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent projects</CardTitle>
          <CardDescription>Projects due over the next three months.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.slice(0, 3).map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{project.due}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button asChild variant="link" className="mt-4 px-0">
            <Link href="/projects">
              View all projects <ArrowRight />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
