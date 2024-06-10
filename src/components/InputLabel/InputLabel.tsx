import "./InputLabel.css";
interface PropsInput {
  nameId: string;
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  onchange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputLabel(props: PropsInput) {
  return (
    <div className="inputLabel-container">
      <label htmlFor={props.nameId} className="label">
        {props.label}
      </label>
      <input
        className="input"
        type={props.type}
        id={props.nameId}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onchange}
        required
      />
    </div>
  );
}
