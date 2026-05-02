import DashboardSidebar from "@/components/shared/sidebar";
import DashboardTopbar from "@/components/shared/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      {/* Main Content Area with dynamic margin */}
      <div
        className="flex-1 transition-all duration-300 data-[collapsed=true]:lg:ml-20"
        style={{ "--sidebar-width": "80px" } as unknown as React.CSSProperties}
      >
        <DashboardTopbar />
        <main className="p-y6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
