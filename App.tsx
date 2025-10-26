import React, { useState, useRef, useEffect } from 'react';
import { Message, ContextItem, ToolConfig } from './types';
import { generateResponse, generatePromptFromInstruction } from './services/geminiService';
import Panel from './components/Panel';
import ToolEditModal from './components/ToolEditModal';
import ContextEditModal from './components/ContextEditModal';
import { 
    BrainCircuitIcon, 
    TypewriterIcon,
    InputVariablesIcon,
    SendIcon, 
    WrenchIcon,
    TrashIcon, 
    PlusIcon,
    SparklesIcon,
    UploadIcon,
    RobotIcon,
} from './components/icons';
import ReactMarkdown from 'react-markdown';
import { Tool } from '@google/genai';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('You are AGENTE AI LENA, a helpful and friendly AI assistant.');
    
    // New context state
    const [contextItems, setContextItems] = useState<ContextItem[]>([]);
    const [activeContextId, setActiveContextId] = useState<string | null>(null);
    const [editingContext, setEditingContext] = useState<ContextItem | null>(null);
    
    const [tools, setTools] = useState<ToolConfig[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeConfigTab, setActiveConfigTab] = useState<'context' | 'tools'>('context');
    const [editingTool, setEditingTool] = useState<ToolConfig | null>(null);

    // New state for prompt instruction feature
    const [promptInstruction, setPromptInstruction] = useState('');
    const [isModifyingPrompt, setIsModifyingPrompt] = useState(false);
    
    // State for editable agent name
    const [agentName, setAgentName] = useState('AGENTE AI LENA');
    const [isEditingAgentName, setIsEditingAgentName] = useState(false);
    const agentNameInputRef = useRef<HTMLInputElement>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (isEditingAgentName) {
            agentNameInputRef.current?.focus();
        }
    }, [isEditingAgentName]);
    
    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const result = loadEvent.target?.result as string;
                const base64 = result.split(',')[1];
                if (base64) {
                   const newFileContext: ContextItem = {
                       id: `context-${Date.now()}`,
                       name: file.name,
                       type: 'file',
                       content: base64,
                       fileDetails: {
                           name: file.name,
                           type: file.type,
                           size: file.size,
                       }
                   };
                   setContextItems(prev => [...prev, newFileContext]);
                   setActiveContextId(newFileContext.id); // Auto-activate new file
                }
            };
            reader.readAsDataURL(file);
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleSendMessage = async () => {
        if (isLoading || !userInput.trim()) return;

        const currentInput = userInput;
        addMessage({ role: 'user', text: currentInput });
        setUserInput('');
        setIsLoading(true);

        let apiTools: Tool[] | undefined = undefined;
        if (tools.length > 0) {
            const functionDeclarations: object[] = [];
            let parseError = false;
            for (const tool of tools) {
                try {
                    functionDeclarations.push(JSON.parse(tool.jsonConfig));
                } catch (e) {
                    const errorMsg = `Error: Invalid JSON in tool "${tool.name}". Please fix it.`;
                    addMessage({ role: 'model', text: errorMsg });
                    console.error(errorMsg, e);
                    setIsLoading(false);
                    parseError = true;
                    break;
                }
            }
            if (parseError) return;
            
            apiTools = [{ functionDeclarations }];
        }

        try {
            const activeContext = contextItems.find(item => item.id === activeContextId) || null;

            const modelResponse = await generateResponse(
                systemPrompt,
                currentInput,
                activeContext,
                apiTools
            );
            addMessage({ role: 'model', text: modelResponse });
        } catch (error) {
            console.error("Error sending message:", error);
            addMessage({ role: 'model', text: 'An error occurred while generating the response.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    const handleClearChat = () => setMessages([]);

    const handleApplyInstruction = async () => {
        if (!promptInstruction.trim() || isModifyingPrompt) return;

        setIsModifyingPrompt(true);
        try {
            const newPrompt = await generatePromptFromInstruction(systemPrompt, promptInstruction);
            setSystemPrompt(newPrompt);
            setPromptInstruction(''); // Clear input on success
        } catch (error) {
            console.error("Failed to apply prompt instruction:", error);
            // Optionally show an error to the user
        } finally {
            setIsModifyingPrompt(false);
        }
    };

    // Agent Name Handlers
    const handleAgentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgentName(e.target.value);
    };

    const handleAgentNameBlur = () => {
        if (!agentName.trim()) {
            setAgentName("AGENTE AI LENA"); // Reset if empty
        }
        setIsEditingAgentName(false);
    };

    const handleAgentNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAgentNameBlur();
        }
    };

    // Tool handlers
    const handleAddTool = () => {
        const newTool: ToolConfig = {
            id: `tool-${Date.now()}`,
            name: `New Tool ${tools.length + 1}`,
            jsonConfig: '{\n  "name": "your_function_name",\n  "description": "A description of the function.",\n  "parameters": {\n    "type": "OBJECT",\n    "properties": {\n      "param1": {\n        "type": "STRING",\n        "description": "Description of param1."\n      }\n    },\n    "required": ["param1"]\n  }\n}',
        };
        setTools(prev => [...prev, newTool]);
        setEditingTool(newTool);
    };

    const handleDeleteTool = (id: string) => {
        setTools(prev => prev.filter(tool => tool.id !== id));
    };

    const handleSaveTool = (updatedTool: ToolConfig) => {
        setTools(prev => prev.map(tool => tool.id === updatedTool.id ? updatedTool : tool));
        setEditingTool(null);
    };

    // Context handlers
    const handleAddTextContext = () => {
        const newContext: ContextItem = {
            id: `context-${Date.now()}`,
            name: `Nueva Variable ${contextItems.length + 1}`,
            type: 'text',
            content: 'Añade tu contexto aquí...'
        };
        setContextItems(prev => [...prev, newContext]);
        setEditingContext(newContext); // Open modal for new text context
    };

    const handleDeleteContext = (id: string) => {
        setContextItems(prev => prev.filter(item => item.id !== id));
        if (activeContextId === id) {
            setActiveContextId(null);
        }
    };

    const handleSaveContext = (updatedContext: ContextItem) => {
        setContextItems(prev => prev.map(item => item.id === updatedContext.id ? updatedContext : item));
        setEditingContext(null);
    };

    const handleContextItemClick = (item: ContextItem) => {
        setActiveContextId(item.id);
        if (item.type === 'text') {
            setEditingContext(item);
        }
        // No modal for files, just activation
    };
    
    const textAreaClass = "w-full p-2 bg-[#282a36] border border-[#6272a4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd93f9] resize-none text-sm text-[#f8f8f2] placeholder:text-gray-400";
    const tabButtonClass = (isActive: boolean) =>
        `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-t-lg -mb-px border border-transparent ${isActive ? 'bg-[#44475a] text-[#8be9fd] border-[#6272a4] border-b-[#44475a]' : 'text-gray-400 hover:text-white'}`;

    return (
        <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col font-sans antialiased">
            <header className="p-4 border-b border-[#6272a4] flex-shrink-0 relative text-center">
                {isEditingAgentName ? (
                    <input
                        ref={agentNameInputRef}
                        type="text"
                        value={agentName}
                        onChange={handleAgentNameChange}
                        onBlur={handleAgentNameBlur}
                        onKeyDown={handleAgentNameKeyDown}
                        className="text-xl font-bold text-center text-[#ff79c6] bg-transparent border-b-2 border-[#ff79c6] focus:outline-none"
                    />
                ) : (
                    <h1 
                        className="text-xl font-bold text-center text-[#ff79c6] cursor-pointer"
                        onClick={() => setIsEditingAgentName(true)}
                    >
                        {agentName}
                    </h1>
                )}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">V. 1.4.0</span>
            </header>
            <main className="flex-grow grid grid-cols-5 gap-4 p-4 min-h-0">
                {/* Left Column */}
                <div className="col-span-2 flex flex-col gap-4 min-h-0">
                    <Panel title="Conversaciones" icon={<TypewriterIcon className="w-6 h-6 text-[#bd93f9]" />} className="flex-[1_1_65%]" actions={
                        <button onClick={handleClearChat} title="Clear Chat" className="p-1 rounded-md hover:bg-[#6272a4] transition-colors">
                            <TrashIcon className="w-5 h-5 text-[#ff5555]" />
                        </button>
                    }>
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-full prose prose-sm prose-invert ${msg.role === 'user' ? 'bg-[#bd93f9] text-black' : 'bg-transparent'}`}>
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && <div className="text-center text-gray-400">...</div>}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t border-[#6272a4] flex-shrink-0">
                            <div className="flex items-end gap-2">
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={`${textAreaClass} flex-grow`}
                                    placeholder={`Interactúa con ${agentName}...`}
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="p-2 rounded-md bg-[#50fa7b] text-[#282a36] disabled:bg-gray-500 hover:bg-[#69ff8c] transition-colors flex-shrink-0">
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </Panel>

                    <Panel title="Agent Configuration" icon={<WrenchIcon className="w-6 h-6 text-[#ffb86c]" />} className="flex-[1_1_35%]">
                         <div className="flex w-full h-full divide-x divide-[#6272a4]">
                            {/* Left Sub-panel: Prompt Instructions */}
                            <div className="w-1/2 p-4 flex flex-col space-y-2">
                                <h3 className="flex items-center text-md font-semibold text-[#f8f8f2]">
                                    <RobotIcon className="w-5 h-5 mr-2 text-gray-400"/>
                                    Instrucciones del Prompt
                                </h3>
                                <textarea
                                    value={promptInstruction}
                                    onChange={(e) => setPromptInstruction(e.target.value)}
                                    className={`${textAreaClass} flex-grow h-full`}
                                    placeholder="Ej: Haz que el agente sea un experto en historia antigua."
                                    disabled={isModifyingPrompt}
                                />
                                <button 
                                    onClick={handleApplyInstruction}
                                    disabled={!promptInstruction.trim() || isModifyingPrompt}
                                    className="flex items-center justify-center px-4 py-2 rounded-md bg-[#8be9fd] text-[#282a36] disabled:bg-gray-500 hover:bg-opacity-80 transition-colors text-sm font-semibold"
                                >
                                    <SparklesIcon className="w-4 h-4 mr-2" />
                                    {isModifyingPrompt ? 'Aplicando...' : 'Aplicar Instrucciones'}
                                </button>
                            </div>

                            {/* Right Sub-panel: Context & Tools */}
                            <div className="w-1/2 flex flex-col">
                                <div className="flex-shrink-0 border-b border-[#6272a4] flex justify-between items-end pr-2">
                                    <div className="flex">
                                        <button onClick={() => setActiveConfigTab('context')} className={tabButtonClass(activeConfigTab === 'context')}>
                                            <InputVariablesIcon className="w-4 h-4" />
                                            Variables
                                        </button>
                                        <button onClick={() => setActiveConfigTab('tools')} className={tabButtonClass(activeConfigTab === 'tools')}>
                                            <WrenchIcon className="w-4 h-4" />
                                            Tools
                                        </button>
                                    </div>
                                    <div className="flex items-center pb-1">
                                        {activeConfigTab === 'context' && (
                                            <>
                                                <button onClick={handleAddTextContext} title="Añadir Variable de Texto" className="p-1 rounded-md hover:bg-[#6272a4] transition-colors">
                                                    <PlusIcon className="w-5 h-5 text-[#8be9fd]" />
                                                </button>
                                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                                <button onClick={() => fileInputRef.current?.click()} title="Subir Archivo de Contexto" className="p-1 rounded-md hover:bg-[#6272a4] transition-colors">
                                                    <UploadIcon className="w-5 h-5 text-[#8be9fd]" />
                                                </button>
                                            </>
                                        )}
                                        {activeConfigTab === 'tools' && (
                                            <button onClick={handleAddTool} title="Añadir Herramienta" className="p-1 rounded-md hover:bg-[#6272a4] transition-colors">
                                                <PlusIcon className="w-5 h-5 text-[#50fa7b]" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {activeConfigTab === 'context' && (
                                    <div className="flex-grow overflow-y-auto p-2 space-y-2">
                                       {contextItems.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm text-center px-4">
                                                <p>Añade variables usando los iconos de arriba.</p>
                                            </div>
                                       ) : (
                                           contextItems.map(item => (
                                            <div 
                                                key={item.id} 
                                                className={`flex justify-between items-center bg-[#282a36] p-3 rounded-md border transition-colors cursor-pointer ${activeContextId === item.id ? 'border-[#8be9fd]' : 'border-transparent hover:border-[#6272a4]'}`}
                                                onClick={() => handleContextItemClick(item)}
                                            >
                                                <div className="flex items-center min-w-0">
                                                    {item.type === 'file' ? <UploadIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" /> : <InputVariablesIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />}
                                                    <span className="font-semibold text-sm truncate">{item.name}</span>
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteContext(item.id);
                                                    }} 
                                                    title={`Borrar ${item.name}`}
                                                    className="p-1 text-gray-400 hover:text-[#ff5555] rounded-full"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )))}
                                   </div>
                                )}

                                {activeConfigTab === 'tools' && (
                                    <div className="flex-grow overflow-y-auto p-2 space-y-2">
                                       {tools.length === 0 ? (
                                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Click en '+' para añadir una herramienta.</div>
                                       ) : (
                                           tools.map(tool => (
                                            <div 
                                                key={tool.id} 
                                                className="flex justify-between items-center bg-[#282a36] p-3 rounded-md border border-transparent hover:border-[#6272a4] cursor-pointer transition-colors"
                                                onClick={() => setEditingTool(tool)}
                                            >
                                                <span className="font-semibold text-sm truncate">{tool.name}</span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTool(tool.id);
                                                    }} 
                                                    title={`Borrar ${tool.name}`}
                                                    className="p-1 text-gray-400 hover:text-[#ff5555] rounded-full"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )))}
                                   </div>
                                )}
                            </div>
                        </div>
                    </Panel>
                </div>

                {/* Right Column */}
                <div className="col-span-3 flex flex-col min-h-0">
                    <Panel title="Agent Prompt" icon={<BrainCircuitIcon className="w-6 h-6 text-[#50fa7b]" />} className="flex-grow">
                        <div className="p-4 h-full">
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                className={`${textAreaClass} h-full`}
                                placeholder="Define el rol, personalidad e instrucciones del agente aquí..."
                            />
                        </div>
                    </Panel>
                </div>
            </main>
            {editingTool && (
                <ToolEditModal 
                    tool={editingTool}
                    onSave={handleSaveTool}
                    onCancel={() => setEditingTool(null)}
                />
            )}
             {editingContext && (
                <ContextEditModal 
                    contextItem={editingContext}
                    onSave={handleSaveContext}
                    onCancel={() => setEditingContext(null)}
                />
            )}
        </div>
    );
};

export default App;