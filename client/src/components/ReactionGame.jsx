import React, { useState, useEffect, useRef } from 'react';

function ReactionGame({ channel, roomCode, players }) {
  // States: instructions | ready | waiting | clicking | early | result
  const [gameState, setGameState] = useState('instructions'); 
  const [currentRound, setCurrentRound] = useState(1);
  const [reactionTime, setReactionTime] = useState(null);
  
  const [scores, setScores] = useState([]);

  // Timer for measuring exact ms locally
  const startTimeRef = useRef(0);

  const [timeoutId, setTimeoutId] = useState(null);

  // Helper to start the next round
  const startLocalRound = () => {
    setGameState('waiting');
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 4000) + 2000;
    const tid = setTimeout(() => {
      setGameState('clicking');
      startTimeRef.current = Date.now();
    }, delay);
    setTimeoutId(tid);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleClick = () => {
    if (gameState === 'instructions') {
      // Start the first local round
      startLocalRound();
    } else if (gameState === 'waiting') {
      // Clicked too early!
      if (timeoutId) clearTimeout(timeoutId);
      setGameState('early');
      const newScores = [...scores, 1000];
      setScores(newScores);
      
      // Wait a moment then go to next round or finish
      setTimeout(() => {
        if (currentRound < 5) {
          setCurrentRound(prev => prev + 1);
          startLocalRound();
        } else {
          setGameState('result');
          channel.emit('player_finished', { roomCode, scores: newScores });
        }
      }, 1500);
      
    } else if (gameState === 'clicking') {
      // Valid click!
      const endTime = Date.now();
      const timeElapsed = endTime - startTimeRef.current;
      setReactionTime(timeElapsed);
      const newScores = [...scores, timeElapsed];
      setScores(newScores);
      
      // Show result briefly
      setGameState('round_result');
      setTimeout(() => {
        if (currentRound < 5) {
          setCurrentRound(prev => prev + 1);
          startLocalRound();
        } else {
          setGameState('result');
          channel.emit('player_finished', { roomCode, scores: newScores });
        }
      }, 1500);
    }
    // If state is 'result', ignore clicks (wait for server to broadcast game_over)
  };

  // Determine background color based on state (Human Benchmark exact styling)
  let bgColor = '#2b87d1'; // Default Light Blue
  if (gameState === 'waiting' || gameState === 'early') bgColor = '#ce2636'; // Red
  if (gameState === 'clicking') bgColor = '#4bdb6a'; // Green

  return (
    <div 
      onMouseDown={handleClick}
      style={{
        width: '100vw', 
        height: '100vh', 
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      {gameState === 'instructions' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚡</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Reaction Time Test</h1>
          <p style={{ fontSize: '24px', margin: '0 0 30px 0', opacity: 0.9 }}>When the red box turns green, click as quickly as you can.</p>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Click anywhere to start.
          </div>
        </div>
      )}

      {gameState === 'ready' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>⏳</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Waiting...</h1>
          <p style={{ fontSize: '24px', margin: 0, opacity: 0.9 }}>Waiting for other players to click start.</p>
        </div>
      )}

      {gameState === 'waiting' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>...</div>
          <h1 style={{ fontSize: '54px', fontWeight: 'bold', margin: 0 }}>Wait for green</h1>
        </div>
      )}

      {gameState === 'clicking' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>!</div>
          <h1 style={{ fontSize: '54px', fontWeight: 'bold', margin: 0 }}>Click!</h1>
        </div>
      )}

      {gameState === 'early' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>!</div>
          <h1 style={{ fontSize: '54px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Too soon!</h1>
          <p style={{ fontSize: '24px', margin: 0, opacity: 0.9 }}>Wait for the next round.</p>
        </div>
      )}

      {gameState === 'round_result' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>⏱️</div>
          <h1 style={{ fontSize: '54px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{reactionTime} ms</h1>
        </div>
      )}

      {gameState === 'result' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>⏱️</div>
          <h1 style={{ fontSize: '54px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{reactionTime} ms</h1>
          <p style={{ fontSize: '24px', margin: 0, opacity: 0.9 }}>Waiting for other players...</p>
        </div>
      )}

      <div style={{ position: 'absolute', top: 20, left: 20, fontSize: '18px', opacity: 0.8 }}>
        Round {currentRound} of 5
      </div>

      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '20px',
        borderRadius: '12px',
        minWidth: '150px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px' }}>Scores</h3>
        {scores.length === 0 && <div style={{ fontSize: '14px', opacity: 0.7 }}>No rounds yet.</div>}
        {scores.map((s, i) => (
          <div key={i} style={{ fontSize: '16px', margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>Round {i + 1}:</span>
            <span style={{ fontWeight: 'bold', color: s === 1000 ? '#ff6b6b' : 'white' }}>{s === 1000 ? 'Early' : `${s} ms`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReactionGame;
