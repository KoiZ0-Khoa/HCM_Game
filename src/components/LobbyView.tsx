import React, { useState } from 'react';
import { Play, Users, Clock, HelpCircle, Bomb, Zap, HeartCrack, Shuffle, HelpCircle as HelpIcon, QrCode, Monitor, Smartphone } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LobbyViewProps {
  onStartGame: (teamNames: string[], discussionTime: number) => void;
  isOnlineMode: boolean;
  setIsOnlineMode: (val: boolean) => void;
  roomId: string;
  connectedPlayers: { socketId: string; teamId: number; name: string }[];
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  onStartGame,
  isOnlineMode,
  setIsOnlineMode,
  roomId,
  connectedPlayers
}) => {
  const [names, setNames] = useState<string[]>(['Chiến Binh Độc Lập', 'Lực Lượng Gắn Kết', 'Binh Đoàn Nhân Dân', 'Khối Toàn Dân']);
  const [timeLimit, setTimeLimit] = useState<number>(30);

  const handleNameChange = (idx: number, val: string) => {
    const next = [...names];
    next[idx] = val;
    setNames(next);
  };

  const handleTimeSelect = (secs: number) => {
    sounds.playClick();
    setTimeLimit(secs);
  };

  const handleStart = () => {
    sounds.playVictory();
    onStartGame(names, timeLimit);
  };

  // Generate QR Code URL pointing to player controller join screen
  const joinUrl = `${window.location.origin}/?room=${roomId}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(joinUrl)}&color=00f0ff&bgcolor=07080d`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      
      {/* Game Header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-game-neonCyan via-game-neonPurple to-game-neonGold mb-2">
          Đại Đoàn Kết Hay Bị Nổ?
        </h2>
        <p className="text-white/60 text-sm max-w-xl mx-auto">
          Cuộc chiến trí tuệ và nhân phẩm kịch tính. Trả lời chính xác câu hỏi và lật thẻ tích lũy sức mạnh đoàn kết vượt qua nguy cơ!
        </p>
      </div>

      {/* Mode Selection Panel */}
      <div className="max-w-md mx-auto glass-panel p-2 rounded-2xl border-white/5 flex gap-2 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
        <button
          onClick={() => { sounds.playClick(); setIsOnlineMode(false); }}
          className={`flex-1 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 ${
            !isOnlineMode
              ? 'bg-game-neonCyan/20 border border-game-neonCyan text-game-neonCyan neon-border-cyan font-black'
              : 'text-white/50 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Monitor className="w-4 h-4" /> Chơi Trực Tiếp (Local)
        </button>
        <button
          onClick={() => { sounds.playClick(); setIsOnlineMode(true); }}
          className={`flex-1 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 ${
            isOnlineMode
              ? 'bg-game-neonPurple/20 border border-game-neonPurple text-game-neonPurple neon-border-purple font-black'
              : 'text-white/50 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Smartphone className="w-4 h-4" /> Chơi Bằng Điện Thoại (Online)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Setup (Offline) OR Room Connection (Online) */}
        <div className="lg:col-span-5 space-y-6">
          
          {isOnlineMode ? (
            /* ONLINE LOBBY CONNECTIVITY SCREEN */
            <div className="glass-panel p-6 rounded-2xl border-game-neonPurple/30 space-y-6 shadow-2xl">
              <h3 className="text-lg font-bold flex items-center gap-2 text-game-neonPurple neon-text-purple border-b border-white/5 pb-2.5">
                <QrCode className="w-5 h-5" /> Kết Nối Điện Thoại
              </h3>

              <div className="text-center space-y-4">
                {/* Dynamically Loaded QR Code image from QRserver */}
                <div className="w-[180px] h-[180px] p-2 bg-[#07080d] border border-game-neonCyan rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.15)] relative overflow-hidden">
                  <img
                    src={qrCodeApiUrl}
                    alt="QR Code to Join Room"
                    className="w-full h-full rounded-lg"
                    loading="lazy"
                  />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Mã Phòng Chơi Của Bạn</span>
                  <span className="text-3xl font-black tracking-widest text-game-neonCyan neon-text-cyan font-mono bg-black/40 px-4 py-1.5 rounded-xl border border-white/5 inline-block">
                    {roomId}
                  </span>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed max-w-xs mx-auto">
                  Học sinh quét mã QR hoặc truy cập đường dẫn: 
                  <br />
                  <span className="font-mono text-game-neonCyan/85 font-semibold text-[9px] select-all break-all">{joinUrl}</span>
                </p>
              </div>

              {/* Real-time connected players display */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">
                  Trạng Thái Các Đội ({connectedPlayers.length}/4)
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const player = connectedPlayers.find(p => p.teamId === slotIdx);
                    return (
                      <div
                        key={slotIdx}
                        className={`p-2.5 rounded-xl border text-center transition duration-300 ${
                          player
                            ? 'bg-game-neonCyan/10 border-game-neonCyan/30 text-white'
                            : 'bg-white/5 border-white/5 text-white/20'
                        }`}
                      >
                        <span className="text-[9px] font-bold block uppercase leading-none opacity-40">Đội {slotIdx + 1}</span>
                        <span className="text-xs font-extrabold truncate block mt-1">
                          {player ? player.name : 'Trống ⚪'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Start game & Discussion timers */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] text-white/40 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-game-neonCyan" /> Thời Gian Thảo Luận
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((secs) => (
                    <button
                      key={secs}
                      onClick={() => handleTimeSelect(secs)}
                      className={`py-2 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                        timeLimit === secs
                          ? 'bg-game-neonCyan/20 border-game-neonCyan text-game-neonCyan neon-border-cyan'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {secs} Giây
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full py-3.5 bg-gradient-to-r from-game-neonPurple to-game-neonCyan hover:from-game-neonCyan hover:to-game-neonPurple text-black font-extrabold uppercase tracking-widest rounded-xl transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Bắt Đầu Trận Đấu
              </button>
            </div>
          ) : (
            /* LOCAL OFFLINE LOBBY SCREEN */
            <div className="glass-panel p-6 rounded-2xl border-game-neonCyan/30 space-y-6 shadow-2xl">
              <h3 className="text-lg font-bold flex items-center gap-2 text-game-neonCyan neon-text-cyan border-b border-white/5 pb-2.5">
                <Users className="w-5 h-5" /> Thiết Lập Đội Chơi
              </h3>
              
              <div className="space-y-3.5">
                {names.map((name, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">
                      Tên Đội {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(idx, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-game-neonCyan focus:ring-1 focus:ring-game-neonCyan/50 rounded-xl px-4 py-2.5 text-xs text-white font-medium transition outline-none"
                      placeholder={`Đội ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] text-white/40 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-game-neonCyan" /> Thời Gian Thảo Luận
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((secs) => (
                    <button
                      key={secs}
                      onClick={() => handleTimeSelect(secs)}
                      className={`py-2 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                        timeLimit === secs
                          ? 'bg-game-neonCyan/20 border-game-neonCyan text-game-neonCyan neon-border-cyan'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {secs} Giây
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full py-3.5 bg-gradient-to-r from-game-neonCyan to-game-neonPurple hover:from-game-neonPurple hover:to-game-neonCyan text-black font-extrabold uppercase tracking-widest rounded-xl transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Bắt Đầu Trận Đấu
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Rule Book */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-5">
            <h3 className="text-lg font-bold flex items-center gap-2 text-game-neonGold neon-text-gold border-b border-white/5 pb-2.5">
              <HelpCircle className="w-5 h-5" /> Luật Chơi & Ý Nghĩa Thẻ Bài
            </h3>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-bold text-xs text-game-neonCyan mb-1.5 uppercase">Quy Trình Một Lượt</h4>
                <ul className="text-xs text-white/70 space-y-1.5 list-disc pl-4 leading-relaxed font-normal">
                  <li><strong>Chọn câu hỏi:</strong> Đội chơi chọn chữ cái (A-P) tương ứng với 16 câu hỏi trên bảng.</li>
                  <li><strong>Trả lời:</strong> Thảo luận nhanh và trả lời câu hỏi trắc nghiệm trong thời gian quy định.</li>
                  <li><strong>Lật thẻ nhân phẩm:</strong> Trả lời ĐÚNG sẽ được vào vòng lật thẻ tích điểm tạm thời. Trả lời SAI sẽ chuyển lượt ngay cho đội kế tiếp.</li>
                  <li><strong>Quyết định:</strong> Trong vòng lật thẻ, nhóm có thể <strong>"Dừng lại"</strong> để cộng điểm tạm thời vào điểm chính thức, hoặc <strong>"Lật tiếp"</strong> để tìm điểm lớn hơn nhưng phải đối mặt nguy cơ mất hết!</li>
                </ul>
              </div>

              <h4 className="font-bold text-xs text-white border-l-2 border-game-neonPurple pl-2 mt-4 uppercase">
                Hệ Thống Thẻ Bài Nguy Cơ & Đặc Biệt
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bomb card description */}
                <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex gap-3 items-start">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                    <Bomb className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-red-400 uppercase">Chia Rẽ Nội Bộ (BOMB)</h5>
                    <p className="text-[10px] text-white/60 mt-0.5 leading-snug">
                      Mất sạch điểm tạm thời của lượt đó. Nhắc nhở sự chia rẽ sẽ phá hỏng sức mạnh từ bên trong.
                    </p>
                  </div>
                </div>

                {/* Nuclear card description */}
                <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/20 flex gap-3 items-start">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-orange-400 uppercase">Khủng Hoảng Chung (Nuclear)</h5>
                    <p className="text-[10px] text-white/60 mt-0.5 leading-snug">
                      Trừ 3 điểm toàn bộ đối thủ. Khi biến cố lớn ập đến, thiếu gắn kết thì toàn xã hội sẽ cùng ảnh hưởng.
                    </p>
                  </div>
                </div>

                {/* LoseAll card description */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex gap-3 items-start">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                    <HeartCrack className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-purple-400 uppercase">Mất Niềm Tin (Lose All)</h5>
                    <p className="text-[10px] text-white/60 mt-0.5 leading-snug">
                      Vô cùng nguy hiểm! Mất sạch toàn bộ điểm số tích lũy chính thức từ đầu trận.
                    </p>
                  </div>
                </div>

                {/* ChangePoints card description */}
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 flex gap-3 items-start">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                    <Shuffle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-blue-400 uppercase">Chuyển Hóa Sức Mạnh</h5>
                    <p className="text-[10px] text-white/60 mt-0.5 leading-snug">
                      Hoán đổi điểm số chính thức hiện tại của mình với một đối thủ bất kỳ để lật ngược tình thế.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rare card description */}
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/25 flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-amber-500/10 text-game-neonGold border border-amber-500/20 shrink-0">
                  <HelpIcon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-game-neonGold uppercase">Cơ Hội Đoàn Kết (Thẻ RARE)</h5>
                  <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                    Có hai sự lựa chọn:
                    <br />
                    1. <strong>An toàn:</strong> Dừng lật và cộng ngay 5 điểm thưởng.
                    <br />
                    2. <strong>Mạo hiểm:</strong> Mở thẻ đặc biệt ngẫu nhiên (50% cơ hội nhận Tráo Điểm, 50% rủi ro Mất Sạch Toàn Bộ Điểm)!
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
