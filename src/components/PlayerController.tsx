import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { Users, Shield, Clock, Coins, RefreshCw, Trophy, Sparkles, Zap, HelpCircle } from 'lucide-react';
import type { Card, Team } from '../types';


interface PlayerControllerProps {
  initialRoomId: string;
  onLeave: () => void;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({ initialRoomId, onLeave }) => {
  // Join Room fields
  const [roomId, setRoomId] = useState<string>(initialRoomId);
  const [teamName, setTeamName] = useState<string>('');
  const [teamSlot, setTeamSlot] = useState<number | null>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Sockets & Game State
  const socketRef = useRef<Socket | null>(null);
  const [syncedState, setSyncedState] = useState<any>(null);

  // Setup connection to WebSocket server
  useEffect(() => {
    // Dynamically connect to the backend socket server (always port 3000 in local dev environment)
    const serverUrl = window.location.port 
      ? `${window.location.protocol}//${window.location.hostname}:3000` 
      : window.location.origin;

    console.log('Connecting mobile client to Socket Server:', serverUrl);
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to relay server:', socket.id);
    });

    socket.on('state-updated', (state) => {
      setSyncedState(state);
    });

    socket.on('join-error', (msg) => {
      setErrorMessage(msg);
      setJoined(false);
    });

    socket.on('host-disconnected', () => {
      alert("Phòng chơi đã bị đóng bởi Host!");
      onLeave();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim() || !teamName.trim() || teamSlot === null) {
      setErrorMessage('Vui lòng nhập đầy đủ mã phòng, tên đội và chọn số đội!');
      return;
    }
    
    setErrorMessage(null);
    if (socketRef.current) {
      socketRef.current.emit('player-join-room', {
        roomId: roomId.trim(),
        teamId: teamSlot,
        name: teamName.trim()
      });
      setJoined(true);
    }
  };

  const sendAction = (type: string, payload?: any) => {
    // Vibrate phone slightly for tactile feedback
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }
    if (socketRef.current) {
      socketRef.current.emit('player-action', {
        roomId: roomId.trim(),
        action: { type, payload }
      });
    }
  };

  // Check if it is currently this team's turn
  const isMyTurn = syncedState && syncedState.currentTeamIndex === teamSlot;
  const activeTeam = syncedState?.teams[syncedState.currentTeamIndex];

  // Helper lists
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

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
          title: 'Đại Đoàn Kết Toàn Dân (+5)',
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
          title: 'Chuyển Hóa Sức Mạnh (Tráo Điểm)',
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
    <div className={`flex-1 w-full mx-auto px-4 py-6 flex flex-col justify-start min-h-[85vh] space-y-6 transition-all duration-500 ${
      joined && syncedState && syncedState.gamePhase === 'flipping'
        ? 'max-w-7xl'
        : 'max-w-xl md:max-w-2xl'
    }`}>

      
      {/* 1. LOBBY LOGIN INTERFACE */}
      {!joined ? (
        <div className="w-full max-w-md mx-auto my-auto">
          <form onSubmit={handleJoin} className="glass-panel p-6 rounded-3xl border-game-neonPurple/30 space-y-5 shadow-2xl">
            <div className="text-center space-y-1">
            <h2 className="text-2xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-game-neonPurple to-game-neonCyan">
              Tay Cầm Đồng Bộ
            </h2>
            <p className="text-[10px] text-white/50 tracking-widest uppercase">Nhập mã phòng để kết nối</p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold text-center">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            {/* Room Code */}
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Mã Phòng Chơi</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 focus:border-game-neonPurple focus:ring-1 focus:ring-game-neonPurple/50 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-widest outline-none transition"
                placeholder="Ví dụ: 1605"
                maxLength={6}
                required
              />
            </div>

            {/* Team Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Tên Nhóm Của Bạn</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-game-neonPurple focus:ring-1 focus:ring-game-neonPurple/50 rounded-xl px-4 py-3 text-sm font-semibold outline-none transition"
                placeholder="Nhập tên nhóm độc lạ..."
                maxLength={20}
                required
              />
            </div>

            {/* Team Slot selection */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Chọn Vị Trí Đội</label>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((slotIdx) => (
                  <button
                    key={slotIdx}
                    type="button"
                    onClick={() => setTeamSlot(slotIdx)}
                    className={`py-3 rounded-xl border text-xs font-extrabold uppercase transition-all duration-300 ${
                      teamSlot === slotIdx
                        ? 'bg-game-neonPurple/20 border-game-neonPurple text-game-neonPurple neon-border-purple'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    Đội {slotIdx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onLeave}
              className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-white/60 transition"
            >
              Quay Lại
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-game-neonPurple to-game-neonCyan text-black font-extrabold uppercase tracking-wider rounded-xl hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition duration-300"
            >
              Tham Gia
            </button>
            </div>
          </form>
        </div>
      ) : !syncedState ? (
        /* 2. WAITING FOR HOST STATE SYNC */
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 my-auto">
          <div className="w-12 h-12 rounded-full bg-game-neonCyan/10 border border-game-neonCyan flex items-center justify-center mx-auto animate-spin" style={{ animationDuration: '4s' }}>
            <RefreshCw className="w-6 h-6 text-game-neonCyan neon-text-cyan" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Đang kết nối...</h3>
          <p className="text-xs text-white/40 max-w-xs mx-auto">
            Hệ thống đã nhận kết nối. Đang đồng bộ hóa trạng thái game show từ màn hình chính của Host.
          </p>
        </div>
      ) : (
        /* 3. SYNCED MOBILE GAMEPAD CONTROLLERS */
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          
          {/* Quick HUD Card */}
          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-white/10 bg-white/5 shadow-md">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-game-neonGreen animate-pulse`} />
              <div>
                <span className="text-xs text-white/40 font-bold block uppercase leading-none mb-1">Tên Nhóm Của Bạn</span>
                <span className="text-base font-extrabold text-game-neonCyan">{teamName}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-white/40 font-bold block uppercase leading-none mb-1">Điểm Đang Có</span>
              <span className="text-lg font-black text-game-neonGold">{syncedState.teams[teamSlot!].score}đ</span>
            </div>
          </div>

          {/* TURN STATE NOTIFIER */}
          <div className={`p-5 rounded-2xl border text-center transition-all ${
            isMyTurn 
              ? 'bg-game-neonCyan/15 border-game-neonCyan shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
              : 'bg-white/5 border-white/5'
          }`}>
            <span className="text-xs text-white/40 font-bold tracking-wider uppercase block mb-1">
              Trạng thái lượt
            </span>
            <h4 className="text-lg font-black uppercase">
              {isMyTurn ? (
                <span className="text-game-neonCyan neon-text-cyan flex items-center justify-center gap-2 animate-pulse">
                  🌟 ĐẾN LƯỢT CỦA BẠN! 🌟
                </span>
              ) : (
                <span className="text-white/60">
                  Lượt của: {activeTeam?.name}
                </span>
              )}
            </h4>
          </div>

          {/* VIEW CONTROLLERS BY PHASE */}
          <div className="flex-1 flex flex-col justify-center py-4">

            {/* LOBBY PHASE */}
            {syncedState.gamePhase === 'lobby' && (
              <div className="text-center p-6 space-y-4 my-auto">
                <div className="w-14 h-14 bg-game-neonPurple/10 border border-game-neonPurple/30 rounded-xl flex items-center justify-center mx-auto animate-pulse-slow">
                  <Users className="w-6 h-6 text-game-neonPurple" />
                </div>
                <h4 className="font-extrabold text-white uppercase tracking-wider">Đã Tham Gia Phòng!</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Hãy quan sát máy chiếu. Trận đấu sẽ lập tức bắt đầu khi Host (Giáo viên) click nút kích hoạt.
                </p>
              </div>
            )}

            {/* BOARD PHASE */}
            {syncedState.gamePhase === 'board' && (
              <div className="space-y-4 w-full">
                {isMyTurn ? (
                  <div className="space-y-3">
                    <div className="text-center space-y-1">
                      <span className="text-sm text-game-neonCyan font-black uppercase tracking-widest block">Hãy Chọn Câu Hỏi</span>
                      <p className="text-xs text-white/50">Chạm vào một chữ cái chưa khóa trên điện thoại để mở câu hỏi!</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5">
                      {letters.map((letter, idx) => {
                        const isUsed = syncedState.unlockedQuestions[idx];
                        return (
                          <button
                            key={idx}
                            disabled={isUsed}
                            onClick={() => sendAction('SELECT_QUESTION', idx + 1)}
                            className={`aspect-square rounded-xl flex items-center justify-center font-extrabold text-2xl border transition-all ${
                              isUsed
                                ? 'bg-black/50 border-white/5 text-white/10 cursor-not-allowed'
                                : 'bg-game-neonCyan/10 border-game-neonCyan/40 text-white active:scale-95 active:bg-game-neonCyan active:text-black hover:border-game-neonCyan'
                            }`}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <Shield className="w-10 h-10 text-white/20 mx-auto animate-pulse-slow" />
                    <h5 className="text-xs font-bold text-white/60 uppercase">Đang chờ đối thủ...</h5>
                    <p className="text-[10px] text-white/40 max-w-xs mx-auto">
                      {activeTeam?.name} đang lựa chọn câu hỏi trên máy chiếu. Hãy chuẩn bị tinh thần thảo luận!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* QUESTION PHASE */}
            {syncedState.gamePhase === 'question' && (
              <div className="space-y-4 w-full animate-fade-in">
                {isMyTurn ? (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="text-center space-y-1.5">
                      <span className="text-xs text-game-neonCyan font-bold uppercase tracking-wider block">
                        Đến Lượt Nhóm Bạn Trả Lời
                      </span>
                      <h4 className="text-xl font-black uppercase text-white tracking-wide leading-none">
                        Câu Hỏi Ô {syncedState.activeQuestion?.letter}
                      </h4>
                    </div>

                    {/* Timer Bar */}
                    {syncedState.questionStatus === 'answering' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/40 font-mono">Đồng hồ đếm ngược</span>
                          <span className={`font-mono font-bold flex items-center gap-1.5 ${
                            syncedState.timeLeft <= 5 ? 'text-game-neonRed animate-pulse' : 'text-game-neonCyan'
                          }`}>
                            <Clock className="w-3.5 h-3.5" /> {syncedState.timeLeft} Giây
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              syncedState.timeLeft <= 5 ? 'bg-game-neonRed' :
                              syncedState.timeLeft <= 12 ? 'bg-game-neonGold' :
                              'bg-game-neonCyan'
                            }`}
                            style={{ width: `${(syncedState.timeLeft / (syncedState.discussionTimeLimit || 30)) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Question Card Box */}
                    <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 text-center relative overflow-hidden">
                      <p className="text-sm md:text-base font-black text-white leading-relaxed relative z-10">
                        "{syncedState.activeQuestion?.question}"
                      </p>
                      <div className="absolute top-0 left-0 w-12 h-12 bg-game-neonCyan/5 rounded-full blur-xl -translate-x-4 -translate-y-4" />
                    </div>

                    {/* Options Grid */}
                    {syncedState.questionStatus === 'answering' ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {syncedState.activeQuestion?.options.map((option: string, idx: number) => {
                          const letterPrefix = ["A", "B", "C", "D"][idx];
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => sendAction('SUBMIT_ANSWER', idx)}
                              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 active:border-game-neonPurple active:bg-game-neonPurple/20 text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer"
                            >
                              <span className="w-8 h-8 rounded-lg bg-white/10 text-white/70 group-active:bg-game-neonPurple group-active:text-black flex items-center justify-center text-sm font-black shrink-0">
                                {letterPrefix}
                              </span>
                              <span className="text-sm font-extrabold text-white/95 leading-relaxed">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center p-5 bg-white/5 border border-white/5 rounded-2xl animate-pulse">
                          <span className="text-sm font-black uppercase text-game-neonGold">Đã nộp đáp án!</span>
                          <p className="text-xs text-white/40 mt-1">
                            Xem màn hình Host để xác nhận kết quả chính xác & ý nghĩa lịch sử!
                          </p>
                        </div>

                        {/* If status is correct/incorrect/timeUp, show the correct styling & explanation */}
                        {(syncedState.questionStatus === 'correct' || 
                          syncedState.questionStatus === 'incorrect' || 
                          syncedState.questionStatus === 'timeUp') && (
                          <div className={`p-4 md:p-5 rounded-2xl border animate-fade-in ${
                            syncedState.questionStatus === 'correct'
                              ? 'bg-game-neonGreen/10 border-game-neonGreen/25 text-game-neonGreen font-bold'
                              : 'bg-game-neonRed/10 border-game-neonRed/25 text-game-neonRed font-bold'
                          }`}>
                            <h5 className="text-sm font-black uppercase tracking-wider mb-1.5">
                              {syncedState.questionStatus === 'correct' ? '✔️ TRẢ LỜI ĐÚNG!' : '❌ TRẢ LỜI CHƯA ĐÚNG!'}
                            </h5>
                            <p className="text-xs text-white/90 leading-relaxed font-normal">
                              <strong>Ý nghĩa lịch sử:</strong> {syncedState.activeQuestion?.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // Other teams' view during active question
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="text-center space-y-1.5">
                      <span className="text-xs text-white/40 font-bold uppercase tracking-wider block">
                        Đang Trong Lượt Của Đội Khác
                      </span>
                      <h4 className="text-base font-extrabold uppercase text-white/60 tracking-wide leading-none">
                        Câu Hỏi Ô {syncedState.activeQuestion?.letter}
                      </h4>
                    </div>

                    {/* Question Card Box for Spectators */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center relative overflow-hidden opacity-80">
                      <p className="text-sm font-bold text-white/70 leading-relaxed">
                        "{syncedState.activeQuestion?.question}"
                      </p>
                    </div>

                    <div className="text-center py-6 space-y-3">
                      <Clock className="w-10 h-10 text-white/20 mx-auto animate-spin" style={{ animationDuration: '12s' }} />
                      <h5 className="text-xs font-bold text-white/60 uppercase">Đang đấu trí...</h5>
                      <p className="text-[10px] text-white/40 max-w-xs mx-auto">
                        Đội {activeTeam?.name} đang thảo luận trả lời. Cùng quan sát và suy nghĩ xem phương án nào là đúng!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FLIPPING PHASE (Vòng Nhân Phẩm) */}
            {syncedState.gamePhase === 'flipping' && (
              <div className="space-y-6 w-full animate-fade-in">
                {isMyTurn ? (
                  <div className="space-y-6">
                    {/* Header bar with Temporary score and Secure button */}
                    <div className="glass-panel p-5 rounded-2xl border-game-neonGreen/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(57,255,20,0.05)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-game-neonGreen/10 border border-game-neonGreen flex items-center justify-center animate-pulse-slow">
                          <Coins className="w-5 h-5 text-game-neonGreen neon-text-green" />
                        </div>
                        <div>
                          <span className="text-[10px] text-game-neonGreen tracking-widest font-bold uppercase block">Đấu Trường Nhân Phẩm</span>
                          <h2 className="text-base font-extrabold text-white tracking-wide">
                            Lượt Lật Của Nhóm Bạn
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                        {/* Temporary Score Badge */}
                        <div className="bg-game-neonGreen/10 border border-game-neonGreen/30 px-4 py-2 rounded-xl text-center">
                          <span className="text-[9px] text-game-neonGreen font-bold uppercase block tracking-wider leading-none mb-1">Tạm Thời</span>
                          <span className="text-xl font-black text-game-neonGreen neon-text-green">
                            +{syncedState.temporaryScore}đ
                          </span>
                        </div>

                        {/* Secure score action button */}
                        <button
                          disabled={syncedState.blockFlipInput || syncedState.temporaryScore === 0}
                          onClick={() => sendAction('SECURE_SCORE')}
                          className={`px-5 py-3 rounded-xl font-extrabold uppercase tracking-wider text-xs transition-all duration-300 flex items-center gap-1.5 shadow-lg ${
                            syncedState.temporaryScore > 0 && !syncedState.blockFlipInput
                              ? 'bg-game-neonGold hover:bg-yellow-500 text-black cursor-pointer hover:shadow-[0_0_15px_rgba(255,184,0,0.3)]'
                              : 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed'
                          }`}
                        >
                          <Trophy className="w-3.5 h-3.5" /> Bảo Toàn Điểm
                        </button>
                      </div>
                    </div>

                    {/* Side-by-Side Arena Splits Layout (Shifted to left, details on right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left Column: 12-Card Grid (lg:col-span-7) */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                            <span className="text-xs text-game-neonPurple tracking-wider font-extrabold uppercase block">
                              Bản đồ nhân phẩm (12 lá bài)
                            </span>
                            <span className="text-[10px] text-white/40 font-mono">
                              Chạm lá bài để lật!
                            </span>
                          </div>

                          {!syncedState.showSwapModal && !syncedState.showRareModal && (
                            <div className="grid grid-cols-4 gap-4">
                              {syncedState.cardsDeck.map((card: Card, idx: number) => (
                                <div key={card.id} className="h-28 sm:h-36 md:h-40 lg:h-44 aspect-[2/3] max-h-[15vh] md:max-h-[17vh] mx-auto perspective-1000 relative">
                                  <div
                                    className={`w-full h-full duration-500 preserve-3d relative cursor-pointer ${
                                      card.isRevealed ? 'rotate-y-180' : ''
                                    }`}
                                    onClick={() => {
                                      if (!card.isRevealed && !syncedState.blockFlipInput) {
                                        sendAction('FLIP_CARD', idx);
                                      }
                                    }}
                                  >
                                    {/* Card BACK */}
                                    <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                                      syncedState.blockFlipInput
                                        ? 'bg-game-cardBack border-white/5 cursor-not-allowed opacity-60'
                                        : 'bg-game-cardBack border-game-neonPurple/25 hover:border-game-neonPurple hover:bg-game-cardBackHover shadow-[0_0_10px_rgba(189,0,255,0.05)] hover:shadow-[0_0_15px_rgba(189,0,255,0.2)]'
                                    }`}>
                                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2.5">
                                        <Shield className="w-5 h-5 text-game-neonPurple/50" />
                                      </div>
                                      <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Mặt Sau</span>
                                      <span className="text-[11px] text-game-neonCyan font-mono font-bold tracking-wider mt-1">#{(card.id + 1).toString().padStart(2, '0')}</span>
                                    </div>

                                    {/* Card FRONT */}
                                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-white/20">
                                      <img
                                        src={getCardImage(card.type)}
                                        alt={card.name}
                                        className="absolute inset-0 w-full h-full object-fill bg-[#0a0d1a]"
                                        draggable={false}
                                      />
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
                          )}

                          {/* Swap points overlay context inside left grid if active */}
                          {syncedState.showSwapModal && (
                            <div className="glass-panel p-6 rounded-2xl border-game-neonCyan/40 text-center space-y-4 animate-fade-in max-w-md mx-auto my-6 shadow-[0_0_30px_rgba(0,240,255,0.2)] bg-[#0c0f1d]">
                              <RefreshCw className="w-8 h-8 text-game-neonCyan animate-spin mx-auto" />
                              <div className="space-y-1">
                                <h5 className="text-sm font-black text-game-neonCyan uppercase tracking-wider">Tráo đổi điểm số</h5>
                                <p className="text-xs text-white/50">Hãy lựa chọn 1 đội đối thủ dưới đây để hoán đổi điểm!</p>
                              </div>
                              <div className="space-y-2">
                                {syncedState.teams.map((t: Team) => {
                                  if (t.id === teamSlot) return null;
                                  return (
                                    <button
                                      key={t.id}
                                      onClick={() => sendAction('SWAP_SCORES', t.id)}
                                      className="w-full p-3 bg-white/5 border border-white/10 hover:border-game-neonCyan rounded-xl text-xs font-bold text-white flex justify-between items-center transition-all duration-300"
                                    >
                                      <span>{t.name}</span>
                                      <span className="text-game-neonGold">{t.score}đ</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Rare card overlay context inside left grid if active */}
                          {syncedState.showRareModal && (
                            <div className="glass-panel p-6 rounded-2xl border-yellow-400 text-center space-y-4 animate-fade-in max-w-md mx-auto my-6 shadow-[0_0_35px_rgba(255,215,0,0.3)] bg-[#0c0f1d]">
                              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce mx-auto" />
                              <div className="space-y-1">
                                <h5 className="text-sm font-black text-yellow-400 uppercase tracking-wider">Cơ Hội Đoàn Kết (Rare)</h5>
                                <p className="text-xs text-white/60">An toàn nhận ngay +5đ hay dấn thân mạo hiểm?</p>
                              </div>
                              <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                  onClick={() => sendAction('CHOOSE_RARE_SAFE')}
                                  className="p-3 rounded-xl bg-game-neonGreen/10 border border-game-neonGreen/30 text-game-neonGreen text-xs font-bold uppercase transition hover:bg-game-neonGreen/20"
                                >
                                  An Toàn (+5đ)
                                </button>
                                <button
                                  onClick={() => sendAction('CHOOSE_RARE_RISK')}
                                  className="p-3 rounded-xl bg-game-neonPurple/10 border border-game-neonPurple/30 text-game-neonPurple text-xs font-bold uppercase transition hover:bg-game-neonPurple/20"
                                >
                                  Mạo Hiểm (Risk)
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Right Column: Active Card Detail Panel (lg:col-span-5) */}
                      <div className="lg:col-span-5 w-full">
                        {syncedState.activeFlippedCard ? (() => {
                          const details = getCardImpactDetails(syncedState.activeFlippedCard);
                          return (
                            <div className={`glass-panel p-5 rounded-3xl border animate-fade-in transition-all duration-300 bg-gradient-to-br from-[#0c0f1d] to-[#080a14] space-y-4 shadow-xl ${details.colorClass}`}>
                              
                              {/* Visual Section: Large Card image + Score badge */}
                              <div className="flex flex-row items-center justify-center gap-6">
                                {/* Magnified Card Image */}
                                <div className="w-28 sm:w-36 aspect-[2/3] flex-shrink-0 relative rounded-2xl overflow-hidden border-2 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.08)] bg-[#0a0d1a]">
                                  <img
                                    src={getCardImage(syncedState.activeFlippedCard.type)}
                                    alt={syncedState.activeFlippedCard.name}
                                    className="w-full h-full object-fill"
                                    draggable={false}
                                  />
                                  {['nuclear', 'loseAll', 'changePoints', 'rare'].includes(syncedState.activeFlippedCard.type) && (
                                    <div className="absolute inset-x-0 bottom-0 bg-black/90 px-1 py-1 border-t border-white/10 text-center z-10 text-[9px] font-black text-white uppercase tracking-wider">
                                      {syncedState.activeFlippedCard.type === 'rare' ? 'Thẻ Rare' : 'Đặc Biệt'}
                                    </div>
                                  )}
                                </div>

                                {/* Text labels */}
                                <div className="space-y-2">
                                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-white/10 ${details.colorClass} block w-max`}>
                                    {details.badgeText}
                                  </span>
                                  <h3 className={`text-base font-black uppercase leading-tight ${details.colorClass} ${details.glowClass}`}>
                                    {syncedState.activeFlippedCard.name}
                                  </h3>
                                  <div className="text-[10px] text-white/40 uppercase font-mono">
                                    Loại thẻ: {syncedState.activeFlippedCard.type.startsWith('plus') ? 'Cộng điểm' : 'Hiệu ứng đặc biệt'}
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
                                    "{syncedState.activeFlippedCard.academicText}"
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
                                Vui lòng lật một ô thẻ ở **Bản đồ bên trái** để tích lũy điểm số!
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                ) : (
                  /* Spectator mode when not my turn */
                  <div className="text-center py-16 space-y-6 glass-panel rounded-3xl border border-white/10 bg-white/5">
                    <Sparkles className="w-14 h-14 text-white/20 mx-auto animate-bounce" />
                    <div className="space-y-2 max-w-md mx-auto px-4">
                      <h5 className="text-base font-black text-white uppercase tracking-wider">Đang Lật Thẻ Nhân Phẩm</h5>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Nhóm <span className="text-game-neonCyan font-bold">{activeTeam?.name}</span> đang thực hiện lật các lá bài. Hãy quan sát máy chiếu để xem các hiệu ứng nhân phẩm bất ngờ diễn ra!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VICTORY PHASE */}
            {syncedState.gamePhase === 'victory' && (
              <div className="text-center p-6 space-y-4 my-auto">
                <Trophy className="w-14 h-14 text-game-neonGold animate-bounce mx-auto" />
                <h4 className="font-extrabold text-white uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-game-neonGold via-white to-game-neonGold">
                  Trận Đấu Kết Thúc!
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Xem bảng vàng chiến thắng danh giá trên màn hình máy chiếu chính của Host! Cảm ơn các đội đã tham gia đoàn kết cùng nhau.
                </p>
              </div>
            )}

          </div>

          {/* Controller Footer */}
          <div className="text-center">
            <button
              onClick={onLeave}
              className="text-[10px] text-white/20 hover:text-white/40 font-bold uppercase tracking-wider transition underline"
            >
              Thoát tay cầm
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
