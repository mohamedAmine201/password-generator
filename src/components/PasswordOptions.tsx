import type { CSSProperties } from "react";
import {
  MAX_LENGTH,
  MIN_LENGTH,
  type CharsetKey,
  type PasswordOptions as PasswordOptionsState,
} from "../utils/passwordGenerator";

interface OptionItem {
  key: CharsetKey;
  label: string;
  hint: string;
}

const OPTION_LIST: OptionItem[] = [
  { key: "uppercase", label: "Uppercase letters", hint: "A-Z" },
  { key: "lowercase", label: "Lowercase letters", hint: "a-z" },
  { key: "numbers", label: "Numbers", hint: "0-9" },
  { key: "symbols", label: "Symbols", hint: "@#$" },
];

interface PasswordOptionsProps {
  length: number;
  onLengthChange: (length: number) => void;
  options: PasswordOptionsState;
  onToggle: (key: CharsetKey) => void;
  validationError: string;
}

export default function PasswordOptions({
  length,
  onLengthChange,
  options,
  onToggle,
  validationError,
}: PasswordOptionsProps) {
  const percent = ((length - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH)) * 100;

  return (
    <section className="options" aria-label="Password options">
      <div className="length">
        <div className="length__header">
          <label htmlFor="password-length" className="label">
            Password length
          </label>
          <output htmlFor="password-length" className="length__value">
            {length}
          </output>
        </div>
        <input
          id="password-length"
          className="slider"
          type="range"
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          step="1"
          value={length}
          onChange={(e) => onLengthChange(Number(e.target.value))}
          style={{ "--fill": `${percent}%` } as CSSProperties}
        />
        <div className="length__scale" aria-hidden="true">
          <span>{MIN_LENGTH}</span>
          <span>{MAX_LENGTH}</span>
        </div>
      </div>

      <fieldset className="toggles">
        <legend className="label">Character types</legend>
        {OPTION_LIST.map(({ key, label, hint }) => (
          <label key={key} className="toggle" htmlFor={`opt-${key}`}>
            <span className="toggle__text">
              <span className="toggle__label">{label}</span>
              <span className="toggle__hint">{hint}</span>
            </span>
            <input
              id={`opt-${key}`}
              className="toggle__input"
              type="checkbox"
              role="switch"
              checked={options[key]}
              onChange={() => onToggle(key)}
            />
            <span className="toggle__track" aria-hidden="true">
              <span className="toggle__thumb" />
            </span>
          </label>
        ))}
      </fieldset>

      {validationError && (
        <p className="field-note field-note--error" role="alert">
          {validationError}
        </p>
      )}
    </section>
  );
}
