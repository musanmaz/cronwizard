import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'CronWizard - Free Cron Expression Generator & Validator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="8.5" stroke="#8083ff" strokeWidth="1.5" fill="none" />
            <line x1="10" y1="10" x2="10" y2="5" stroke="#8083ff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="10" x2="14" y2="10" stroke="#8083ff" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="10" r="1" fill="#8083ff" />
            <circle cx="10" cy="2.5" r="0.8" fill="#8083ff" />
            <circle cx="17.5" cy="10" r="0.8" fill="#8083ff" />
            <circle cx="10" cy="17.5" r="0.8" fill="#8083ff" />
            <circle cx="2.5" cy="10" r="0.8" fill="#8083ff" />
          </svg>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: -2,
            marginBottom: 8,
          }}
        >
          CronWizard
        </div>

        <div
          style={{
            fontSize: 28,
            color: '#c0c1ff',
            marginBottom: 40,
            fontWeight: 500,
          }}
        >
          Cron Expression Generator & Validator
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(128, 131, 255, 0.1)',
            border: '1px solid rgba(128, 131, 255, 0.3)',
            borderRadius: 16,
            padding: '16px 32px',
          }}
        >
          <div style={{ fontSize: 22, color: '#a0a3ff', fontFamily: 'monospace' }}>
            */5 * * * *
          </div>
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.4)' }}>→</div>
          <div style={{ fontSize: 22, color: '#c0c1ff' }}>Every 5 minutes</div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 40,
            fontSize: 16,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <span>Unix & Quartz</span>
          <span>•</span>
          <span>Timezone Support</span>
          <span>•</span>
          <span>K8s / GitHub Actions / systemd Export</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
