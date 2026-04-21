import { useState } from 'react';

interface ChatbotProps {
  onNavigate: (page: string) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot({ onNavigate }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today? 👋', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');

  const quickOptions = [
    { text: '📚 View Courses', action: () => onNavigate('courses') },
    { text: '💰 Check Fees', action: () => handleQuickReply('What are the course fees?') },
    { text: '📝 Register Now', action: () => onNavigate('register') }
  ];

  const handleQuickReply = (text: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'user'
    };

    let botResponse = '';
    if (text.toLowerCase().includes('fee')) {
      botResponse = 'Our course fees range from ₹2,000 to ₹5,000 per month depending on the course. 💰';
    } else {
      botResponse = 'Please call us at +91 98180 34565 for more information. 📞';
    }

    const botMessage: Message = {
      id: messages.length + 2,
      text: botResponse,
      sender: 'bot'
    };

    setMessages([...messages, userMessage, botMessage]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    handleQuickReply(inputText);
    setInputText('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white rounded-full p-4 shadow-2xl shadow-accent/40 transition-all hover:scale-110"
        aria-label="Chat with us"
        style={{ animation: isOpen ? '' : 'float 3s ease-in-out infinite' }}
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-border flex flex-col max-h-[32rem] mx-4 sm:mx-0 overflow-hidden"
          style={{ animation: 'scaleIn 0.3s ease-out' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-indigo-600 text-white p-5 flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-family-display)' }}>Gurukul Assistant</h3>
              <p className="text-xs text-white/90">Online • Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-muted/30 to-background">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fadeInUp 0.3s ease-out' }}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-accent to-indigo-600 text-white rounded-br-sm shadow-lg'
                      : 'bg-white border border-border rounded-bl-sm shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Quick Options */}
            {messages.length === 1 && (
              <div className="space-y-2 pt-2" style={{ animation: 'fadeInUp 0.4s ease-out 0.2s backwards' }}>
                <p className="text-xs text-muted-foreground text-center mb-3 font-semibold">Quick Actions:</p>
                {quickOptions.map((option, i) => (
                  <button
                    key={i}
                    onClick={option.action}
                    className="w-full bg-white hover:bg-gradient-to-r hover:from-accent/5 hover:to-indigo-600/5 border border-border hover:border-accent/30 text-foreground font-semibold py-3 px-4 rounded-xl transition-all text-sm hover:scale-[1.02] hover:shadow-md"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-input rounded-xl bg-input-background focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white p-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-accent/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
