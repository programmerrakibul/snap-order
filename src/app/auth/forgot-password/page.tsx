import Container from "@/components/shared/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

const ForgotPasswordPage = () => {
  return (
    <>
      <section>
        <Container>
          <h1>Forgot password page</h1>
        </Container>
      </section>
    </>
  );
};

export default ForgotPasswordPage;
