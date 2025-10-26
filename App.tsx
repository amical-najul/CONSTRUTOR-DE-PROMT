import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainInterface from './components/MainInterface';
import ToolsView from './components/ToolsView';
import { AppView, WebhookTool } from './types';
// FIX: Import 'Type' to use in tool definitions.
import { Type } from '@google/genai';

// Mock data moved here to be the single source of truth
const initialTools: WebhookTool[] = [
  {
    id: 'tool-webhook-1',
    name: 'Get Weather Forecast',
    description: 'Fetches the 5-day weather forecast for a specified location.',
    webhookUrl: 'https://api.example-weather.com/v1/forecast',
    httpMethod: 'GET',
    parameters: [
      // FIX: Use Type.STRING enum instead of string literal.
      { id: 'param-1', name: 'location', type: Type.STRING, description: 'The city and state, e.g., San Francisco, CA', required: true },
      // FIX: Use Type.STRING enum instead of string literal.
      { id: 'param-2', name: 'units', type: Type.STRING, description: "'celsius' or 'fahrenheit'", required: false },
    ],
  },
];


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('principal');
  const [tools, setTools] = useState<WebhookTool[]>(initialTools);

  const renderView = () => {
    switch (activeView) {
      case 'principal':
        return <MainInterface tools={tools} />;
      case 'tools':
        return <ToolsView tools={tools} setTools={setTools} />;
      case 'flujos':
        return <div className="p-8 text-white"><h1 className="text-2xl font-bold">Flujos (En construcción)</h1></div>;
      case 'configuraciones':
        return <div className="p-8 text-white"><h1 className="text-2xl font-bold">Configuraciones (En construcción)</h1></div>;
      default:
        return <MainInterface tools={tools} />;
    }
  };

  return (
    <main className="h-screen w-screen bg-[#282a36] text-[#f8f8f2] flex overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-grow h-full overflow-hidden">
        {renderView()}
      </div>
    </main>
  );
};

export default App;
