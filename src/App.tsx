import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LobbyView } from './components/LobbyView';
import { BoardView } from './components/BoardView';
import { QuestionModal } from './components/QuestionModal';
import { FlippingView } from './components/FlippingView';
import { VictoryView } from './components/VictoryView';
import { PlayerController } from './components/PlayerController';
import { useGameState } from './hooks/useGameState';

export const App: React.FC = () => {
  const {
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
    
    // Online states
    isOnlineMode,
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
  } = useGameState();

  // Route routing based on URL search query parameters (e.g. ?room=1234)
  const [clientRole, setClientRole] = useState<'host' | 'player'>('host');
  const [playerRoomId, setPlayerRoomId] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setClientRole('player');
      setPlayerRoomId(roomParam);
    } else {
      setClientRole('host');
    }
  }, []);

  const handleLeavePlayer = () => {
    // Clear room query param and return to main host screen
    window.history.pushState({}, '', window.location.pathname);
    setClientRole('host');
  };

  const activeTeamName = teams[currentTeamIndex]?.name || `Nhóm ${currentTeamIndex + 1}`;

  // If the user is a player connecting from their phone
  if (clientRole === 'player') {
    return (
      <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#07080d] text-gray-100">
        <Header
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onReset={resetGame}
          showReset={false}
        />
        <main className="flex-1 w-full flex flex-col justify-start py-4 relative z-10">
          <PlayerController initialRoomId={playerRoomId} onLeave={handleLeavePlayer} />
        </main>
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-game-neonPurple/5 rounded-full blur-[80px] pointer-events-none -z-0" />
      </div>
    );
  }

  // Otherwise, render Host Projector view
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden select-none">
      {/* Dynamic Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onReset={resetGame}
        showReset={gamePhase !== 'lobby'}
      />

      {/* Main Game Screen Routing */}
      <main className="flex-1 w-full flex flex-col justify-center py-6">
        {gamePhase === 'lobby' && (
          <LobbyView 
            onStartGame={startGame} 
            isOnlineMode={isOnlineMode}
            roomId={roomId}
            connectedPlayers={connectedPlayers}
          />
        )}

        {gamePhase === 'board' && (
          <BoardView
            teams={teams}
            currentTeamIndex={currentTeamIndex}
            unlockedQuestions={unlockedQuestions}
            onSelectQuestion={selectQuestion}
            gameLogs={gameLogs}
          />
        )}

        {gamePhase === 'question' && activeQuestion && (
          <div className="flex-1 flex items-center justify-center">
            {/* Show background BoardView for visual continuity, but overlaid with QuestionModal */}
            <div className="w-full blur-sm pointer-events-none absolute inset-0 pt-20">
              <BoardView
                teams={teams}
                currentTeamIndex={currentTeamIndex}
                unlockedQuestions={unlockedQuestions}
                onSelectQuestion={() => {}}
                gameLogs={gameLogs}
              />
            </div>
            <QuestionModal
              question={activeQuestion}
              status={questionStatus}
              timeLeft={timeLeft}
              timeLimit={discussionTimeLimit}
              teamName={activeTeamName}
              onSubmitAnswer={submitAnswer}
            />
          </div>
        )}

        {gamePhase === 'flipping' && (
          <FlippingView
            teamName={activeTeamName}
            temporaryScore={temporaryScore}
            cardsDeck={cardsDeck}
            activeFlippedCard={activeFlippedCard}
            teams={teams}
            currentTeamIndex={currentTeamIndex}
            onFlipCard={flipCard}
            onStopAndSecure={stopAndSecure}
            showSwapModal={showSwapModal}
            onSwapScores={swapScores}
            showRareModal={showRareModal}
            onChooseSafeRare={chooseSafeRare}
            onChooseRiskRare={chooseRiskRare}
            blockFlipInput={blockFlipInput}
            screenShake={screenShake}
            nuclearAlert={nuclearAlert}
          />
        )}

        {gamePhase === 'victory' && (
          <VictoryView
            teams={teams}
            onReset={resetGame}
          />
        )}
      </main>

      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-game-neonPurple/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-game-neonCyan/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
};

export default App;
