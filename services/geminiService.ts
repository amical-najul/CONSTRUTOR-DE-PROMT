import { GoogleGenAI, GenerateContentResponse, Tool } from "@google/genai";
import { UploadedFile } from '../types';

if (!process.env.API_KEY) {
    // In a real application, you would throw an error or handle this case appropriately.
    // For this example, we'll proceed, but API calls will fail without a key.
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateResponse = async (
    systemPrompt: string,
    userPrompt: string,
    file: UploadedFile | null,
    contextText: string,
    toolsConfig: string,
): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        
        const fullUserPrompt = contextText 
            ? `[CONTEXT PROVIDED]\n${contextText}\n\n[USER QUERY]\n${userPrompt}` 
            : userPrompt;

        const parts: any[] = [{ text: fullUserPrompt }];

        if (file) {
            parts.unshift({
                inlineData: {
                    mimeType: file.type,
                    data: file.base64,
                },
            });
        }
        
        let tools: Tool[] | undefined = undefined;
        if (toolsConfig.trim()) {
            try {
                // The API expects the tools in a specific format, e.g., [{ functionDeclarations: [...] }]
                const parsedTools = JSON.parse(toolsConfig);
                // Basic validation to ensure it's an array
                if (Array.isArray(parsedTools)) {
                    tools = parsedTools;
                } else {
                    console.warn("Tools config is not a valid JSON array. Ignoring tools.");
                }
            } catch (e) {
                console.error("Error parsing tools JSON:", e);
                // Optionally return an error message to the user
                return "Error: The provided Tools JSON is invalid. Please correct it and try again.";
            }
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: { parts: parts },
            config: {
                systemInstruction: systemPrompt,
                // FIX: The `tools` parameter has been correctly moved inside the `config` object.
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