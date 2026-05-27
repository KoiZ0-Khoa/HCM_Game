import React from 'react';
import { HelpCircle, Lock, Trophy, Flame } from 'lucide-react';
import type { Team, GameLog } from '../types';
import { questions } from '../data/questions';

interface BoardViewProps {
  teams: Team[];
  currentTeamIndex: number;
  unlockedQuestions: boolean[];
  onSelectQuestion: (qId: number) => void;
  gameLogs: GameLog[];
}

export const BoardView: React.FC<BoardViewProps> = ({
  teams,
  currentTeamIndex,
  unlockedQuestions,
  onSelectQuestion,
  gameLogs
}) => {
  const activeTeam = teams[currentTeamIndex];

  // Helper to color log types
  const getLogColorClass = (type: GameLog['type']) => {
    switch (type) {
      case 'success': return 'text-game-neonGreen neon-text-green';
      case 'warning': return 'text-game-neonGold neon-text-gold';
      case 'danger': return 'text-red-400 neon-text-red font-bold';
      case 'special': return 'text-game-neonPurple neon-text-purple font-extrabold';
      default: return 'text-white/70';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* Active Team Banner */}
      <div className="w-full glass-panel p-5 rounded-2xl border-game-neonCyan/30 flex items-center justify-between shadow-[0_0_20px_rgba(0,240,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-game-neonCyan/15 border border-game-neonCyan flex items-center justify-center animate-bounce-short">
            <Flame className="w-6 h-6 text-game-neonCyan neon-text-cyan" />
          </div>
          <div>
            <span className="text-[10px] text-game-neonCyan tracking-widest font-bold uppercase block">Lượt Hiện Tại</span>
            <h2 className="text-2xl font-black uppercase text-white tracking-wide">
              {activeTeam.name}
            </h2>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs text-white/60">
          <HelpCircle className="w-4 h-4 text-game-neonPurple" />
          Hãy chọn một ô chữ cái dưới đây để bắt đầu câu hỏi!
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 12 Question Grid */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-lg font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
            <span>Bàn Cờ Trận Địa (12 Câu Hỏi)</span>
          </h3>
          
          <div className="grid grid-cols-4 gap-4">
            {questions.map((q) => {
              const isUsed = unlockedQuestions[q.id - 1];
              return (
                <button
                  key={q.id}
                  disabled={isUsed}
                  onClick={() => onSelectQuestion(q.id)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-3 transition-all duration-300 relative overflow-hidden group border ${
                    isUsed
                      ? 'bg-black/40 border-white/5 text-white/20 cursor-not-allowed shadow-inner'
                      : 'glass-panel border-game-neonCyan/20 hover:border-game-neonCyan hover:-translate-y-1.5 hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] text-white hover:text-game-neonCyan'
                  }`}
                >
                  {isUsed ? (
                    <>
                      <Lock className="w-5 h-5 text-white/10 mb-1.5" />
                      <span className="text-sm font-semibold tracking-wider opacity-30">{q.letter}</span>
                      <span className="absolute top-2 right-2 text-[9px] font-bold text-white/20">ĐÃ KHÓA</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold tracking-wider group-hover:scale-110 transition-transform duration-300">
                        {q.letter}
                      </span>
                      <span className="text-[10px] text-white/40 group-hover:text-game-neonCyan/70 font-semibold tracking-wider uppercase mt-1">
                        Câu {q.id}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-game-neonCyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Scoreboard & Event Logs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Teams Leaderboard */}
          <div className="glass-panel p-5 rounded-2xl border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
              <Trophy className="w-4 h-4 text-game-neonGold" /> Bảng Điểm Thực Tế
            </h3>
            
            <div className="space-y-2.5">
              {teams.map((team, idx) => {
                const isActive = idx === currentTeamIndex;
                return (
                  <div
                    key={team.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      isActive
                        ? 'bg-game-neonCyan/10 border-game-neonCyan/50 shadow-[0_0_15px_rgba(0,240,255,0.15)] translate-x-1.5'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-game-neonCyan animate-pulse' : 'bg-white/20'}`} />
                      <span className={`text-sm font-semibold ${isActive ? 'text-game-neonCyan font-bold' : 'text-white/70'}`}>
                        {team.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xl font-black ${isActive ? 'text-game-neonCyan neon-text-cyan' : 'text-game-neonGold neon-text-gold'}`}>
                        {team.score}
                      </span>
                      <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">ĐIỂM</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time commentary console log */}
          <div className="glass-panel p-5 rounded-2xl border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" /> Nhật Ký Trận Đấu
            </h3>
            
            <div className="h-[210px] overflow-y-auto pr-1 bg-black/50 border border-white/5 rounded-xl p-3 font-mono text-xs space-y-2.5 scrollbar-thin">
              {gameLogs.length === 0 ? (
                <div className="text-white/30 italic text-center py-10">Chưa có hoạt động nào được ghi lại...</div>
              ) : (
                gameLogs.map((log) => (
                  <div key={log.id} className="leading-relaxed border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-white/40 mr-1.5">[{log.timestamp}]</span>
                    <span className={getLogColorClass(log.type)}>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
