import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function Chat() {
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

    // 模拟AI响应
    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: `根据您的喜好，我推荐：

1. Freedom (Lager, 5% ABV)
   - 清爽可口，适合入门
   - 价格: $15

2. YUZU (Lager, 4.8% ABV)
   - 柚子风味，清新果香
   - 价格: $22

您觉得这些推荐如何？我可以根据您的反馈继续调整。`,
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">AI 智能推荐</h1>
      
      {/* 聊天窗口 */}
      <div className="bg-white rounded-lg shadow-md mb-4">
        {/* 聊天记录 */}
        <div className="h-[60vh] overflow-y-auto p-6">
          {messages.map((message, index) => (
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
          ))}
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
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="告诉我您的口味偏好，我来为您推荐..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              disabled={loading}
            />
            <button
              type="submit"
              className={`px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              发送
            </button>
          </form>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">您可以这样问：</h2>
        <ul className="space-y-2 text-gray-600">
          <li>• 我喜欢清爽的啤酒，有什么推荐？</li>
          <li>• 想尝试一些果香型的精酿</li>
          <li>• 有什么适合下酒的小吃？</li>
          <li>• 新手入门，应该喝什么？</li>
        </ul>
      </div>
    </div>
  );
}

export default Chat; 