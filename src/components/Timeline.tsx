import React, { useState } from 'react';
import { Image as ImageIcon, UploadCloud, Trash2 } from 'lucide-react';
import { FrameData } from '../types';

interface TimelineProps {
  frames: FrameData[];
  setFrames: React.Dispatch<React.SetStateAction<FrameData[]>>;
  processFiles: (files: FileList | File[]) => void;
}

export function Timeline({ frames, setFrames, processFiles }: TimelineProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFrameId, setDraggedFrameId] = useState<string | null>(null);

  const handleSortDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedFrameId || draggedFrameId === targetId) return;

    setFrames((prev) => {
      const draggedIndex = prev.findIndex((f) => f.id === draggedFrameId);
      const targetIndex = prev.findIndex((f) => f.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newFrames = [...prev];
      const [moved] = newFrames.splice(draggedIndex, 1);
      newFrames.splice(targetIndex, 0, moved);
      return newFrames;
    });
    setDraggedFrameId(null);
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 border-r border-[#1F2937] overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-zinc-100 text-lg font-medium flex items-center gap-2">
          <ImageIcon size={18} className="text-zinc-500" /> Frame Sequence
        </h2>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/svg+xml"
          id="file-upload"
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <label
          htmlFor="file-upload"
          className="text-xs px-3 py-1.5 border border-[#1F2937] hover:bg-[#1F2937] hover:text-white rounded-md cursor-pointer transition-colors"
        >
          + Add Files
        </label>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
        }}
        className={`w-full min-h-[40vh] border-2 border-dashed ${
          isDragging ? 'border-zinc-400 bg-zinc-900/50' : 'border-[#1F2937] hover:border-zinc-700 bg-[#0D1117]/50'
        } rounded-xl transition-all flex flex-col relative overflow-hidden`}
      >
        {frames.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 pointer-events-none">
            <UploadCloud size={48} className="mb-4 text-[#1F2937]" />
            <p className="text-sm">Drag and drop frames here</p>
            <p className="text-xs mt-1 text-zinc-600">Supports PNG, JPEG, SVG</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 p-6 w-full items-center min-h-full content-start flex-wrap lg:flex-nowrap">
            {frames.map((frame, index) => (
              <div
                key={frame.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  setDraggedFrameId(frame.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => handleSortDrop(e, frame.id)}
                className="flex-shrink-0 w-36 flex flex-col bg-[#0D1117] border border-[#1F2937] rounded-lg overflow-hidden hover:border-zinc-500 transition-all cursor-grab active:cursor-grabbing group shadow-sm"
              >
                <div className="h-28 w-full relative bg-black flex items-center justify-center">
                  <img src={frame.url} className="max-h-full max-w-full object-contain pointer-events-none" />

                  <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] text-zinc-400 border border-[#1F2937]">
                    #{index + 1}
                  </div>

                  <button
                    onClick={() => setFrames(frames.filter((f) => f.id !== frame.id))}
                    className="absolute top-1 right-1 p-1 bg-black/80 text-zinc-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-red-900/50"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="p-2 border-t border-[#1F2937] flex items-center gap-2 bg-[#0a0d13]">
                  <input
                    type="number"
                    value={frame.delay}
                    onChange={(e) => {
                      const val = Math.max(10, parseInt(e.target.value) || 0);
                      setFrames(frames.map((f) => (f.id === frame.id ? { ...f, delay: val } : f)));
                    }}
                    className="w-full bg-black border border-[#1F2937] text-white text-xs px-2 py-1.5 rounded focus:outline-none focus:border-zinc-500 transition-colors text-center"
                  />
                  <span className="text-[10px] text-zinc-500 pr-1">ms</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
