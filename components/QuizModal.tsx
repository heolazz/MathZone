import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizData: QuizData | null;
  isLoading: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, quizData, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
  };

  const isCorrect = selectedOption === quizData?.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
             Tantangan Matematika
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-8">
               <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-slate-300">Sedang membuat soal latihan...</p>
             </div>
          ) : quizData ? (
            <>
              <p className="text-lg text-white mb-6 font-medium leading-relaxed">
                {quizData.question}
              </p>
              
              <div className="space-y-3">
                {quizData.options.map((option, index) => {
                  let buttonClass = "w-full text-left p-4 rounded-xl border transition-all relative ";
                  
                  if (showResult) {
                    if (index === quizData.correctIndex) {
                      buttonClass += "bg-emerald-900/30 border-emerald-500 text-emerald-100";
                    } else if (index === selectedOption) {
                      buttonClass += "bg-red-900/30 border-red-500 text-red-100";
                    } else {
                      buttonClass += "bg-slate-700/50 border-slate-600 text-slate-400 opacity-50";
                    }
                  } else {
                    buttonClass += "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100 hover:border-indigo-400";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      className={buttonClass}
                      disabled={showResult}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                      {showResult && index === quizData.correctIndex && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                      )}
                      {showResult && index === selectedOption && index !== quizData.correctIndex && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400" size={20} />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-900/20 border-emerald-900/50' : 'bg-indigo-900/20 border-indigo-900/50'}`}>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    <span className="font-bold block mb-1 uppercase text-xs tracking-wider opacity-70">Penjelasan</span>
                    {quizData.explanation}
                  </p>
                  <button 
                    onClick={onClose}
                    className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
                  >
                    Lanjut Belajar
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-red-400">Gagal memuat soal. Silakan coba lagi.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;