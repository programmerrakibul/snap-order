import Container from "@/components/shared/container";

const ForbiddenComponent = () => {
  return (
    <>
      <section>
        <Container>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight">Forbidden</h1>
            <p className="text-muted-foreground">
              You don&apos;t have permission to access this page.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ForbiddenComponent;
