// ============================================
// 루트 레이아웃 (모든 페이지의 공통 껍데기)
// ============================================
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '내얼굴 이모티콘 생성기',
  description: '내 사진으로 만드는 카카오톡 스타일 이모티콘 12종 세트',
};

// 모바일 우선 - 안전영역 + 확대 방지
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FFD93D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-soft min-h-screen text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
