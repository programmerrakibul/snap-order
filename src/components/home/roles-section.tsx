import Container from "@/components/shared/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconShieldCheck, IconUser, IconUserCog } from "@tabler/icons-react";

const roles = [
  {
    icon: IconUserCog,
    title: "Admin",
    description:
      "Full control over products, all orders, customer records, and restock approvals.",
    permissions: [
      "Manage product catalog",
      "Update any order status",
      "Approve restock requests",
      "View all customers",
    ],
  },
  {
    icon: IconUser,
    title: "User",
    description:
      "Self-service ordering and profile management within a scoped, secure workspace.",
    permissions: [
      "Browse products and place orders",
      "Track own order history",
      "Cancel pending orders",
      "Update profile details",
    ],
  },
  {
    icon: IconShieldCheck,
    title: "Security Layer",
    description:
      "Access is enforced at middleware, server actions, and UI — least privilege by default.",
    permissions: [
      "JWT access + refresh tokens",
      "HttpOnly cookie storage",
      "Route-level protection",
      "Action-level auth guards",
    ],
  },
];

export default function RolesSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Roles & security
          </h2>
          <p className="mt-4 text-muted-foreground">
            Clear separation between admin and user capabilities, backed by
            consistent enforcement across the stack.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {roles.map((role) => (
            <Card
              key={role.title}
              className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <role.icon className="size-5" stroke={1.75} />
                </div>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {role.permissions.map((permission) => (
                    <li key={permission} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
