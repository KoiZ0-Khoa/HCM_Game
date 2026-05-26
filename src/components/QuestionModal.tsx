import React, { useState } from 'react';
import { Clock, HelpCircle, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import type { Question } from '../data/questions';
import type { QuestionStatus } from '../types';

interface QuestionModalProps {
  question: Question;
  status: QuestionStatus;
  timeLeft: number;
  timeLimit: number;
  teamName: string;
  onSubmitAnswer: (isCorrect: boolean) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  status,
  timeLeft,
  timeLimit,
  teamName,
  onSubmitAnswer
}) => {
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);

  const handleOptionClick = (idx: number) => {
    if (answered || status !== 'answering') return;
    setSelectedOptionIdx(idx);
    setAnswered(true);
    
    const isCorrect = idx === question.answerIndex;
    onSubmitAnswer(isCorrect);
  };

  // Force Correct/Incorrect by Host (Manual override)
  const handleHostBypass = (isCorrect: boolean) => {
    if (answered || status !== 'answering') return;
    setAnswered(true);
    // Find correct answer index for visual highlighting
    if (isCorrect) {
      setSelectedOptionIdx(question.answerIndex);
    } else {
      // Choose any wrong index
      setSelectedOptionIdx((question.answerIndex + 1) % 4);
    }
    onSubmitAnswer(isCorrect);
  };

  // Timer Bar Color Calculation
  const progressPercent = (timeLeft / timeLimit) * 100;
  const getTimerBarColor = () => {
    if (timeLeft <= 5) return 'bg-game-neonRed shadow-[0_0_10px_#ff0055]';
    if (timeLeft <= 12) return 'bg-game-neonGold shadow-[0_0_10px_#ffb800]';
    return 'bg-game-neonCyan shadow-[0_0_10px_#00f0ff]';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl glass-panel border-game-neonPurple/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_0_40px_rgba(189,0,255,0.15)] my-8">
        
        {/* Modal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-game-neonPurple/15 border border-game-neonPurple/40 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-game-neonPurple" />
            </div>
            <div>
              <span className="text-[10px] text-game-neonPurple tracking-widest font-bold uppercase block">Phòng Giải Đáp</span>
              <h2 className="text-xl font-extrabold uppercase text-white tracking-wide">
                Câu Hỏi Ô {question.letter}
              </h2>
            </div>
          </div>

          <div className="bg-game-neonCyan/15 border border-game-neonCyan/40 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-game-neonCyan font-bold uppercase block tracking-wider">Đang Trả Lời</span>
            <span className="text-sm font-extrabold text-white">{teamName}</span>
          </div>
        </div>

        {/* Timer Bar */}
        {status === 'answering' && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40 font-mono">Đồng hồ đếm ngược</span>
              <span className={`font-mono font-bold flex items-center gap-1.5 ${timeLeft <= 5 ? 'text-game-neonRed animate-pulse' : 'text-white'}`}>
                <Clock className="w-3.5 h-3.5" /> {timeLeft} Giây
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getTimerBarColor()}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* The Question Text */}
        <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 text-center relative overflow-hidden">
          <h3 className="text-lg md:text-xl font-extrabold text-white leading-relaxed relative z-10">
            "{question.question}"
          </h3>
          <div className="absolute top-0 left-0 w-16 h-16 bg-game-neonPurple/5 rounded-full blur-2xl -translate-x-6 -translate-y-6" />
        </div>

        {/* The 4 Multiple-Choice Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, idx) => {
            const letterPrefix = ["A", "B", "C", "D"][idx];
            const isCorrectAnswer = idx === question.answerIndex;
            const isSelected = idx === selectedOptionIdx;

            let btnStyle = 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-game-neonPurple/50 hover:text-white';
            let statusIcon = null;

            if (answered || status === 'correct' || status === 'incorrect' || status === 'timeUp') {
              if (isCorrectAnswer) {
                btnStyle = 'bg-game-neonGreen/20 border-game-neonGreen text-game-neonGreen neon-border-green';
                statusIcon = <CheckCircle2 className="w-5 h-5 text-game-neonGreen" />;
              } else if (isSelected) {
                btnStyle = 'bg-game-neonRed/20 border-game-neonRed text-game-neonRed neon-border-red';
                statusIcon = <XCircle className="w-5 h-5 text-game-neonRed" />;
              } else {
                btnStyle = 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed';
              }
            }

            return (
              <button
                key={idx}
                disabled={answered || status !== 'answering'}
                onClick={() => handleOptionClick(idx)}
                className={`p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all duration-300 ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold transition-all duration-300 ${
                    isSelected 
                      ? 'bg-current text-black' 
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {letterPrefix}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{option}</span>
                </div>
                {statusIcon}
              </button>
            );
          })}
        </div>

        {/* Answer Revealed / Academic Explanation block */}
        {(status === 'correct' || status === 'incorrect' || status === 'timeUp') && (
          <div className={`p-4 md:p-5 rounded-2xl border animate-fade-in ${
            status === 'correct' 
              ? 'bg-game-neonGreen/10 border-game-neonGreen/25 text-game-neonGreen' 
              : 'bg-game-neonRed/10 border-game-neonRed/25 text-game-neonRed'
          }`}>
            <h4 className="text-sm font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              {status === 'correct' ? (
                <>✔️ TRẢ LỜI ĐÚNG!</>
              ) : (
                <>❌ {status === 'timeUp' ? 'HẾT GIỜ THẢO LUẬN!' : 'TRẢ LỜI SAI!'}</>
              )}
            </h4>
            <p className="text-xs text-white/80 leading-relaxed font-normal">
              <strong>Ý nghĩa học thuật:</strong> {question.explanation}
            </p>
          </div>
        )}

        {/* Host Control Area (Bypass manual check) */}
        {status === 'answering' && (
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-red-950/5 p-4 rounded-2xl border border-red-500/10">
            <div className="flex items-center gap-2 text-xs text-red-400 font-bold">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>BẢNG ĐIỀU KHIỂN CỦA HOST (GIÁO VIÊN):</span>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleHostBypass(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-game-neonGreen/10 hover:bg-game-neonGreen/25 border border-game-neonGreen/30 hover:border-game-neonGreen text-game-neonGreen rounded-lg text-xs font-bold transition-all duration-300"
              >
                Chấp Nhận ĐÚNG (+ Lật Bài)
              </button>
              <button
                onClick={() => handleHostBypass(false)}
                className="flex-1 sm:flex-none px-4 py-2 bg-game-neonRed/10 hover:bg-game-neonRed/25 border border-game-neonRed/30 hover:border-game-neonRed text-game-neonRed rounded-lg text-xs font-bold transition-all duration-300"
              >
                Chấp Nhận SAI (Chuyển Lượt)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
