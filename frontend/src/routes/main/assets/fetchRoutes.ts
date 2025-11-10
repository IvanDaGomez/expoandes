import axios from "axios";
import type { Route } from "../../../types/route";
import { BACKEND_URL } from "../../../utils/config";

export async function fetchRoutes(query: string): Promise<Route[]> {
  if (query.trim() === "") return [];

  // Mocked API simulation
  const mockedRoutes: Route[] = [
    {
      routeId: "1",
      routeCode: "J70",
      location: "Estación A",
      avgSpeed: 30,
      nextLocation: "Estación B",
      arrivalTime: "2025-01-01T12:00:00Z",
      fromTo: "Estación A - Estación B",
    },
    {
      routeId: "2",
      routeCode: "J80",
      location: "Estación B",
      avgSpeed: 40,
      nextLocation: "Estación C",
      arrivalTime: "2025-01-01T12:30:00Z",
      fromTo: "Estación B - Estación C",
    },
    {
      routeId: "3",
      routeCode: "J90",
      location: "Estación C",
      avgSpeed: 35,
      nextLocation: "Estación D",
      arrivalTime: "2025-01-01T13:00:00Z",
      fromTo: "Estación C - Estación D",
    },
    {
      routeId: "4",
      routeCode: "J100",
      location: "Estación D",
      avgSpeed: 45,
      nextLocation: "Estación E",
      arrivalTime: "2025-01-01T13:30:00Z",
      fromTo: "Estación D - Estación E",
    },
    {
      routeId: "5",
      routeCode: "J110",
      location: "Estación E",
      avgSpeed: 50,
      nextLocation: "Estación F",
      arrivalTime: "2025-01-01T14:00:00Z",
      fromTo: "Estación E - Estación F",
    },
  ];

  await new Promise((resolve) => setTimeout(resolve, 100)); // simulate delay
  return mockedRoutes;

  // Real API example:
  /*
  try {
    const { data } = await axios.get(`${BACKEND_URL}/api/routes?search=${query}`);
    return data;
  } catch (err) {
    console.error("Error fetching routes:", err);
    return [];
  }
  */
}
