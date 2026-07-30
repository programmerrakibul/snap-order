import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function BackToHomeLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="w-fit">
      <Link href="/">
        <IconArrowLeft />
        Back to Homepage
      </Link>
    </Button>
  );
}
