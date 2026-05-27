import React from 'react';
import { RotateCcw, Crown, GraduationCap, Quote } from 'lucide-react';
import type { Team } from '../types';

interface VictoryViewProps {
  teams: Team[];
  onReset: () => void;
}

export const VictoryView: React.FC<VictoryViewProps> = ({ teams, onReset }) => {
  // Sort teams by score descending to find rankings
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-game-neonGold/10 border border-game-neonGold rounded-full flex items-center justify-center mx-auto animate-bounce-slow shadow-[0_0_20px_rgba(255,184,0,0.2)]">
          <Crown className="w-10 h-10 text-game-neonGold neon-text-gold" />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-game-neonGold font-extrabold uppercase tracking-widest block">Bảng Vàng Chiến Thắng</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-game-neonGold via-white to-game-neonGold">
            Đoàn Kết Là Sức Mạnh!
          </h2>
        </div>
        <p className="text-sm text-white/50 max-w-md mx-auto">
          Trải qua 12 ô chữ đấu trí khốc liệt và những màn lật bài nhân phẩm kịch tính, khối đoàn kết vĩ đại đã tìm ra người thủ lĩnh dẫn đầu!
        </p>
      </div>

      {/* Visual Podium Ceremony (Top 3) */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 shadow-xl space-y-8">
        
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 pt-10 pb-6 max-w-2xl mx-auto">
          
          {/* 2nd Place (Left) */}
          {rankedTeams[1] && (
            <div className="w-full sm:w-1/3 flex flex-col items-center order-2 sm:order-1 mt-6 sm:mt-0">
              <div className="text-center mb-2.5">
                <span className="text-xs font-bold text-slate-300 block">{rankedTeams[1].name}</span>
                <span className="text-sm font-black text-slate-400">{rankedTeams[1].score}đ</span>
              </div>
              <div className="w-full h-24 bg-gradient-to-t from-slate-800/80 to-slate-700/40 border-t border-x border-slate-500/30 rounded-t-2xl flex items-center justify-center shadow-lg relative">
                <span className="text-3xl font-black text-slate-400">#2</span>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-400" />
              </div>
            </div>
          )}

          {/* 1st Place (Center - Winner) */}
          {rankedTeams[0] && (
            <div className="w-full sm:w-1/3 flex flex-col items-center order-1 sm:order-2">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-1">
                  <Crown className="w-4 h-4 text-game-neonGold animate-bounce" />
                  <span className="text-sm font-extrabold text-game-neonGold neon-text-gold block">{rankedTeams[0].name}</span>
                </div>
                <span className="text-lg font-black text-yellow-400">{rankedTeams[0].score}đ</span>
              </div>
              <div className="w-full h-32 bg-gradient-to-t from-yellow-600/60 to-yellow-500/20 border-t-2 border-x border-yellow-400/40 rounded-t-2xl flex items-center justify-center shadow-2xl relative">
                <span className="text-4xl font-black text-yellow-400 neon-text-gold">#1</span>
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-yellow-400 animate-ping" />
                <div className="absolute -top-1 w-full h-[2px] bg-yellow-400 shadow-[0_0_10px_rgba(255,184,0,0.8)]" />
              </div>
            </div>
          )}

          {/* 3rd Place (Right) */}
          {rankedTeams[2] && (
            <div className="w-full sm:w-1/3 flex flex-col items-center order-3 mt-6 sm:mt-0">
              <div className="text-center mb-2.5">
                <span className="text-xs font-bold text-amber-600 block">{rankedTeams[2].name}</span>
                <span className="text-sm font-black text-amber-700">{rankedTeams[2].score}đ</span>
              </div>
              <div className="w-full h-16 bg-gradient-to-t from-amber-900/60 to-amber-800/20 border-t border-x border-amber-800/30 rounded-t-2xl flex items-center justify-center shadow-md relative">
                <span className="text-2xl font-black text-amber-600">#3</span>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-600" />
              </div>
            </div>
          )}

        </div>

        {/* 4th Place List item (If exists) */}
        {rankedTeams[3] && (
          <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between max-w-md mx-auto text-xs text-white/50">
            <span className="font-semibold">Hạng 4: {rankedTeams[3].name}</span>
            <span className="font-bold">{rankedTeams[3].score} Điểm</span>
          </div>
        )}

      </div>

      {/* Academic Takeaways and Quotes summary */}
      <div className="glass-panel p-6 rounded-3xl border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
          <GraduationCap className="w-5 h-5 text-game-neonCyan" /> Thông Điệp Giáo Dục Cách Mạng
        </h3>
        
        <div className="space-y-4 text-xs md:text-sm text-white/80 leading-relaxed font-normal">
          <div className="p-4 rounded-2xl bg-white/5 border-l-4 border-game-neonPurple italic flex gap-3">
            <Quote className="w-8 h-8 text-game-neonPurple opacity-30 shrink-0" />
            <p className="text-white/90">
              "Đoàn kết, đoàn kết, đại đoàn kết.
              <br />
              Thành công, thành công, đại thành công."
              <span className="block text-[11px] text-white/50 not-italic mt-1.5">— Chủ tịch Hồ Chí Minh</span>
            </p>
          </div>

          <p>
            Trò chơi <strong>“Đại Đoàn Kết Hay Bị Nổ?”</strong> lồng ghép các bài học thực tiễn vô giá về sức mạnh tập thể:
          </p>
          
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Thực trạng Chia Rẽ (Bomb):</strong> Sự thiếu tin tưởng, chia rẽ nội bộ chính là "quả bom" phá hoại khối đoàn kết thống nhất từ bên trong, khiến tập thể mất đi mọi điểm số sức mạnh.</li>
            <li><strong>Khủng Hoảng Chung (Nuclear):</strong> Trước giông bão thời đại, nếu các cá nhân cô độc đứng riêng rẽ, cả cộng đồng sẽ chịu chung tổn thất. Gắn kết là chìa khóa sinh tồn.</li>
            <li><strong>Nền Móng Niềm Tin (Lose All):</strong> Đánh mất niềm tin là đánh mất tất cả. Muốn duy trì sự đoàn kết vững chắc, phải bắt đầu từ lòng khoan dung, thấu hiểu và tôn trọng lợi ích chính đáng của nhau.</li>
          </ul>
        </div>
      </div>

      {/* CTA Restart game */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="px-8 py-4 bg-gradient-to-r from-game-neonPurple to-game-neonCyan text-black font-extrabold uppercase tracking-widest rounded-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5"
        >
          <RotateCcw className="w-5 h-5" /> Bắt Đầu Lượt Chơi Mới
        </button>
      </div>

    </div>
  );
};
