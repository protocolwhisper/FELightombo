"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-t border-accent-yellow/20">
      {/* Status bar */}
      <div className="px-6 py-2 flex items-center justify-between text-xs text-accent-yellow/60">
        <div className="flex items-center gap-4">
          <span className="text-accent-yellow">// status:</span>
          <span className="hover:text-accent-yellow transition-colors cursor-pointer">
            available for fun
          </span>
          <span className="opacity-40">|</span>
          <span className="hover:text-accent-yellow transition-colors cursor-pointer">
            no meetings policy
          </span>
          <span className="opacity-40">|</span>
          <a 
            href="https://crates.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-accent-yellow transition-colors"
          >
            crates.io →
          </a>
          <span className="opacity-40">|</span>
          <Link href="/billing" className="hover:text-accent-yellow transition-colors">
            billing & quotes
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="mailto:hello@lightombo.dev" className="hover:text-accent-yellow transition-colors underline">
            hello@lightombo.dev
          </Link>
        </div>
      </div>
    </footer>
  );
}
