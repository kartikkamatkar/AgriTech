import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  sendMessage,
  createNewSession,
  addUserMessage,
} from '../store/slices/chatbotSlice';

const Chatbot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSession, isTyping } = useSelector((state: RootState) => state.chatbot);

  const [message, setMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentSession) {
      dispatch(createNewSession());
    }
  }, [dispatch, currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && selectedImages.length === 0) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString(),
    };

    dispatch(addUserMessage(userMessage));
    
    const messageCopy = message;
    const imagesCopy = [...selectedImages];
    setMessage('');
    setSelectedImages([]);

    await dispatch(sendMessage({ message: messageCopy, images: imagesCopy }));
  };

  const quickQuestions = [
    'What crops are best for monsoon season?',
    'How to improve soil fertility?',
    'Best practices for pest control',
    'When to harvest wheat?',
    'How to use drip irrigation?',
  ];

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <div className="min-h-screen bg-agri-beige-soft py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-agri-green text-white flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AgriTech Assistant</h1>
              <p className="text-sm text-gray-600">
                Ask me anything about farming, crops, weather, or market prices
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-md flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!currentSession || currentSession.messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌾</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Welcome to AgriTech Assistant!
                </h2>
                <p className="text-gray-600 mb-6">
                  I'm here to help you with all your farming questions
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Try asking:</p>
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(q)}
                      className="block w-full text-left px-4 py-2 bg-agri-green-soft hover:bg-agri-green hover:text-white text-agri-green rounded-lg transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {currentSession.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-agri-green text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.role === 'assistant' && (
                          <span className="text-xl">🤖</span>
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.images && msg.images.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {msg.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt=""
                                  className="w-20 h-20 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-2">
                      <span>🤖</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-4">
            {selectedImages.length > 0 && (
              <div className="flex gap-2 mb-2">
                {selectedImages.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedImages([...selectedImages, ...Array.from(e.target.files || [])])}
                  className="hidden"
                />
                <span className="text-2xl">📷</span>
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question here..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
              <button
                type="submit"
                disabled={!message.trim() && selectedImages.length === 0}
                className="px-6 py-2 bg-agri-green text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
