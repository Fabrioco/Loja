import { InputHTMLAttributes } from "react";

interface ButtonProps extends InputHTMLAttributes<HTMLInputElement> {}

export function ButtonShared(props: ButtonProps) {
  return <input {...props} type="button" />;
}
