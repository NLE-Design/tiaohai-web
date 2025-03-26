import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Dify API 配置
const DIFY_API_KEY = 'app-lrAlpUg3loqDNxgQlE1c6woM';
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: input.trim(),
          response_mode: "blocking",
          conversation_id: null,
          user: "web-user"
        }),
      });

      if (!response.ok) {
        throw new Error('API 请求失败');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        role: 'assistant',
        content: data.answer,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('API 错误:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，我现在遇到了一些问题。请稍后再试。',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="min-h-screen bg-black bg-opacity-50 backdrop-blur-sm py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* 欢迎标语 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 font-serif">跳海精酿酒馆</h1>
            <p className="text-xl text-gray-200">探索精酿啤酒的无限可能</p>
          </div>

          {/* AI 聊天窗口 */}
          <div className="bg-white bg-opacity-90 rounded-lg shadow-2xl backdrop-blur-md mb-8">
            {/* 聊天记录 */}
            <div className="h-[40vh] overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-center">
                    👋 你好！我是跳海的 AI 调酒师<br />
                    告诉我你的口味偏好，让我为你推荐合适的精酿啤酒
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入框 */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="告诉我您的口味偏好，我来为您推荐..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 bg-white"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className={`px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  发送
                </button>
              </form>
            </div>
          </div>

          {/* 提示卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md backdrop-blur-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🍺 你可以这样问</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• 我喜欢清爽的啤酒，有什么推荐？</li>
                <li>• 想尝试一些果香型的精酿</li>
                <li>• 新手入门，应该喝什么？</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md backdrop-blur-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🌟 今日推荐</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Freedom Lager - 清爽畅快</li>
                <li>• YUZU - 柚子风味精酿</li>
                <li>• 水果啤系列 - 多种风味可选</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;