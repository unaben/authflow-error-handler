"use client";

import cn from "classnames";
import styles from "./AuthErrorDialog.module.css";
import type { AuthErrorDialogProps } from "./AuthErrorDialog.types";
import { getIcon, getTitle } from "./AuthErrorDialog.utils";

export function AuthErrorDialog(props: AuthErrorDialogProps) {
  const { isOpen, status, message, onClose, onRetry } = props;

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
            {getIcon(status, iconClasses)}
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{getTitle(status)}</h3>
            <div className={styles.messageWrapper}>
              <p className={styles.message}>{message}</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={onClose}
            className={cn(styles.button, styles.buttonSecondary)}
          >
            Close
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className={cn(styles.button, styles.buttonPrimary)}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
