import { Dispatch, SetStateAction } from "react";

export type AuthErrorIconProps = {
  status: string;
  iconClasses: string;
};

export type AuthErrorCTAProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  returnUrl: string;
};
