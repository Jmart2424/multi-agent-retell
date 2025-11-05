// TEMPLATE: Copy this file to create a new agent
// Steps:
// 1. Copy this file and rename it (e.g., agent3.js)
// 2. Update the metadata below
// 3. Replace the prompt with your agent's script
// 4. Import and add to agents/index.js
// 5. Push to GitHub - Railway auto-deploys!

export default {
  // ============================================
  // AGENT METADATA
  // ============================================
  id: "AGENT_ID_HERE", // e.g., "go2bank", "solar", "insurance"
  name: "Agent Name Here", // e.g., "Go2Bank Cash Advance Agent"
  description: "Brief description of what this agent does",
  
  // ============================================
  // GROQ MODEL CONFIGURATION
  // ============================================
  model: "llama-3.3-70b-versatile", // Options:
  // "llama-3.3-70b-versatile" - Best quality, most expensive
  // "llama-3.1-8b-instant" - Faster, cheaper, good for simple tasks
  // "mixtral-8x7b-32768" - Alternative, good balance
  
  temperature: 0.7, // 0.0 = deterministic, 1.0 = creative
  max_tokens: 300, // Maximum response length
  
  // ============================================
  // AGENT PROMPT (YOUR SCRIPT)
  // ============================================
  prompt: `
# Identity & Purpose

[Who is this agent? What's their purpose?]

---

# Voice & Persona

## Personality
- [Describe personality traits]
- [How should they sound?]
- [What's their approach?]

## Speech Characteristics
- [Speaking style]
- [Tone]
- [Pace]
- [Language choices]

---

# Response Guidelines

- [How to respond]
- [When to ask questions]
- [How to handle objections]

---

# Scenario Handling

- **If [scenario]:** [How to handle it]
- **If [scenario]:** [How to handle it]

---

# Conversational Flow

## Introduction

1. Say: "[Your opening line]"
2. [Next step]

## [Next Section]

1. [Step 1]
2. [Step 2]

---

## [Final Section]

- [Closing steps]
  - Then endCall
`
};