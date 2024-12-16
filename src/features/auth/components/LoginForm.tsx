import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

export default function LoginForm() {
  const [isSignup, setIsSignup] = useState(false); // Toggle between Login and Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For Sign Up
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignup = async () => {
    try {
      await axios.post("/api/auth/signup", { name, email, password });
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Sign up failed. Please try again.");
      } else {
        router.push("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Sign up failed. Email may already be in use.");
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
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
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full my-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full my-2"
      />
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={isSignup ? handleSignup : handleLogin}
        className="bg-blue-500 text-white p-2 rounded w-full my-2"
      >
        {isSignup ? "Sign Up" : "Login"}
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

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded w-full mt-4"
      >
        Logout
      </button>
    </div>
  );
}
