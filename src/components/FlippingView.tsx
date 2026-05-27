import React from 'react';
import { Shield, Sparkles, RefreshCw, Trophy, AlertOctagon } from 'lucide-react';
import type { Card, Team } from '../types';

interface FlippingViewProps {
  teamName: string;
  temporaryScore: number;
  cardsDeck: Card[];
  activeFlippedCard: Card | null;
  teams: Team[];
  currentTeamIndex: number;
  onFlipCard: (cardIdx: number) => void;
  onStopAndSecure: () => void;
  showSwapModal: boolean;
  onSwapScores: (targetTeamId: number) => void;
  showRareModal: boolean;
  onChooseSafeRare: () => void;
  onChooseRiskRare: () => void;
  blockFlipInput: boolean;
  screenShake: boolean;
  nuclearAlert: boolean;
}

export const FlippingView: React.FC<FlippingViewProps> = ({
  teamName,
  temporaryScore,
  cardsDeck,
  activeFlippedCard,
  teams,
  currentTeamIndex,
  onFlipCard,
  onStopAndSecure,
  showSwapModal,
  onSwapScores,
  showRareModal,
  onChooseSafeRare,
  onChooseRiskRare,
  blockFlipInput,
  screenShake,
  nuclearAlert
}) => {

  const getCardImage = (type: Card['type']): string => {
    switch (type) {
      case 'plus1': return '/cards/Lá +1.png';
      case 'plus2': return '/cards/Lá +2.png';
      case 'plus3': return '/cards/Lá +3.png';
      case 'plus4': return '/cards/Lá +4.png';
      case 'plus5': return '/cards/Lá +5.png';
      case 'bomb':  return '/cards/Lá bomb.png';
      default:      return '/cards/Lá đặc biệt.png';
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 py-6 space-y-6 relative transition-all duration-300 ${
      screenShake ? 'animate-shake' : ''
    }`}>
      
      {/* Nuclear warning flash overlay */}
      {nuclearAlert && (
        <div className="fixed inset-0 z-[100] animate-flash-red pointer-events-none flex items-center justify-center">
          <div className="bg-red-600/90 text-white font-black px-8 py-5 rounded-2xl border-4 border-white text-2xl uppercase tracking-widest flex items-center gap-4 animate-bounce">
            <AlertOctagon className="w-8 h-8 text-white animate-spin" />
            Cảnh báo khủng hoảng! Đối thủ bị trừ 3 điểm!
          </div>
        </div>
      )}

      {/* Arena Title Bar */}
      <div className="glass-panel p-5 rounded-2xl border-game-neonPurple/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(189,0,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-game-neonPurple/15 border border-game-neonPurple flex items-center justify-center animate-pulse-slow">
            <Sparkles className="w-6 h-6 text-game-neonPurple neon-text-purple" />
          </div>
          <div>
            <span className="text-[10px] text-game-neonPurple tracking-widest font-bold uppercase block">Đấu Trường Nhân Phẩm</span>
            <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
              Lượt Lật Của <span className="text-game-neonPurple neon-text-purple">{teamName}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Temporary Score Badge */}
          <div className="bg-game-neonGreen/10 border border-game-neonGreen/40 px-6 py-3 rounded-2xl text-center shadow-[0_0_15px_rgba(57,255,20,0.1)]">
            <span className="text-[10px] text-game-neonGreen font-bold uppercase block tracking-wider">Điểm Tạm Thời Lượt Này</span>
            <span className="text-3xl font-black text-game-neonGreen neon-text-green">
              +{temporaryScore}
            </span>
          </div>

          {/* Secure score action button */}
          <button
            disabled={blockFlipInput || temporaryScore === 0}
            onClick={onStopAndSecure}
            className={`px-6 py-4 rounded-2xl font-extrabold uppercase tracking-wider text-sm transition-all duration-300 flex items-center gap-2 shadow-lg ${
              temporaryScore > 0 && !blockFlipInput
                ? 'bg-game-neonGold hover:bg-yellow-500 text-black cursor-pointer hover:shadow-[0_0_20px_rgba(255,184,0,0.35)]'
                : 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <Trophy className="w-4 h-4" /> Dừng Lại & Bảo Toàn
          </button>
        </div>
      </div>

      {/* Cards 3D Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2">
        {cardsDeck.map((card, idx) => (
          <div key={card.id} className="aspect-[3/4] perspective-1000 relative">
            <div
              className={`w-full h-full duration-500 preserve-3d relative cursor-pointer ${
                card.isRevealed ? 'rotate-y-180' : ''
              }`}
              onClick={() => onFlipCard(idx)}
            >
              {/* Card BACK (Covered) */}
              <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                blockFlipInput
                  ? 'bg-game-cardBack border-white/5 cursor-not-allowed opacity-60'
                  : 'bg-game-cardBack border-game-neonPurple/25 hover:border-game-neonPurple hover:bg-game-cardBackHover shadow-[0_0_10px_rgba(189,0,255,0.05)] hover:shadow-[0_0_15px_rgba(189,0,255,0.2)]'
              }`}>
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-game-neonPurple/50" />
                </div>
                <span className="text-xs font-bold text-white/40 tracking-widest uppercase">Mặt Sau</span>
                <span className="text-[10px] text-game-neonPurple/40 font-mono mt-1">#{(card.id + 1).toString().padStart(2, '0')}</span>
              </div>

              {/* Card FRONT (Revealed) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-white/20 flex flex-col justify-end">
                <img
                  src={getCardImage(card.type)}
                  alt={card.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Special Card Banner Overlay (For cards sharing Lá đặc biệt.png) */}
                {['nuclear', 'loseAll', 'changePoints', 'rare'].includes(card.type) && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/85 backdrop-blur-sm px-2 py-3 border-t border-white/10 text-center z-10 animate-fade-in">
                    <span className={`text-[9px] font-black tracking-widest uppercase block mb-0.5 ${
                      card.type === 'rare' ? 'text-yellow-400 neon-text-gold' :
                      card.type === 'changePoints' ? 'text-game-neonCyan neon-text-cyan' :
                      card.type === 'nuclear' ? 'text-orange-400' :
                      'text-red-500'
                    }`}>
                      {card.type === 'rare' ? 'Thẻ Rare' : 'Thẻ Đặc Biệt'}
                    </span>
                    <h4 className="text-[11px] font-black text-white leading-tight uppercase line-clamp-1">
                      {card.name.replace(' (Rare)', '')}
                    </h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Display: Academic Context of the LAST Flipped Card */}
      {activeFlippedCard && (
        <div className={`glass-panel p-5 rounded-2xl border-white/10 animate-fade-in space-y-2 ${
          activeFlippedCard.type === 'bomb' || activeFlippedCard.type === 'loseAll'
            ? 'bg-red-950/15 border-red-500/20'
            : 'bg-game-neonGreen/5 border-game-neonGreen/20'
        }`}>
          <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-70">
            <span>Ý Nghĩa Giáo Dục Cách Mạng: </span>
            <span className="font-extrabold text-white">"{activeFlippedCard.name}"</span>
          </h4>
          <p className="text-sm text-white/90 leading-relaxed font-normal">
            {activeFlippedCard.academicText}
          </p>
        </div>
      )}

      {/* 1. Modal Change Points (Swap points) */}
      {showSwapModal && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel border-game-neonCyan/40 rounded-3xl p-6 text-center space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <div className="w-14 h-14 bg-game-neonCyan/15 border border-game-neonCyan rounded-full flex items-center justify-center mx-auto animate-bounce-short">
              <RefreshCw className="w-7 h-7 text-game-neonCyan neon-text-cyan animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-game-neonCyan neon-text-cyan uppercase">Chuyển Hóa Sức Mạnh</h3>
              <p className="text-xs text-white/60">
                Hãy lựa chọn 1 đội đối thủ dưới đây để hoán đổi toàn bộ điểm số chính thức hiện tại của mình!
              </p>
            </div>

            <div className="space-y-2.5">
              {teams.map((t) => {
                // Cannot swap with yourself
                if (t.id === currentTeamIndex) return null;
                return (
                  <button
                    key={t.id}
                    onClick={() => onSwapScores(t.id)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-game-neonCyan hover:bg-game-neonCyan/10 text-white flex justify-between items-center transition-all duration-300 font-semibold group"
                  >
                    <span className="group-hover:text-game-neonCyan transition-colors">{t.name}</span>
                    <span className="text-game-neonGold neon-text-gold">{t.score} Điểm</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Rare Card (Unity Opportunity) */}
      {showRareModal && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel border-yellow-400 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-[0_0_35px_rgba(255,215,0,0.3)]">
            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-yellow-400 uppercase tracking-wide">Cơ Hội Đoàn Kết</h3>
              <p className="text-xs text-white/70 max-w-md mx-auto">
                Bạn đã lật trúng Thẻ Đặc Biệt của khối liên minh! Đứng trước thời khắc trọng đại, tập thể của bạn sẽ chọn giải pháp nào?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Option 1: Safe +5 */}
              <button
                onClick={onChooseSafeRare}
                className="p-5 rounded-2xl bg-game-neonGreen/10 border border-game-neonGreen/30 hover:border-game-neonGreen hover:bg-game-neonGreen/20 text-white flex flex-col items-center justify-center text-center transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-game-neonGreen/10 text-game-neonGreen flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-sm text-game-neonGreen uppercase tracking-wider block">Lựa Chọn 1: An Toàn</span>
                <span className="text-[11px] text-white/60 mt-1 leading-snug">
                  Nhận ngay 5 điểm thưởng chắc chắn và dừng lật thẻ bảo toàn điểm lượt này.
                </span>
              </button>

              {/* Option 2: Risk special card */}
              <button
                onClick={onChooseRiskRare}
                className="p-5 rounded-2xl bg-game-neonPurple/10 border border-game-neonPurple/30 hover:border-game-neonPurple hover:bg-game-neonPurple/20 text-white flex flex-col items-center justify-center text-center transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-game-neonPurple/10 text-game-neonPurple flex items-center justify-center mb-3">
                  <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <span className="font-extrabold text-sm text-game-neonPurple uppercase tracking-wider block">Lựa Chọn 2: Mạo Hiểm</span>
                <span className="text-[11px] text-white/60 mt-1 leading-snug">
                  Kích hoạt sức mạnh khối: 50% cơ hội tráo đổi điểm đối thủ, 50% rủi ro mất sạch toàn bộ điểm chính thức.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
