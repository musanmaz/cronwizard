import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: 36,
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="55" cy="55" r="46" stroke="white" strokeWidth="4" fill="none" />
          <line x1="55" y1="55" x2="55" y2="28" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="55" y1="55" x2="77" y2="55" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <circle cx="55" cy="55" r="4" fill="white" />
          <circle cx="55" cy="12" r="3.5" fill="white" />
          <circle cx="98" cy="55" r="3.5" fill="white" />
          <circle cx="55" cy="98" r="3.5" fill="white" />
          <circle cx="12" cy="55" r="3.5" fill="white" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
