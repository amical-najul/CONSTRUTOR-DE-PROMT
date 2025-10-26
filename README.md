# AGENTE AI LENA

**AGENTE AI LENA** is a powerful and intuitive web-based user interface designed to serve as a "workbench" for interacting with Google's advanced Gemini AI models. It provides developers, researchers, and power users with a comprehensive toolkit to test, prototype, and harness the full potential of generative AI.

![AGENTE AI LENA Screenshot](https://storage.googleapis.com/aistudio-project-files/5c1a1f33-155e-4122-869a-32c02c2f6d54/_project_artifacts/2a4b8782-e2c7-4566-a60d-58475cd152e9/Luz-Vi-20240523-144211.png)

---

## ✨ Key Features

-   ** interactive Chat Interface:** Engage in seamless, turn-by-turn conversations with the AI.
-   **Dynamic Agent Configuration:** Instantly modify the AI's core behavior, personality, and instructions using a dedicated System Prompt panel.
-   **Rich Context Provisioning:** Provide the model with external knowledge for more accurate and relevant responses:
    -   **Text-Based Context:** Paste any amount of text to set the stage for your query.
    -   **File Uploads:** Upload files (like images or documents) to be included in the context.
-   **Extensible Tooling (Function Calling):** Define custom tools and functions using a clean, scalable list-detail interface. The AI can request to use these tools to interact with external APIs or systems, and the application will display the structured function call request.

---

## 🚀 How to Use

The interface is divided into three main sections for maximum efficiency:

1.  **Messages Panel (Left):**
    -   View the ongoing conversation history.
    -   Type your messages in the input box at the bottom and press Enter or click the send button.
    -   Clear the chat history using the broom icon.

2.  **Agent Configuration Panel (Left):**
    -   **Context Tab:** Switch between providing context as raw text or by uploading a file. The uploaded file is sent with the next message and then cleared.
    -   **Agent Tools & APIs Tab:** Manage the agent's tools. Click the `+` icon to add a new tool. Click on any existing tool to open a modal window where you can edit its name and JSON configuration.

3.  **Agent Prompt Panel (Right):**
    -   Write and edit the **System Prompt** here. This is the master instruction that guides the AI's behavior throughout the conversation. Changes are applied automatically on your next message.

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
