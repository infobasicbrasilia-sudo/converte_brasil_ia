'use client';

import { useState, useRef, useCallback } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const ffmpegRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handlers para drag & drop
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.type === 'video/mp4') {
        setFile(droppedFile);
        setDownloadUrl('');
        setStatus('Arquivo carregado: ' + droppedFile.name);
      } else {
        alert('Por favor, solte um arquivo MP4 válido.');
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'video/mp4') {
      setFile(selected);
      setDownloadUrl('');
      setStatus('Arquivo carregado: ' + selected.name);
    } else {
      alert('Por favor, selecione um arquivo MP4 válido.');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const convert = async () => {
    if (!file) {
      alert('Selecione um arquivo MP4 primeiro.');
      return;
    }

    try {
      setStatus('Carregando motor de conversão...');
      setProgress(10);

      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { fetchFile } = await import('@ffmpeg/util');

      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
      });

      setStatus('Arquivo carregado na memória...');
      setProgress(30);

      const fileData = await fetchFile(file);
      await ffmpeg.writeFile('input.mp4', fileData);

      setStatus('Convertendo para MP3... (pode levar alguns segundos)');
      setProgress(50);

      await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-acodec', 'libmp3lame', 'output.mp3']);

      setStatus('Lendo o resultado...');
      setProgress(80);

      const mp3Data = await ffmpeg.readFile('output.mp3');
      const blob = new Blob([mp3Data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      setProgress(100);
      setStatus('✅ Conversão concluída! Clique em "Baixar MP3".');

      await ffmpeg.deleteFile('input.mp4');
      await ffmpeg.deleteFile('output.mp3');
    } catch (error) {
      console.error(error);
      setStatus('❌ Erro na conversão: ' + error.message);
      setProgress(0);
    }
  };

  const reset = () => {
    setFile(null);
    setStatus('');
    setProgress(0);
    setDownloadUrl('');
    if (ffmpegRef.current) {
      ffmpegRef.current.terminate?.();
      ffmpegRef.current = null;
    }
  };

  return (
    <main className="app-card">
      {/* Cabeçalho */}
      <div className="header">
        <div className="header-icon">🎵</div>
        <div>
          <div className="header-title">MP4 → MP3 - OFICINA DE INFORMÁTICA</div>
          <div className="header-sub">Conversor offline · privacidade garantida</div>
         </div>
      </div>

      {/* Área de upload (drag & drop) */}
      <div
        className={`drop-zone ${isDragging ? 'dragover' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          type="file"
          accept=".mp4"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <div className="drop-zone-label">
          <span className="drop-zone-icon">📂</span>
          <span className="drop-zone-text">
            {file ? 'Arquivo selecionado' : 'Arraste um arquivo MP4 aqui'}
          </span>
          <span className="drop-zone-hint">
            {file ? file.name : 'ou clique para escolher'}
          </span>
        </div>
      </div>

      {/* Informações do arquivo */}
      {file && (
        <div className="file-info">
          <span className="file-name">
            <span>📁</span> {file.name}
          </span>
          <span className="file-size">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}

      {/* Botões */}
      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={convert}
          disabled={!file || (progress > 0 && progress < 100)}
        >
          {progress > 0 && progress < 100 ? '⏳ Convertendo...' : '🔄 Converter'}
        </button>
        {downloadUrl && (
          <a href={downloadUrl} download="audio.mp3" style={{ flex: 1 }}>
            <button className="btn btn-success">
              ⬇️ Baixar MP3
            </button>
          </a>
        )}
        {progress > 0 && (
          <button className="btn btn-secondary" onClick={reset}>
            ↺ Novo
          </button>
        )}
      </div>

      {/* Status e progresso */}
      {status && (
        <div className="status">
          <span>{status}</span>
        </div>
      )}
      {progress > 0 && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Rodapé */}
      <div className="footer-note">
       <span>⚡ Devs: alunos de Informática Básica - Samambaia 404 / 2026 do instrutor Joner</span>
        
      </div>
    </main>
  );
}