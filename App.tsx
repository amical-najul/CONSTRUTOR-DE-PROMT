import React, { useState } from 'react';
import { AppView } from './types';
import MainInterface from './components/MainInterface';
import Sidebar from './components/Sidebar';

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex-grow flex items-center justify-center bg-[#282a36]">
        <h1 className="text-4xl font-bold text-gray-500">{title} - Próximamente</h1>
    </div>
);

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<AppView>('principal');

    return (
        <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex font-sans antialiased">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow flex flex-col min-w-0">
                {activeView === 'principal' && <MainInterface />}
                {activeView === 'flujos' && <PlaceholderView title="Flujos" />}
                {activeView === 'configuraciones' && <PlaceholderView title="Configuraciones" />}
            </main>
        </div>
    );
};

export default App;
