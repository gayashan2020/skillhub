import Layout from "@/components/layout/Layout";
import type { NextPageWithLayout } from "./_app";

const LandingPage: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <p>This is the public landing page.</p>
    </div>
  );
};

LandingPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default LandingPage;
