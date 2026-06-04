import { getUserData } from "@/actions/server/user.action";
import AdminOverview from "@/app/dashboard/_component/admin-overview";
import UserOverview from "@/app/dashboard/_component/user-overview";
import { PageHeader } from "@/components/ui/page-header";
import { Role } from "@/generated/prisma/enums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description:
    "View your real-time sales metrics, recent orders, and performance analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Overview() {
  const user = await getUserData();

  if (!user) return null;

  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        description="Welcome to your dashboard overview. Here you can find insights and quick access to your data."
      />

      {user.role === Role.ADMIN && <AdminOverview />}
      {user.role === Role.USER && <UserOverview />}
    </>
  );
}
