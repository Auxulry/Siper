export declare namespace AlertDeclaration {
  type AlertType = 'info' | 'success' | 'warning' | 'danger'
  interface AlertProps {
    type: AlertType;
    message: string;
    onClose?: () => void;
  }
}
