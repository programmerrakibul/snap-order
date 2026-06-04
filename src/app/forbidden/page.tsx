import ForbiddenComponent from "@/components/ui/forbidden";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 - Forbidden",
  description: "You do not have permission to view this resource.",
  robots: {
    index: false,
    follow: false,
  },
};

const Forbidden = () => <ForbiddenComponent />;

export default Forbidden;
