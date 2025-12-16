import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, X, Calculator, HelpCircle, GraduationCap, Info, ChevronDown, MessageCircle } from 'lucide-react';
import { ChatMessage, ShapeType } from '../types';
import ReactMarkdown from 'react-markdown';
import FormulaVisualizer from './FormulaVisualizer';

interface ChatInterfaceProps {
  selectedShape: ShapeType | null;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onClearSelection: () => void;
  onQuizRequest: () => void;
}

const getVisualContext = (text: string, selectedShape: ShapeType | null): { shape: ShapeType, concept: 'volume' | 'area' | 'properties' } | null => {
    const lower = text.toLowerCase();
    
    // Detect Concept
    let concept: 'volume' | 'area' | 'properties' | null = null;
    
    // 'volume' triggers Volume display
    if (lower.includes('volume')) concept = 'volume';
    // 'luas', 'permukaan', 'keliling' trigger Area display
    else if (lower.includes('luas') || lower.includes('permukaan') || lower.includes('keliling')) concept = 'area';
    // 'sifat', 'ciri', 'fakta' trigger Properties display
    else if (lower.includes('sifat') || lower.includes('ciri') || lower.includes('fakta') || lower.includes('unsur')) concept = 'properties';
    
    if (!concept) return null;

    // Detect Shape
    let shape: ShapeType | null = null;
    
    if (lower.includes('kubus')) shape = 'Cube';
    else if (lower.includes('bola')) shape = 'Sphere';
    else if (lower.includes('kerucut')) shape = 'Cone';
    else if (lower.includes('torus') || lower.includes('donat')) shape = 'Torus';
    else if (lower.includes('ikosahedron')) shape = 'Icosahedron';
    else if (lower.includes('tabung') || lower.includes('silinder')) shape = 'Cylinder';
    else if (lower.includes('limas')) shape = 'Pyramid';
    else if (lower.includes('prisma')) shape = 'Prism';
    else if (lower.includes('persegi') || lower.includes('bujur sangkar')) shape = 'Square';
    else if (lower.includes('lingkaran')) shape = 'Circle';
    else if (lower.includes('segitiga')) shape = 'Triangle';

    // Fallback: If no specific shape mentioned in text, but user has selected one, assume context
    if (!shape && selectedShape) {
        shape = selectedShape;
    }

    if (shape) return { shape, concept };
    return null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  selectedShape, 
  chatHistory, 
  onSendMessage, 
  isLoading,
  onClearSelection,
  onQuizRequest
}) => {
  const [input, setInput] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false); // State for mobile toggle
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading, isMobileOpen]);

  // Auto-open chat on mobile if a shape is selected to show context
  useEffect(() => {
    if (selectedShape && window.innerWidth < 768) {
        setIsMobileOpen(true);
    }
  }, [selectedShape]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <>
      {/* Mobile Toggle Button (Visible only when chat is closed on mobile) */}
      <div className={`fixed bottom-6 right-6 z-20 md:hidden transition-all duration-300 ${isMobileOpen ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-xl flex items-center gap-2 border border-indigo-400"
        >
          <MessageCircle size={24} />
          <span className="font-bold text-sm">Tanya & Rumus</span>
        </button>
      </div>

      {/* Main Container */}
      <div className={`
        absolute z-10 pointer-events-none flex flex-col
        /* Desktop: Top Right, Fixed Width */
        md:right-0 md:top-0 md:h-full md:w-[400px] md:justify-end md:p-4
        /* Mobile: Bottom Sheet, Full Width */
        inset-x-0 bottom-0 h-full justify-end
      `}>
        {/* Interactive Chat Box */}
        <div className={`
            pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl overflow-hidden flex flex-col
            transition-all duration-300 ease-in-out
            
            /* Desktop Styles */
            md:rounded-2xl md:max-h-[85vh] md:translate-y-0 md:opacity-100 md:static
            
            /* Mobile Styles (Bottom Sheet) */
            fixed bottom-0 left-0 right-0 rounded-t-2xl rounded-b-none
            ${isMobileOpen ? 'h-[75vh] translate-y-0 opacity-100' : 'h-0 translate-y-[100%] opacity-0 md:h-auto md:opacity-100'}
        `}>
          
          {/* Header */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
              </div>
              <div>
                  <h2 className="font-bold text-white">MathZone AI</h2>
                  <p className="text-xs text-slate-400">
                      {selectedShape ? `Mempelajari: ${selectedShape}` : 'Pilih bangun ruang'}
                  </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
                {/* Mobile Minimize Button */}
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="md:hidden text-slate-400 hover:text-white p-1"
                >
                    <ChevronDown size={24} />
                </button>

                {selectedShape && (
                    <button 
                      onClick={onClearSelection}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Keluar Mode Bangun"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
             {chatHistory.length === 0 ? (
                 <div className="text-center text-slate-400 mt-4 md:mt-10">
                     <Sparkles className="mx-auto mb-3 text-yellow-400 opacity-80" size={32} />
                     <h3 className="text-lg font-medium text-white mb-2">MathZone AI</h3>
                     <p className="text-sm px-4">Klik bangun ruang 3D untuk belajar, atau tanya soal di bawah.</p>
                     
                     <div className="mt-6 grid grid-cols-1 gap-2 px-4">
                         <button onClick={() => onSendMessage("Berikan contoh soal volume kubus")} className="text-xs bg-slate-800 hover:bg-slate-700 p-3 rounded border border-slate-700 transition">
                             Contoh soal volume Kubus
                         </button>
                         <button onClick={() => onSendMessage("Apa rumus luas permukaan bola?")} className="text-xs bg-slate-800 hover:bg-slate-700 p-3 rounded border border-slate-700 transition">
                             Rumus luas permukaan Bola
                         </button>
                     </div>
                 </div>
             ) : (
                 chatHistory.map((msg) => {
                     const visualContext = msg.role === 'model' ? getVisualContext(msg.text, selectedShape) : null;
                     
                     return (
                     <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[95%] md:max-w-[90%] rounded-2xl p-3 text-sm ${
                             msg.role === 'user' 
                             ? 'bg-indigo-600 text-white rounded-br-none' 
                             : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
                         }`}>
                             <div className="flex flex-col md:flex-row gap-4 items-start">
                                 <div className="flex-1 min-w-0">
                                     {msg.role === 'model' ? (
                                         <ReactMarkdown 
                                           components={{
                                               strong: ({node, ...props}) => <span className="font-bold text-yellow-300" {...props} />,
                                               ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props} />,
                                               p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                                           }}
                                         >
                                             {msg.text}
                                         </ReactMarkdown>
                                     ) : (
                                         msg.text
                                     )}
                                 </div>
                                 {/* Render Visualizer if context matches */}
                                 {visualContext && (
                                     <div className="w-full md:w-auto flex justify-center md:block mt-2 md:mt-0"> 
                                         <FormulaVisualizer shape={visualContext.shape} concept={visualContext.concept} />
                                     </div>
                                 )}
                             </div>
                         </div>
                     </div>
                 )})
             )}
             {isLoading && (
                 <div className="flex justify-start">
                     <div className="bg-slate-700 text-slate-300 rounded-2xl rounded-bl-none p-3 flex items-center gap-2">
                         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                 </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Action Buttons (Visible only when shape selected) */}
          {selectedShape && (
              <div className="px-4 py-2 bg-slate-800/50 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
                   <button 
                      onClick={() => onSendMessage(`Sebutkan fakta unik tentang ${selectedShape}`)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg text-xs font-medium border border-indigo-500/30 transition-all"
                  >
                      <Sparkles size={14} /> Fakta Unik
                  </button>
                  <button 
                      onClick={() => onSendMessage(`Apa rumus ${['Square','Circle','Triangle'].includes(selectedShape) ? 'luas' : 'volume'} untuk ${selectedShape}?`)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30 transition-all"
                  >
                      <Calculator size={14} /> Rumus
                  </button>
                  <button 
                      onClick={onQuizRequest}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 rounded-lg text-xs font-medium border border-amber-500/30 transition-all"
                  >
                      <GraduationCap size={14} /> Latihan Soal
                  </button>
                  <button 
                      onClick={() => onSendMessage(`Jelaskan sifat-sifat dan ciri-ciri dari ${selectedShape} secara lengkap.`)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 rounded-lg text-xs font-medium border border-sky-500/30 transition-all"
                  >
                      <Info size={14} /> Sifat Bangun
                  </button>
              </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0 mb-safe">
              <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={selectedShape ? `Tanya tentang ${selectedShape}...` : "Tanya soal..."}
                      className="flex-1 bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                  />
                  <button 
                      type="submit" 
                      disabled={isLoading || !input.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                  >
                      <Send size={18} />
                  </button>
              </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;