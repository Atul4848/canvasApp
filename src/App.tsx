import React, { useState } from 'react';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar/SideBar';
import Canvas from './Components/Canvas/Canvas';
import { CanvasElement, DrawingTool } from './Interfaces';
import { ZoomIn, ZoomOut } from 'lucide-react';

const App: React.FC = () => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('select');

  const onAddElement = (newElement: CanvasElement) => {
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const onUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const onSelectTool = (tool: DrawingTool) => {
    setCurrentTool(tool);
    setSelectedElementId(null);
  };

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  const saveDrawing = () => {
    try {
      localStorage.setItem('drawingAppElements', JSON.stringify(elements));
      alert('Drawing saved successfully!');
    } catch (error) {
      console.error('Failed to save drawing:', error);
      alert('Failed to save drawing. Please try again.');
    }
  };

  const loadDrawing = () => {
    try {
      const savedElements = localStorage.getItem('drawingAppElements');
      if (savedElements) {
        setElements(JSON.parse(savedElements));
        setSelectedElementId(null);
        alert('Drawing loaded successfully!');
      } else {
        alert('No saved drawing found.');
      }
    } catch (error) {
      console.error('Failed to load drawing:', error);
      alert('Failed to load drawing. Data might be corrupted.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col p-4">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}
      </style>
      <Header
        currentTool={currentTool}
        onSelectTool={onSelectTool}
        onSaveDrawing={saveDrawing}
        onLoadDrawing={loadDrawing}
      />

      <main className="flex flex-1 mt-4 space-x-4">
        <Sidebar selectedElement={selectedElement} onUpdateElement={onUpdateElement} />
        <Canvas
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={onUpdateElement}
          canvasWidth={900}
          canvasHeight={400}
          zoom={zoom}
          currentTool={currentTool}
          onAddElement={onAddElement}
        />
      </main>

      <footer className="flex justify-end items-center mt-4 p-2 bg-gray-800 rounded-lg shadow-md space-x-4">
        <button onClick={handleZoomOut} className="p-2 bg-gray-700 rounded-md hover:bg-gray-600">
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-lg">{Math.round(zoom * 100)}%</span>
        <button onClick={handleZoomIn} className="p-2 bg-gray-700 rounded-md hover:bg-gray-600">
          <ZoomIn className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};

export default App;
