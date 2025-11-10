
export interface Route {
  routeId: string, // Unique identifier for the route
  routeCode: string, // J70, J80, H30, C39, etc
  location: string | null, // Where the train is currently located
  avgSpeed: number, // speed from last station to current location
  nextLocation: string, // Next location arrival time,
  arrivalTime: string | null,
  fromTo: `${string} - ${string}`, // Origin - Destination
}