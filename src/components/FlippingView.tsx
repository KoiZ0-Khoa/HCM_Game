import React from 'react';
import { Shield, Sparkles, RefreshCw, Trophy, AlertOctagon, Zap, HelpCircle } from 'lucide-react';
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
      case 'bomb': return '/cards/Lá bomb.png';
      case 'nuclear': return '/cards/Lá nuclear.png';
      case 'loseAll': return '/cards/Mất niềm tin.png';
      case 'changePoints': return '/cards/Lá chuyển hóa sức mạnh.png';
      case 'rare': return '/cards/Lá đặc biệt.png';
      default: return '/cards/Lá đặc biệt.png';
    }
  };

  const getCardImpactDetails = (card: Card) => {
    switch (card.type) {
      case 'plus1':
        return {
          title: 'Điểm Cộng Cơ Bản (+1)',
          impact: 'Cộng thêm +1 điểm vào quỹ điểm tạm thời của lượt này. An toàn và dễ tích lũy!',
          actionTip: 'Nhóm bạn có thể quyết định lật tiếp hoặc bấm "Dừng Lại & Bảo Toàn" để nhận điểm chính thức.',
          colorClass: 'border-game-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.1)] text-game-neonGreen',
          badgeText: 'Điểm Cộng',
          glowClass: 'neon-text-green'
        };
      case 'plus2':
        return {
          title: 'Gắn Kết Lực Lượng (+2)',
          impact: 'Cộng thêm +2 điểm vào quỹ điểm tạm thời lượt này. Sức mạnh nhân đôi nhờ phối hợp ăn ý!',
          actionTip: 'Số điểm khá tốt. Bạn muốn mạo hiểm lật tiếp để đột phá hay bảo toàn điểm số để giữ an toàn?',
          colorClass: 'border-game-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.1)] text-game-neonGreen',
          badgeText: 'Điểm Cộng',
          glowClass: 'neon-text-green'
        };
      case 'plus3':
        return {
          title: 'Sức Mạch Nhân Dân (+3)',
          impact: 'Cộng thêm +3 điểm vào quỹ điểm tạm thời lượt này. Tạo ra một bước tiến vượt bậc về điểm số!',
          actionTip: 'Điểm số tích lũy rất cao. Hãy thống nhất ý chí toàn đội xem nên tiếp tục thử thách hay bảo toàn.',
          colorClass: 'border-game-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.1)] text-game-neonGreen',
          badgeText: 'Điểm Cộng Lớn',
          glowClass: 'neon-text-green'
        };
      case 'plus4':
        return {
          title: 'Đồng Lòng Vì Mục Tiêu Chung (+4)',
          impact: 'Cộng thêm +4 điểm vào quỹ điểm tạm thời lượt này. Siêu điểm cộng giúp nhóm bạn tiến gần chiến thắng!',
          actionTip: 'Số điểm lớn có thể thay đổi cục diện trận đấu. Hãy thảo luận thật kỹ trước khi lật thêm!',
          colorClass: 'border-game-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.1)] text-game-neonGreen',
          badgeText: 'Siêu Điểm Cộng',
          glowClass: 'neon-text-green'
        };
      case 'plus5':
        return {
          title: 'Đại Đoàn Kết Toân Dân (+5)',
          impact: 'Cộng thêm +5 điểm vào quỹ điểm tạm thời lượt này. Đỉnh cao điểm thưởng, nâng tầm vị thế nhóm!',
          actionTip: 'Số điểm cực đại từ một thẻ bài! Khuyến nghị cao nên bấm nút "Dừng Lại & Bảo Toàn" ngay lập tức.',
          colorClass: 'border-game-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.15)] text-game-neonGreen',
          badgeText: 'Cực Đại Điểm Cộng',
          glowClass: 'neon-text-green'
        };
      case 'bomb':
        return {
          title: 'Chia Rẽ Nội Bộ (BOM)',
          impact: 'Toàn bộ điểm tạm thời tích lũy của lượt này bị HỦY BỎ hoàn toàn và đưa về 0!',
          actionTip: 'Lượt chơi kết thúc lập tức. Quyền lật thẻ chuyển sang đội đối thủ tiếp theo. Bài học về sự chia rẽ!',
          colorClass: 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-red-500',
          badgeText: 'BOM HỦY DIỆT',
          glowClass: 'neon-text-red'
        };
      case 'nuclear':
        return {
          title: 'Khủng Hoảng Chung (Nuclear)',
          impact: 'Gây sát thương diện rộng! Tất cả 3 đội đối thủ còn lại đều bị TRỪ 3 điểm chính thức.',
          actionTip: 'Điểm tạm thời lượt này được bảo toàn. Nhóm bạn tiếp tục có thêm 1 lượt lật thẻ bài nữa!',
          colorClass: 'border-game-neonPurple/40 shadow-[0_0_15px_rgba(189,0,255,0.15)] text-game-neonPurple',
          badgeText: 'TẤN CÔNG DIỆN RỘNG',
          glowClass: 'neon-text-purple'
        };
      case 'loseAll':
        return {
          title: 'Mất Niềm Tin (Trắng Tay)',
          impact: 'TOÀN BỘ ĐIỂM CHÍNH THỨC hiện tại của nhóm bạn biến mất (trở về 0đ). Quỹ điểm tạm thời cũng mất sạch.',
          actionTip: 'Lượt lật kết thúc ngay lập tức. Đây là hình phạt nặng nhất trong đấu trường, hãy cực kỳ cẩn trọng!',
          colorClass: 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-red-500',
          badgeText: 'HÌNH PHẠT CỰC NẶNG',
          glowClass: 'neon-text-red'
        };
      case 'changePoints':
        return {
          title: 'Chuyển Hóa Sức Mạng (Tráo Điểm)',
          impact: 'Kích hoạt vòng hoán đổi! Nhóm bạn có đặc quyền TRÁO ĐỔI ĐIỂM SỐ CHÍNH THỨC với một nhóm đối thủ tùy chọn.',
          actionTip: 'Hãy chọn nhóm đang có điểm số cao nhất để đổi điểm, giúp nhóm vươn lên vị trí dẫn đầu!',
          colorClass: 'border-game-neonCyan/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-game-neonCyan',
          badgeText: 'TRÁO ĐỔI ĐIỂM SỐ',
          glowClass: 'neon-text-cyan'
        };
      case 'rare':
        return {
          title: 'Cơ Hội Đoàn Kết (Rare Card)',
          impact: 'Thẻ đặc biệt của Khối liên minh mang lại cơ hội ngã rẽ định mệnh cho nhóm bạn.',
          actionTip: 'Lựa chọn 1: Ăn chắc +5đ chính thức & dừng lượt. Lựa chọn 2: Mạo hiểm 50% tráo điểm / 50% mất sạch điểm chính thức.',
          colorClass: 'border-yellow-400/40 shadow-[0_0_15px_rgba(255,215,0,0.15)] text-yellow-400',
          badgeText: 'THẺ SIÊU ĐẶC BIỆT',
          glowClass: 'neon-text-gold'
        };
      default:
        return {
          title: 'Thẻ Bài Nhân Phẩm',
          impact: 'Chứa đựng những hiệu ứng đặc sắc làm thay đổi điểm số trong game.',
          actionTip: 'Xem kỹ tác dụng thẻ bài trên máy chiếu.',
          colorClass: 'border-white/20 text-white',
          badgeText: 'THẺ BÀI',
          glowClass: ''
        };
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 space-y-6 relative transition-all duration-300 ${screenShake ? 'animate-shake' : ''
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
            className={`px-6 py-4 rounded-2xl font-extrabold uppercase tracking-wider text-sm transition-all duration-300 flex items-center gap-2 shadow-lg ${temporaryScore > 0 && !blockFlipInput
              ? 'bg-game-neonGold hover:bg-yellow-500 text-black cursor-pointer hover:shadow-[0_0_20px_rgba(255,184,0,0.35)]'
              : 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed'
              }`}
          >
            <Trophy className="w-4 h-4" /> Dừng Lại & Bảo Toàn
          </button>
        </div>
      </div>

      {/* Side-by-Side Arena Splits Layout (Highly optimized for PC/Projector screen to prevent vertical overflow) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: 12-Card Grid (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <span className="text-xs text-game-neonPurple tracking-wider font-extrabold uppercase block">
                Bản đồ nhân phẩm (12 lá bài)
              </span>
              <span className="text-[10px] text-white/40 uppercase font-mono">
                Lượt: {teamName}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {cardsDeck.map((card, idx) => (
                <div key={card.id} className="h-28 sm:h-36 md:h-40 lg:h-44 aspect-[2/3] max-h-[15vh] md:max-h-[17vh] mx-auto perspective-1000 relative">
                  <div
                    className={`w-full h-full duration-500 preserve-3d relative cursor-pointer ${card.isRevealed ? 'rotate-y-180' : ''
                      }`}
                    onClick={() => onFlipCard(idx)}
                  >
                    {/* Card BACK (Covered) */}
                    <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 ${blockFlipInput
                      ? 'bg-game-cardBack border-white/5 cursor-not-allowed opacity-60'
                      : 'bg-game-cardBack border-game-neonPurple/25 hover:border-game-neonPurple hover:bg-game-cardBackHover shadow-[0_0_10px_rgba(189,0,255,0.05)] hover:shadow-[0_0_15px_rgba(189,0,255,0.2)]'
                      }`}>
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2.5">
                        <Shield className="w-5 h-5 text-game-neonPurple/50" />
                      </div>
                      <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Mặt Sau</span>
                      <span className="text-[11px] text-game-neonCyan font-mono font-bold tracking-wider mt-1">#{(card.id + 1).toString().padStart(2, '0')}</span>
                    </div>

                    {/* Card FRONT (Revealed) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-white/20">
                      <img
                        src={getCardImage(card.type)}
                        alt={card.name}
                        className="absolute inset-0 w-full h-full object-fill bg-[#0a0d1a]"
                        draggable={false}
                      />

                      {/* Special Card Banner Overlay */}
                      {['nuclear', 'loseAll', 'changePoints', 'rare'].includes(card.type) && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-sm px-1.5 py-2 border-t border-white/10 text-center z-10 animate-fade-in text-[10px] font-black text-white uppercase tracking-wider line-clamp-1">
                          {card.type === 'rare' ? 'Thẻ Rare' : 'Đặc Biệt'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Active Card Detail Panel (lg:col-span-5) */}
        <div className="lg:col-span-5">
          {activeFlippedCard ? (() => {
            const details = getCardImpactDetails(activeFlippedCard);
            return (
              <div className={`glass-panel p-5 rounded-3xl border animate-fade-in transition-all duration-300 bg-gradient-to-br from-[#0c0f1d] to-[#080a14] space-y-4 shadow-xl ${details.colorClass}`}>
                
                {/* Visual Section: Large Card image + Score badge */}
                <div className="flex flex-row items-center justify-center gap-6">
                  {/* Magnified Card Image */}
                  <div className="w-28 sm:w-36 aspect-[2/3] flex-shrink-0 relative rounded-2xl overflow-hidden border-2 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.08)] bg-[#0a0d1a]">
                    <img
                      src={getCardImage(activeFlippedCard.type)}
                      alt={activeFlippedCard.name}
                      className="w-full h-full object-fill"
                      draggable={false}
                    />
                    {['nuclear', 'loseAll', 'changePoints', 'rare'].includes(activeFlippedCard.type) && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/90 px-1 py-1 border-t border-white/10 text-center z-10 text-[9px] font-black text-white uppercase tracking-wider">
                        {activeFlippedCard.type === 'rare' ? 'Thẻ Rare' : 'Đặc Biệt'}
                      </div>
                    )}
                  </div>

                  {/* Text labels */}
                  <div className="space-y-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-white/10 ${details.colorClass} block w-max`}>
                      {details.badgeText}
                    </span>
                    <h3 className={`text-base font-black uppercase leading-tight ${details.colorClass} ${details.glowClass}`}>
                      {activeFlippedCard.name}
                    </h3>
                    <div className="text-[10px] text-white/40 uppercase font-mono">
                      Loại thẻ: {activeFlippedCard.type.startsWith('plus') ? 'Cộng điểm' : 'Hiệu ứng đặc biệt'}
                    </div>
                  </div>
                </div>

                {/* Explanations vertical stacked container */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Hiệu ứng game:
                    </h4>
                    <p className="text-xs text-white/95 font-semibold bg-white/5 px-3 py-2.5 rounded-xl border border-white/5 leading-relaxed">
                      {details.impact}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-white/50">Ảnh hưởng & hành động:</h4>
                    <p className="text-xs text-game-neonGold font-semibold italic">
                      👉 {details.actionTip}
                    </p>
                  </div>

                  <div className="space-y-1 border-t border-white/10 pt-3">
                    <h4 className="text-xs font-black uppercase text-white/70 tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" /> Ý nghĩa giáo dục & lịch sử
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed italic bg-white/5 p-3 rounded-2xl border border-white/5">
                      "{activeFlippedCard.academicText}"
                    </p>
                  </div>
                </div>

              </div>
            );
          })() : (
            /* Placeholder panel when no card is flipped yet */
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5 text-center py-16 space-y-4 h-full flex flex-col justify-center items-center">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                <Sparkles className="w-7 h-7 text-game-neonPurple" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Đang Chờ Lật Thẻ
                </h4>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  Nhóm <span className="text-game-neonPurple font-bold">{teamName}</span> vui lòng lật một ô thẻ ở **Bản đồ bên trái** để kiểm tra nhân phẩm tích lũy điểm!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

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
