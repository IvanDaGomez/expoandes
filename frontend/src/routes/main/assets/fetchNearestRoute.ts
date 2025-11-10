import axios from 'axios';
import type { Route } from '../../../types/route';
import { BACKEND_URL } from '../../../utils/config';
export async function fetchNearestRoute(routeCode: string): Promise<null | Route> {
    return {
        routeId: "1",
        routeCode: "J70",
        location: "Estación A",
        avgSpeed: 30,
        nextLocation: "Estación B",
        arrivalTime: "2025-01-01T12:00:00Z",
        fromTo: "Estación A - Estación B",
    }
    try {
        const response = await axios.get(`${BACKEND_URL}/api/routes/nearest?routeCode=${routeCode}`);
        if (response.status !== 200) {
            throw new Error(`Error fetching nearest route: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching nearest route:", error);
        return null;
    }
}
