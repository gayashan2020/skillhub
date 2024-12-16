import withAuth from "@/lib/withAuth";

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Protected Dashboard</h1>
      <p>Welcome to the protected Dashboard page!</p>
    </div>
  );
}

export default withAuth(Dashboard);
