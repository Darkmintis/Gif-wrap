/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Timeline } from './components/Timeline';
import { Workspace } from './components/Workspace';
import { FrameData, OutputConfig } from './types';

declare global {
  interface Window {
    gifshot: any;
  }
}

export default function App() {
  const [frames, setFrames] = useState<FrameData[]>([]);
  const [globalDelay, setGlobalDelay] = useState<number>(100);
  const [maxColors, setMaxColors] = useState<number>(256);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compiledGifUrl, setCompiledGifUrl] = useState<string | null>(null);

  const [previewIndex, setPreviewIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outputWidth, setOutputWidth] = useState<number>(500);
  const [outputHeight, setOutputHeight] = useState<number>(500);
  const [useCustomDimensions, setUseCustomDimensions] = useState<boolean>(false);

  // Load gifshot from CDN
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.gifshot) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/gifshot@0.4.5/dist/gifshot.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Real-time Canvas Loop
  useEffect(() => {
    if (!frames.length) return;

    const currentFrame = frames[previewIndex];
    if (!currentFrame) {
      setPreviewIndex(0);
      return;
    }

    const firstFrame = frames[0];
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx && canvasRef.current) {
      canvasRef.current.width = firstFrame.width;
      canvasRef.current.height = firstFrame.height;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, firstFrame.width, firstFrame.height);
        ctx.drawImage(img, 0, 0, firstFrame.width, firstFrame.height);
      };
      img.src = currentFrame.url;
    }

    const timer = setTimeout(() => {
      setPreviewIndex((prev) => (prev + 1) % frames.length);
    }, currentFrame.delay || 100);

    return () => clearTimeout(timer);
  }, [frames, previewIndex]);

  // File Handlers
  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setFrames((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            url,
            delay: globalDelay,
            width: img.width || 500,
            height: img.height || 500,
          },
        ]);
      };
      img.src = url;
    });

    // Update output dimensions based on first frame if not custom
    if (frames.length === 0) {
      setOutputWidth(img.width || 500);
      setOutputHeight(img.height || 500);
    }
  };

  const applyGlobalDelay = () => {
    setFrames(frames.map((f) => ({ ...f, delay: globalDelay })));
  };

  const handleCompile = () => {
    if (!window.gifshot || frames.length === 0) return;
    setIsCompiling(true);
    setCompileProgress(0);
    setCompiledGifUrl(null);

    const firstFrame = frames[0];
    const baseMs = 50;

    // Determine output dimensions
    const finalWidth = useCustomDimensions ? outputWidth : firstFrame.width;
    const finalHeight = useCustomDimensions ? outputHeight : firstFrame.height;

    // Expand images to simulate variable granular delays inherently unsupported natively by simple gifshot queues
    const expandedImages: string[] = [];
    frames.forEach((frame) => {
      const slices = Math.max(1, Math.round(frame.delay / baseMs));
      for (let i = 0; i < slices; i++) {
        expandedImages.push(frame.url);
      }
    });

    window.gifshot.createGIF(
      {
        images: expandedImages,
        interval: baseMs / 1000,
        gifWidth: finalWidth,
        gifHeight: finalHeight,
        numWorkers: 2,
        sampleInterval: maxColors >= 256 ? 1 : 10,
        progressCallback: (prog: number) => {
          setCompileProgress(Math.floor(prog * 100));
        },
      },
      (obj: any) => {
        setIsCompiling(false);
        if (!obj.error) {
          setCompiledGifUrl(obj.image);
        }
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-zinc-800">
      <Header />
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Timeline frames={frames} setFrames={setFrames} processFiles={processFiles} />
        <Workspace
          frames={frames}
          canvasRef={canvasRef}
          globalDelay={globalDelay}
          setGlobalDelay={setGlobalDelay}
          applyGlobalDelay={applyGlobalDelay}
          maxColors={maxColors}
          setMaxColors={setMaxColors}
          handleCompile={handleCompile}
          isCompiling={isCompiling}
          compileProgress={compileProgress}
          compiledGifUrl={compiledGifUrl}
          outputWidth={outputWidth}
          setOutputWidth={setOutputWidth}
          outputHeight={outputHeight}
          setOutputHeight={setOutputHeight}
          useCustomDimensions={useCustomDimensions}
          setUseCustomDimensions={setUseCustomDimensions}
        />
      </main>
    </div>
  );
}
