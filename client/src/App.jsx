import { useState, useEffect } from 'react';
import geckos from '@geckos.io/client';
import './App.css';
import { LandingView, JoinSetupView, HostSetupView, LobbyView, AnimatedCursor } from './components/UI';
import ReactionGame from './components/ReactionGame';
import Leaderboard from './components/Leaderboard';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:3001`;

function App() {
  const [view, setView] = useState('landing'); // landing | host_setup | join_setup | lobby | reaction_game | leaderboard
  const [roomCode, setRoomCode] = useState(null);
  const [lobbyError, setLobbyError] = useState('');
  const [activePlayers, setActivePlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    let urlObj;
    try { urlObj = new URL(SOCKET_URL); } catch { urlObj = new URL(`http://${window.location.hostname}:3001`); }
    
    const newChannel = geckos({ 
      url: `${urlObj.protocol}//${urlObj.hostname}`, 
      port: urlObj.port ? parseInt(urlObj.port) : (urlObj.protocol === 'https:' ? 443 : 80) 
    });

    newChannel.onConnect((error) => {
      if (error) {
        console.error("Geckos connection error:", error.message);
        return;
      }
      setChannel(newChannel);

      newChannel.on('room_created', (data) => {
        setRoomCode(data.roomCode);
        setIsHost(true);
        setView('lobby');
        setLobbyError('');
      });

      newChannel.on('room_joined', (data) => {
        setRoomCode(data.roomCode);
        setIsHost(false);
        setView('lobby');
        setLobbyError('');
      });

      newChannel.on('room_error', (data) => {
        setLobbyError(data.message);
      });

      newChannel.on('player_list', (players) => {
        setActivePlayers(players);
      });

      newChannel.on('game_started', () => {
        setView('reaction_game');
      });

      newChannel.on('game_over', (data) => {
        setGameResults(data.results);
        setView('leaderboard');
      });
    });

    return () => {
      try {
        if (newChannel) newChannel.close();
      } catch (e) {
        console.warn('Error closing geckos channel on cleanup:', e);
      }
    };
  }, []);

  const handleHost = (teamName, playerName) => {
    if (channel) channel.emit('create_room', { teamName, playerName });
  };

  const handleJoin = (code, playerName) => {
    if (channel) channel.emit('join_room', { roomCode: code, playerName });
  };

  const handleStartGame = () => {
    if (channel) channel.emit('start_game', { roomCode });
  };

  const renderView = () => {
    if (view === 'landing') return <LandingView onHost={() => setView('host_setup')} onJoin={() => setView('join_setup')} />;
    if (view === 'host_setup') return <HostSetupView onBack={() => setView('landing')} onEnter={handleHost} error={lobbyError} />;
    if (view === 'join_setup') return <JoinSetupView onBack={() => setView('landing')} onEnter={handleJoin} error={lobbyError} />;
    if (view === 'lobby') return <LobbyView roomCode={roomCode} players={activePlayers} onBack={() => { if(channel) channel.close(); window.location.reload(); }} onStart={isHost ? handleStartGame : undefined} />;
    if (view === 'reaction_game') return <ReactionGame channel={channel} roomCode={roomCode} isHost={isHost} players={activePlayers} />;
    if (view === 'leaderboard') return <Leaderboard results={gameResults} isHost={isHost} onNext={() => { alert('Next game coming soon!'); }} />;
    return null;
  };

  return (
    <>
      <AnimatedCursor />
      {renderView()}
    </>
  );
}

export default App;
