import { useState } from 'react';
import './App.css';
import { LandingView, JoinSetupView, HostSetupView, LobbyView, AnimatedCursor } from './components/UI';

function App() {
  const [view, setView] = useState('landing'); // landing | host_setup | join_setup | lobby
  const [roomCode, setRoomCode] = useState(null);
  const [lobbyError, setLobbyError] = useState('');
  const [activePlayers, setActivePlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);

  const handleHost = (teamName, playerName) => {
    // Dummy host logic for UI display
    setRoomCode('ABCD');
    setIsHost(true);
    setView('lobby');
    setActivePlayers([{ id: 1, name: playerName, isHost: true }]);
  };

  const handleJoin = (code, playerName) => {
    // Dummy join logic for UI display
    setRoomCode(code);
    setIsHost(false);
    setView('lobby');
    setActivePlayers([{ id: 1, name: playerName, isHost: false }]);
  };

  const handleStartGame = () => {
    console.log("Game Start Clicked!");
  };

  const renderLobbyView = () => {
    if (view === 'landing') return <LandingView onHost={() => setView('host_setup')} onJoin={() => setView('join_setup')} />;
    if (view === 'host_setup') return <HostSetupView onBack={() => setView('landing')} onEnter={handleHost} error={lobbyError} />;
    if (view === 'join_setup') return <JoinSetupView onBack={() => setView('landing')} onEnter={handleJoin} error={lobbyError} />;
    if (view === 'lobby') return <LobbyView roomCode={roomCode} players={activePlayers} onBack={() => setView('landing')} onStart={isHost ? handleStartGame : undefined} />;
    return null;
  };

  return (
    <>
      <AnimatedCursor />
      {renderLobbyView()}
    </>
  );
}

export default App;
