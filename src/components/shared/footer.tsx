import Container from "@/components/shared/container";
import Logo from "@/components/ui/logo";
import { cacheLife } from "next/cache";

const timestamp = async () => {
  "use cache";
  cacheLife("max");

  return new Date();
};

export default async function Footer() {
  const year = (await timestamp()).getFullYear();

  return (
    <footer className="border-t border-border/60 py-6">
      <Container className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <p className="text-sm text-muted-foreground">
          &copy; {year} <span className="font-bold">Snap Order</span>. All
          rights reserved.
        </p>
      </Container>
    </footer>
  );
}
