import { Check, Clipboard } from "lucide-react";
import type { CopyStatus } from "../hooks/usePasswordGenerator";

interface PasswordDisplayProps {
  password: string;
  onCopy: () => void;
  copyStatus: CopyStatus;
}

export default function PasswordDisplay({
  password,
  onCopy,
  copyStatus,
}: PasswordDisplayProps) {
  const copied = copyStatus === "copied";
  const failed = copyStatus === "error";
  const label = copied ? "Copied!" : failed ? "Copy failed" : "Copy";

  return (
    <div className="password-display">
      <div className="password-display__row">
        <input
          id="password-output"
          className="password-display__input"
          type="text"
          readOnly
          value={password}
          placeholder="Click Generate Password"
          aria-label="Generated password"
          spellCheck="false"
          autoComplete="off"
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          type="button"
          className={`btn btn--secondary${copied ? " btn--success" : ""}${failed ? " btn--danger" : ""}`}
          onClick={onCopy}
          disabled={!password}
          aria-label={
            password
              ? "Copy password to clipboard"
              : "Copy password (generate one first)"
          }
        >
          {copied ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <Clipboard size={18} aria-hidden="true" />
          )}
          <span className="btn__label">{label}</span>
        </button>
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">
        {copied
          ? "Password copied to clipboard"
          : failed
            ? "Could not copy to clipboard"
            : ""}
      </p>
      {failed && (
        <p className="field-note field-note--error">
          Clipboard access was blocked. Select the password above and copy it
          manually.
        </p>
      )}
    </div>
  );
}
