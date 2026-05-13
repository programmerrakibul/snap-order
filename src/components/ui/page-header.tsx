import { cn } from "@/lib/utils";
import Container from "@/components/shared/container";

interface Props {
  label: string;
  className?: string;
}

interface PageHeaderProps {
  title: Props | string;
  description?: Props | string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  const titleObject =
    typeof title === "string" ? { label: title, className: "" } : title;
  const descriptionObject =
    typeof description === "string"
      ? { label: description, className: "" }
      : description;

  return (
    <section className={cn("pt-8", className)}>
      <Container>
        <div className="space-y-2">
          <h1
            className={cn(
              "text-3xl font-bold tracking-tight",
              titleObject.className,
            )}
          >
            {typeof title === "string" ? title : titleObject.label}
          </h1>

          {descriptionObject && descriptionObject.label && (
            <p
              className={cn(
                "text-muted-foreground",
                descriptionObject.className,
              )}
            >
              {typeof description === "string"
                ? description
                : descriptionObject.label}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
