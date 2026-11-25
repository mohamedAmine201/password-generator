import { RefreshCw } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function GenerateButton({
  onClick,
  disabled,
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      className="btn btn--primary btn--block"
      onClick={onClick}
      disabled={disabled}
    >
      <RefreshCw size={18} aria-hidden="true" />
      Generate Password
    </button>
  );
}
