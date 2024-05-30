import { FaPhone, FaRegEnvelope } from "react-icons/fa";

import "./Footer.css";

export function Footer() {
  return (
    <footer>
      <h1>Contatos</h1>
      <p>
        <FaRegEnvelope />
        fabriciooliveiralopes50@gmail.com
      </p>
      <p>
        <FaPhone />
        (11) 9 6016-8159
      </p>
      <span>&copy; Fabrício Oliveira Lopes</span>
    </footer>
  );
}
