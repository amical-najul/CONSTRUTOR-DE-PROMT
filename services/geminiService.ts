
import { GoogleGenAI, GenerateContentResponse, Tool } from "@google/genai";
import { ContextItem } from '../types';

if (!process.env.API_KEY) {
    // In a real application, you would throw an error or handle this case appropriately.
    // For this example, we'll proceed, but API calls will fail without a key.
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateResponse = async (
    systemPrompt: string,
    userPrompt: string,
    activeContext: ContextItem | null,
    tools: Tool[] | undefined,
): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        
        let promptText = userPrompt;
        let imagePart = null;

        if (activeContext) {
            if (activeContext.type === 'text') {
                 promptText = `[CONTEXT PROVIDED]\n${activeContext.content}\n\n[USER QUERY]\n${userPrompt}`;
            } else if (activeContext.type === 'file' && activeContext.fileDetails) {
                 imagePart = {
                    inlineData: {
                        mimeType: activeContext.fileDetails.type,
                        data: activeContext.content, // content is the base64 string
                    },
                };
            }
        }
        
        // FIX: Simplify `contents` parameter for generateContent.
        // For text-only, pass a string. For multimodal, pass an object with a `parts` array.
        const contents = imagePart ? { parts: [imagePart, { text: promptText }] } : promptText;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: systemPrompt,
                ...(tools && { tools: tools }),
            },
        });

        // Handle function call responses
        if (response.functionCalls && response.functionCalls.length > 0) {
             return `Function Call Requested:\n\`\`\`json\n${JSON.stringify(response.functionCalls, null, 2)}\n\`\`\``;
        }

        return response.text;

    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        return "Sorry, I encountered an error while processing your request. Please check the console for details.";
    }
};

/**
 * Generates a new system prompt by applying a user's instruction to an existing prompt.
 * @param currentPrompt The current system prompt.
 * @param instruction The user's instruction for modification.
 * @returns The rewritten system prompt.
 */
export const generatePromptFromInstruction = async (
    currentPrompt: string,
    instruction: string,
): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const metaPrompt = `You are an AI assistant that expertly rewrites system prompts based on user instructions.
        Given the current system prompt and a modification instruction, rewrite the prompt to incorporate the instruction.
        Only return the full, rewritten prompt text. Do not add any extra commentary, formatting, or markdown.

        [CURRENT PROMPT]
        ${currentPrompt}

        [INSTRUCTION]
        ${instruction}

        [REWRITTEN PROMPT]`;

        // FIX: Simplify `contents` for text-only prompts to be a string.
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: metaPrompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating prompt from instruction:", error);
        return "Sorry, I encountered an error while modifying the prompt.";
    }
};
