"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-t border-terminal-green/20">
      {/* Status bar */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between text-xs text-terminal-green/60 gap-4">
        <div className="flex items-center gap-6">
          <span className="text-terminal-green">// current status:</span>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <span className="hover:text-terminal-green transition-colors cursor-pointer">
            available for fun
          </span>
          <span className="opacity-40">|</span>
          <span className="hover:text-terminal-green transition-colors cursor-pointer">
            no meetings policy
          </span>
          <span className="opacity-40">|</span>
          <span className="hover:text-terminal-green transition-colors cursor-pointer">
            collabing w/ cool global agencies
          </span>
          <span className="opacity-40">|</span>
          <span className="hover:text-terminal-green transition-colors cursor-pointer">
            experiencing life in human form
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="mailto:hello@lightombo.dev" className="hover:text-terminal-green transition-colors underline">
            hello@lightombo.dev
          </Link>
          <span className="text-terminal-green/40">
            site by <span className="text-terminal-green">LTMB</span> 24-25©
          </span>
        </div>
      </div>
    </footer>
  );
}
