import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { Users, Shield, Clock, Coins, RefreshCw, Trophy, Sparkles } from 'lucide-react';
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
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-4 py-4 flex flex-col justify-start min-h-[85vh]">
      
      {/* 1. LOBBY LOGIN INTERFACE */}
      {!joined ? (
        <form onSubmit={handleJoin} className="glass-panel p-6 rounded-3xl border-game-neonPurple/30 space-y-5 my-auto shadow-2xl">
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
          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full bg-game-neonGreen animate-pulse`} />
              <div>
                <span className="text-[9px] text-white/40 font-bold block uppercase leading-none">Tên Nhóm Của Bạn</span>
                <span className="text-sm font-extrabold text-game-neonCyan">{teamName}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-white/40 font-bold block uppercase leading-none">Điểm Đang Có</span>
              <span className="text-sm font-black text-game-neonGold">{syncedState.teams[teamSlot!].score}đ</span>
            </div>
          </div>

          {/* TURN STATE NOTIFIER */}
          <div className={`p-4 rounded-2xl border text-center transition-all ${
            isMyTurn 
              ? 'bg-game-neonCyan/15 border-game-neonCyan shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
              : 'bg-white/5 border-white/5'
          }`}>
            <span className="text-[9px] text-white/40 font-semibold tracking-wider uppercase block">
              Trạng thái lượt
            </span>
            <h4 className="text-base font-extrabold uppercase mt-0.5">
              {isMyTurn ? (
                <span className="text-game-neonCyan neon-text-cyan flex items-center justify-center gap-1.5 animate-pulse">
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
                    <div className="text-center">
                      <span className="text-xs text-game-neonCyan font-bold uppercase tracking-wider block">Hãy Chọn Câu Hỏi</span>
                      <p className="text-[10px] text-white/40">Chạm vào một chữ cái chưa khóa trên điện thoại để mở câu hỏi!</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5">
                      {letters.map((letter, idx) => {
                        const isUsed = syncedState.unlockedQuestions[idx];
                        return (
                          <button
                            key={idx}
                            disabled={isUsed}
                            onClick={() => sendAction('SELECT_QUESTION', idx + 1)}
                            className={`aspect-square rounded-xl flex items-center justify-center font-extrabold text-lg border transition-all ${
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
              <div className="space-y-4 w-full">
                {isMyTurn ? (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-xs text-game-neonCyan font-bold uppercase block">Thảo Luận & Trả Lời</span>
                      <p className="text-[10px] text-white/40 leading-snug">
                        Chạm vào phương án A, B, C hoặc D để gửi câu trả lời của nhóm bạn lên màn hình lớn!
                      </p>
                    </div>

                    {syncedState.questionStatus === 'answering' ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {["A", "B", "C", "D"].map((prefix, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => sendAction('SUBMIT_ANSWER', idx)}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 active:border-game-neonPurple active:bg-game-neonPurple/20 text-left font-bold text-sm text-white transition-all flex items-center gap-3"
                          >
                            <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs text-white/60">
                              {prefix}
                            </span>
                            <span>{syncedState.activeQuestion?.options[idx] || `Đáp án ${prefix}`}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-white/5 border border-white/5 rounded-2xl animate-pulse">
                        <span className="text-xs font-bold uppercase text-game-neonGold">Đã nộp đáp án!</span>
                        <p className="text-[10px] text-white/40 mt-1">Hãy xem máy chiếu để kiểm tra kết quả và đọc ý nghĩa lịch sử!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <Clock className="w-10 h-10 text-white/20 mx-auto animate-spin" style={{ animationDuration: '8s' }} />
                    <h5 className="text-xs font-bold text-white/60 uppercase">Đang đấu trí...</h5>
                    <p className="text-[10px] text-white/40 max-w-xs mx-auto">
                      Đội {activeTeam?.name} đang trả lời câu hỏi. Quan sát máy chiếu để biết câu trả lời đúng!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* FLIPPING PHASE (Vòng Nhân Phẩm) */}
            {syncedState.gamePhase === 'flipping' && (
              <div className="space-y-4 w-full">
                {isMyTurn ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-game-neonGreen/5 border border-game-neonGreen/20 p-3 rounded-xl">
                      <span className="text-xs text-game-neonGreen font-bold flex items-center gap-1">
                        <Coins className="w-4 h-4" /> Lượt lật: +{syncedState.temporaryScore}đ tạm thời
                      </span>
                      
                      <button
                        disabled={syncedState.temporaryScore === 0 || syncedState.blockFlipInput}
                        onClick={() => sendAction('SECURE_SCORE')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition ${
                          syncedState.temporaryScore > 0 && !syncedState.blockFlipInput
                            ? 'bg-game-neonGold text-black active:scale-95'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        Bảo Toàn Điểm
                      </button>
                    </div>

                    {/* Flipped Card Popup / HUD in phone client */}
                    {syncedState.activeFlippedCard && (
                      <div className={`p-3 rounded-xl border border-white/10 text-center space-y-1 ${
                        syncedState.activeFlippedCard.type === 'bomb' || syncedState.activeFlippedCard.type === 'loseAll'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-game-neonGreen/10 border-game-neonGreen/20 text-game-neonGreen'
                      }`}>
                        <span className="text-[9px] font-bold block uppercase leading-none opacity-60">Lá bài vừa lật</span>
                        <span className="text-sm font-extrabold block">{syncedState.activeFlippedCard.name} ({syncedState.activeFlippedCard.effectText})</span>
                      </div>
                    )}

                    {/* 12 Cards list to flip */}
                    {!syncedState.showSwapModal && !syncedState.showRareModal && (
                      <div className="grid grid-cols-4 gap-2">
                        {syncedState.cardsDeck.map((card: Card, idx: number) => (
                          <button
                            key={card.id}
                            disabled={card.isRevealed || syncedState.blockFlipInput}
                            onClick={() => sendAction('FLIP_CARD', idx)}
                            className={`aspect-[3/4] rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center transition-all ${
                              card.isRevealed
                                ? 'bg-black/60 border-white/5 text-white/15 cursor-not-allowed'
                                : syncedState.blockFlipInput
                                ? 'bg-game-cardBack border-white/5 cursor-not-allowed opacity-50'
                                : 'bg-game-cardBack border-game-neonPurple/30 text-game-neonPurple active:scale-95 active:bg-game-neonPurple/20'
                            }`}
                          >
                            {card.isRevealed ? "LẬT" : `?`}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Action overlays synced on Mobile gamepad */}
                    {syncedState.showSwapModal && (
                      <div className="glass-panel p-4 rounded-xl border-game-neonCyan/40 text-center space-y-3 animate-fade-in">
                        <RefreshCw className="w-6 h-6 text-game-neonCyan animate-spin mx-auto" />
                        <h5 className="text-xs font-bold text-game-neonCyan uppercase">Chọn đối thủ tráo đổi điểm</h5>
                        <div className="space-y-1.5">
                          {syncedState.teams.map((t: Team) => {
                            if (t.id === teamSlot) return null;
                            return (
                              <button
                                key={t.id}
                                onClick={() => sendAction('SWAP_SCORES', t.id)}
                                className="w-full py-2 bg-white/5 border border-white/10 hover:border-game-neonCyan rounded-lg text-xs font-semibold"
                              >
                                {t.name} ({t.score}đ)
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {syncedState.showRareModal && (
                      <div className="glass-panel p-4 rounded-xl border-yellow-400 text-center space-y-3 animate-fade-in">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce mx-auto" />
                        <h5 className="text-xs font-bold text-yellow-400 uppercase">Cơ hội đoàn kết (Rare Card)</h5>
                        <p className="text-[10px] text-white/50 leading-tight">Bạn chọn an toàn lấy 5đ hay dấn thân mạo hiểm?</p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => sendAction('CHOOSE_RARE_SAFE')}
                            className="py-2.5 rounded-lg bg-game-neonGreen/10 border border-game-neonGreen/30 text-game-neonGreen text-[11px] font-bold"
                          >
                            An Toàn (+5đ)
                          </button>
                          <button
                            onClick={() => sendAction('CHOOSE_RARE_RISK')}
                            className="py-2.5 rounded-lg bg-game-neonPurple/10 border border-game-neonPurple/30 text-game-neonPurple text-[11px] font-bold"
                          >
                            Mạo Hiểm (Risk)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <Sparkles className="w-10 h-10 text-white/20 mx-auto animate-bounce" />
                    <h5 className="text-xs font-bold text-white/60 uppercase">Đang lật thẻ nhân phẩm...</h5>
                    <p className="text-[10px] text-white/40 max-w-xs mx-auto">
                      Đội {activeTeam?.name} đang thử thách lòng quả cảm. Xem máy chiếu để xem họ có bị nổ bom không!
                    </p>
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
