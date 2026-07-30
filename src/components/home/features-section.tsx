import Container from "@/components/shared/container";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconChartBar,
  IconPackage,
  IconRefresh,
  IconShieldLock,
  IconTruckDelivery,
  IconUsers,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconPackage,
    title: "Order Tracking",
    description:
      "Create orders with atomic stock checks and follow status from pending through delivered.",
  },
  {
    icon: IconShieldLock,
    title: "Role-Based Access",
    description:
      "Separate admin and user experiences with middleware-enforced route protection.",
  },
  {
    icon: IconTruckDelivery,
    title: "Real-Time Status",
    description:
      "Update and monitor order lifecycle stages so teams always know what is in progress.",
  },
  {
    icon: IconChartBar,
    title: "Dashboard Insights",
    description:
      "Role-specific overviews surface the metrics that matter for admins and customers.",
  },
  {
    icon: IconRefresh,
    title: "Automated Restock",
    description:
      "Low-stock alerts trigger restock requests admins can review, adjust, and approve.",
  },
  {
    icon: IconUsers,
    title: "Multi-Role Workflows",
    description:
      "Admins manage catalog and fulfillment while users place orders within their scope.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Built for operational clarity
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to manage inventory and orders without losing
            control of who can do what.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" stroke={1.75} />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
