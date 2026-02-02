"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface StreamEvent {
  type: string;
  data: {
    version?: number;
    hash?: string;
    account?: string;
    from?: string;
    to?: string;
    amount?: number;
    amount_in?: number;
    amount_out?: number;
    token_in?: string;
    token_out?: string;
    token_type?: string;
    activity_type?: string;
    timestamp?: number;
    contract_address?: string;
  };
  cursor: number;
}

interface Metrics {
  total: number;
  swaps: number;
  transfers: number;
  mints: number;
  burns: number;
  other: number;
  totalVolume: number;
  uniqueAccounts: Set<string>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "ws://localhost:3001";
const STORAGE_KEY = "lightombo_subscribed_";

function getSubscriptionKey(address: string): string {
  return STORAGE_KEY + address.toLowerCase();
}

function isAddressSubscribed(address: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(getSubscriptionKey(address)) === "true";
}

function setAddressSubscribed(address: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getSubscriptionKey(address), "true");
}

export default function DashboardContent() {
  const { account, connected, signMessage } = useWallet();
  const router = useRouter();
  
  const [contractAddress, setContractAddress] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const metrics = useMemo<Metrics>(() => {
    const m: Metrics = {
      total: events.length,
      swaps: 0,
      transfers: 0,
      mints: 0,
      burns: 0,
      other: 0,
      totalVolume: 0,
      uniqueAccounts: new Set(),
    };

    for (const event of events) {
      switch (event.type) {
        case "swap":
          m.swaps++;
          m.totalVolume += (event.data.amount_in || 0) + (event.data.amount_out || 0);
          break;
        case "transfer":
          m.transfers++;
          m.totalVolume += event.data.amount || 0;
          break;
        case "mint":
          m.mints++;
          m.totalVolume += event.data.amount || 0;
          break;
        case "burn":
          m.burns++;
          m.totalVolume += event.data.amount || 0;
          break;
        default:
          m.other++;
      }

      if (event.data.account) m.uniqueAccounts.add(event.data.account);
      if (event.data.from) m.uniqueAccounts.add(event.data.from);
      if (event.data.to) m.uniqueAccounts.add(event.data.to);
    }

    return m;
  }, [events]);

  const exportToCSV = useCallback(() => {
    if (events.length === 0) return;

    const headers = ["type", "version", "hash", "account", "from", "to", "amount", "amount_in", "amount_out", "token_in", "token_out", "timestamp"];
    const rows = events.map((e) => [
      e.type,
      e.cursor,
      e.data.hash || "",
      e.data.account || "",
      e.data.from || "",
      e.data.to || "",
      e.data.amount || "",
      e.data.amount_in || "",
      e.data.amount_out || "",
      e.data.token_in || "",
      e.data.token_out || "",
      e.data.timestamp || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lightombo-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [events]);

  useEffect(() => {
    if (account?.address) {
      const alreadyPaid = isAddressSubscribed(account.address.toString());
      if (alreadyPaid) {
        setIsSubscribed(true);
      }
    }
  }, [account]);

  useEffect(() => {
    if (!connected) {
      router.push("/login");
    }
  }, [connected, router]);

  const handleSign = async () => {
    if (!account) return;
    
    setIsSigning(true);
    setError(null);
    
    try {
      const message = `Lightombo Access Request\nWallet: ${account.address.toString()}\nTimestamp: ${Date.now()}`;
      await signMessage({ message, nonce: "lightombo-mvp" });
      setAddressSubscribed(account.address.toString());
      setIsSubscribed(true);
    } catch (err) {
      console.error("Sign failed:", err);
      setError("Signature failed. Please try again.");
    } finally {
      setIsSigning(false);
    }
  };

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setConnectionStatus("connecting");
    setError(null);

    let wsUrl = BACKEND_URL;
    if (wsUrl.startsWith("http://")) {
      wsUrl = wsUrl.replace("http://", "ws://");
    } else if (wsUrl.startsWith("https://")) {
      wsUrl = wsUrl.replace("https://", "wss://");
    }
    if (!wsUrl.endsWith("/ws")) {
      wsUrl = `${wsUrl}/ws`;
    }
    
    if (contractAddress.trim()) {
      wsUrl = `${wsUrl}?contract=${encodeURIComponent(contractAddress.trim())}`;
    }
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnectionStatus("connected");
      setSessionStart(new Date());
    };

    ws.onmessage = (event) => {
      try {
        const data: StreamEvent = JSON.parse(event.data);
        setEvents((prev) => [data, ...prev].slice(0, 100));
      } catch (err) {
        console.error("Failed to parse event:", err);
      }
    };

    ws.onerror = () => {
      setError("Connection error. Make sure the backend is running.");
      setConnectionStatus("disconnected");
    };

    ws.onclose = (event) => {
      setConnectionStatus("disconnected");
      if (event.code !== 1000) {
        setError(`Connection closed unexpectedly (code: ${event.code})`);
      }
    };

    wsRef.current = ws;
  }, [contractAddress]);

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus("disconnected");
    setSessionStart(null);
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getEventColor = (type: string) => {
    switch (type) {
      case "swap": return "border-l-purple-400";
      case "transfer": return "border-l-accent-yellow";
      case "mint": return "border-l-blue-400";
      case "burn": return "border-l-red-400";
      default: return "border-l-accent-yellow/40";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "swap": return "~";
      case "transfer": return ">";
      case "mint": return "+";
      case "burn": return "-";
      default: return "*";
    }
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return "0";
    return (amount / 100000000).toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const shortenAddress = (address?: string) => {
    if (!address) return "unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return null;
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-accent-yellow text-2xl tracking-tight mb-2">// event_stream</h1>
        <p className="text-accent-yellow/50 text-sm">
          connected: <span className="text-accent-yellow font-mono">{shortenAddress(account?.address.toString())}</span>
        </p>
      </motion.div>

      {!isSubscribed ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto mt-20"
        >
          <div className="border-2 border-accent-yellow/50 bg-[#1a1400]/90 p-8 text-center">
            <div className="text-4xl text-accent-yellow mb-6">+++</div>
            <h2 className="text-accent-yellow text-xl mb-4">// unlock_access</h2>
            <p className="text-accent-yellow/50 text-sm mb-6">
              Sign a message to verify your wallet and access real-time 
              transaction event streaming.
            </p>
            <ul className="text-left text-accent-yellow/50 mb-8 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-accent-yellow">+</span> Real-time decoded events
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-yellow">+</span> DEX swap detection
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-yellow">+</span> Transfer & mint tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-yellow">+</span> Filter by contract address
              </li>
            </ul>
            
            {error && (
              <div className="border border-red-400/50 text-red-400 px-4 py-2 mb-4 text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handleSign}
              disabled={isSigning}
              className="w-full border-2 border-accent-yellow text-accent-yellow px-8 py-4 hover:bg-accent-yellow hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wider"
            >
              {isSigning ? "SIGNING..." : "SIGN TO ACCESS →"}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Connection Panel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-accent-yellow/50 bg-[#1a1400]/90"
          >
            <div className="border-b-2 border-accent-yellow/50 bg-accent-yellow/10 px-4 py-3 flex items-center justify-between">
              <span className="text-accent-yellow font-bold text-sm">// connection</span>
              <div className={`w-3 h-3 ${
                connectionStatus === "connected" ? "bg-accent-yellow" :
                connectionStatus === "connecting" ? "bg-accent-yellow/50 animate-pulse" :
                "bg-accent-yellow/30"
              }`} />
            </div>
            
            <div className="p-6 bg-[#120e00]">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-accent-yellow/50 mb-2">
                    contract_address <span className="text-accent-yellow/30">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-transparent border border-accent-yellow/30 px-4 py-3 text-accent-yellow font-mono text-sm focus:outline-none focus:border-accent-yellow transition-colors"
                    disabled={connectionStatus === "connected"}
                  />
                </div>
                <div className="flex items-end gap-2">
                  {connectionStatus === "connected" ? (
                    <button
                      onClick={disconnectWebSocket}
                      className="border border-red-400/50 text-red-400 px-6 py-3 hover:bg-red-400/10 transition-colors text-sm"
                    >
                      DISCONNECT
                    </button>
                  ) : (
                    <button
                      onClick={connectWebSocket}
                      disabled={connectionStatus === "connecting"}
                      className="border-2 border-accent-yellow text-accent-yellow px-6 py-3 hover:bg-accent-yellow hover:text-black transition-all disabled:opacity-50 text-sm"
                    >
                      {connectionStatus === "connecting" ? "..." : "CONNECT →"}
                    </button>
                  )}
                </div>
              </div>
              
              {error && (
                <div className="mt-4 border border-red-400/30 text-red-400 px-4 py-2 text-sm">
                  {error}
                </div>
              )}
              
              <div className="mt-4 flex items-center gap-2 text-xs text-accent-yellow/50">
                <span>{connectionStatus === "connected" ? "streaming" : connectionStatus === "connecting" ? "connecting" : "idle"}</span>
                <span className="text-accent-yellow/30">|</span>
                <span className="text-accent-yellow/30">{BACKEND_URL}</span>
              </div>
            </div>
          </motion.div>

          {/* Metrics */}
          {events.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              <div className="border-2 border-accent-yellow/50 bg-[#1a1400] p-4">
                <p className="text-xs text-accent-yellow/70 uppercase font-bold">total</p>
                <p className="text-2xl text-accent-yellow mt-1 font-bold">{metrics.total}</p>
              </div>
              <div className="border-2 border-accent-yellow/50 bg-[#1a1400] p-4">
                <p className="text-xs text-accent-yellow/70 uppercase font-bold">swaps</p>
                <p className="text-2xl text-accent-yellow mt-1 font-bold">{metrics.swaps}</p>
              </div>
              <div className="border-2 border-accent-yellow/50 bg-[#1a1400] p-4">
                <p className="text-xs text-accent-yellow/70 uppercase font-bold">transfers</p>
                <p className="text-2xl text-accent-yellow mt-1 font-bold">{metrics.transfers}</p>
              </div>
              <div className="border-2 border-accent-yellow/50 bg-[#1a1400] p-4">
                <p className="text-xs text-accent-yellow/70 uppercase font-bold">mints</p>
                <p className="text-2xl text-accent-yellow mt-1 font-bold">{metrics.mints}</p>
              </div>
              <div className="border-2 border-accent-yellow/50 bg-[#1a1400] p-4">
                <p className="text-xs text-accent-yellow/70 uppercase font-bold">burns</p>
                <p className="text-2xl text-accent-yellow mt-1 font-bold">{metrics.burns}</p>
              </div>
              <div className="border-2 border-accent-yellow/50 bg-[#1a1400] p-4">
                <p className="text-xs text-accent-yellow/70 uppercase font-bold">unique</p>
                <p className="text-2xl text-accent-yellow mt-1 font-bold">{metrics.uniqueAccounts.size}</p>
              </div>
            </motion.div>
          )}

          {/* Volume & Actions */}
          {events.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-accent-yellow/50 bg-[#1a1400] p-4">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-accent-yellow/50">volume:</span>
                  <span className="text-accent-yellow ml-2 font-mono">
                    {(metrics.totalVolume / 100000000).toLocaleString(undefined, { maximumFractionDigits: 2 })} MOVE
                  </span>
                </div>
                {sessionStart && (
                  <div>
                    <span className="text-accent-yellow/50">session:</span>
                    <span className="text-accent-yellow/70 ml-2">{sessionStart.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEvents([])}
                  className="text-xs text-accent-yellow/50 hover:text-accent-yellow px-3 py-2 border border-accent-yellow/20 hover:border-accent-yellow/50 transition-colors"
                >
                  CLEAR
                </button>
                <button
                  onClick={exportToCSV}
                  className="text-xs text-black bg-accent-yellow px-4 py-2 hover:bg-accent-yellow/80 transition-colors"
                >
                  EXPORT CSV
                </button>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="border-2 border-accent-yellow/50 bg-[#1a1400]/90">
            <div className="px-4 py-3 border-b-2 border-accent-yellow/50 bg-accent-yellow/10 flex items-center justify-between">
              <span className="text-accent-yellow font-bold text-sm">// live_events</span>
              <span className="text-xs text-accent-yellow">{events.length}/100</span>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto bg-[#120e00]">
              {events.length === 0 ? (
                <div className="px-6 py-12 text-center text-accent-yellow/60 text-sm">
                  {connectionStatus === "connected" 
                    ? "waiting for events..."
                    : "connect to start streaming"}
                </div>
              ) : (
                <div className="divide-y divide-accent-yellow/20">
                  {events.map((event, index) => (
                    <div
                      key={`${event.cursor}-${index}`}
                      className={`px-4 py-3 border-l-4 ${getEventColor(event.type)} bg-[#120e00] hover:bg-accent-yellow/5 transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-accent-yellow text-lg font-mono">{getEventIcon(event.type)}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-accent-yellow text-sm">{event.type}</span>
                              <span className="text-xs text-accent-yellow/40 font-mono">v{event.cursor}</span>
                            </div>
                            
                            {event.type === "swap" && (
                              <p className="text-xs text-accent-yellow/50 mt-1 font-mono">
                                {formatAmount(event.data.amount_in)} → {formatAmount(event.data.amount_out)}
                                <span className="text-accent-yellow/30 ml-2">by {shortenAddress(event.data.account)}</span>
                              </p>
                            )}
                            
                            {event.type === "transfer" && (
                              <p className="text-xs text-accent-yellow/50 mt-1 font-mono">
                                {formatAmount(event.data.amount)}
                                <span className="text-accent-yellow/30 ml-2">{shortenAddress(event.data.from)} → {shortenAddress(event.data.to)}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {event.data.hash && (
                          <a
                            href={`https://explorer.movementlabs.xyz/txn/${event.data.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent-yellow/50 hover:text-accent-yellow font-mono transition-colors"
                          >
                            {shortenAddress(event.data.hash)}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
