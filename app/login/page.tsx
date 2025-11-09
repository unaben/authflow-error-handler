"use client";

import { useRouter } from "next/navigation";
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Simulate setting auth token
    document.cookie = "auth-token=fake-token-123; path=/";
    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <h1>Login Page</h1>
      <button
        onClick={handleLogin}
        className={styles.btn}
      >
        Login
      </button>
    </div>
  );
}
