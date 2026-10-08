import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Lock,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Check,
  ShieldCheck,
  Sparkles,
  Smile,
  Paperclip
} from 'lucide-react';
import { UserProfile, ChatMessage } from '@/types';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile | null;
  onOpenUnlockPayment: (profile: UserProfile) => void;
  isContactUnlocked?: boolean;
  currentUserId?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onOpenUnlockPayment,
  isContactUnlocked = false,
  currentUserId
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history when activeProfile changes
  useEffect(() => {
    if (!isOpen || !activeProfile) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${activeProfile.id}?currentUserId=current-user-1`);
        const data = await res.json();
        if (data.success && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [isOpen, activeProfile]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !activeProfile) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const myId = currentUserId || 'guest';
    const optimisticMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      senderId: myId,
      receiverId: activeProfile.id,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      // Send to backend
      await fetch(`/api/messages/${activeProfile.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: myId,
          text: userText
        })
      });

      // Realistic automated smart reply from the fictional adult male profile
      setTimeout(() => {
        setIsTyping(true);
      }, 700);

      setTimeout(async () => {
        setIsTyping(false);
        const replyPool = [
          `Hey! Great to hear from you. Loved your energy! What are you up to today?`,
          `Totally agree with you! Sincere connections are so rare. Glad we started talking.`,
          `That sounds really interesting! Tell me more about your favorite weekend spots.`,
          `Haha that made me smile! Are you free for a coffee sometime later this week?`,
          `Love that! You seem very genuine and grounded. Always nice meeting good people.`
        ];
        const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];

        // Post demo reply
        const replyRes = await fetch(`/api/messages/${myId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: activeProfile.id,
            text: randomReply
          })
        });
        const replyData = await replyRes.json();
        if (replyData.success && replyData.message) {
          setMessages((prev) => [...prev, replyData.message]);
        }
      }, 2200);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[82vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-purple-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00C496] ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">{activeProfile.username}</h4>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  {activeProfile.orientation}
                </span>
              </div>
              <p className="text-[11px] text-[#00C496] font-medium">Online now</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Unlock Action in Header */}
            {!isContactUnlocked && (
              <button
                onClick={() => onOpenUnlockPayment(activeProfile)}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6C3BFF] text-xs font-bold transition-colors"
                title="Unlock WhatsApp"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock WA</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety Notice in Chat */}
        <div className="bg-purple-50/70 border-b border-purple-100/60 px-4 py-2 text-[11px] text-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6C3BFF]" />
            <span>Private end-to-end encrypted messaging</span>
          </div>
          {!isContactUnlocked && (
            <button
              onClick={() => onOpenUnlockPayment(activeProfile)}
              className="text-[#6C3BFF] font-bold hover:underline"
            >
              Get WhatsApp (₹{activeProfile.unlockPrice ?? 499})
            </button>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F7FC]">
          <div className="text-center my-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white/80 px-3 py-1 rounded-full shadow-xs">
              Chat started with {activeProfile.username}
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === (currentUserId || 'guest');
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-gradient-to-r from-[#00C496] to-[#00A880] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-100'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isMe ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 max-w-[90px] bg-white rounded-2xl rounded-bl-xs shadow-xs border border-slate-100">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activeProfile.username}...`}
            className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#6C3BFF] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-[#00C496] hover:bg-[#00A880] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-[#00C496] shadow-sm flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 fill-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
