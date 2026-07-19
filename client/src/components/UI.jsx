import { useState, useEffect } from 'react';
import { Gamepad2, Users, ArrowLeft, Heart, ChevronRight, Play, Swords, Dices, Zap, Target, MousePointer2, Shield, Trophy, Globe, ChevronDown, Sparkles, Clock, Cpu } from 'lucide-react';

/* ═══════════════════════════════════════════
   GAMER DESIGN TOKENS (Neo-Brutalism)
═══════════════════════════════════════════ */
export const PALETTE = [
  { bg: "#00E5FF", text: "#000000" }, // Electric Cyan
  { bg: "#FF2A5F", text: "#FFFFFF" }, // Hot Pink
  { bg: "#00FF66", text: "#000000" }, // Toxic Green
  { bg: "#FFD700", text: "#000000" }, // Arcade Yellow
  { bg: "#9D00FF", text: "#FFFFFF" }, // Deep Purple
  { bg: "#FF6600", text: "#FFFFFF" }, // Blaze Orange
  { bg: "#FF00FF", text: "#FFFFFF" }, // Magenta
  { bg: "#00FF00", text: "#000000" }, // Neon Lime
];

export const MAX_SLOTS = 8;

/* ═══════════════════════════════════════════
   AI NAME GENERATOR
═══════════════════════════════════════════ */
const ADJECTIVES = ["Toxic", "Chaotic", "Based", "Epic", "Savage", "Ghost", "Neon", "Cyber", "Mega", "Sneaky", "Salty", "Sweaty", "Cursed"];
const NOUNS = ["Goblin", "Ninja", "Wizard", "Panda", "Slime", "Glitch", "Cyborg", "Viper", "Potato", "Gremlin", "Phantom", "Demon"];

export const generateAIName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
};

export function AnimatedCursor() {
  const [pos, setPos] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : -100, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : -100 
  });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (e.touches && e.touches.length > 0) {
        setPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      } else if (e.clientX !== undefined) {
        setPos({ x: e.clientX, y: e.clientY });
      }
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchstart', down);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchstart', down);
      window.removeEventListener('touchend', up);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0,
      transform: `translate(${pos.x}px, ${pos.y}px)`,
      pointerEvents: 'none', zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        transform: `rotate(${clicked ? -15 : 0}deg) scale(${clicked ? 0.8 : 1})`,
        transition: 'transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.5))' }}>
          <path d="M4 2 L4 22 L10 16 L15 22 L18 19 L13 13 L20 13 Z" fill="#00E5FF" stroke="#000000" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export function ChunkyButton({ children, color = "#FFFFFF", onClick, disabled = false, style = {} }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => !disabled && setActive(false)}
      onMouseLeave={() => setActive(false)}
      style={{
        background: disabled ? "#D1D5DB" : color,
        border: "4px solid #000000", borderRadius: "12px",
        padding: "1rem 1.5rem", fontSize: "1.1rem", fontWeight: "900", fontFamily: "'Nunito', sans-serif",
        textTransform: "uppercase", letterSpacing: "2px",
        color: disabled ? "#9CA3AF" : "#000000",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: active || disabled ? "0px 0px 0px #000" : "6px 6px 0px #000",
        transform: active || disabled ? "translate(6px, 6px)" : "translate(0, 0)",
        transition: "transform 0.05s linear, box-shadow 0.05s linear",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        ...style
      }}
    >
      {children}
    </button>
  );
}

export function ChunkyInput({ value, onChange, placeholder, maxLength, onKeyDown }) {
  return (
    <input
      value={value} onChange={onChange} onKeyDown={onKeyDown}
      maxLength={maxLength} placeholder={placeholder}
      className="display-font"
      style={{
        width: "100%", textAlign: "center", fontSize: "2rem",
        background: "#FFF", border: "6px solid #000", borderRadius: "16px",
        padding: "1rem", color: "#000", outline: "none",
        boxShadow: "6px 6px 0px #000",
      }}
    />
  );
}

export function LandingView({ onHost, onJoin }) {
  const sectionStyle = { width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 2rem' };
  
  useEffect(() => {
    try {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    } catch (err) {}
  }, []);
  const cardStyle = (color, delay) => ({
    background: color, border: '4px solid #000', borderRadius: 16, padding: '2rem',
    boxShadow: '6px 6px 0px #000', animation: `slideUp 0.5s ${delay}s both`
  });
  const HOW_STEPS = [
    { icon: <Gamepad2 size={32}/>, title: 'Create or Join', desc: 'Host a room or enter a 4-letter code to join your squad.', color: '#00FF66' },
    { icon: <Target size={32}/>, title: 'Reaction Test', desc: 'Complete 5 rounds of the reaction speed test as fast as possible.', color: '#00E5FF' },
    { icon: <Clock size={32}/>, title: 'Pure Speed', desc: 'Lowest single reaction time out of your 5 rounds determines your final score.', color: '#FFD700' },
    { icon: <Trophy size={32}/>, title: 'Prove Who\'s Better', desc: 'Once everyone finishes, the leaderboard reveals the fastest player.', color: '#FF2A5F' },
  ];
  const FEATURES = [
    { icon: <Zap size={28}/>, title: 'Real-Time UDP', desc: 'Sub-50ms latency via WebRTC data channels.', color: '#00E5FF' },
    { icon: <Shield size={28}/>, title: 'Anti-Cheat', desc: 'Early click penalties ensure fair gameplay.', color: '#FF2A5F' },
    { icon: <Clock size={28}/>, title: 'Millisecond Precision', desc: 'Accurate to the millisecond to perfectly judge reactions.', color: '#FFD700' },
    { icon: <Users size={28}/>, title: 'Up to 8 Players', desc: 'Challenge your whole friend group at once.', color: '#00FF66' },
    { icon: <Globe size={28}/>, title: 'Browser Native', desc: 'No downloads. Share link, open browser, play.', color: '#FF6600' },
  ];
  const STATS = [
    { value: '8', label: 'Max Players', color: '#00E5FF' },
    { value: '5', label: 'Rounds', color: '#FFD700' },
    { value: '<50', label: 'ms Latency', color: '#00FF66' },
    { value: '1', label: 'Winner', color: '#FF2A5F' },
  ];

  return (
    <div className="game-bg" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'floaty 4s ease-in-out infinite' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Swords size={64} color="#000" strokeWidth={2.5}/></div>
          <h1 className="display-font" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: '#FFD700', WebkitTextStroke: '4px #000', textShadow: '8px 8px 0px #000', letterSpacing: 4, lineHeight: 1 }}>
            WHO'S<span style={{ color: '#00E5FF' }}>BETTER?</span>
          </h1>
          <div style={{ marginTop: '1rem', background: '#000', color: '#FFF', display: 'inline-block', padding: '8px 20px', borderRadius: 99, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }}>
            Multiplayer Reaction Test
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 800 }}>
          <div style={{ flex: '1 1 300px' }}>
            <ChunkyButton color="#00FF66" onClick={onHost} style={{ flexDirection: 'column', padding: '2.5rem 1.5rem', gap: 15 }}>
              <div style={{ background: '#000', color: '#FFF', padding: 15, borderRadius: 12 }}><Gamepad2 size={40}/></div>
              <h2 className="display-font" style={{ fontSize: '2rem', margin: 0 }}>Host Game</h2>
            </ChunkyButton>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <ChunkyButton color="#FF2A5F" onClick={onJoin} style={{ flexDirection: 'column', padding: '2.5rem 1.5rem', gap: 15 }}>
              <div style={{ background: '#000', color: '#FFF', padding: 15, borderRadius: 12 }}><Users size={40}/></div>
              <h2 className="display-font" style={{ fontSize: '2rem', margin: 0 }}>Join Game</h2>
            </ChunkyButton>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 30, animation: 'bounceDown 2s ease-in-out infinite' }}>
          <ChevronDown size={36} color="#000" strokeWidth={3}/>
        </div>
      </div>

      {/* ══ ABOUT ══ */}
      <div style={{ background: '#111827', padding: '5rem 2rem' }}>
        <div style={sectionStyle}>
          <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'slideUp 0.5s both' }}>
            <div style={{ display: 'inline-flex', background: '#FFD700', border: '4px solid #000', borderRadius: 12, padding: 12, boxShadow: '6px 6px 0 #000', marginBottom: '1rem' }}><Sparkles size={32} color="#000"/></div>
            <h2 className="display-font" style={{ fontSize: '2.5rem', color: '#FFF', WebkitTextStroke: '2px #000', textShadow: '4px 4px 0 #000' }}>WHAT IS WHO'S BETTER?</h2>
          </div>
          <div style={{ ...cardStyle('#FFF', 0.1), maxWidth: 700, margin: '0 auto' }}>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, fontWeight: 800, fontFamily: "'Nunito'" }}>
              <strong style={{ color: '#FF2A5F' }}>Who's Better?</strong> is a free online multiplayer <strong style={{ color: '#00E5FF' }}>reaction test</strong>. 
              Find out exactly who in your friend group has the fastest reflexes down to the millisecond.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, fontWeight: 800, fontFamily: "'Nunito'", marginTop: '1rem' }}>
              Wait for the screen to turn green, then click as fast as possible. Complete 5 rounds to record your absolute best time. The lowest score takes the crown!
            </p>
          </div>
        </div>
      </div>

      {/* ══ HOW TO PLAY ══ */}
      <div style={{ background: '#00E5FF', padding: '5rem 2rem', borderTop: '6px solid #000', borderBottom: '6px solid #000' }}>
        <div style={sectionStyle}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', background: '#000', border: '4px solid #000', borderRadius: 12, padding: 12, boxShadow: '6px 6px 0 rgba(0,0,0,0.3)', marginBottom: '1rem' }}><Target size={32} color="#00E5FF"/></div>
            <h2 className="display-font" style={{ fontSize: '2.5rem', WebkitTextStroke: '2px #000', textShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}>HOW TO PLAY</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i} style={{ ...cardStyle('#FFF', 0.1 * i), textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ background: s.color, border: '3px solid #000', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 #000' }}>{s.icon}</div>
                <div className="display-font" style={{ fontSize: 12, background: '#000', color: '#FFF', padding: '2px 10px', borderRadius: 99 }}>STEP {i + 1}</div>
                <h3 className="display-font" style={{ fontSize: '1.1rem', margin: 0 }}>{s.title}</h3>
                <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#555', fontFamily: "'Nunito'" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <div style={{ background: '#111827', padding: '5rem 2rem' }}>
        <div style={sectionStyle}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', background: '#9D00FF', border: '4px solid #000', borderRadius: 12, padding: 12, boxShadow: '6px 6px 0 #000', marginBottom: '1rem' }}><Zap size={32} color="#FFF"/></div>
            <h2 className="display-font" style={{ fontSize: '2.5rem', color: '#FFF', WebkitTextStroke: '2px #000', textShadow: '4px 4px 0 #000' }}>FEATURES</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#1E293B', border: '4px solid #000', borderRadius: 16, padding: '1.5rem', boxShadow: '6px 6px 0 #000', animation: `slideUp 0.5s ${0.08 * i}s both`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: f.color, border: '3px solid #000', borderRadius: 10, padding: 10, flexShrink: 0, boxShadow: '3px 3px 0 #000' }}>{f.icon}</div>
                <div>
                  <h3 className="display-font" style={{ fontSize: '1rem', color: '#FFF', margin: '0 0 6px' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 700, fontFamily: "'Nunito'", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STATS BAR ══ */}
      <div style={{ background: '#FFD700', padding: '3rem 2rem', borderTop: '6px solid #000', borderBottom: '6px solid #000' }}>
        <div style={{ ...sectionStyle, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', animation: `countUp 0.4s ${0.1 * i}s both` }}>
              <div className="display-font" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#000', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontWeight: 900, fontSize: '0.85rem', background: '#000', color: s.color, padding: '4px 14px', borderRadius: 99, marginTop: 8, fontFamily: "'Nunito'", letterSpacing: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA REPEAT ══ */}
      <div style={{ background: '#111827', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 className="display-font" style={{ fontSize: '2.5rem', color: '#FFF', WebkitTextStroke: '2px #000', textShadow: '4px 4px 0 #000', marginBottom: '2rem' }}>READY TO PLAY?</h2>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <ChunkyButton color="#00FF66" onClick={onHost} style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>
            <Gamepad2 size={24}/> Host Game
          </ChunkyButton>
          <ChunkyButton color="#FF2A5F" onClick={onJoin} style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>
            <Users size={24}/> Join Game
          </ChunkyButton>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{ background: '#000', padding: '2rem', textAlign: 'center', borderTop: '4px solid #333' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: "About", url: "#/about" },
            { label: "Contact Us", url: "#/contact-us" },
            { label: "Privacy Policy", url: "#/privacy-policy" },
            { label: "Cookie Declaration", url: "#/cookie-declaration" },
            { label: "Legal", url: "#/legal" }
          ].map(l => (
            <a key={l.label} href={l.url} style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 800, transition: 'color 0.2s', fontFamily: "'Nunito'" }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#888'}>
              {l.label}
            </a>
          ))}
        </div>
        <p style={{ color: '#555', fontWeight: 800, fontSize: '0.85rem', fontFamily: "'Nunito'" }}>
          WHO'S BETTER? © 2026 — Built with 💖 and WebRTC
        </p>
        <p style={{ color: '#333', fontWeight: 700, fontSize: '0.75rem', fontFamily: "'Nunito'", marginTop: 8 }}>
          Not responsible for broken mice during gameplay.
        </p>
      </div>
    </div>
  );
}

export function HostSetupView({ onBack, onEnter }) {
  const [name, setName] = useState("");
  
  return (
    <div className="game-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "2rem" }}>
      <div><ChunkyButton color="#FFF" onClick={onBack} style={{ display: "inline-flex", padding: "0.5rem 1rem" }}><ArrowLeft size={20} /> Back</ChunkyButton></div>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "-4rem" }}>
        <h2 className="display-font" style={{ fontSize: "2.5rem", marginBottom: "2rem", WebkitTextStroke: "2px #000", color: "#FFF", textShadow: "4px 4px 0px #000" }}>HOST A ROOM</h2>
        
        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ position: "relative" }}>
            <ChunkyInput value={name} onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))} placeholder="YOUR NAME" maxLength={12} />
            <button onClick={() => setName(generateAIName().toUpperCase())} style={{ position: "absolute", right: -20, top: -20, background: "#9D00FF", border: "3px solid #000", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "4px 4px 0px #000", color: "#FFF" }} title="Auto Generate AI Name">
              <Dices size={24} />
            </button>
          </div>
        </div>

        <ChunkyButton color="#00FF66" onClick={() => onEnter('Squad', name)} disabled={name.trim().length === 0} style={{ width: "320px", padding: "1.5rem" }}>
          Create Lobby <ChevronRight size={24} />
        </ChunkyButton>
      </div>
    </div>
  );
}

export function JoinSetupView({ onBack, onEnter }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  
  return (
    <div className="game-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "2rem" }}>
      <div><ChunkyButton color="#FFF" onClick={onBack} style={{ display: "inline-flex", padding: "0.5rem 1rem" }}><ArrowLeft size={20} /> Back</ChunkyButton></div>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "-4rem" }}>
        <h2 className="display-font" style={{ fontSize: "2.5rem", marginBottom: "2rem", WebkitTextStroke: "2px #000", color: "#FFF", textShadow: "4px 4px 0px #000" }}>JOIN A ROOM</h2>
        
        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
          <ChunkyInput value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4))} placeholder="ROOM CODE" maxLength={4} />
          
          <div style={{ position: "relative" }}>
            <ChunkyInput value={name} onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))} placeholder="YOUR NAME" maxLength={12} />
            <button onClick={() => setName(generateAIName().toUpperCase())} style={{ position: "absolute", right: -20, top: -20, background: "#9D00FF", border: "3px solid #000", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "4px 4px 0px #000", color: "#FFF" }} title="Auto Generate AI Name">
              <Dices size={24} />
            </button>
          </div>
        </div>

        <ChunkyButton color="#FF2A5F" onClick={() => onEnter(code, name)} disabled={code.length !== 4 || name.trim().length === 0} style={{ width: "320px", padding: "1.5rem", color: "#FFF" }}>
          Enter Lobby <ChevronRight size={24} />
        </ChunkyButton>
      </div>
    </div>
  );
}

export function LobbyView({ roomCode, players, onBack, onStart }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText(roomCode).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="game-bg" style={{ height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column", padding: "2rem", paddingBottom: "6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <ChunkyButton color="#FFF" onClick={onBack} style={{ padding: "0.5rem 1rem" }}><ArrowLeft size={20} /> Leave</ChunkyButton>
        <div style={{ background: "#000", color: "#00FF66", padding: "8px 20px", borderRadius: "99px", fontWeight: 900, border: "3px solid #000", boxShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}>
          WAITING FOR PLAYERS...
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3rem", marginTop: "2rem" }}>
        
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: "-10px", fontFamily:"'Nunito'" }}>ROOM CODE</p>
          <div className="display-font" onClick={copyCode} style={{ fontSize: "clamp(4rem, 15vw, 8rem)", background: "#FFD700", color: "#000", padding: "0rem 2rem", border: "8px solid #000", borderRadius: "24px", boxShadow: "12px 12px 0px #000", display: "inline-block", cursor: "pointer" }}>
            {roomCode}
          </div>
          <p style={{ marginTop: "1rem", fontWeight: 800, color: copied ? "#00FF66" : "#000", fontFamily:"'Nunito'" }}>
            {copied ? "COPIED!" : "CLICK TO COPY"}
          </p>
        </div>

        <div style={{ width: "100%", maxWidth: "800px", textAlign: "center", fontFamily:"'Nunito'" }}>
           <p style={{ fontWeight: 900, letterSpacing: "2px", color: "rgba(0,0,0,0.5)", marginBottom: "1.5rem" }}>
             {players.length} OF {MAX_SLOTS} PLAYERS
           </p>
           <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
            {players.map((p, index) => {
              const c = PALETTE[(p.color !== undefined ? p.color : index) % PALETTE.length] || PALETTE[0];
              return (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div style={{ position: "relative", width: 85, height: 85, background: c.bg, border: "4px solid #000", borderRadius: "20px", boxShadow: "6px 6px 0px #000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="display-font" style={{ fontSize: "2.8rem", color: c.text, marginTop: "5px" }}>
                      {(p.name || 'P').charAt(0).toUpperCase()}
                    </span>
                    <div style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, background: c.bg, border: "4px solid #000", borderRadius: "50%", animation: "pulseHard 1.5s infinite" }} />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: "1rem", background: "#000", color: "#FFF", padding: "4px 12px", borderRadius: "8px", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                </div>
              );
            })}
            
            {Array.from({ length: Math.max(0, MAX_SLOTS - players.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 85, height: 85, background: "transparent", border: "4px dashed rgba(0,0,0,0.2)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <div style={{ width: 20, height: 20, background: "rgba(0,0,0,0.1)", borderRadius: "50%" }} />
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "rgba(0,0,0,0.3)", padding: "4px 12px" }}>Open</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {players.length >= 2 && onStart && (
        <div style={{ position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 100 }}>
          <ChunkyButton color="#FF2A5F" onClick={onStart} style={{ padding: "1.5rem 4rem", fontSize: "1.5rem", color: "#FFF", boxShadow: "8px 8px 0px #000" }}>
            <Play fill="#FFF" size={28} /> START GAME
          </ChunkyButton>
        </div>
      )}
    </div>
  );
}

export function GameHUD({ level, levelName, startTime, onExit }) {
  const [time, setTime] = useState("00:00.00");

  useEffect(() => {
    const origin = startTime || Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - origin;
      const mins = String(Math.floor(diff / 60000)).padStart(2, '0');
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      const ms = String(Math.floor((diff % 1000) / 10)).padStart(2, '0');
      setTime(`${mins}:${secs}.${ms}`);
    }, 50);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <>
      {/* Bounding Box */}
      <div style={{
        position: "absolute", top: 24, left: 24, right: 24, bottom: 24,
        border: "3px solid rgba(255, 215, 0, 0.3)", // Thinner and faded (30% opacity)
        borderRadius: "16px",
        boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.1), inset 0px 0px 15px rgba(255, 215, 0, 0.1)",
        pointerEvents: "none", zIndex: 5
      }} />

      {/* HUD Header */}
      <div style={{ position: "absolute", top: 48, left: 48, right: 48, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "none" }}>
        {/* Level Tag */}
        <div style={{ background: "#00E5FF", border: "4px solid #000", borderRadius: "12px", padding: "10px 20px", boxShadow: "6px 6px 0px #000" }}>
          <p className="display-font" style={{ margin: 0, fontSize: "1rem", color: "#000" }}>LVL {level}/10</p>
          <p style={{ margin: 0, fontWeight: 900, fontSize: "0.85rem", color: "#000", fontFamily: "'Nunito'" }}>{levelName || ''}</p>
        </div>

        {/* Speedrun Timer */}
        <div style={{ background: "#000", border: "4px solid #FF2A5F", borderRadius: "12px", padding: "10px 25px", boxShadow: "6px 6px 0px #FF2A5F", display: "flex", alignItems: "center" }}>
          <span className="display-font" style={{ fontSize: "1.8rem", color: "#FFF", letterSpacing: "4px" }}>
            {time}
          </span>
        </div>
      </div>

    </>
  );
}

export function LevelOverlay({ level, name, desc, accent }) {
  return (
    <div style={{ position:"absolute", inset:0, zIndex:30, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", backgroundColor:"rgba(0,0,0,0.92)", backdropFilter:"blur(16px)", animation:"fadeInScale 0.35s ease-out" }}>
      <div className="display-font" style={{ color:"#FFD700", fontSize:"1.2rem", letterSpacing:"4px", marginBottom:"12px", animation:"slideUp 0.4s 0.1s both" }}>LEVEL {level}</div>
      <h1 className="display-font" style={{ fontSize:"4rem", margin:"0 0 16px", color:"#FFF", WebkitTextStroke:"2px #000", textShadow:"6px 6px 0 #000", animation:"slideUp 0.4s 0.2s both", textAlign: 'center' }}>{name}</h1>
      <div style={{ width:60, height:4, borderRadius:2, backgroundColor:accent||"#00E5FF", margin:"0 0 24px", animation:"slideUp 0.4s 0.25s both" }}/>
      <p style={{ fontSize:"1.2rem", color:"#ccc", fontWeight:800, maxWidth:500, textAlign:"center", animation:"slideUp 0.4s 0.3s both", fontFamily:"'Nunito'" }}>{desc}</p>
    </div>
  );
}

export function StatusOverlay({ title, subtitle, color, children }) {
  return (
    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", backgroundColor:"rgba(0,0,0,0.9)", zIndex:20, backdropFilter:"blur(12px)" }}>
      <h1 className="display-font" style={{ fontSize:"5rem", margin:"0 0 20px", color, WebkitTextStroke:"3px #000", textShadow:"8px 8px 0 #000", textAlign: 'center' }}>{title}</h1>
      {subtitle && <p style={{ fontSize:"1.5rem", margin:"0 0 30px", color:"#aaa", fontWeight:800, fontFamily:"'Nunito'" }}>{subtitle}</p>}
      {children}
    </div>
  );
}
