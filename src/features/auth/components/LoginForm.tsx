import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error("Invalid email or password");
      }

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (Array.isArray(data.error)) {
          throw new Error(data.error.join(", "));
        } else {
          throw new Error(data.error || "Sign up failed");
        }
      }

      await handleLogin();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during signup.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isSignup ? "Sign Up" : "Login"}
      </h2>
      {isSignup && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full my-2"
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full my-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full my-2"
        minLength={6}
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={isSignup ? handleSignup : handleLogin}
        disabled={isLoading}
        className="bg-blue-500 text-white p-2 rounded w-full my-2"
      >
        {isLoading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
      </button>
      <p
        className="text-center text-sm cursor-pointer text-gray-600"
        onClick={() => {
          setIsSignup(!isSignup);
          setError("");
        }}
      >
        {isSignup
          ? "Already have an account? Login here."
          : "Don't have an account? Sign up here."}
      </p>
    </div>
  );
}
