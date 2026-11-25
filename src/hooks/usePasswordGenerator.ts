import { useCallback, useEffect, useRef, useState } from "react";
import {
  generatePassword,
  getEnabledSets,
  type CharsetKey,
  type PasswordOptions,
} from "../utils/passwordGenerator";

export type CopyStatus = "idle" | "copied" | "error";

const COPIED_RESET_MS = 2000;

export default function usePasswordGenerator() {
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(16);
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const hasSelection = getEnabledSets(options).length > 0;
  const validationError = hasSelection
    ? ""
    : "Select at least one character type to generate a password.";

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const resetCopyStatus = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setCopyStatus("idle");
  }, []);

  const toggleOption = useCallback((key: CharsetKey) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const generate = useCallback(() => {
    if (!hasSelection) return;
    setPassword(generatePassword(length, options));
    resetCopyStatus();
  }, [hasSelection, length, options, resetCopyStatus]);

  const copy = useCallback(async () => {
    if (!password) return;
    clearTimeout(timeoutRef.current);
    try {
      await navigator.clipboard.writeText(password);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    timeoutRef.current = setTimeout(
      () => setCopyStatus("idle"),
      COPIED_RESET_MS,
    );
  }, [password]);

  return {
    password,
    length,
    setLength,
    options,
    toggleOption,
    validationError,
    canGenerate: hasSelection,
    generate,
    copy,
    copyStatus,
  };
}
