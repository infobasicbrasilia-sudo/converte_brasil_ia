// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Conversor MP4 → MP3 Premium',
  description: 'Converta vídeos MP4 para MP3 diretamente no navegador, com total privacidade.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}