import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Route } from "../../types/route";
import "./specificRoute.css";
import { fetchNearestRoute } from "../main/assets/fetchNearestRoute";

export default function SpecificRoute() {
  const { routeId } = useParams();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const loadRoute = async () => {
      if (!routeId) 
        return navigate('/');
      setLoading(true);
      const route = await fetchNearestRoute(routeId); // simulate all routes (mocked)

      setRoute(route || null);
      setLoading(false);
    };
    loadRoute();
  }, [routeId]);

  if (loading) {
    return (
      <div className="app">
        <p>Cargando detalles de la ruta...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="app">
        <p>No se encontró la ruta solicitada.</p>
        <Link to="/" className="back-link">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Detalles de la Ruta 🚍</h1>

      <div className="route-details">
        <p><strong>Código:</strong> {route.routeCode}</p>
        <p><strong>Ubicación actual:</strong> {route.location}</p>
        <p><strong>Próxima estación:</strong> {route.nextLocation}</p>
        <p><strong>Velocidad promedio:</strong> {route.avgSpeed} km/h</p>
        <p><strong>Tiempo estimado de llegada:</strong> {new Date(route.arrivalTime ?? '').toLocaleTimeString()}</p>
        <p><strong>Trayecto:</strong> {route.fromTo}</p>
      </div>

      <Link to="/" className="back-link">← Volver a buscar</Link>
    </div>
  );
}
