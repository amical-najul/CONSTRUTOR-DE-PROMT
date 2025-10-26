import React, { useState, useEffect } from 'react';
import { ToolConfig } from '../types';

interface ToolEditModalProps {
  tool: ToolConfig;
  onSave: (tool: ToolConfig) => void;
  onCancel: () => void;
}

const ToolEditModal: React.FC<ToolEditModalProps> = ({ tool, onSave, onCancel }) => {
  const [name, setName] = useState(tool.name);
  const [jsonConfig, setJsonConfig] = useState(tool.jsonConfig);
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setName(tool.name);
    setJsonConfig(tool.jsonConfig);
    setJsonError(null);
  }, [tool]);

  const handleSave = () => {
    // Basic JSON validation before saving
    try {
      JSON.parse(jsonConfig);
      setJsonError(null);
      onSave({ ...tool, name, jsonConfig });
    } catch (e: any) {
      setJsonError(`Invalid JSON: ${e.message}`);
    }
  };

  const textAreaClass = "w-full p-2 bg-[#282a36] border border-[#6272a4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd93f9] resize-none text-sm text-[#f8f8f2] placeholder:text-gray-400";
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onCancel} // Close on backdrop click
    >
      <div 
        className="bg-[#44475a] border border-[#6272a4] rounded-lg shadow-2xl w-full max-w-2xl flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <header className="p-4 border-b border-[#6272a4]">
          <h3 className="text-xl font-bold text-[#f8f8f2]">Edit Tool</h3>
        </header>
        <main className="p-6 space-y-4 flex-grow">
          <div>
            <label htmlFor="tool-name" className="block text-sm font-medium text-[#bd93f9] mb-1">Tool Name</label>
            <input
              id="tool-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 bg-[#282a36] border border-[#6272a4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd93f9] text-[#f8f8f2]"
            />
          </div>
          <div>
            <label htmlFor="tool-json" className="block text-sm font-medium text-[#bd93f9] mb-1">JSON Configuration</label>
            <textarea
              id="tool-json"
              value={jsonConfig}
              onChange={e => setJsonConfig(e.target.value)}
              className={`${textAreaClass} h-64 font-mono text-xs`}
            />
            {jsonError && <p className="text-xs text-[#ff5555] mt-1" role="alert">{jsonError}</p>}
          </div>
        </main>
        <footer className="flex justify-end p-4 border-t border-[#6272a4] space-x-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-[#6272a4] text-white hover:bg-opacity-80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-[#50fa7b] text-[#282a36] hover:bg-opacity-80 transition-colors"
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ToolEditModal;