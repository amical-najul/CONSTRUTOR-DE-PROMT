import React, { useState, useEffect } from 'react';
import { WebhookTool, ToolParameter } from '../types';
import Panel from './Panel';
import { ToolboxIcon, PlusIcon, PencilIcon, TrashIcon } from './icons';
import { Type } from '@google/genai';

interface ToolsViewProps {
  tools: WebhookTool[];
  setTools: React.Dispatch<React.SetStateAction<WebhookTool[]>>;
}

interface ToolFormProps {
  tool: WebhookTool;
  setTool: React.Dispatch<React.SetStateAction<WebhookTool>>;
}

const ToolForm: React.FC<ToolFormProps> = ({ tool, setTool }) => {
  const handleParamChange = (index: number, field: keyof ToolParameter, value: string | boolean) => {
    const newParams = [...tool.parameters];
    (newParams[index] as any)[field] = value;
    setTool({ ...tool, parameters: newParams });
  };

  const addParameter = () => {
    const newParam: ToolParameter = {
      id: `param-${Date.now()}`,
      name: '',
      type: Type.STRING,
      description: '',
      required: false,
    };
    setTool({ ...tool, parameters: [...tool.parameters, newParam] });
  };

  const removeParameter = (index: number) => {
    const newParams = tool.parameters.filter((_, i) => i !== index);
    setTool({ ...tool, parameters: newParams });
  };
  
  const inputClass = "w-full p-2 bg-[#282a36] border border-[#6272a4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd93f9] text-[#f8f8f2]";
  const selectClass = `${inputClass} appearance-none`;
  const labelClass = "block text-sm font-medium text-[#bd93f9] mb-1";
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="tool-name" className={labelClass}>Tool Name</label>
        <input id="tool-name" type="text" value={tool.name} onChange={e => setTool({...tool, name: e.target.value})} className={inputClass} />
      </div>
      <div>
        <label htmlFor="tool-desc" className={labelClass}>Description</label>
        <textarea id="tool-desc" value={tool.description} onChange={e => setTool({...tool, description: e.target.value})} className={`${inputClass} resize-y min-h-[60px]`} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label htmlFor="tool-url" className={labelClass}>Webhook URL</label>
          <input id="tool-url" type="text" value={tool.webhookUrl} onChange={e => setTool({...tool, webhookUrl: e.target.value})} className={inputClass} />
        </div>
        <div>
          <label htmlFor="tool-method" className={labelClass}>HTTP Method</label>
          <select id="tool-method" value={tool.httpMethod} onChange={e => setTool({...tool, httpMethod: e.target.value as any})} className={selectClass}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>
      </div>
      <div>
        <h4 className="text-md font-semibold text-[#f8f8f2] mb-2">Parameters</h4>
        <div className="space-y-3">
          {tool.parameters.map((param, index) => (
            <div key={param.id} className="grid grid-cols-12 gap-2 p-3 bg-[#282a36]/50 rounded-md">
              <div className="col-span-3"><input type="text" placeholder="Name" value={param.name} onChange={e => handleParamChange(index, 'name', e.target.value)} className={`${inputClass} text-sm`} /></div>
              <div className="col-span-2">
                <select value={param.type} onChange={e => handleParamChange(index, 'type', e.target.value as Type)} className={`${selectClass} text-sm`}>
                  <option value={Type.STRING}>STRING</option>
                  <option value={Type.NUMBER}>NUMBER</option>
                  <option value={Type.BOOLEAN}>BOOLEAN</option>
                </select>
              </div>
              <div className="col-span-5"><input type="text" placeholder="Description" value={param.description} onChange={e => handleParamChange(index, 'description', e.target.value)} className={`${inputClass} text-sm`} /></div>
              <div className="col-span-1 flex items-center justify-center">
                <input type="checkbox" checked={param.required} onChange={e => handleParamChange(index, 'required', e.target.checked)} className="h-4 w-4 rounded bg-[#282a36] border-[#6272a4] text-[#50fa7b] focus:ring-[#50fa7b]" title="Required"/>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <button onClick={() => removeParameter(index)} className="text-gray-400 hover:text-[#ff5555]"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addParameter} className="mt-2 flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-[#6272a4] hover:bg-opacity-80 transition-colors">
          <PlusIcon className="w-4 h-4" /> Add Parameter
        </button>
      </div>
    </div>
  );
};

const ToolEditModal: React.FC<{
  tool: WebhookTool | null;
  onSave: (tool: WebhookTool) => void;
  onCancel: () => void;
}> = ({ tool: initialTool, onSave, onCancel }) => {
  const [tool, setTool] = useState<WebhookTool | null>(null);

  useEffect(() => {
    if (initialTool) {
      setTool(JSON.parse(JSON.stringify(initialTool))); // Deep copy to avoid mutating state
    }
  }, [initialTool]);

  if (!tool) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-[#44475a] border border-[#6272a4] rounded-lg shadow-2xl w-full max-w-4xl flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-[#6272a4]">
          <h3 className="text-xl font-bold text-[#f8f8f2]">{initialTool?.id.startsWith('new-') ? 'Create New Tool' : 'Edit Tool'}</h3>
        </header>
        <main className="p-6 flex-grow max-h-[70vh] overflow-y-auto">
          {tool && <ToolForm tool={tool} setTool={setTool} />}
        </main>
        <footer className="flex justify-end p-4 border-t border-[#6272a4] space-x-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-md bg-[#6272a4] text-white hover:bg-opacity-80 transition-colors">Cancel</button>
          <button onClick={() => tool && onSave(tool)} className="px-4 py-2 rounded-md bg-[#50fa7b] text-[#282a36] hover:bg-opacity-80 transition-colors">Save Changes</button>
        </footer>
      </div>
    </div>
  );
};

const ToolsView: React.FC<ToolsViewProps> = ({ tools, setTools }) => {
    const [editingTool, setEditingTool] = useState<WebhookTool | null>(null);

    const handleAddTool = () => {
        const newTool: WebhookTool = {
          id: `new-tool-${Date.now()}`,
          name: '',
          description: '',
          webhookUrl: '',
          httpMethod: 'GET',
          parameters: [],
        };
        setEditingTool(newTool);
    };

    const handleSaveTool = (updatedTool: WebhookTool) => {
      if (updatedTool.id.startsWith('new-')) {
        setTools(prev => [...prev, { ...updatedTool, id: `tool-${Date.now()}` }]);
      } else {
        setTools(prev => prev.map(t => (t.id === updatedTool.id ? updatedTool : t)));
      }
      setEditingTool(null);
    };

    const handleDeleteTool = (id: string) => {
        setTools(prev => prev.filter(tool => tool.id !== id));
    };

    return (
        <div className="p-4 h-full">
            <Panel 
              title="Herramientas" 
              icon={<ToolboxIcon className="w-6 h-6 text-[#bd93f9]" />} 
              className="h-full"
              actions={
                <button onClick={handleAddTool} className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[#50fa7b] text-[#282a36] hover:bg-opacity-80 transition-colors">
                  <PlusIcon className="w-4 h-4"/>
                  Añadir Herramienta
                </button>
              }
            >
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {tools.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm text-center px-4">
                    <p>No hay herramientas configuradas.</p>
                    <p>Haga clic en 'Añadir Herramienta' para empezar.</p>
                  </div>
                ) : (
                  tools.map(tool => (
                    <div key={tool.id} className="bg-[#282a36] p-4 rounded-lg border border-transparent hover:border-[#6272a4] transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-[#8be9fd]">{tool.name}</h3>
                          <p className="text-sm text-gray-300 mt-1">{tool.description}</p>
                          <div className="mt-2 text-xs font-mono bg-[#21222C] inline-block px-2 py-1 rounded">
                            <span className={`font-bold ${tool.httpMethod === 'GET' ? 'text-green-400' : 'text-orange-400'}`}>{tool.httpMethod}</span>
                            <span className="text-gray-400 ml-2">{tool.webhookUrl}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                          <button onClick={() => setEditingTool(tool)} className="p-2 text-gray-400 hover:text-[#8be9fd] rounded-full hover:bg-[#44475a]"><PencilIcon className="w-5 h-5"/></button>
                          <button onClick={() => handleDeleteTool(tool.id)} className="p-2 text-gray-400 hover:text-[#ff5555] rounded-full hover:bg-[#44475a]"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                      </div>
                      {tool.parameters.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#44475a]/50">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">Parameters</h4>
                          <ul className="space-y-1 text-sm">
                            {tool.parameters.map(p => (
                              <li key={p.id} className="flex items-center">
                                <code className="text-[#f1fa8c]">{p.name}</code>
                                <span className="text-gray-500 mx-2">-</span>
                                <span className="text-gray-400">{p.type}</span>
                                {p.required && <span className="ml-2 text-xs text-[#ff5555] font-bold">(Required)</span>}
                                <span className="text-gray-500 mx-2">-</span>
                                <span className="text-gray-300 italic flex-1">{p.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Panel>
            {editingTool && <ToolEditModal tool={editingTool} onSave={handleSaveTool} onCancel={() => setEditingTool(null)} />}
        </div>
    );
};

export default ToolsView;