import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 p-4 shadow-lg rounded">
        <LoginForm />
      </div>
    </div>
  );
}
