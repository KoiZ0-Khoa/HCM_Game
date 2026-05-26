import React from 'react';
import { Volume2, VolumeX, RotateCcw, Shield } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  showReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isMuted, onToggleMute, onReset, showReset }) => {
  const handleToggleMute = () => {
    onToggleMute();
    if (isMuted) {
      // play a quick sound after unmuting
      sounds.playClick();
    }
  };

  const handleResetClick = () => {
    sounds.playClick();
    if (window.confirm("Bạn có chắc chắn muốn thiết lập lại trò chơi từ đầu không? Toàn bộ điểm số sẽ bị xóa.")) {
      onReset();
    }
  };

  return (
    <header className="w-full py-4 px-6 glass-panel border-b border-white/10 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-game-neonPurple/20 border border-game-neonPurple flex items-center justify-center animate-pulse-slow">
          <Shield className="w-5 h-5 text-game-neonPurple neon-text-purple" />
        </div>
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-game-neonCyan via-game-neonPurple to-game-neonGold neon-text-cyan">
            Đại Đoàn Kết
          </h1>
          <p className="text-[10px] text-white/50 tracking-widest uppercase">Hay Bị Nổ?</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleMute}
          className={`p-2.5 rounded-lg border transition-all duration-300 ${
            isMuted 
              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
              : 'bg-game-neonCyan/10 border-game-neonCyan/30 text-game-neonCyan hover:bg-game-neonCyan/20 hover:border-game-neonCyan'
          }`}
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {showReset && (
          <button
            onClick={handleResetClick}
            className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
            title="Chơi lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Chơi Lại</span>
          </button>
        )}
      </div>
    </header>
  );
};
