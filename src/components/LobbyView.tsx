import React, { useState } from 'react';
import { Play, Users, Clock, QrCode, Monitor, Smartphone } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const CARD_LIBRARY = [
  {
    type: 'plus1',
    name: 'Một Hành Động Đoàn Kết',
    badge: 'Điểm Cộng',
    effectText: '+1 Điểm',
    description: 'Cộng thêm +1 điểm vào quỹ điểm tạm thời của lượt này. An toàn và dễ tích lũy!',
    academicText: 'Lắng nghe, hỗ trợ, tôn trọng nhau tạo dựng khối đoàn kết vững chắc từ những điều nhỏ bé nhất.',
    image: '/cards/Lá +1.png',
    bgClass: 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  },
  {
    type: 'plus2',
    name: 'Gắn Kết Lực Lượng',
    badge: 'Điểm Cộng',
    effectText: '+2 Điểm',
    description: 'Cộng thêm +2 điểm vào quỹ điểm tạm thời lượt này. Sức mạnh nhân đôi nhờ phối hợp ăn ý!',
    academicText: 'Sự phối hợp đồng bộ giữa các cá nhân giúp nâng sức mạnh tập thể lên gấp bội.',
    image: '/cards/Lá +2.png',
    bgClass: 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  },
  {
    type: 'plus3',
    name: 'Sức Mạnh Nhân Dân',
    badge: 'Điểm Cộng Lớn',
    effectText: '+3 Điểm',
    description: 'Cộng thêm +3 điểm vào quỹ điểm tạm thời lượt này. Tạo ra một bước tiến vượt bậc về điểm số!',
    academicText: 'Cách mạng là sự nghiệp của quần chúng. Sức mạnh vĩ đại nhất nằm ở lòng dân.',
    image: '/cards/Lá +3.png',
    bgClass: 'bg-emerald-950/15 border-emerald-500/35 text-emerald-300 hover:border-emerald-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
  },
  {
    type: 'plus4',
    name: 'Đồng Lòng Vì Mục Tiêu Chung',
    badge: 'Siêu Điểm Cộng',
    effectText: '+4 Điểm',
    description: 'Cộng thêm +4 điểm vào quỹ điểm tạm thời lượt này. Siêu điểm cộng giúp nhóm bạn tiến gần chiến thắng!',
    academicText: 'Đại đoàn kết chỉ bền vững khi toàn thể thành viên cùng chung sức hướng về lợi ích tối cao.',
    image: '/cards/Lá +4.png',
    bgClass: 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 hover:border-emerald-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    badgeClass: 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 font-extrabold'
  },
  {
    type: 'plus5',
    name: 'Đại Đoàn Kết Toàn Dân',
    badge: 'Cực Đại Điểm Cộng',
    effectText: '+5 Điểm',
    description: 'Cộng thêm +5 điểm vào quỹ điểm tạm thời lượt này. Đỉnh cao điểm thưởng, nâng tầm vị thế nhóm!',
    academicText: 'Sức mạnh lớn nhất khi toàn dân tập hợp thành một khối thống nhất dưới sự dẫn dắt đúng đắn.',
    image: '/cards/Lá +5.png',
    bgClass: 'bg-teal-950/20 border-teal-500/40 text-teal-300 hover:border-teal-300 hover:shadow-[0_0_25px_rgba(20,184,166,0.25)]',
    badgeClass: 'bg-teal-500/20 text-teal-200 border border-teal-500/40 font-extrabold'
  },
  {
    type: 'bomb',
    name: 'Chia Rẽ Nội Bộ',
    badge: 'BOM HỦY DIỆT',
    effectText: 'Mất sạch điểm tạm thời của lượt đó.',
    description: 'Toàn bộ điểm tạm thời tích lũy của lượt này bị HỦY BỎ hoàn toàn và đưa về 0! Kết thúc lượt ngay.',
    academicText: 'Sự nghi kỵ, chia rẽ làm suy yếu tập thể. Điều này đi ngược tư tưởng Hồ Chí Minh về đại đoàn kết.',
    image: '/cards/Lá bomb.png',
    bgClass: 'bg-rose-950/10 border-rose-500/20 text-rose-400 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    badgeClass: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
  },
  {
    type: 'nuclear',
    name: 'Khủng Hoảng Chung',
    badge: 'TẤN CÔNG DIỆN RỘNG',
    effectText: 'Trừ 3 điểm toàn bộ đối thủ.',
    description: 'Gây sát thương diện rộng! Tất cả 3 đội đối thủ còn lại đều bị TRỪ 3 điểm chính thức. Bạn được lật tiếp.',
    academicText: 'Gặp biến cố lớn, nếu thiếu đoàn kết thì không chỉ một cá nhân mà cả cộng đồng đều gánh chịu tổn thất.',
    image: '/cards/Lá nuclear.png',
    bgClass: 'bg-purple-950/10 border-purple-500/20 text-purple-400 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    badgeClass: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  },
  {
    type: 'loseAll',
    name: 'Mất Niềm Tin',
    badge: 'HÌNH PHẠT CỰC NẶNG',
    effectText: 'Mất toàn bộ điểm số tích lũy từ đầu trận.',
    description: 'TOÀN BỘ ĐIỂM CHÍNH THỨC hiện tại của nhóm bạn biến mất (trở về 0đ). Quỹ điểm tạm thời cũng mất sạch.',
    academicText: 'Niềm tin là xi măng gắn kết lực lượng. Khi mất niềm tin, khối đoàn kết lập tức lung lay và đổ vỡ.',
    image: '/cards/Mất niềm tin.png',
    bgClass: 'bg-red-950/20 border-red-500/30 text-red-400 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    badgeClass: 'bg-red-500/10 text-red-400 border border-red-500/20 font-bold'
  },
  {
    type: 'changePoints',
    name: 'Chuyển Hóa Sức Mạnh',
    badge: 'TRÁO ĐỔI ĐIỂM SỐ',
    effectText: 'Đổi điểm với đối thủ bất kỳ.',
    description: 'Hoán đổi điểm số chính thức hiện tại của mình với một đối thủ bất kỳ để lật ngược tình thế.',
    academicText: 'Chiến thuật nhạy bén và tinh thần đoàn kết giúp tập thể lật ngược thế cờ trong hoàn cảnh éo le nhất.',
    image: '/cards/Lá chuyển hóa sức mạnh.png',
    bgClass: 'bg-cyan-950/10 border-cyan-500/20 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
  },
  {
    type: 'rare',
    name: 'Cơ Hội Đoàn Kết',
    badge: 'THẺ SIÊU ĐẶC BIỆT (RARE)',
    effectText: 'Nhận 5 điểm hoặc mạo hiểm 50% Tráo / 50% Mất sạch.',
    description: 'Hai sự lựa chọn: An toàn dừng lật cộng 5đ chính thức, hoặc Mạo hiểm lật thẻ đặc biệt tráo điểm/mất sạch.',
    academicText: 'Thách thức bản lĩnh tập thể: Chọn lựa lợi ích an toàn trước mắt hay dấn thân vì mục tiêu đột phá vĩ đại.',
    image: '/cards/Lá đặc biệt.png',
    bgClass: 'bg-amber-950/10 border-amber-500/30 text-amber-400 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
  }
];

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
  const [lobbyTab, setLobbyTab] = useState<'rules' | 'cards'>('rules');


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
          className={`flex-1 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 ${!isOnlineMode
              ? 'bg-game-neonCyan/20 border border-game-neonCyan text-game-neonCyan neon-border-cyan font-black'
              : 'text-white/50 hover:bg-white/5 border border-transparent'
            }`}
        >
          <Monitor className="w-4 h-4" /> Chơi Trực Tiếp (Local)
        </button>
        <button
          onClick={() => { sounds.playClick(); setIsOnlineMode(true); }}
          className={`flex-1 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 ${isOnlineMode
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
                        className={`p-2.5 rounded-xl border text-center transition duration-300 ${player
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
                      className={`py-2 rounded-xl border text-xs font-semibold transition-all duration-300 ${timeLimit === secs
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
                      className={`py-2 rounded-xl border text-xs font-semibold transition-all duration-300 ${timeLimit === secs
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
          <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-5 h-full">
            
            {/* Tab Switcher */}
            <div className="flex border-b border-white/10 gap-6">
              <button
                onClick={() => { sounds.playClick(); setLobbyTab('rules'); }}
                className={`pb-3 text-sm font-extrabold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                  lobbyTab === 'rules'
                    ? 'text-game-neonCyan neon-text-cyan font-black'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                📜 Hướng Dẫn Luật Chơi
                {lobbyTab === 'rules' && (
                  <div className="absolute bottom-0 inset-x-0 h-[2px] bg-game-neonCyan shadow-[0_0_8px_#00f0ff] animate-fade-in" />
                )}
              </button>
              <button
                onClick={() => { sounds.playClick(); setLobbyTab('cards'); }}
                className={`pb-3 text-sm font-extrabold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                  lobbyTab === 'cards'
                    ? 'text-game-neonGold neon-text-gold font-black'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                🃏 Thư Viện Thẻ Bài
                {lobbyTab === 'cards' && (
                  <div className="absolute bottom-0 inset-x-0 h-[2px] bg-game-neonGold shadow-[0_0_8px_#ffb800] animate-fade-in" />
                )}
              </button>
            </div>

            {lobbyTab === 'rules' ? (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin animate-fade-in font-sans">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="font-bold text-xs text-game-neonCyan mb-1.5 uppercase">Quy Trình Một Lượt</h4>
                  <ul className="text-xs text-white/70 space-y-1.5 list-disc pl-4 leading-relaxed font-normal">
                    <li><strong>Chọn câu hỏi:</strong> Đội chơi chọn ô số (1-12) tương ứng với 12 câu hỏi trên bảng.</li>
                    <li><strong>Trả lời:</strong> Thảo luận nhanh và trả lời câu hỏi trắc nghiệm trong thời gian quy định.</li>
                    <li><strong>Lật thẻ nhân phẩm:</strong> Trả lời ĐÚNG sẽ được vào vòng lật thẻ tích điểm tạm thời. Trả lời SAI sẽ chuyển lượt ngay cho đội kế tiếp.</li>
                    <li><strong>Quyết định:</strong> Trong vòng lật thẻ, nhóm có thể <strong>"Dừng lại"</strong> để cộng điểm tạm thời vào điểm chính thức, hoặc <strong>"Lật tiếp"</strong> để tìm điểm lớn hơn nhưng phải đối mặt nguy cơ mất hết!</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-game-neonPurple/5 border border-game-neonPurple/10 space-y-2">
                  <h4 className="font-bold text-xs text-game-neonPurple uppercase">Tinh Thần Đại Đoàn Kết</h4>
                  <p className="text-[11px] text-white/70 leading-relaxed font-normal">
                    Trò chơi kết hợp kiến thức lịch sử, tư tưởng Hồ Chí Minh về đại đoàn kết dân tộc cùng các tình huống bất ngờ từ bộ thẻ bài nguy cơ. Hãy biết kết hợp chiến thuật mạo hiểm và sự đồng lòng của tập thể để đưa nhóm của bạn vươn tới chiến thắng vinh quang!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin animate-fade-in font-sans">
                {CARD_LIBRARY.map((card) => (
                  <div
                    key={card.type + card.name}
                    className={`flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-black/40 border transition-all duration-300 ${card.bgClass}`}
                  >
                    {/* Visual Card Graphic */}
                    <div className="w-[100px] aspect-[2/3] mx-auto sm:mx-0 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] relative group">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Card Content & Meaning */}
                    <div className="flex-1 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="text-sm font-bold text-white uppercase tracking-wide">
                            {card.name}
                          </h5>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${card.badgeClass}`}>
                            {card.badge}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-game-neonGold mt-1 leading-snug">
                          ⚡ Tác dụng: {card.effectText}
                        </p>
                        
                        <p className="text-[11px] text-white/70 mt-1.5 leading-relaxed font-normal">
                          {card.description}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/5">
                        <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider block leading-none mb-1">
                          Ý nghĩa đại đoàn kết
                        </span>
                        <p className="text-[10px] text-white/50 leading-relaxed italic font-normal">
                          "{card.academicText}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
