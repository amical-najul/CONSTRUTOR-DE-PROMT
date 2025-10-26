# AGENTE AI LENA: Roadmap & Architectural Overview

_Current Version: 1.1.0_

This document outlines the vision, current functionality, architectural decisions, and future roadmap for the AGENTE AI LENA application.

## 1. Project Vision & Goal

The primary goal of **AGENTE AI LENA** is to provide a flexible and powerful user interface for interacting with Google's Gemini models. It serves as a "workbench" or "agent console" for developers, researchers, and power users to test, prototype, and leverage advanced AI capabilities.

The key features are:
-   **Conversational Interface:** A standard chat UI for turn-by-turn interaction.
-   **Dynamic Agent Configuration:** The ability to modify the agent's core behavior via a system prompt.
-   **Rich Context Provisioning:** The ability to provide the model with external information, either through text or file uploads (e.g., images, documents).
-   **Extensible Tooling:** The ability to define and provide the agent with tools (function declarations) that it can request to use, enabling it to interact with external APIs or systems.

## 2. Current State (Version 1.1.0)

The application includes the following fully functional features:

-   **Chat Interface:** Users can send and receive messages from the AI model. The chat history is maintained for the current session.
-   **System Prompt Configuration:** A dedicated panel allows users to define the agent's role, personality, and instructions, which is sent with every API request.
-   **Context Provisioning:**
    -   **Text Context:** A text area allows users to provide arbitrary text-based context for the AI to consider.
    -   **File Upload:** Users can upload a single file. The application converts the file to a Base64 string and sends it along with the user's prompt. The file is cleared after each use to ensure a clean slate for the next request.
-   **Tool/Function Calling Configuration:**
    -   The UI for managing tools has been refactored into a more scalable and user-friendly **"list-detail" pattern**.
    -   The main panel displays a clean list of all configured tools by name, keeping the interface uncluttered.
    -   Creating a new tool or editing an existing one opens a dedicated **modal window** (`ToolEditModal`). This provides a focused editing experience for the tool's name and its JSON configuration, complete with validation to prevent syntax errors.
    -   When the model responds with a request to call a function, the application displays the formatted `FunctionCall` JSON object in the chat.

## 3. Architectural Decisions

-   **Frontend Framework:** **React with TypeScript**.
    -   **Why?** It offers a robust, component-based architecture perfect for building a complex UI. TypeScript adds static typing, which significantly reduces runtime errors and improves developer experience and code maintainability.

-   **Styling:** **Tailwind CSS**.
    -   **Why?** It's a utility-first CSS framework that allows for rapid UI development directly within the HTML/JSX. This approach ensures visual consistency and makes it easy to create a custom, modern look.

-   **AI Integration:** **`@google/genai` SDK**.
    -   **Why?** This is the official JavaScript SDK for the Gemini API. Using it ensures compatibility, access to the latest features, and a simplified interface for making API calls.

-   **State Management:** **React Hooks (`useState`, `useEffect`, `useRef`)**.
    -   **Why?** For the current scope of the application, React's built-in hooks are sufficient and lightweight, keeping the architecture simple.

-   **File Handling:** **Client-Side Base64 Encoding**.
    -   **Why?** The Gemini API accepts file data directly as a Base64 encoded string. Handling this on the client-side with the `FileReader` API eliminates the need for a backend server.

-   **Code Structure & Modularity:**
    -   `components/`: Contains reusable UI components (`Panel.tsx`, `icons.tsx`) to promote code reuse and separation of concerns. The introduction of dedicated components for complex interactions, such as `ToolEditModal.tsx`, reinforces the commitment to modularity. It encapsulates the logic and state for editing a tool, decoupling it from the main application view.
    -   `services/`: Isolates external API logic (`geminiService.ts`).
    -   `types.ts`: A central location for all TypeScript interfaces, ensuring type consistency.

## 4. Future Roadmap

-   **Streaming Responses:** Implement `generateContentStream` to display the AI's response token-by-token, improving perceived performance.
-   **Chat History Persistence:** Use `localStorage` to save and load conversations across browser sessions.
-   **Enhanced Tooling:**
    -   **Tool Library:** Create a way to save, load, and reuse tool configurations.
    -   **Function Call Execution:** Implement a client-side "executor" to run simple JavaScript functions based on the model's request and send the result back to the model.
-   **Advanced Configuration:**
    -   **Model Selection:** Add a dropdown to allow users to choose between different Gemini models.
    -   **Parameter Tuning:** Expose model parameters like `temperature`, `topP`, and `topK` in the UI.
-   **UI/UX Enhancements:**
    -   **Syntax Highlighting:** Add a library (like CodeMirror or Monaco Editor) to the text areas for system prompts and JSON tools for a better editing experience.
    -   **Responsiveness:** Improve the layout for use on smaller screens.