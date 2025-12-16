import React, { useState, useCallback } from 'react';
import MathScene from './components/MathScene';
import ChatInterface from './components/ChatInterface';
import QuizModal from './components/QuizModal';
import { ShapeType, ChatMessage, SHAPES } from './types';
import { generateMathResponse, generateQuizQuestion } from './services/geminiService';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Quiz State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);

  // Helper to add message
  const addMessage = (role: 'user' | 'model', text: string) => {
    setChatHistory(prev => [...prev, {
      id: Date.now().toString() + Math.random().toString(),
      role,
      text
    }]);
  };

  const handleShapeSelect = useCallback(async (shape: ShapeType) => {
    if (selectedShape === shape) return;

    setSelectedShape(shape);
    
    // Auto-trigger a greeting from AI about the shape
    setIsLoading(true);
    
    // Prompt in Indonesian to introduce the shape
    const shapeInfo = SHAPES.find(s => s.name === shape);
    const prompt = `Perkenalkan bangun ruang ${shape} kepada siswa. Jelaskan rumus volumenya secara sederhana dan berikan satu contoh perhitungan mudah.`;
    
    const response = await generateMathResponse(prompt);
    
    addMessage('model', response);
    setIsLoading(false);
  }, [selectedShape]);

  const handleSendMessage = async (text: string) => {
    addMessage('user', text);
    setIsLoading(true);

    // Prepare history for API
    const apiHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Add context about selected shape if available
    let finalPrompt = text;
    if (selectedShape) {
      finalPrompt = `[Konteks Saat Ini: Siswa sedang melihat bangun ruang 3D ${selectedShape}]. ${text}`;
    }

    const response = await generateMathResponse(finalPrompt, apiHistory);
    addMessage('model', response);
    setIsLoading(false);
  };

  const handleClearSelection = () => {
    setSelectedShape(null);
  };

  const handleQuizRequest = async () => {
    if (!selectedShape) return;
    setIsQuizOpen(true);
    setQuizLoading(true);
    setQuizData(null); // Reset previous quiz

    const rawJson = await generateQuizQuestion(selectedShape);
    try {
        // Clean up markdown blocks if present (Gemini sometimes adds ```json ... ```)
        const jsonString = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);
        setQuizData(data);
    } catch (e) {
        console.error("Failed to parse quiz JSON", e);
        setQuizData({
            question: "Ups, saya kesulitan membuat soal. Coba lagi?",
            options: ["Oke", "Batal", "Ulangi", "Keluar"],
            correctIndex: 0,
            explanation: "Terkadang AI juga butuh istirahat."
        });
    }
    setQuizLoading(false);
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* 3D Scene Layer */}
      <MathScene 
        selectedShape={selectedShape} 
        onSelectShape={handleShapeSelect} 
      />

      {/* Main UI Overlay - Chat */}
      <ChatInterface 
        selectedShape={selectedShape}
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onClearSelection={handleClearSelection}
        onQuizRequest={handleQuizRequest}
      />

      {/* Title / Brand (Top Left) */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-sm">
          MathZone<span className="text-white text-lg font-light ml-1">3D</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Eksplorasi Geometri Interaktif</p>
      </div>

      {/* Instructions Overlay (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-0 pointer-events-none md:block hidden">
        <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 max-w-xs">
           <div className="flex items-start gap-3">
             <Info className="text-indigo-400 mt-1 shrink-0" size={20} />
             <div className="text-sm text-slate-300">
               <p className="mb-2"><strong>Cara menggunakan:</strong></p>
               <ul className="list-disc ml-4 space-y-1 text-slate-400">
                 <li>Geser untuk memutar tampilan.</li>
                 <li>Scroll untuk zoom in/out.</li>
                 <li>Klik bangun untuk belajar.</li>
                 <li>Chat AI untuk latihan soal.</li>
               </ul>
             </div>
           </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)}
        quizData={quizData}
        isLoading={quizLoading}
      />
    </div>
  );
};

export default App;