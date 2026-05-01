import DashboardSidebar from "@/components/shared/sidebar";
import DashboardTopbar from "@/components/shared/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardTopbar />
      <div className="flex gap-7">
        <DashboardSidebar />
        <main>{children}</main>
      </div>
    </>
  );
}
