import Container from "@/components/shared/container";
import { CustomersTable } from "@/components/tables/customers-table";
import { TableUser } from "@/types/user.interface";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

async function CustomersPage() {
  const res = await fetch(BASE_URL + "/api/users", {
    cache: "force-cache",
  });

  const users = (await res.json()).data as TableUser[];

  return (
    <div className="space-y-8">
      <section className="pt-8">
        <Container>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              {users.length > 0
                ? `Manage and view all ${users.length} customers`
                : "Manage and view all your customers in one place"}
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
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

export default CustomersPage;
