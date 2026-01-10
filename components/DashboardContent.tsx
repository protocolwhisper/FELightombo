"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";

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

  // Check if user already paid
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
      case "swap": return "border-l-purple-500 bg-purple-500/10";
      case "transfer": return "border-l-green-500 bg-green-500/10";
      case "mint": return "border-l-blue-500 bg-blue-500/10";
      case "burn": return "border-l-red-500 bg-red-500/10";
      default: return "border-l-gray-500 bg-gray-500/10";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "swap": return "↔";
      case "transfer": return "→";
      case "mint": return "+";
      case "burn": return "−";
      default: return "•";
    }
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return "0";
    return (amount / 100000000).toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const shortenAddress = (address?: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return null;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Event Stream Dashboard</h1>
        <p className="text-gray-400">
          Connected as <span className="text-movement-yellow font-mono">{shortenAddress(account?.address.toString())}</span>
        </p>
      </div>

      {!isSubscribed ? (
        <div className="max-w-lg mx-auto mt-20">
          <div className="border border-gray-800 bg-gray-900/50 rounded-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-movement-yellow/20 flex items-center justify-center">
              <span className="text-4xl text-movement-yellow">*</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Unlock Event Streaming</h2>
            <p className="text-gray-400 mb-6">
              Sign a message to verify your wallet and access real-time 
              transaction event streaming for any contract address.
            </p>
            <ul className="text-left text-gray-400 mb-8 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-movement-yellow">-</span> Real-time decoded events
              </li>
              <li className="flex items-center gap-2">
                <span className="text-movement-yellow">-</span> DEX swap detection
              </li>
              <li className="flex items-center gap-2">
                <span className="text-movement-yellow">-</span> Transfer & mint tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-movement-yellow">-</span> Filter by contract address
              </li>
            </ul>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <button
              onClick={handleSign}
              disabled={isSigning}
              className="w-full bg-movement-yellow text-black px-8 py-4 rounded-md font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigning ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing...
                </span>
              ) : (
                "Sign to Access"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border border-gray-800 bg-gray-900/50 rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">
                  Contract Address <span className="text-gray-500 text-xs">(optional - leave empty for all events)</span>
                </label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x... (leave empty to see all events)"
                  className="w-full bg-black border border-gray-700 rounded-md px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-movement-yellow transition-colors"
                  disabled={connectionStatus === "connected"}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Backend URL: {BACKEND_URL}
                </p>
              </div>
              <div className="flex items-end gap-2">
                {connectionStatus === "connected" ? (
                  <button
                    onClick={disconnectWebSocket}
                    className="bg-red-500/20 text-red-400 border border-red-500 px-6 py-3 rounded-md font-semibold hover:bg-red-500/30 transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={connectWebSocket}
                    disabled={connectionStatus === "connecting"}
                    className="bg-movement-yellow text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connectionStatus === "connecting" ? "Connecting..." : "Start Streaming"}
                  </button>
                )}
              </div>
            </div>
            
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected" ? "bg-green-500" :
                connectionStatus === "connecting" ? "bg-yellow-500 animate-pulse" :
                "bg-gray-500"
              }`} />
              <span className="text-sm text-gray-400">
                {connectionStatus === "connected" ? "Connected - Streaming events" :
                 connectionStatus === "connecting" ? "Connecting..." :
                 "Disconnected"}
              </span>
            </div>
          </div>

          {/* Metrics Cards */}
          {events.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="border border-gray-800 bg-gray-900/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Events</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.total}</p>
              </div>
              <div className="border border-purple-500/30 bg-purple-500/10 rounded-xl p-4">
                <p className="text-xs text-purple-400 uppercase tracking-wide">Swaps</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.swaps}</p>
                <p className="text-xs text-gray-500">{metrics.total > 0 ? ((metrics.swaps / metrics.total) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="border border-green-500/30 bg-green-500/10 rounded-xl p-4">
                <p className="text-xs text-green-400 uppercase tracking-wide">Transfers</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.transfers}</p>
                <p className="text-xs text-gray-500">{metrics.total > 0 ? ((metrics.transfers / metrics.total) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="border border-blue-500/30 bg-blue-500/10 rounded-xl p-4">
                <p className="text-xs text-blue-400 uppercase tracking-wide">Mints</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.mints}</p>
                <p className="text-xs text-gray-500">{metrics.total > 0 ? ((metrics.mints / metrics.total) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="border border-red-500/30 bg-red-500/10 rounded-xl p-4">
                <p className="text-xs text-red-400 uppercase tracking-wide">Burns</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.burns}</p>
                <p className="text-xs text-gray-500">{metrics.total > 0 ? ((metrics.burns / metrics.total) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="border border-movement-yellow/30 bg-movement-yellow/10 rounded-xl p-4">
                <p className="text-xs text-movement-yellow uppercase tracking-wide">Unique Accounts</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.uniqueAccounts.size}</p>
              </div>
            </div>
          )}

          {/* Volume & Session Info */}
          {events.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border border-gray-800 bg-gray-900/50 rounded-xl p-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500">Total Volume</p>
                  <p className="text-lg font-mono text-white">{(metrics.totalVolume / 100000000).toLocaleString(undefined, { maximumFractionDigits: 2 })} MOVE</p>
                </div>
                {sessionStart && (
                  <div>
                    <p className="text-xs text-gray-500">Session Started</p>
                    <p className="text-sm text-gray-400">{sessionStart.toLocaleTimeString()}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEvents([])}
                  className="text-sm text-gray-400 hover:text-white px-3 py-2 border border-gray-700 rounded-md hover:border-gray-600 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={exportToCSV}
                  className="text-sm bg-movement-yellow text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
          )}

          <div className="border border-gray-800 bg-gray-900/50 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Live Events</h2>
              <span className="text-sm text-gray-400">{events.length} / 100 events</span>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {events.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  {connectionStatus === "connected" 
                    ? "Waiting for events..."
                    : "Connect to start receiving events"}
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {events.map((event, index) => (
                    <div
                      key={`${event.cursor}-${index}`}
                      className={`px-6 py-4 border-l-4 ${getEventColor(event.type)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getEventIcon(event.type)}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold capitalize">{event.type}</span>
                              <span className="text-xs text-gray-500 font-mono">v{event.cursor}</span>
                            </div>
                            
                            {event.type === "swap" && (
                              <p className="text-sm text-gray-400 mt-1">
                                <span className="text-white">{formatAmount(event.data.amount_in)}</span>
                                {" → "}
                                <span className="text-white">{formatAmount(event.data.amount_out)}</span>
                                {event.data.token_in && (
                                  <span className="text-gray-500 ml-2 text-xs">
                                    {event.data.token_in.split("::").pop()}
                                  </span>
                                )}
                                <span className="text-gray-500 ml-2 text-xs">by {shortenAddress(event.data.account)}</span>
                              </p>
                            )}
                            
                            {event.type === "transfer" && (
                              <p className="text-sm text-gray-400 mt-1">
                                <span className="text-white">{formatAmount(event.data.amount)}</span>
                                <span className="text-gray-500"> {shortenAddress(event.data.from)} → {shortenAddress(event.data.to)}</span>
                              </p>
                            )}
                            
                            {event.type === "account_activity" && (
                              <p className="text-sm text-gray-400 mt-1 font-mono text-xs">
                                {event.data.activity_type?.split("::").slice(-1)[0]}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {event.data.hash && (
                          <a
                            href={`https://explorer.movementlabs.xyz/txn/${event.data.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-movement-yellow hover:underline font-mono"
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

