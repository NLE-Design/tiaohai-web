import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 英雄区域 */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          欢迎来到跳海
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          发现独特的精酿啤酒，让AI为您推荐最适合的选择
        </p>
        <Link
          to="/chat"
          className="btn btn-primary text-lg px-8 py-3"
        >
          开始AI推荐
        </Link>
      </section>

      {/* 特色功能 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="text-accent text-4xl mb-4">🍺</div>
          <h3 className="text-xl font-semibold mb-2">精选酒单</h3>
          <p className="text-gray-600">
            探索我们丰富的精酿啤酒和小吃菜单
          </p>
        </div>
        <div className="card text-center">
          <div className="text-accent text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">AI推荐</h3>
          <p className="text-gray-600">
            智能对话系统为您推荐最适合的酒品
          </p>
        </div>
        <div className="card text-center">
          <div className="text-accent text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">社区互动</h3>
          <p className="text-gray-600">
            与其他酒友分享您的品酒体验
          </p>
        </div>
      </section>

      {/* 最新推荐 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">最新推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 这里可以添加最新推荐的酒品卡片 */}
        </div>
      </section>
    </div>
  );
};

export default Home; 