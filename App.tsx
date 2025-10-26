import React, { useState, useRef, useEffect } from 'react';
import { Message, UploadedFile, ToolConfig } from './types';
import { generateResponse } from './services/geminiService';
import Panel from './components/Panel';
import ToolEditModal from './components/ToolEditModal';
import { 
    BrainCircuitIcon, 
    ChatBubbleIcon, 
    FileIcon, 
    SendIcon, 
    ToolsIcon, 
    TrashIcon, 
    UploadIcon,
    PlusIcon,
    BroomIcon
} from './components/icons';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('You are AGENTE AI LENA, a helpful and friendly AI assistant.');
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [contextText, setContextText] = useState('');
    const [contextType, setContextType] = useState<'text' | 'file'>('text');
    const [tools, setTools] = useState<ToolConfig[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeConfigTab, setActiveConfigTab] = useState<'context' | 'tools'>('context');
    const [editingTool, setEditingTool] = useState<ToolConfig | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    
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
                    setUploadedFile({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        base64: base64,
                    });
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

        let toolsConfigString = '';
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
            
            toolsConfigString = JSON.stringify([{ functionDeclarations }]);
        }

        try {
            const fileToPass = contextType === 'file' ? uploadedFile : null;
            const contextToPass = contextType === 'text' ? contextText : '';

            const modelResponse = await generateResponse(
                systemPrompt,
                currentInput,
                fileToPass,
                contextToPass,
                toolsConfigString
            );
            addMessage({ role: 'model', text: modelResponse });
        } catch (error) {
            console.error("Error sending message:", error);
            addMessage({ role: 'model', text: 'An error occurred while generating the response.' });
        } finally {
            setIsLoading(false);
            if (contextType === 'file') {
              setUploadedFile(null); // Clear file after use
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    const handleClearChat = () => setMessages([]);

    const handleAddTool = () => {
        const newTool: ToolConfig = {
            id: `tool-${Date.now()}-${Math.random()}`,
            name: `New Tool ${tools.length + 1}`,
            jsonConfig: '{\n  "name": "your_function_name",\n  "description": "A description of the function.",\n  "parameters": {\n    "type": "OBJECT",\n    "properties": {\n      "param1": {\n        "type": "STRING",\n        "description": "Description of param1."\n      }\n    },\n    "required": ["param1"]\n  }\n}',
        };
        setTools(prev => [...prev, newTool]);
        setEditingTool(newTool); // Open modal for the new tool
    };

    const handleDeleteTool = (id: string) => {
        setTools(prev => prev.filter(tool => tool.id !== id));
    };

    const handleSaveTool = (updatedTool: ToolConfig) => {
        setTools(prev => prev.map(tool => tool.id === updatedTool.id ? updatedTool : tool));
        setEditingTool(null); // Close modal on save
    };
    
    const textAreaClass = "w-full p-2 bg-[#282a36] border border-[#6272a4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd93f9] resize-none text-sm text-[#f8f8f2] placeholder:text-gray-400";
    const tabButtonClass = (isActive: boolean) => 
        `px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-[#282a36] text-[#8be9fd]' : 'text-gray-400 hover:text-white'}`;

    return (
        <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col font-sans antialiased">
            <header className="p-4 border-b border-[#6272a4] flex-shrink-0 relative">
                <h1 className="text-xl font-bold text-center text-[#ff79c6]">AGENTE AI LENA</h1>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">V. 1.1.0</span>
            </header>
            <main className="flex-grow grid grid-cols-5 gap-4 p-4 min-h-0">
                {/* Left Column */}
                <div className="col-span-2 flex flex-col gap-4 min-h-0">
                    <Panel title="Messages" icon={<ChatBubbleIcon className="w-6 h-6 text-[#bd93f9]" />} className="flex-[1_1_65%]" actions={
                        <button onClick={handleClearChat} title="Clear Chat" className="p-1 rounded-md hover:bg-[#6272a4] transition-colors">
                            <BroomIcon className="w-5 h-5 text-[#ff5555]" />
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
                            <div className="relative">
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={`${textAreaClass} pr-12`}
                                    placeholder="Interact with AGENTE AI LENA..."
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="absolute right-2 bottom-2 p-2 rounded-md bg-[#50fa7b] text-[#282a36] disabled:bg-gray-500 hover:bg-[#69ff8c] transition-colors">
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </Panel>

                    <Panel title="Agent Configuration" icon={<ToolsIcon className="w-6 h-6 text-[#ffb86c]" />} className="flex-[1_1_35%]" actions={
                         activeConfigTab === 'tools' && (
                            <button onClick={handleAddTool} title="Add Tool" className="p-1 rounded-md hover:bg-[#6272a4] transition-colors">
                                <PlusIcon className="w-5 h-5 text-[#50fa7b]" />
                            </button>
                        )
                    }>
                         <div className="flex flex-col h-full">
                            <div className="flex-shrink-0 border-b border-[#6272a4]">
                                <button onClick={() => setActiveConfigTab('context')} className={tabButtonClass(activeConfigTab === 'context')}>Context File</button>
                                <button onClick={() => setActiveConfigTab('tools')} className={tabButtonClass(activeConfigTab === 'tools')}>Agent Tools & APIs</button>
                            </div>
                            
                            {activeConfigTab === 'context' && (
                                <div className="flex-grow p-2 min-h-0">
                                    <div className="flex flex-col h-full">
                                        <div className="flex-shrink-0 border-b border-[#6272a4]">
                                            <button onClick={() => setContextType('text')} className={tabButtonClass(contextType === 'text')}>Write Text</button>
                                            <button onClick={() => setContextType('file')} className={tabButtonClass(contextType === 'file')}>Upload File</button>
                                        </div>
                                        <div className="flex-grow p-2 min-h-0">
                                            {contextType === 'text' ? (
                                                <textarea value={contextText} onChange={e => setContextText(e.target.value)} className={`${textAreaClass} h-full`} placeholder="Add context here..." />
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-[#6272a4] rounded-md">
                                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                                    <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center text-gray-400 hover:text-[#8be9fd] w-full h-full p-2">
                                                        <UploadIcon className="w-8 h-8 mb-2" />
                                                        <span className="text-xs truncate">{uploadedFile ? uploadedFile.name : 'Click to upload a file'}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeConfigTab === 'tools' && (
                                <div className="flex-grow overflow-y-auto p-2 space-y-2">
                                   {tools.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">Click the '+' icon to add a new tool.</div>
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
                                                    e.stopPropagation(); // Prevent opening the modal
                                                    handleDeleteTool(tool.id);
                                                }} 
                                                title={`Delete ${tool.name}`}
                                                className="p-1 text-gray-400 hover:text-[#ff5555] rounded-full"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )))}
                               </div>
                            )}
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
                                placeholder="Define the agent's role, personality, and instructions here..."
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
        </div>
    );
};

export default App;