import Header from "./components/Header";
import PasswordDisplay from "./components/PasswordDisplay";
import PasswordOptions from "./components/PasswordOptions";
import GenerateButton from "./components/GenerateButton";
import usePasswordGenerator from "./hooks/usePasswordGenerator";

export default function App() {
  const {
    password,
    length,
    setLength,
    options,
    toggleOption,
    validationError,
    canGenerate,
    generate,
    copy,
    copyStatus,
  } = usePasswordGenerator();

  return (
    <main className="page">
      <div className="card">
        <Header />
        <PasswordDisplay
          password={password}
          onCopy={copy}
          copyStatus={copyStatus}
        />
        <PasswordOptions
          length={length}
          onLengthChange={setLength}
          options={options}
          onToggle={toggleOption}
          validationError={validationError}
        />
        <GenerateButton onClick={generate} disabled={!canGenerate} />
      </div>
    </main>
  );
}
