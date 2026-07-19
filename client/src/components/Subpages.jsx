import React from 'react';

export function PageContent({ pageId, onBack }) {
  const getPageContent = () => {
    switch(pageId) {
      case 'about':
        return (
          <div style={{ textAlign: 'left', color: '#ccc', lineHeight: 1.8 }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>About Who's Better?</h2>
            <p>Welcome to Who's Better! This is a real-time multiplayer reaction test game where you can challenge your friends to see who has the fastest reflexes.</p>
            <p>Built with React and Geckos.io, it provides ultra-low latency for millisecond-precision reaction testing.</p>
            <p style={{ marginTop: '1.5rem', color: '#fff', fontWeight: 'bold' }}>Developed by: Soham Gadekar</p>
          </div>
        );
      case 'privacy-policy':
        return (
          <div style={{ textAlign: 'left', color: '#ccc', lineHeight: 1.8 }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Privacy Policy</h2>
            <p>Effective Date: {new Date().toLocaleDateString()}</p>
            <p>At Soham Games (created by Soham Gadekar), we take your privacy seriously. This policy outlines how we collect, use, and protect your personal data when you use our services.</p>
            <h3 style={{ color: '#fff', marginTop: '1.5rem' }}>1. Information We Collect</h3>
            <p>We may collect information such as your IP address, browser type, and interactions with our games to improve your experience.</p>
            <h3 style={{ color: '#fff', marginTop: '1.5rem' }}>2. Google AdSense & Third-Party Cookies</h3>
            <p>We use third-party advertising companies, including Google, to serve ads when you visit our website. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.</p>
            <p>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</p>
            <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" style={{ color: '#00E5FF', textDecoration: 'none' }}>Ads Settings</a> or by visiting <a href="http://www.aboutads.info" target="_blank" rel="noreferrer" style={{ color: '#00E5FF', textDecoration: 'none' }}>www.aboutads.info</a>.</p>
            <h3 style={{ color: '#fff', marginTop: '1.5rem' }}>3. How We Use Your Information</h3>
            <p>Your data is used to provide, maintain, and improve our games and services, and to ensure compliance with our terms. If you have any questions, please contact me at sohamgadekar@gmail.com.</p>
          </div>
        );
      case 'legal':
      case 'imprint':
      case 'cookie-declaration':
        return (
          <div style={{ textAlign: 'left', color: '#ccc', lineHeight: 1.8 }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem', textTransform: 'capitalize' }}>{pageId.replace(/-/g, ' ')}</h2>
            <p>Soham Games is an independent game development studio run by Soham Gadekar.</p>
            <p>All content, including games, artwork, and code, is the property of Soham Gadekar unless otherwise stated.</p>
          </div>
        );
      case 'contact-us':
        return (
          <div style={{ textAlign: 'left', color: '#ccc', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>Contact Us</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Have questions or feedback? Email me directly at <a href="mailto:sohamgadekar@gmail.com" style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 'bold' }}>sohamgadekar@gmail.com</a>
            </p>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Your Name" style={{ padding: '12px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
              <input type="email" placeholder="Your Email" style={{ padding: '12px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
              <textarea placeholder="Your Message" rows="5" style={{ padding: '12px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', resize: 'vertical' }}></textarea>
              <button style={{ width: '100%', padding: '12px', fontSize: '1rem', background: '#00E5FF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>Send Message</button>
            </form>
          </div>
        );
      default:
        return (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem', textTransform: 'capitalize' }}>{pageId.replace(/-/g, ' ')}</h2>
            <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
              This section is currently under construction. Please check back later!
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px', background: '#111827', padding: '3rem', borderRadius: '8px', border: '1px solid #2a2a2a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <button onClick={onBack} style={{ marginBottom: '2rem', background: 'transparent', border: '1px solid #555', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          ← Back to Game
        </button>
        {getPageContent()}
      </div>
    </div>
  );
}
