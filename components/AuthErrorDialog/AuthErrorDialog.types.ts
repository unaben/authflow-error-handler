export interface AuthErrorDialogProps {
  isOpen: boolean;
  status: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}
