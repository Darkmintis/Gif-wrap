import React from 'react';
import { Settings, Play, Loader2, Download } from 'lucide-react';
import { FrameData, OutputConfig } from '../types';

interface WorkspaceProps {
  frames: FrameData[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  globalDelay: number;
  setGlobalDelay: React.Dispatch<React.SetStateAction<number>>;
  applyGlobalDelay: () => void;
  maxColors: number;
  setMaxColors: React.Dispatch<React.SetStateAction<number>>;
  handleCompile: () => void;
  isCompiling: boolean;
  compileProgress: number;
  compiledGifUrl: string | null;
  outputWidth: number;
  setOutputWidth: React.Dispatch<React.SetStateAction<number>>;
  outputHeight: number;
  setOutputHeight: React.Dispatch<React.SetStateAction<number>>;
  useCustomDimensions: boolean;
  setUseCustomDimensions: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Workspace({
  frames,
  canvasRef,
  globalDelay,
  setGlobalDelay,
  applyGlobalDelay,
  maxColors,
  setMaxColors,
  handleCompile,
  isCompiling,
  compileProgress,
  compiledGifUrl,
  outputWidth,
  setOutputWidth,
  outputHeight,
  setOutputHeight,
  useCustomDimensions,
  setUseCustomDimensions,
}: WorkspaceProps) {
  return (
    <div className="w-full lg:w-[420px] xl:w-[480px] bg-[#0D1117] flex flex-col border-l border-[#1F2937]">
      {/* Real-time Preview Area */}
      <div className="p-6 lg:p-8 flex-1 flex items-center justify-center bg-black/20 border-b border-[#1F2937]">
        {frames.length > 0 ? (
          <div className="w-full flex-col flex items-center justify-center gap-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest self-start font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Matrix Preview
            </div>
            <div className="relative border border-[#1F2937] rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-2xl p-4 w-full">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[300px] object-contain mx-auto border border-[#1F2937]/50"
              />
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              Output Target: {useCustomDimensions ? `${outputWidth} × ${outputHeight}px` : `${frames[0].width} × ${frames[0].height}px`}
            </div>
          </div>
        ) : (
          <div className="text-zinc-600 text-sm flex items-center gap-2 font-mono">
            &lt; Awaiting Origin Frames /&gt;
          </div>
        )}
      </div>

      {/* Configuration & Compilation Panel */}
      <div className="p-6 lg:p-8 bg-[#0D1117] flex flex-col gap-6">
        <h3 className="text-zinc-100 text-sm font-medium flex items-center gap-2">
          <Settings size={16} className="text-zinc-500" /> Global Parameters
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500">Global Frame Delay (ms)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={globalDelay}
                onChange={(e) => setGlobalDelay(parseInt(e.target.value) || 0)}
                className="flex-1 bg-black border border-[#1F2937] text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:border-zinc-500"
              />
              <button
                onClick={applyGlobalDelay}
                className="px-4 py-2 border border-[#1F2937] text-xs rounded-md hover:bg-[#1F2937] hover:text-white transition-colors whitespace-nowrap"
              >
                Apply All
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-500">Color Palette Capacity</label>
              <span className="text-xs text-zinc-400 font-mono">{maxColors}</span>
            </div>
            <input
              type="range"
              min="2"
              max="256"
              value={maxColors}
              onChange={(e) => setMaxColors(parseInt(e.target.value))}
              className="w-full accent-zinc-500 cursor-pointer"
            />
          </div>
        </div>

        <hr className="border-[#1F2937] my-2" />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Output Dimensions</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-zinc-600 mb-1 block">Width (px)</label>
              <input
                type="number"
                value={outputWidth}
                onChange={(e) => setOutputWidth(parseInt(e.target.value) || 0)}
                disabled={!useCustomDimensions}
                className="w-full bg-black border border-[#1F2937] text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-zinc-600 mb-1 block">Height (px)</label>
              <input
                type="number"
                value={outputHeight}
                onChange={(e) => setOutputHeight(parseInt(e.target.value) || 0)}
                disabled={!useCustomDimensions}
                className="w-full bg-black border border-[#1F2937] text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={() => setUseCustomDimensions(!useCustomDimensions)}
              className={`px-3 py-2 rounded-md text-xs border transition-colors whitespace-nowrap ${
                useCustomDimensions 
                  ? 'bg-zinc-700 border-zinc-600 text-white' 
                  : 'border-[#1F2937] text-zinc-400 hover:bg-[#1F2937] hover:text-white'
              }`}
              title={useCustomDimensions ? "Use original dimensions" : "Set custom dimensions"}
            >
              {useCustomDimensions ? 'Custom' : 'Custom'}
            </button>
          </div>
        </div>

        <hr className="border-[#1F2937] my-2" />

        <button
          onClick={handleCompile}
          disabled={isCompiling || frames.length === 0}
          className="w-full bg-white text-black font-semibold py-3 px-4 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all flex justify-center items-center gap-2 shadow-lg"
        >
          {isCompiling ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Synthesizing... {compileProgress}%
            </>
          ) : (
            <>
              <Play size={16} className="fill-current" />
              Compile & Export
            </>
          )}
        </button>

        {compiledGifUrl && !isCompiling && (
          <div className="p-4 border border-[#1F2937] bg-black rounded-lg flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
            <span className="text-sm font-medium text-emerald-400">Compilation Successful</span>
            <a
              href={compiledGifUrl}
              download={`forge-export-${Date.now()}.gif`}
              className="flex items-center gap-1.5 text-xs bg-[#1F2937] hover:bg-white hover:text-black py-1.5 px-3 rounded-md transition-colors"
            >
              <Download size={14} /> Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
