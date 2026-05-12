import Container from "@/components/shared/container";
import { CustomersTable } from "@/components/tables/customers-table";
import { API_BASE_URL } from "@/lib/exportURL";
import { TableUser } from "@/types/user.interface";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Customers",
};

async function CustomersPage() {
  const res = await fetch(`${API_BASE_URL}/users`, {
    cache: "force-cache",
    credentials: "include",
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  if (!res.ok) {
    return (
      <>
        <div className="grid h-full place-items-center">
          <div>
            <pre>
              {res.status} - {res.statusText}
            </pre>
          </div>
        </div>
      </>
    );
  }

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

export default CustomersPage;
