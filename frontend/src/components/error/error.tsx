import { Link } from "react-router-dom";
import "./error.css";

export default function ErrorNotFound() {
  return (
    <div className="app error">
      <h1>404</h1>
      <p className="notfound-text">Oops... no encontramos esta página 🕳️</p>
      <Link to="/" className="back-link">
        ← Volver al inicio
      </Link>
    </div>
  );
}
