import { useAuth } from "../../context/auth";

export function Mail() {
  const { user } = useAuth();
  console.log(user)
  return (
    <div>
      <h1>pagina da loja</h1>
    </div>
  );
}
