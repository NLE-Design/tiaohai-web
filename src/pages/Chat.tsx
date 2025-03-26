import React from 'react';

function Chat() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">AI 智能推荐</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            让AI为您推荐最适合的美食选择。告诉我您的喜好，我们会为您找到最佳推荐。
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 mb-2">您可以这样问：</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>有什么适合下酒的小菜推荐？</li>
              <li>想吃辣的，有什么推荐？</li>
              <li>有什么特色菜品？</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="输入您的问题..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat; 