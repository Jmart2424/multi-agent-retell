# 🚀 Multi-Agent Retell AI System with Groq
## One Deployment, Unlimited Agents - 97% Cost Savings

This is a **scalable multi-agent** architecture for Retell AI powered by Groq's LLM. Deploy once, run unlimited agents with different personalities, scripts, and purposes.

---

## 🎯 Why This Architecture?

### **The Problem:**
- Deploying 10 agents = 10 Railway instances = $50-150/month
- Each agent needs separate management
- Code duplication across deployments
- Difficult to maintain consistency

### **The Solution:**
- ✅ ONE Railway deployment handles ALL agents
- ✅ Add new agents by creating a single file
- ✅ Shared infrastructure = lower costs
- ✅ Easy to maintain and update
- ✅ Each agent has unique personality/script

---

## 💰 Cost Comparison

### **Old Way (10 agents, 10 deployments):**
```
Railway: $15/month × 10 = $150/month
LLM: Retell native = $0.06/min
Total per 3-min call: $0.435
```

### **New Way (10 agents, 1 deployment):**
```
Railway: $15/month × 1 = $15/month
LLM: Groq = $0.002/min
Total per 3-min call: $0.262

SAVINGS: 40% per call + $135/month on hosting! 🎉
```

---

## 🏗️ Architecture Overview
```
ONE Railway Deployment
    ↓
Central Server (server.js)
    ↓
Agent Router (based on URL path)
    ↓
┌──────────┬──────────┬──────────┬──────────┐
│ Magnolia │ Go2Bank  │ Agent 3  │ Agent 10 │
│  Agent   │  Agent   │          │          │
└──────────┴──────────┴──────────┴──────────┘
```

### **How It Works:**
Each agent gets its own WebSocket URL:
- Magnolia: `wss://your-url.up.railway.app/llm-websocket/magnolia`
- Go2Bank: `wss://your-url.up.railway.app/llm-websocket/go2bank`
- Agent 3: `wss://your-url.up.railway.app/llm-websocket/agent3`

---

## 📁 Project Structure
```
multi-agent-retell/
├── server.js              # Main server with agent routing
├── package.json           # Dependencies
├── railway.json           # Railway config
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── README.md             # This file
│
└── agents/
    ├── index.js          # Exports all agents
    ├── magnolia.js       # Magnolia Bank agent
    ├── go2bank.js        # Go2Bank agent
    └── _template.js      # Template for new agents
```

---

## 🚀 Quick Start

### **1. Push to GitHub**
```bash
git init
git add .
git commit -m "Initial multi-agent setup"
git remote add origin https://github.com/YOUR-USERNAME/multi-agent-retell.git
git branch -M main
git push -u origin main
```

### **2. Deploy to Railway**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your `multi-agent-retell` repo
4. Add environment variables:
   - `GROQ_API_KEY` = your Groq API key
   - `PORT` = 8080
5. Generate domain (e.g., `your-app.up.railway.app`)

### **3. Create Agents in Retell**

For each agent:
1. Retell Dashboard → Create Agent
2. Select **"Custom LLM"**
3. WebSocket URL: `wss://your-app.up.railway.app/llm-websocket/AGENT_ID`
   - Replace `AGENT_ID` with: `magnolia`, `go2bank`, etc.
4. Select voice (ElevenLabs recommended)
5. Save and test!

---

## ✨ Adding a New Agent (5 Minutes!)

### **Step 1: Copy the Template**
```bash
cp agents/_template.js agents/mynewagent.js
```

### **Step 2: Edit Your Agent File**
Open `mynewagent.js` and update:
```javascript
export default {
  id: "mynewagent",  // ← Change this
  name: "My New Agent Name",  // ← Change this
  description: "What this agent does",  // ← Change this
  
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
  max_tokens: 300,
  
  prompt: `
# Your agent's script here
...
  `
};
```

### **Step 3: Register the Agent**
Edit `agents/index.js`:
```javascript
import magnolia from "./magnolia.js";
import go2bank from "./go2bank.js";
import mynewagent from "./mynewagent.js";  // ← Add this

export const agents = {
  magnolia,
  go2bank,
  mynewagent,  // ← Add this
};
```

### **Step 4: Push to GitHub**
```bash
git add .
git commit -m "Added mynewagent"
git push
```

**That's it!** Railway auto-deploys in ~2 minutes.

### **Step 5: Use Your New Agent**
In Retell, create an agent with WebSocket URL:
```
wss://your-app.up.railway.app/llm-websocket/mynewagent
```

---

## 📊 Managing Multiple Agents

### **View All Available Agents**
Visit: `https://your-app.up.railway.app/agents`

### **Health Check**
Visit: `https://your-app.up.railway.app/health`

---

## 🐛 Troubleshooting

### **Agent Not Found Error**
- Make sure agent is imported in `agents/index.js`
- Check agent ID matches file name

### **WebSocket Connection Failed**
- Verify URL format: `wss://your-url.up.railway.app/llm-websocket/AGENT_ID`
- Check Railway deployment succeeded

### **Viewing Logs by Agent**
Railway logs show agent names:
```
[Magnolia Bank VA Outbound] Client connected
[Go2Bank] AI Response: ...
```

---

## 💡 Pro Tips

1. **Test Agents Independently** - Use Retell's web call feature
2. **Use Descriptive Agent IDs** - `magnolia-va-loans` not `agent1`
3. **Keep Prompts in Version Control** - Easy to rollback if needed
4. **Monitor Per-Agent Performance** - Railway logs include agent names

---

## 📚 Additional Resources

- **Groq Console:** https://console.groq.com
- **Retell Docs:** https://docs.retellai.com
- **Railway Docs:** https://docs.railway.app

---

**Built by HeyDay Digital Media**
**Multi-Agent Architecture v2.0**
**November 2025**
```

**Save it** (Ctrl+S)

---

## 🎉 ALL DONE! You should now have:

In VS Code, you should see:
```
multi-agent-retell/
├── agents/
│   ├── index.js
│   ├── magnolia.js
│   ├── go2bank.js
│   └── _template.js
├── .env.example
├── .gitignore
├── package.json
├── railway.json
├── README.md
└── server.js