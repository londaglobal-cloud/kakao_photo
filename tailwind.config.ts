import type { Config } from 'tailwindcss';

// Tailwind 설정 - 모바일 우선, 9:16 화면에서도 예쁘게 보이도록 디자인
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 카카오톡 이모티콘 느낌의 밝고 귀여운 톤
        primary: '#FFD93D',     // 노란색 (메인 컬러)
        secondary: '#FF6B9D',   // 핑크 (포인트)
        accent: '#6BCB77',      // 그린 (CTA)
        soft: '#FFF8E7',        // 연한 크림 배경
      },
      fontFamily: {
        // 손글씨 느낌을 위해 시스템 폰트 + 한글 우선
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sticker: '0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
