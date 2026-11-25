import { ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header__icon" aria-hidden="true">
        <ShieldCheck size={22} />
      </div>
      <h1 className="header__title">Password Generator</h1>
      <p className="header__subtitle">
        Create strong, random passwords right in your browser. Nothing is sent
        or stored anywhere.
      </p>
    </header>
  );
}
