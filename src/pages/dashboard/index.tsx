import AdminLayout from "@/components/layout/AdminLayout";
import type { NextPageWithLayout } from "../_app";

const DashboardPage: NextPageWithLayout = () => {
  return <div>Welcome to the Admin Dashboard</div>;
};

DashboardPage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default DashboardPage;
