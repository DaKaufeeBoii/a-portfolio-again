import { useEffect } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.click();
          onClose();
        }
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0A0C14',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(15, 18, 28, 0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="var(--amber)" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFF' }}>
              Sai Tarun Reddy Velagala — Resume
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={PERSONAL_INFO.resumePath}
              download="Sai_Tarun_Reddy_Velagala.pdf"
              onClick={() => soundFx.click()}
              className="btn btn-primary btn-sm"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>

            <a
              href={PERSONAL_INFO.resumePath}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundFx.click()}
              className="btn btn-secondary btn-sm"
            >
              <ExternalLink size={14} />
              <span>New Tab</span>
            </a>

            <button
              onClick={() => { soundFx.click(); onClose(); }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Embedded PDF View */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div
            style={{
              width: '100%',
              height: '620px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              background: '#07080C',
            }}
          >
            <iframe
              src={`${PERSONAL_INFO.resumePath}#toolbar=0&navpanes=0`}
              title="Sai Tarun Reddy Velagala Resume"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
