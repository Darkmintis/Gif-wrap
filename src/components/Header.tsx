import React from 'react';

export function Header() {
  return (
    <header className="h-14 flex items-center px-6 border-b border-[#1F2937] bg-black sticky top-0 z-50">
      <h1 className="text-sm font-semibold tracking-wide text-white uppercase flex items-center gap-2">
        Gif Wrap
      </h1>
    </header>
  );
}
