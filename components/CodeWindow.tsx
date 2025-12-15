"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const codeSnippet = `use lightombo::{Client, Network, AccountAddress};

#[tokio::main]
async fn main() -> Result<()> {
    let client = Client::new(Network::Mainnet)?;

    let address: AccountAddress = "0x2196a365aee43fff15be60561625bc1c5d2d8e821294e1264c6c0b86f0dbdd74"
        .parse()
        .expect("Invalid address");
    
    // Get balance
    let balance = client
        .get_account_balance(&address)
        .await?;
    
    println!("Balance: {}", balance);
    
    Ok(())
}`;

export default function CodeWindow() {
  const [displayedCode, setDisplayedCode] = useState("");
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const startTyping = () => {
      let currentIndex = 0;
      setDisplayedCode("");
      
      intervalId = setInterval(() => {
        if (currentIndex <= codeSnippet.length) {
          setDisplayedCode(codeSnippet.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          timeoutId = setTimeout(startTyping, 3000); // Wait 3s then restart
        }
      }, 30);
    };

    startTyping();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  // Syntax highlighting helper for Rust
  const highlightSyntax = (code: string) => {
    const rustKeywords = ['use', 'async', 'fn', 'let', 'mut', 'pub', 'struct', 'impl', 'enum', 'match', 'if', 'else', 'for', 'while', 'loop', 'return', 'Ok', 'Err', 'Result', 'Some', 'None', 'Option', 'expect', 'await'];
    const rustTypes = ['String', 'Network', 'Client', 'AccountAddress'];
    const rustMacros = ['tokio::main', 'println!'];
    const rustTraits = ['Result'];
    
    return code.split(/(\s+|\(|\)|\[|\]|\{|\}|;|,|\.|:|=|!|\?|#|&)/).map((part, index) => {
      if (part.startsWith("//")) return <span key={index} className="text-gray-500">{part}</span>;
      if (part.startsWith("#[")) return <span key={index} className="text-cyan-400">{part}</span>;
      if (rustKeywords.includes(part)) return <span key={index} className="text-purple-400">{part}</span>;
      if (rustTypes.includes(part)) return <span key={index} className="text-movement-yellow">{part}</span>;
      if (rustMacros.some(m => part.includes(m)) || part.includes("::")) return <span key={index} className="text-cyan-400">{part}</span>;
      if (rustTraits.includes(part)) return <span key={index} className="text-blue-400">{part}</span>;
      if (part.startsWith('"') || part.startsWith("'")) return <span key={index} className="text-green-400">{part}</span>;
      if (['{', '}', '(', ')', '[', ']', '.', ';', ':', '=', '?', '!', '#', '&'].includes(part)) return <span key={index} className="text-gray-300">{part}</span>;
      if (/^\d+$/.test(part)) return <span key={index} className="text-orange-400">{part}</span>;
      return <span key={index} className="text-gray-100">{part}</span>;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-lg mx-auto bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl shadow-movement-yellow/10"
    >
      {/* Window Header */}
      <div className="bg-gray-800/50 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="ml-auto text-xs text-gray-500 font-mono">main.rs</div>
      </div>

      {/* Code Area */}
      <div className="p-6 font-mono text-sm overflow-hidden min-h-[250px] text-left">
        <pre className="whitespace-pre-wrap break-words">
          {highlightSyntax(displayedCode)}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-movement-yellow ml-1 align-middle"
          />
        </pre>
      </div>
    </motion.div>
  );
}
