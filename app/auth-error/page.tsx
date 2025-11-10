"use client";

import cn from "classnames";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AuthErrorCTA from "./auth-error-cta";
import AuthErrorIcon from "./auth-error-icon";
import styles from "./auth-error.module.css";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  const status = searchParams.get("status") || "401";
  const message =
    searchParams.get("message") || "Authentication error occurred";
  const returnUrl = searchParams.get("returnUrl") || "/";

  if (!isOpen) return null;

  const iconClasses = cn(styles.icon, {
    [styles.iconError]: status === "403",
    [styles.iconWarning]: status === "401",
    [styles.iconInfo]: status !== "403" && status !== "401",
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <AuthErrorIcon status={status} iconClasses={iconClasses} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>
              {status === "403"
                ? "Access Denied"
                : status === "401"
                ? "Authentication Required"
                : "Error"}
            </h3>
            <div className={styles.messageWrapper}>
              <p className={styles.message}>{message}</p>
              <p className={styles.statusCode}>Status Code: {status}</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <AuthErrorCTA
            setIsOpen={setIsOpen}
            returnUrl={returnUrl}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
