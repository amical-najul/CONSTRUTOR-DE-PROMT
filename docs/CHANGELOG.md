# Changelog

All notable changes to this project will be documented in this file.

## [1.6.0]

### Added
-   **Dynamic Tool Activation:** Users can now enable or disable specific tools for the current chat session directly from the 'Principal' view. A toggle switch is provided for each tool, and only the active tools are sent to the Gemini model, allowing for more granular control over the agent's capabilities.

## [1.5.0]

### Added
-   **Multi-View Architecture:** The application has been refactored to support multiple views, managed by a new persistent navigation sidebar on the left.
-   **Scalable Foundation:** The original interface is now encapsulated in a "Principal" view, with placeholders for future "Flujos" and "Configuraciones" sections. This prepares the application for significant future feature expansion.

### Changed
-   The main `App.tsx` component now acts as a view router, improving code organization and separation of concerns.

## [1.4.0]

### Added
-   **Editable Agent Name:** The main title of the application can now be clicked and edited to rename the agent for the current session.

### Changed
-   **UI Polish & Theming:**
    -   Renamed panels and tabs to Spanish for better thematic consistency (e.g., "Messages" to "Conversaciones").
    -   Updated icons across the application for better visual clarity (e.g., a typewriter for conversations, a robot for instructions).
-   **UX Improvements:**
    -   The chat input area was redesigned to prevent the send button from overlapping the text field.
    -   Configuration tabs ("Variables" and "Tools") are now arranged horizontally for a more standard layout.
-   **Code Quality:**
    -   Refactored the tool handling logic to pass objects directly instead of stringifying and re-parsing JSON, improving efficiency.
    -   Corrected the HTML charset to `UTF-8`.

## [1.3.0]

### Added
-   **AI-Assisted Prompt Engineering:** Introduced a new "Prompt Instructions" panel. Users can now provide natural language instructions to an AI to automatically rewrite and refine the main "Agent Prompt".
-   Added `SparklesIcon` to visually represent the AI-powered prompt modification action.

### Changed
-   **UI Refactor for Agent Configuration:** The "Agent Configuration" panel has been split into two sub-panels. The new "Prompt Instructions" feature is on the left, and the existing "Context Items" and "Agent Tools & APIs" tabs are now consolidated on the right.

## [1.2.0]

### Changed
-   **UI Refactor for Context Management:** Reworked the "Context Items" panel to use the same list-detail pattern as the Agent Tools. Users can now manage a list of multiple context items (both text and files), select an "active" context to be sent with a prompt, and edit text context in a dedicated modal window.

### Added
-   **Context Edit Modal:** Created a new `ContextEditModal` component for a focused text context editing experience.
-   **Multi-Context Selection:** Implemented logic to handle a list of context items and track the currently active one.

## [1.1.0]

### Changed
-   **UI Refactor for Agent Tools:** Reworked the "Agent Tools & APIs" panel to use a list-detail pattern. Tools are now displayed in a clean list, and a modal window is used for creating and editing tool configurations. This improves UI scalability and user experience.

### Added
-   **Tool Edit Modal:** Created a new `ToolEditModal` component to provide a focused editing environment for tool configurations, including real-time JSON validation.
-   **Project Documentation:** Added this CHANGELOG.md and updated the project roadmap to reflect v1.1.0 changes.

## [1.0.0]

### Added
-   Initial release of AGENTE AI LENA.
-   Core features:
    -   Conversational chat interface.
    -   Configurable system prompt.
    -   Context provisioning via text input and file upload.
    -   Dynamic tool configuration with in-line JSON editing.