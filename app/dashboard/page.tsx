import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h1>Protected Dashboard</h1>
      <p>If you see this, authentication passed!</p>
    </div>
  );
}
