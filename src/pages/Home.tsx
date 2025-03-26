import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">欢迎来到跳海</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">发现美食</h2>
          <p className="text-gray-600">探索各种精选美食，让您的味蕾享受一场美味之旅。</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">智能推荐</h2>
          <p className="text-gray-600">基于AI的个性化推荐，为您找到最适合的美食选择。</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">美食社区</h2>
          <p className="text-gray-600">加入我们的社区，分享美食体验，结识志同道合的美食爱好者。</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">在线交流</h2>
          <p className="text-gray-600">随时与其他用户交流，获取最新的美食资讯和推荐。</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 