import Container from "@/components/shared/container";

const steps = [
  {
    step: "01",
    title: "Create orders",
    description:
      "Users browse products and place orders with validated stock and pricing.",
  },
  {
    step: "02",
    title: "Assign roles & permissions",
    description:
      "Admins and users access only the routes and actions their role allows.",
  },
  {
    step: "03",
    title: "Track & fulfill",
    description:
      "Move orders through confirmed, shipped, and delivered with inventory updates.",
  },
  {
    step: "04",
    title: "Review & restock",
    description:
      "Monitor dashboards and approve automated restock requests when stock runs low.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-20 md:py-28">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            A straightforward flow from order creation to fulfillment and
            reporting.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col gap-3 rounded-4xl border border-border/60 bg-background p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <span className="font-heading text-sm font-medium text-primary">
                {item.step}
              </span>
              <h3 className="font-heading text-lg font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
