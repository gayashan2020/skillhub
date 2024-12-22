import LoginForm from "@/pages/auth/components/LoginForm";
import Layout from "@/components/layout/Layout";
import type { NextPageWithLayout } from "../_app";


const LoginPage: NextPageWithLayout = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 p-4 shadow-lg rounded">
        <LoginForm />
      </div>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default LoginPage;