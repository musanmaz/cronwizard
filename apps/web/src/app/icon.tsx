import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #494bd6 0%, #8083ff 100%)',
          borderRadius: 6,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Clock circle */}
          <circle cx="10" cy="10" r="8.5" stroke="white" strokeWidth="1.5" fill="none" />
          {/* Hour hand */}
          <line x1="10" y1="10" x2="10" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          {/* Minute hand */}
          <line x1="10" y1="10" x2="14" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          {/* Center dot */}
          <circle cx="10" cy="10" r="1" fill="white" />
          {/* Asterisk marks (cron symbol) at 12, 3, 6, 9 */}
          <circle cx="10" cy="2.5" r="0.8" fill="white" />
          <circle cx="17.5" cy="10" r="0.8" fill="white" />
          <circle cx="10" cy="17.5" r="0.8" fill="white" />
          <circle cx="2.5" cy="10" r="0.8" fill="white" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
