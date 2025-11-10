import { useState, useEffect } from "react";
import "./App.css";
import type { Route } from "../../types/route";
import { fetchRoutes } from "./assets/fetchRoutes";
import { Link } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [routesFiltered, setRoutesFiltered] = useState<Partial<Route>[]>([]);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setRoutesFiltered([]);
      return;
    }

    // setIsLoading(true);

    // Debounce: wait 500ms after user stops typing
    const timeoutId = setTimeout(async () => {
      const routes = await fetchRoutes(query);
      setRoutesFiltered(routes);
      // setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId); // cancel if user types again
  }, [query]);

  return (
    <div className="app">
      <h1>TransmiApp 2.0</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Escribe la ruta deseada (ej. J70, 2-5, C24)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {routesFiltered.length > 0 && (
        <>
        <h2>Rutas encontradas:</h2>
        <div className="results">
          
          {routesFiltered.map((route) => (
            <Link
              to={`/routes/${route.routeId}`}
              key={route.routeId}
              className="route-link"
            >
              <div className="route-item">
                <h2>{route.routeCode}</h2>
                <p>Ruta: {route.fromTo}</p>
              </div>
            </Link>
          ))}
        </div>
        </>
      )}
      
    </div>
  );
}

export default App;
