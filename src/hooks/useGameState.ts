import { useState, useEffect, useRef } from 'react';
import type { Team, Card, GameLog, GamePhase, QuestionStatus } from '../types';
import { questions } from '../data/questions';
import type { Question } from '../data/questions';
import { sounds } from '../utils/soundEffects';
import { io } from 'socket.io-client';

const CARD_TEMPLATES: Omit<Card, 'id' | 'isRevealed'>[] = [
  {
    type: 'plus1',
    name: 'Một Hành Động Đoàn Kết',
    effectText: '+1 Điểm',
    academicText: 'Lắng nghe, hỗ trợ, tôn trọng nhau tạo dựng khối đoàn kết vững chắc từ những điều nhỏ bé nhất.'
  },
  {
    type: 'plus1',
    name: 'Một Hành Động Đoàn Kết',
    effectText: '+1 Điểm',
    academicText: 'Những hành động nhỏ của mỗi người góp phần xây dựng nền móng đoàn kết cho cả tập thể.'
  },
  {
    type: 'plus2',
    name: 'Gắn Kết Lực Lượng',
    effectText: '+2 Điểm',
    academicText: 'Sự phối hợp đồng bộ giữa các cá nhân, phòng ban giúp nâng sức mạnh tập thể lên gấp bội.'
  },
  {
    type: 'plus2',
    name: 'Gắn Kết Lực Lượng',
    effectText: '+2 Điểm',
    academicText: 'Đoàn kết là sự phối hợp ăn ý của các cá nhân vì sự tiến bộ chung.'
  },
  {
    type: 'plus3',
    name: 'Sức Mạch Nhân Dân',
    effectText: '+3 Điểm',
    academicText: 'Cách mạng là sự nghiệp của quần chúng. Sức mạnh vĩ đại nhất nằm ở lòng dân.'
  },
  {
    type: 'plus3',
    name: 'Sức Mạch Nhân Dân',
    effectText: '+3 Điểm',
    academicText: 'Dựa vào dân, lắng nghe tiếng nói của nhân dân là chìa khóa của mọi thắng lợi.'
  },
  {
    type: 'plus4',
    name: 'Đồng Lòng Vì Mục Tiêu Chung',
    effectText: '+4 Điểm',
    academicText: 'Đại đoàn kết chỉ bền vững khi toàn thể thành viên cùng chung sức hướng về lợi ích tối cao.'
  },
  {
    type: 'plus5',
    name: 'Đại Đoàn Kết Toàn Dân',
    effectText: '+5 Điểm',
    academicText: 'Sức mạnh lớn nhất khi toàn dân tập hợp thành một khối thống nhất dưới sự dẫn dắt đúng đắn.'
  },
  {
    type: 'bomb',
    name: 'Chia Rẽ Nội Bộ',
    effectText: 'Bị nổ! Mất toàn bộ điểm tạm thời lượt này.',
    academicText: 'Sự nghi kỵ, chia rẽ làm suy yếu tập thể. Điều này đi ngược tư tưởng Hồ Chí Minh về đại đoàn kết.'
  },
  {
    type: 'nuclear',
    name: 'Khủng Hoảng Chung',
    effectText: 'Thiên tai dịch bệnh! Trừ 3 điểm tất cả các đối thủ.',
    academicText: 'Gặp biến cố lớn, nếu thiếu đoàn kết thì không chỉ một cá nhân mà cả cộng đồng đều gánh chịu tổn thất.'
  },
  {
    type: 'loseAll',
    name: 'Mất Niềm Tin',
    effectText: 'Trắng tay! Mất toàn bộ điểm chính thức đang có.',
    academicText: 'Niềm tin là xi măng gắn kết lực lượng. Khi mất niềm tin, khối đoàn kết lập tức lung lay và đổ vỡ.'
  },
  {
    type: 'changePoints',
    name: 'Chuyển Hóa Sức Mạnh',
    effectText: 'Đổi điểm chính thức với một nhóm khác.',
    academicText: 'Chiến thuật nhạy bén và tinh thần đoàn kết giúp tập thể lật ngược thế cờ trong hoàn cảnh éo le nhất.'
  },
  {
    type: 'rare',
    name: 'Cơ Hội Đoàn Kết (Rare)',
    effectText: 'Lấy 5 điểm an toàn và dừng, hoặc mạo hiểm lật thẻ đặc biệt!',
    academicText: 'Thách thức bản lĩnh tập thể: Chọn lựa lợi ích an toàn trước mắt hay dấn thân vì mục tiêu đột phá vĩ đại.'
  }
];

const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const useGameState = () => {
  // Game Setup
  const [teams, setTeams] = useState<Team[]>([
    { id: 0, name: 'Nhóm 1', score: 0 },
    { id: 1, name: 'Nhóm 2', score: 0 },
    { id: 2, name: 'Nhóm 3', score: 0 },
    { id: 3, name: 'Nhóm 4', score: 0 }
  ]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState<number>(0);
  const [discussionTimeLimit, setDiscussionTimeLimit] = useState<number>(30); // 30s default
  
  // Game Phases
  const [gamePhase, setGamePhase] = useState<GamePhase>('lobby');
  const [unlockedQuestions, setUnlockedQuestions] = useState<boolean[]>(new Array(12).fill(false));

  // References to keep states fresh across async callbacks (React stale closures bypass)
  const unlockedQuestionsRef = useRef<boolean[]>(unlockedQuestions);
  const teamsRef = useRef<Team[]>(teams);
  const currentTeamIndexRef = useRef<number>(currentTeamIndex);

  useEffect(() => {
    unlockedQuestionsRef.current = unlockedQuestions;
  }, [unlockedQuestions]);

  useEffect(() => {
    teamsRef.current = teams;
  }, [teams]);

  useEffect(() => {
    currentTeamIndexRef.current = currentTeamIndex;
  }, [currentTeamIndex]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  
  // Flipping Cards Phase
  const [temporaryScore, setTemporaryScore] = useState<number>(0);
  const [cardsDeck, setCardsDeck] = useState<Card[]>([]);
  const [activeFlippedCard, setActiveFlippedCard] = useState<Card | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [nuclearAlert, setNuclearAlert] = useState<boolean>(false);

  // Modals / Overlays
  const [showSwapModal, setShowSwapModal] = useState<boolean>(false);
  const [showRareModal, setShowRareModal] = useState<boolean>(false);
  const [rareCardIndex, setRareCardIndex] = useState<number | null>(null);
  const [blockFlipInput, setBlockFlipInput] = useState<boolean>(false);
  
  // Audio Mute State
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Live Logs
  const [gameLogs, setGameLogs] = useState<GameLog[]>([]);

  // Ref for timer
  const timerRef = useRef<any>(null);

  // sound toggle sync
  const toggleMute = () => {
    const nextMute = sounds.toggleMute();
    setIsMuted(nextMute);
  };

  // Add Log helper
  const addLog = (message: string, type: GameLog['type'] = 'info') => {
    const newLog: GameLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
    setGameLogs(prev => [newLog, ...prev].slice(0, 50)); // limit to 50 logs
  };

  // --- ONLINE MULTIPLAYER LAYER ---
  const [isOnlineMode, setIsOnlineMode] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>('');
  const [connectedPlayers, setConnectedPlayers] = useState<{ socketId: string; teamId: number; name: string }[]>([]);
  const socketRef = useRef<any>(null);

  // Generate a random room code once lobby loads
  useEffect(() => {
    const randCode = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomId(randCode);
  }, []);

  // Hiện modal Rare Card sau animation lật thẻ (600ms).
  // Cleanup tự huỷ timer nếu rareCardIndex bị reset (nextTurn) trước khi modal kịp mở.
  useEffect(() => {
    if (rareCardIndex === null) return;
    const timer = setTimeout(() => setShowRareModal(true), 600);
    return () => clearTimeout(timer);
  }, [rareCardIndex]);

  // WebSockets Connection Effect (Only runs when online status or roomId changes)
  useEffect(() => {
    if (!isOnlineMode || !roomId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Dynamically connect to the backend socket server (always port 3000 in local dev environment)
    const serverUrl = window.location.port 
      ? `${window.location.protocol}//${window.location.hostname}:3000` 
      : window.location.origin;

    console.log('Connecting Host to Socket Server:', serverUrl);
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.emit('host-create-room', roomId);
    addLog(`Đang thiết lập phòng Online [${roomId}]...`, 'warning');

    // Listener for connected team slot
    socket.on('player-connected', (player) => {
      setConnectedPlayers(prev => {
        const filtered = prev.filter(p => p.teamId !== player.teamId);
        return [...filtered, player];
      });

      // Dynamically override team names in scoreboard state
      setTeams(prev => prev.map((t, idx) => idx === player.teamId ? { ...t, name: player.name } : t));
      addLog(`Nhóm "${player.name}" đã tham gia phòng chơi ở vị trí Đội ${player.teamId + 1}!`, 'success');
      sounds.playCorrect();
    });

    socket.on('player-disconnected', (player) => {
      setConnectedPlayers(prev => prev.filter(p => p.socketId !== player.socketId));
      addLog(`Nhóm "${player.name}" đã ngắt kết nối!`, 'danger');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOnlineMode, roomId]);

  // WebSockets Event Listener Effect (Re-binds listener with fresh state closure)
  useEffect(() => {
    if (!isOnlineMode || !socketRef.current) return;

    const socket = socketRef.current;

    // Remove old listener if exists to prevent duplicate triggers
    socket.off('host-receive-action');

    // Register new listener with access to all fresh state variables!
    socket.on('host-receive-action', (data: { action: any }) => {
      const { action } = data;
      console.log('Received Action from Phone Client (Fresh Closure):', action);
      handlePlayerAction(action);
    });

    return () => {
      socket.off('host-receive-action');
    };
  }, [
    isOnlineMode,
    teams,
    currentTeamIndex,
    gamePhase,
    unlockedQuestions,
    activeQuestion,
    questionStatus,
    timeLeft,
    temporaryScore,
    cardsDeck,
    activeFlippedCard,
    showSwapModal,
    showRareModal,
    blockFlipInput
  ]);

  // Host state broadcast effect - synced to players' mobile gamepads
  useEffect(() => {
    if (isOnlineMode && socketRef.current) {
      const gameState = {
        teams,
        currentTeamIndex,
        gamePhase,
        unlockedQuestions,
        activeQuestion,
        questionStatus,
        timeLeft,
        temporaryScore,
        cardsDeck,
        activeFlippedCard,
        showSwapModal,
        showRareModal,
        blockFlipInput
      };
      socketRef.current.emit('host-broadcast-state', { roomId, gameState });
    }
  }, [
    teams,
    currentTeamIndex,
    gamePhase,
    unlockedQuestions,
    activeQuestion,
    questionStatus,
    timeLeft,
    temporaryScore,
    cardsDeck,
    activeFlippedCard,
    showSwapModal,
    showRareModal,
    blockFlipInput,
    isOnlineMode,
    roomId
  ]);

  // Command parser translating Websocket relays into local updates
  const handlePlayerAction = (action: { type: string; payload?: any }) => {
    switch (action.type) {
      case 'SELECT_QUESTION':
        selectQuestion(action.payload);
        break;
      case 'SUBMIT_ANSWER':
        if (activeQuestion) {
          const isCorrect = action.payload === activeQuestion.answerIndex;
          submitAnswer(isCorrect);
        }
        break;
      case 'FLIP_CARD':
        flipCard(action.payload);
        break;
      case 'SECURE_SCORE':
        stopAndSecure();
        break;
      case 'SWAP_SCORES':
        swapScores(action.payload);
        break;
      case 'CHOOSE_RARE_SAFE':
        chooseSafeRare();
        break;
      case 'CHOOSE_RARE_RISK':
        chooseRiskRare();
        break;
    }
  };

  // Setup discussion countdown
  useEffect(() => {
    if (gamePhase === 'question' && questionStatus === 'answering') {
      if (timeLeft > 0) {
        timerRef.current = setTimeout(() => {
          setTimeLeft(prev => prev - 1);
          sounds.playTick();
        }, 1000);
      } else {
        // Time is up!
        setQuestionStatus('timeUp');
        sounds.playIncorrect();
        addLog(`Hết giờ trả lời! Lượt của ${teams[currentTeamIndex].name} kết thúc.`, 'danger');
        
        // Lock question and switch turn after 3 seconds
        setTimeout(() => {
          if (activeQuestion) {
            const nextUnlocked = [...unlockedQuestions];
            nextUnlocked[activeQuestion.id - 1] = true;
            setUnlockedQuestions(nextUnlocked);
          }
          nextTurn();
        }, 3000);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gamePhase, questionStatus, timeLeft]);

  // Start the Game
  const startGame = (customNames: string[], timeLimit: number) => {
    // If offline mode, set the custom names from inputs. If online, keep connected team names
    if (!isOnlineMode) {
      setTeams(prev => prev.map((t, idx) => ({ ...t, name: customNames[idx] || `Nhóm ${idx + 1}`, score: 0 })));
    }
    setDiscussionTimeLimit(timeLimit);
    setUnlockedQuestions(new Array(12).fill(false));
    setCurrentTeamIndex(0);
    setGamePhase('board');
    setGameLogs([]);
    addLog("--- Trò chơi bắt đầu! Chúc các đội may mắn ---", "special");
    addLog(`Lượt chơi đầu tiên thuộc về: ${teams[0].name}`, "info");
  };

  // Select a Question card
  const selectQuestion = (qId: number) => {
    if (unlockedQuestions[qId - 1]) return; // already answered
    sounds.playClick();
    const q = questions.find(item => item.id === qId);
    if (!q) return;

    setActiveQuestion(q);
    setQuestionStatus('answering');
    setTimeLeft(discussionTimeLimit);
    setGamePhase('question');
    addLog(`${teams[currentTeamIndex].name} đã chọn câu hỏi số ${q.letter}.`, 'info');
  };

  // Submit Answer
  const submitAnswer = (isCorrect: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isCorrect) {
      setQuestionStatus('correct');
      sounds.playCorrect();
      addLog(`Chính xác! ${teams[currentTeamIndex].name} xuất sắc trả lời đúng câu hỏi số ${activeQuestion?.letter}.`, 'success');
      
      // Lock the question immediately
      if (activeQuestion) {
        const nextUnlocked = [...unlockedQuestions];
        nextUnlocked[activeQuestion.id - 1] = true;
        setUnlockedQuestions(nextUnlocked);
      }

      // Transition to flipping cards phase after 2.5 seconds
      setTimeout(() => {
        setupFlippingPhase();
      }, 2500);

    } else {
      setQuestionStatus('incorrect');
      sounds.playIncorrect();
      addLog(`Sai rồi! ${teams[currentTeamIndex].name} trả lời chưa chính xác câu hỏi số ${activeQuestion?.letter}.`, 'danger');

      // Lock the question
      if (activeQuestion) {
        const nextUnlocked = [...unlockedQuestions];
        nextUnlocked[activeQuestion.id - 1] = true;
        setUnlockedQuestions(nextUnlocked);
      }

      // Transition back to board & next turn after 3 seconds
      setTimeout(() => {
        nextTurn();
      }, 3000);
    }
  };

  // Setup Cards Deck for Flipping Room
  const setupFlippingPhase = () => {
    setTemporaryScore(0);
    setActiveFlippedCard(null);
    setBlockFlipInput(false);
    setShowRareModal(false);
    setRareCardIndex(null);

    // We want the Rare card to have less chance of appearing in the deck of 12 cards.
    // Instead of shuffling the entire pool (which gives it a 12/13 ~ 92.3% chance),
    // we explicitly control its spawn rate (e.g. 25% chance).
    const RARE_CARD_CHANCE = 0.25; 
    const includeRare = Math.random() < RARE_CARD_CHANCE;

    const rareTemplate = CARD_TEMPLATES.find(tmpl => tmpl.type === 'rare')!;
    const otherTemplates = CARD_TEMPLATES.filter(tmpl => tmpl.type !== 'rare');

    let deckTemplates: Omit<Card, 'id' | 'isRevealed'>[] = [];
    if (includeRare) {
      // Pick 11 non-rare cards and add the rare card, then shuffle
      const slicedOthers = shuffle(otherTemplates).slice(0, 11);
      deckTemplates = shuffle([...slicedOthers, rareTemplate]);
    } else {
      // Pick 12 non-rare cards (all of them) and shuffle
      deckTemplates = shuffle(otherTemplates).slice(0, 12);
    }

    const generatedDeck: Card[] = deckTemplates.map((tmpl, idx) => ({
      ...tmpl,
      id: idx,
      isRevealed: false
    }));

    setCardsDeck(generatedDeck);
    setGamePhase('flipping');
    addLog(`${teams[currentTeamIndex].name} bắt đầu lật thẻ nhân phẩm tích lũy điểm!`, 'special');
  };

  // Flip Card Action
  const flipCard = (cardIdx: number) => {
    if (blockFlipInput || cardsDeck[cardIdx].isRevealed) return;
    sounds.playCardFlip();
    
    // Lock controls to prevent spamming
    setBlockFlipInput(true);

    const targetCard = cardsDeck[cardIdx];
    const nextDeck = [...cardsDeck];
    nextDeck[cardIdx] = { ...targetCard, isRevealed: true };
    setCardsDeck(nextDeck);
    setActiveFlippedCard(nextDeck[cardIdx]);

    const activeTeam = teams[currentTeamIndex];

    // Process specific card effects
    switch (targetCard.type) {
      case 'plus1':
        setTemporaryScore(prev => prev + 1);
        addLog(`+1 Điểm tạm thời từ thẻ "${targetCard.name}"`, 'success');
        sounds.playCorrect();
        setBlockFlipInput(false);
        break;
      case 'plus2':
        setTemporaryScore(prev => prev + 2);
        addLog(`+2 Điểm tạm thời từ thẻ "${targetCard.name}"`, 'success');
        sounds.playCorrect();
        setBlockFlipInput(false);
        break;
      case 'plus3':
        setTemporaryScore(prev => prev + 3);
        addLog(`+3 Điểm tạm thời từ thẻ "${targetCard.name}"`, 'success');
        sounds.playCorrect();
        setBlockFlipInput(false);
        break;
      case 'plus4':
        setTemporaryScore(prev => prev + 4);
        addLog(`+4 Điểm tạm thời từ thẻ "${targetCard.name}"`, 'success');
        sounds.playCorrect();
        setBlockFlipInput(false);
        break;
      case 'plus5':
        setTemporaryScore(prev => prev + 5);
        addLog(`+5 Điểm tạm thời từ thẻ "${targetCard.name}" (Tuyệt vời!)`, 'success');
        sounds.playCorrect();
        setBlockFlipInput(false);
        break;

      case 'bomb':
        // Reset turn points to 0
        setTemporaryScore(0);
        setScreenShake(true);
        sounds.playBomb();
        addLog(`BÙM!!! Gặp thẻ "${targetCard.name}". Mất sạch điểm tích lũy lượt này!`, 'danger');
        
        // Wait 4 seconds to view the bomb card detail, then end turn
        setTimeout(() => {
          setScreenShake(false);
          nextTurn();
        }, 4500);
        break;

      case 'loseAll':
        // Lose all total score & temporary score!
        setTemporaryScore(0);
        setTeams(prev => prev.map((t, idx) => idx === currentTeamIndex ? { ...t, score: 0 } : t));
        sounds.playIncorrect();
        addLog(`Ồ KHÔNG!!! Gặp thẻ "${targetCard.name}". Trắng tay! Mất toàn bộ điểm số tích lũy từ đầu game!`, 'danger');

        // Wait 4.5 seconds to read, then end turn
        setTimeout(() => {
          nextTurn();
        }, 4500);
        break;

      case 'nuclear':
        // All opponents lose 3 points
        setNuclearAlert(true);
        sounds.playNuclear();
        setTeams(prev => prev.map((t, idx) => idx !== currentTeamIndex ? { ...t, score: Math.max(0, t.score - 3) } : t));
        addLog(`KHỦNG HOẢNG CHUNG!!! ${activeTeam.name} kích hoạt trừ 3 điểm tất cả các nhóm đối thủ!`, 'warning');

        setTimeout(() => {
          setNuclearAlert(false);
          setBlockFlipInput(false);
        }, 2000);
        break;

      case 'changePoints':
        // Opens team list swap dialog
        sounds.playCorrect();
        addLog(`${activeTeam.name} nhận thẻ tráo điểm! Đang chuẩn bị chuyển hóa sức mạnh.`, 'warning');
        setTimeout(() => {
          setShowSwapModal(true);
        }, 800);
        break;

      case 'rare':
        sounds.playCorrect();
        addLog(`${activeTeam.name} đứng trước Cơ hội đoàn kết (Rare Card)! Đang đưa ra quyết định.`, 'warning');
        setRareCardIndex(cardIdx); // useEffect sẽ bật modal sau animation
        break;
    }
  };

  // Action swap scores
  const swapScores = (targetTeamId: number) => {
    const activeTeam = teams[currentTeamIndex];
    const targetTeam = teams[targetTeamId];

    setTeams(prev => prev.map(t => {
      if (t.id === activeTeam.id) return { ...t, score: targetTeam.score };
      if (t.id === targetTeam.id) return { ...t, score: activeTeam.score };
      return t;
    }));

    addLog(`Đổi điểm thành công! ${activeTeam.name} tráo điểm với ${targetTeam.name} (Điểm cũ: ${activeTeam.score} vs ${targetTeam.score})`, 'special');
    sounds.playVictory();
    setShowSwapModal(false);
    setTimeout(() => {
      nextTurn();
    }, 2500);
  };

  // Safe choice rare card (+5 safe points and ends turn)
  const chooseSafeRare = () => {
    if (!showRareModal) return;
    setShowRareModal(false);
    const finalScore = temporaryScore + 5;
    
    setTeams(prev => prev.map((t, idx) => idx === currentTeamIndex ? { ...t, score: t.score + finalScore } : t));
    addLog(`${teams[currentTeamIndex].name} chọn AN TOÀN! Nhận ngay 5 điểm thưởng và cộng ${finalScore} điểm vào quỹ chính thức.`, 'success');
    sounds.playVictory();

    setTimeout(() => {
      nextTurn();
    }, 2500);
  };

  // Risk choice rare card
  const chooseRiskRare = () => {
    if (!showRareModal || rareCardIndex === null) return;
    setShowRareModal(false);
    const gambleChance = Math.random() < 0.5; // 50-50 swap or loseAll

    const updatedDeck = [...cardsDeck];
    const activeIndex = rareCardIndex!;

    if (gambleChance) {
      // 50% Swap points
      updatedDeck[activeIndex] = {
        ...updatedDeck[activeIndex],
        name: 'Chuyển Hóa Sức Mạnh (Mạo hiểm)',
        type: 'changePoints',
        effectText: 'Đổi điểm chính thức với một nhóm khác!',
        academicText: 'Dấn thân mạo hiểm đem đến cơ hội tráo đổi vận mệnh cho tập thể!'
      };
      setCardsDeck(updatedDeck);
      setActiveFlippedCard(updatedDeck[activeIndex]);
      addLog(`Kỳ tích mạo hiểm! ${teams[currentTeamIndex].name} nhận hiệu ứng: "Chuyển hóa sức mạnh".`, 'success');
      
      setTimeout(() => {
        setShowSwapModal(true);
      }, 1500);

    } else {
      // 50% Lose all points
      updatedDeck[activeIndex] = {
        ...updatedDeck[activeIndex],
        name: 'Mất Niềm Tin (Mạo hiểm)',
        type: 'loseAll',
        effectText: 'Mất toàn bộ điểm số chính thức đang có!',
        academicText: 'Niềm tin lung lay do những hành vi mạo hiểm thiếu tính toán dẫn tới đổ vỡ.'
      };
      setCardsDeck(updatedDeck);
      setActiveFlippedCard(updatedDeck[activeIndex]);
      addLog(`Không may rồi! ${teams[currentTeamIndex].name} lật trúng hiệu ứng: "Mất niềm tin". Mất sạch điểm!`, 'danger');
      sounds.playIncorrect();

      // Wipe current and permanent points
      setTemporaryScore(0);
      setTeams(prev => prev.map((t, idx) => idx === currentTeamIndex ? { ...t, score: 0 } : t));

      setTimeout(() => {
        nextTurn();
      }, 4500);
    }
  };

  // Stop & Save points
  const stopAndSecure = () => {
    if (blockFlipInput) return;
    sounds.playVictory();
    
    setTeams(prev => prev.map((t, idx) => idx === currentTeamIndex ? { ...t, score: t.score + temporaryScore } : t));
    addLog(`${teams[currentTeamIndex].name} đã chọn dừng lại an toàn! Bảo toàn cộng thêm +${temporaryScore} điểm chính thức.`, 'success');

    nextTurn();
  };

  // Move to next team turn
  const nextTurn = () => {
    setActiveQuestion(null);
    setQuestionStatus('idle');
    setTemporaryScore(0);
    setActiveFlippedCard(null);
    setShowSwapModal(false);
    setShowRareModal(false);
    setRareCardIndex(null);
    setBlockFlipInput(false);

    // Check if game is over (all 12 questions unlocked)
    const allAnswered = unlockedQuestionsRef.current.every(q => q === true);
    // Or if one team reached high points? Let's check when all 12 questions are solved
    if (allAnswered) {
      setGamePhase('victory');
      sounds.playVictory();
      addLog("--- TRÒ CHƠI KẾT THÚC! BẢNG VÀNG DANH DỰ ---", "special");
      
      // Find the winner using fresh ref values
      const currentTeamsFresh = teamsRef.current;
      const maxScore = Math.max(...currentTeamsFresh.map(t => t.score));
      const teamsWithMaxScore = currentTeamsFresh.filter(t => t.score === maxScore);
      const hasUniqueWinner = teamsWithMaxScore.length === 1 && maxScore > 0;

      if (hasUniqueWinner) {
        addLog(`CHÚC MỪNG CHIẾN THẮNG: ${teamsWithMaxScore[0].name} với tổng ${maxScore} điểm!`, "success");
      } else {
        addLog(`TRẬN ĐẤU HÒA CHUNG CUỘC! Các đội có điểm số cao nhất là ${maxScore} điểm.`, "special");
      }
      return;
    }

    // Otherwise, shift to next team
    setCurrentTeamIndex(prev => {
      const nextIdx = (prev + 1) % 4;
      const currentTeamsFresh = teamsRef.current;
      addLog(`Lượt chơi tiếp theo thuộc về: ${currentTeamsFresh[nextIdx]?.name || `Nhóm ${nextIdx + 1}`}`, 'info');
      return nextIdx;
    });

    setGamePhase('board');
  };

  // Reset Game completely
  const resetGame = () => {
    setGamePhase('lobby');
    setTeams(prev => prev.map(t => ({ ...t, score: 0 })));
    setUnlockedQuestions(new Array(12).fill(false));
    setCurrentTeamIndex(0);
    setGameLogs([]);
    setConnectedPlayers([]);
  };

  return {
    teams,
    currentTeamIndex,
    discussionTimeLimit,
    gamePhase,
    unlockedQuestions,
    activeQuestion,
    questionStatus,
    timeLeft,
    temporaryScore,
    cardsDeck,
    activeFlippedCard,
    gameLogs,
    isMuted,
    screenShake,
    nuclearAlert,
    showSwapModal,
    showRareModal,
    blockFlipInput,
    
    // Online-only states
    isOnlineMode,
    setIsOnlineMode,
    roomId,
    connectedPlayers,

    startGame,
    selectQuestion,
    submitAnswer,
    flipCard,
    swapScores,
    chooseSafeRare,
    chooseRiskRare,
    stopAndSecure,
    resetGame,
    toggleMute
  };
};
