import DashboardTopbar from "@/components/shared/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardTopbar />
      <main>{children}</main>
    </>
  );
}
