import "./InputLabel.css";
interface PropsInput {
  nameId: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onchange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputLabel({
  nameId,
  label,
  type,
  placeholder,
  value,
  onchange,
}: PropsInput) {
  return (
    <div className="inputLabel-container">
      <label htmlFor={nameId} className="label">{label}</label>
      <input className="input"
        type={type}
        id={nameId}
        placeholder={placeholder}
        value={value}
        onChange={onchange}
        required
      />
    </div>
  );
}
