# AGENTE AI LENA

**AGENTE AI LENA** is a powerful and intuitive web-based user interface designed to serve as a "workbench" for interacting with Google's advanced Gemini AI models. It provides developers, researchers, and power users with a comprehensive toolkit to test, prototype, and harness the full potential of generative AI.

![AGENTE AI LENA Screenshot](https://storage.googleapis.com/aistudio-project-files/5c1a1f33-155e-4122-869a-32c02c2f6d54/_project_artifacts/2a4b8782-e2c7-4566-a60d-58475cd152e9/Luz-Vi-20240523-144211.png)

---

## ✨ Key Features

-   **Interactive Chat Interface:** Engage in seamless, turn-by-turn conversations with the AI.
-   **Dynamic Agent Configuration:** Instantly modify the AI's core behavior, personality, and instructions using a dedicated System Prompt panel.
-   **AI-Assisted Prompt Engineering:** Use natural language instructions in a dedicated panel to have an AI automatically rewrite and refine the main System Prompt, accelerating the development of agent behavior.
-   **Advanced Context Management:** Persistently manage a list of multiple context items.
    -   **Text & File Support:** Create context from both text snippets and uploaded files (images, documents).
    -   **One-Click Activation:** Easily switch between different contexts by selecting the "active" one from your list.
-   **Extensible Tooling (Function Calling):**
    -   **Structured Tool Builder:** Define custom tools and functions in a dedicated "Herramientas" section with a user-friendly form.
    -   **Dynamic Activation:** In the main interface, toggle tools on or off for the current session. Only active tools are made available to the agent.

---

## 🚀 How to Use

The interface is divided into three main sections for maximum efficiency:

1.  **Messages Panel (Left):**
    -   View the ongoing conversation history.
    -   Type your messages in the input box at the bottom and press Enter or click the send button.
    -   Clear the chat history using the trash icon.

2.  **Agent Configuration Panel (Left):** This panel is split into two parts:
    -   **Prompt Instructions (Left side):** Type a command (e.g., "Make the agent speak like a pirate") and click "Apply Instructions". The AI will automatically rewrite the main "Agent Prompt" on the right.
    -   **Configuration (Right side):**
        -   **Context Items Tab:** Manage a list of context items. Add text or upload files. Click any item to mark it as **active** (it will be sent with your next message).
        -   **Agent Tools & APIs Tab:** Manage the agent's tools. Use the **toggle switch** next to each tool to activate or deactivate it for the current conversation.

3.  **Agent Prompt Panel (Right):**
    -   Write and edit the **System Prompt** here. This is the master instruction that guides the AI's behavior. You can edit it manually or have it modified by the "Prompt Instructions" feature.

---

## 🛠️ Technology Stack

-   **Frontend:** React with TypeScript
-   **AI Integration:** `@google/genai` (The official Google Gemini API SDK)
-   **Styling:** Tailwind CSS
-   **State Management:** React Hooks (`useState`, `useEffect`)

---

## 📂 Project Structure

-   `/components`: Reusable React components (e.g., `Panel`, `ToolEditModal`, `icons`).
-   `/services`: Logic for interacting with external APIs (e.g., `geminiService.ts`).
-   `/docs`: Project documentation, including the roadmap and changelog.
-   `types.ts`: Centralized TypeScript type definitions.

---

## 🔮 Future Development

This project is under active development. For a detailed overview of upcoming features and architectural decisions, please see the [Roadmap](docs/idea-inbox-mvp-roadmap.md).