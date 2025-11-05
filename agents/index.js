// Import all agent configurations
import magnolia from "./magnolia.js";
import go2bank from "./go2bank.js";
// Import additional agents here as you create them
// import agent3 from "./agent3.js";
// import agent4 from "./agent4.js";

// Export all agents with their IDs
export const agents = {
  magnolia,
  go2bank,
  // Add more agents here
  // agent3,
  // agent4,
};

// Helper function to get agent by ID
export function getAgent(id) {
  return agents[id];
}

// Helper function to list all agent IDs
export function listAgents() {
  return Object.keys(agents);
}