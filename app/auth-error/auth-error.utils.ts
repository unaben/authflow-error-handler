import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

const handleClose = (
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance
) => {
  setIsOpen(false);
  setTimeout(() => {
    router.push("/login");
  }, 200);
};

const handleRetry = (
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  returnUrl: string
) => {
  setIsOpen(false);
  setTimeout(() => {
    router.push(returnUrl);
  }, 200);
};

export {handleClose, handleRetry}