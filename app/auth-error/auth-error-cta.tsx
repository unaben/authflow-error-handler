import cn from "classnames";
import { useRouter } from "next/navigation";
import styles from "./auth-error.module.css";
import type { AuthErrorCTAProps } from "./auth-error.types";
import { handleClose, handleRetry } from "./auth-error.utils";

const AuthErrorCTA = (props: AuthErrorCTAProps) => {
  const { returnUrl, setIsOpen, status } = props;
  const router = useRouter();
  return (
    <>
      {status === "401" && (
        <button
          onClick={() => handleClose(setIsOpen, router)}
          className={cn(styles.button, styles.buttonPrimary)}
        >
          Login
        </button>
      )}
      {status === "403" && (
        <>
          <button
            onClick={() => router.push("/")}
            className={cn(styles.button, styles.buttonSecondary)}
          >
            Go Home
          </button>
          <button
            onClick={() => handleClose(setIsOpen, router)}
            className={cn(styles.button, styles.buttonPrimary)}
          >
            Contact Support
          </button>
        </>
      )}
      {!["401", "403"].includes(status) && (
        <>
          <button
            onClick={() => router.push("/")}
            className={cn(styles.button, styles.buttonSecondary)}
          >
            Go Home
          </button>
          <button
            onClick={() => handleRetry(setIsOpen, router, returnUrl)}
            className={cn(styles.button, styles.buttonPrimary)}
          >
            Retry
          </button>
        </>
      )}
    </>
  );
};
export default AuthErrorCTA;
