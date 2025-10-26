# AGENTE AI LENA: Roadmap & Architectural Overview

_Current Version: 1.6.0_

This document outlines the vision, current functionality, architectural decisions, and future roadmap for the AGENTE AI LENA application.

## 1. Project Vision & Goal

The primary goal of **AGENTE AI LENA** is to provide a flexible and powerful user interface for interacting with Google's Gemini models. It serves as a "workbench" or "agent console" for developers, researchers, and power users to test, prototype, and leverage advanced AI capabilities.

The key features are:
-   **Conversational Interface:** A standard chat UI for turn-by-turn interaction.
-   **Dynamic Agent Configuration:** The ability to modify the agent's core behavior via a system prompt.
-   **Rich Context Provisioning:** The ability to provide the model with external information, either through text or file uploads (e.g., images, documents).
-   **Extensible Tooling:** The ability to define and provide the agent with tools (function declarations) that it can request to use, enabling it to interact with external APIs or systems.

## 2. Current State (Version 1.6.0)

The application has been refactored into a multi-view architecture, preparing it for future expansion.

-   **Navigation Sidebar:** A persistent sidebar allows navigation between the main application and future sections like "Flujos" and "Configuraciones".
-   **Main View (`Principal`):** This view contains all previously developed features:
    -   **Chat Interface:** Users can send and receive messages from the AI model.
    -   **System Prompt Configuration:** A dedicated panel allows users to define the agent's role and instructions.
    -   **AI-Assisted Prompt Engineering:** A dedicated panel to rewrite the main `Agent Prompt` using natural language instructions.
    -   **Context Management:** A "list-detail" interface to manage and activate multiple text or file-based context items.
    -   **Dynamic Tool Activation:** In the main interface, users can see a list of all available tools created in the "Herramientas" section. Each tool has a toggle switch, allowing the user to selectively activate or deactivate it for the current chat session. Only the active tools are sent to the model.

-   **Tools View (`Herramientas`):** A dedicated section for creating and managing a persistent library of tools.
    -   **Structured Tool Editor:** A user-friendly, form-based UI for creating and managing Webhook-based tools, abstracting away the complexity of JSON.

## 3. Architectural Decisions

-   **Frontend Framework:** **React with TypeScript**.
    -   **Why?** It offers a robust, component-based architecture. TypeScript adds static typing for better code quality and maintainability.

-   **Styling:** **Tailwind CSS**.
    -   **Why?** A utility-first CSS framework for rapid and consistent UI development.

-   **AI Integration:** **`@google/genai` SDK**.
    -   **Why?** The official JavaScript SDK for the Gemini API, ensuring compatibility and access to the latest features.

-   **State Management:** **React Hooks (`useState`, `useEffect`, `useRef`)**.
    -   **Why?** For the current scope, React's built-in hooks are sufficient and lightweight. State is lifted to the highest common ancestor (`App.tsx`) where necessary to share between views.

-   **Application Architecture:** **Multi-View with Sidebar Navigation**.
    -   **Why?** The application is structured with a main router (`App.tsx`) that conditionally renders different views based on the selection in a persistent sidebar. This approach is highly scalable, allowing new, distinct feature sets (like "Flujos") to be added as separate components without cluttering the main interface. It promotes a strong separation of concerns.

-   **Code Structure & Modularity:**
    -   `components/`: Contains reusable UI components. The main application logic is now encapsulated in `MainInterface.tsx`, and the navigation is handled by `Sidebar.tsx`.
    -   `services/`: Isolates external API logic (`geminiService.ts`).
    -   `types.ts`: A central location for all TypeScript interfaces.

## 4. Future Roadmap

-   **Enhanced Tooling (v1.7+):**
    -   **Tool Persistence:** Tools created in the new "Herramientas" view will be saved to `localStorage`, making them persistent across sessions.
-   **Develop "Flujos" View:** Implement a visual workflow builder to create and manage multi-step agent interactions.
-   **Develop "Configuraciones" View:** Add a section for global application settings, such as API key management, theme selection, and model parameter defaults.
-   **Streaming Responses:** Implement `generateContentStream` in the chat for real-time feedback.
-   **Chat History Persistence:** Use `localStorage` to save and load conversations.
-   **Advanced Configuration:** Add UI controls for model selection (`gemini-pro`, etc.) and parameter tuning (`temperature`, `topK`).
-   **UI/UX Enhancements:** Add syntax highlighting to code/JSON editors.