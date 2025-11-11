import Groq from "groq-sdk";
import { WebSocketServer } from "ws";
import express from "express";
import { agents } from "./agents/index.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on("connection", (ws, req, agentId) => {
  console.log(`Client connected for agent: ${agentId}`);
  
  // Get agent configuration
  const agentConfig = agents[agentId];
  if (!agentConfig) {
    console.error(`Agent ${agentId} not found`);
    ws.close();
    return;
  }

  console.log(`Using agent: ${agentConfig.name}`);

  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`[${agentConfig.name}] Received:`, message.interaction_type);

      // Only respond when Retell requests a response
      if (message.interaction_type === "response_required") {
        // Get lead context if available
        const leadContext = ws.leadContext || '';
        
        // Build conversation history with agent-specific prompt
        const messages = [
          { role: "system", content: agentConfig.prompt + leadContext },
          ...message.transcript.map((t) => ({
            role: t.role === "agent" ? "assistant" : "user",
            content: t.content,
          })),
        ];

        console.log(`[${agentConfig.name}] Sending to Groq...`);

        // Get response from Groq with agent-specific settings
        const completion = await groq.chat.completions.create({
          model: agentConfig.model || "llama-3.3-70b-versatile",
          messages: messages,
          temperature: agentConfig.temperature || 0.7,
          max_tokens: agentConfig.max_tokens || 300,
          top_p: 0.9,
        });

        const aiResponse = completion.choices[0].message.content;
        console.log(`[${agentConfig.name}] AI Response:`, aiResponse.substring(0, 100) + "...");

        // Send response back to Retell
        ws.send(
          JSON.stringify({
            response_id: message.response_id,
            content: aiResponse,
            content_complete: true,
            end_call: false,
          })
        );
      } else if (message.interaction_type === "call_details") {
        console.log(`[${agentConfig.name}] Call started:`, message.call_id);
        
        // Extract lead data from Retell
        const leadData = message.call.retell_llm_dynamic_variables || {};
        const firstName = leadData.first_name || "there";
        const loanBalance = leadData.loan_balance || "unknown";
        const homeValue = leadData.home_value || "unknown";
        
        console.log(`[${agentConfig.name}] Lead data:`, { firstName, loanBalance, homeValue });
        
        // Store lead data for this WebSocket connection
        ws.leadContext = `

Lead Information:
- Name: ${firstName}
- Current Loan Balance: $${loanBalance}
- Estimated Home Value: $${homeValue}

Use this information naturally in your conversation. Don't ask questions you already know the answer to.`;
        
        // Personalized greeting with pause
        const greeting = `Hi ${firstName}, this is Alicia Jones from the VA Loan Department at Magnolia Bank on a recorded line. Our callback number is 702-820-2172. How are you doing today?`;
        
        // Send greeting
        ws.send(
          JSON.stringify({
            response_id: 0,
            content: greeting,
            content_complete: true,
            end_call: false,
          })
        );
        
        console.log(`[${agentConfig.name}] Sent personalized greeting to ${firstName}`);
      } else if (message.interaction_type === "update_only") {
        console.log(`[${agentConfig.name}] Transcript update`);
      }
    } catch (error) {
      console.error(`[${agentConfig.name}] Error:`, error);
      ws.send(
        JSON.stringify({
          response_id: 0,
          content: "I apologize, I'm experiencing technical difficulties. Let me transfer you to someone who can help.",
          content_complete: true,
          end_call: false,
        })
      );
    }
  });

  ws.on("close", () => {
    console.log(`[${agentConfig.name}] Client disconnected`);
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    agents: Object.keys(agents).map(id => ({
      id,
      name: agents[id].name
    }))
  });
});

// List available agents
app.get("/agents", (req, res) => {
  res.json({
    agents: Object.keys(agents).map(id => ({
      id,
      name: agents[id].name,
      description: agents[id].description,
      websocket_url: `wss://${req.get('host')}/llm-websocket/${id}`
    }))
  });
});

// Create HTTP server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Multi-Agent Retell-Groq server running on port ${PORT}`);
  console.log(`Available agents: ${Object.keys(agents).join(", ")}`);
});

// Handle WebSocket upgrade with agent routing
server.on("upgrade", (request, socket, head) => {
  // Extract agent ID from URL path
  // Format: /llm-websocket/magnolia or /llm-websocket/go2bank
  const urlParts = request.url.split("/");
  const agentId = urlParts[2]; // Get the agent ID from URL

  if (urlParts[1] === "llm-websocket" && agentId && agents[agentId]) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, agentId);
    });
  } else {
    console.error(`Invalid WebSocket path or agent: ${request.url}`);
    socket.destroy();
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
