import { useState, type FormEvent } from 'react';
import { Mail, Phone, Send, Check, Copy, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

export const ContactSection = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('Full-Time / Engineering Role Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const copyEmail = () => {
    soundFx.click();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyPhone = () => {
    soundFx.click();
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    soundFx.achievement();
    confetti({ particleCount: 80, spread: 65, origin: { y: 0.8 }, colors: ['#F5A623', '#3ECFCF', '#22D3AE'] });
    setFormSubmitted(true);
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(`[Portfolio] ${formSubject} from ${formName}`)}&body=${encodeURIComponent(`Sender: ${formName} (${formEmail})\n\n${formMessage}`)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <footer id="contact" className="section" style={{ position: 'relative', borderTop: '1px solid var(--border-faint)' }}>
      <div className="container">

        {/* — Header — */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-tag emerald">
            <Mail size={12} />
            Get In Touch
          </div>
          <h2 className="section-title" style={{ marginBottom: '14px' }}>
            Let's Build <span className="gradient-amber">Something Extraordinary</span>
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Open to full-time backend AI engineering roles, high-scale agent architectures, and visionary collaborations.
          </p>
        </div>

        {/* — Contact grid — */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginBottom: '60px',
          alignItems: 'start',
        }}>
          {/* Left: Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Email card */}
            <div
              className="card"
              style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onMouseEnter={() => soundFx.hover()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: 'var(--r-md)',
                  background: 'rgba(245,166,35,0.08)',
                  border: '1px solid rgba(245,166,35,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Mail size={18} style={{ color: 'var(--amber)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                    Email
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {PERSONAL_INFO.email}
                  </div>
                </div>
              </div>
              <button onClick={copyEmail} className="btn btn-secondary btn-sm">
                {copiedEmail ? <Check size={13} style={{ color: 'var(--emerald)' }} /> : <Copy size={13} />}
                {copiedEmail ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Phone card */}
            <div
              className="card"
              style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onMouseEnter={() => soundFx.hover()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: 'var(--r-md)',
                  background: 'rgba(62,207,207,0.08)',
                  border: '1px solid rgba(62,207,207,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Phone size={18} style={{ color: 'var(--cyan)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                    Phone / WhatsApp
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {PERSONAL_INFO.phone}
                  </div>
                </div>
              </div>
              <button onClick={copyPhone} className="btn btn-secondary btn-sm">
                {copiedPhone ? <Check size={13} style={{ color: 'var(--emerald)' }} /> : <Copy size={13} />}
                {copiedPhone ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Social links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.click()}
                className="card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onMouseEnter={() => soundFx.hover()}
              >
                <Linkedin size={20} style={{ color: '#0A66C2', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>LinkedIn</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>/in/vstr</div>
                </div>
                <ArrowUpRight size={12} style={{ color: 'var(--text-dim)', marginLeft: 'auto', flexShrink: 0 }} />
              </a>

              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.click()}
                className="card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onMouseEnter={() => soundFx.hover()}
              >
                <Github size={20} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>GitHub</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>/DaKaufeeBoii</div>
                </div>
                <ArrowUpRight size={12} style={{ color: 'var(--text-dim)', marginLeft: 'auto', flexShrink: 0 }} />
              </a>
            </div>

            {/* Existing OS link */}
            <a
              href={PERSONAL_INFO.socials.existingOs}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundFx.click()}
              className="card"
              style={{
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid rgba(167,139,250,0.2)',
              }}
              onMouseEnter={() => soundFx.hover()}
            >
              <div style={{
                width: '36px', height: '36px',
                borderRadius: 'var(--r-md)',
                background: 'rgba(167,139,250,0.1)',
                border: '1px solid rgba(167,139,250,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <ExternalLink size={16} style={{ color: 'var(--purple)' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>vstr-os.vercel.app</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Previous portfolio OS concept</div>
              </div>
              <ArrowUpRight size={12} style={{ color: 'var(--text-dim)', marginLeft: 'auto', flexShrink: 0 }} />
            </a>
          </div>

          {/* Right: Contact form */}
          <div
            className="card"
            style={{
              padding: '30px',
              border: '1px solid rgba(245,166,35,0.18)',
            }}
          >
            <div className="accent-line" style={{ background: 'linear-gradient(90deg, var(--amber), var(--cyan), transparent)' }} />

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '6px' }}>
              Direct Message Dispatcher
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '22px' }}>
              Drop a note directly to my inbox. Opens your email client.
            </p>

            {formSubmitted ? (
              <div style={{
                padding: '28px',
                textAlign: 'center',
                background: 'rgba(34,211,174,0.05)',
                borderRadius: 'var(--r-lg)',
                border: '1px solid rgba(34,211,174,0.2)',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚀</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Dispatch Prepared!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.65 }}>
                  Your email client should open. You can also email directly at{' '}
                  <strong style={{ color: 'var(--amber)' }}>{PERSONAL_INFO.email}</strong>.
                </p>
                <button onClick={() => setFormSubmitted(false)} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Name
                    </label>
                    <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Jane Doe" className="input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Email
                    </label>
                    <input type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="jane@company.com" className="input" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Inquiry Type
                  </label>
                  <select value={formSubject} onChange={(e) => setFormSubject(e.target.value)} className="input select">
                    <option value="Full-Time / Engineering Role Inquiry">Full-Time / Engineering Role</option>
                    <option value="Backend AI Engineering Opportunity">Backend AI Engineering</option>
                    <option value="Local Agents & Systems Project">Local Agents & Systems</option>
                    <option value="General Technical Inquiry">General Technical Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Tell me about your team, challenge, or project..."
                    className="input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }}>
                  <Send size={14} />
                  Dispatch Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* — Footer bar — */}
        <div style={{
          borderTop: '1px solid var(--border-faint)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
        }}>
          <div>
            © {new Date().getFullYear()} Sai Tarun Reddy Velagala (Kaufee). Built for impact & AI innovation.
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>TypeScript · React · Vite · Vanilla CSS</span>
            <span style={{ color: 'var(--amber)', opacity: 0.6 }}>☕</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
