import { getAllUsers } from "@/actions/server/user.action";
import Container from "@/components/shared/container";
import CustomersTable from "@/components/tables/customers-table";
import { TableUser } from "@/types/user.interface";
import { Metadata } from "next";
import { Suspense } from "react";
import CustomersLoading from "./loading";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Customers",
};

async function CustomersPageContent() {
  const users = (await getAllUsers()) as TableUser[];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        description={
          users.length > 0
            ? `Manage and view all ${users.length} customers`
            : "Manage and view all your customers in one place"
        }
      />

      <section className="pb-8">
        <Container>
          <div className="bg-card rounded-lg border border-border">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              <CustomersTable users={users} />
            </div>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No users found.</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<CustomersLoading />}>
      <CustomersPageContent />
    </Suspense>
  );
}
