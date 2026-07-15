import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
import { PALETTE } from './UI';

function Leaderboard({ results, isHost, onNext }) {
  if (!results) return null;

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      overflowY: 'auto'
    }}>
      <Trophy size={64} color="#FFD700" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '40px', color: '#00E5FF' }}>
        Final Results
      </h1>

      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {results.map((player, index) => {
          const isWinner = index === 0;
          return (
            <div key={player.id} style={{
              backgroundColor: isWinner ? '#FFD700' : 'rgba(255,255,255,0.05)',
              color: isWinner ? '#000' : '#FFF',
              border: `2px solid ${isWinner ? '#FFD700' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isWinner ? '8px 8px 0px rgba(0,0,0,0.5)' : 'none',
              transform: isWinner ? 'scale(1.05)' : 'none',
              transition: 'all 0.3s ease',
              zIndex: isWinner ? 10 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  opacity: isWinner ? 1 : 0.5
                }}>
                  #{index + 1}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                    {player.name}
                  </h2>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>
                    Scores: {player.scores.map(s => s >= 1000 ? 'Early' : `${Math.round(s)}ms`).join(', ')}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', fontWeight: 'bold' }}>Best</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                  {player.best === 9999 ? 'N/A' : Math.round(player.best)}<span style={{ fontSize: '1rem', opacity: 0.8 }}>ms</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isHost ? (
        <button 
          onClick={onNext}
          style={{
            marginTop: '50px',
            padding: '20px 40px',
            backgroundColor: '#00FF66',
            color: '#000',
            border: '4px solid #000',
            borderRadius: '16px',
            fontSize: '1.5rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '8px 8px 0px #000',
            transition: 'transform 0.1s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'translate(4px, 4px)'}
          onMouseUp={e => e.currentTarget.style.transform = 'translate(0, 0)'}
        >
          Proceed to Next Game <ChevronRight size={32} />
        </button>
      ) : (
        <div style={{ marginTop: '50px', fontSize: '1.2rem', opacity: 0.7 }}>
          Waiting for host to proceed...
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
