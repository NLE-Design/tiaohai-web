import React from 'react';

function Menu() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">美食菜单</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">热门推荐</h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <span className="text-gray-800">特色小龙虾</span>
              <span className="text-gray-600">¥98/斤</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-800">麻辣香锅</span>
              <span className="text-gray-600">¥68/份</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-800">烤鱼</span>
              <span className="text-gray-600">¥128/条</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">今日特价</h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <span className="text-gray-800">啤酒</span>
              <span className="text-gray-600">¥10/瓶</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-800">炸鸡</span>
              <span className="text-gray-600">¥30/份</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-800">薯条</span>
              <span className="text-gray-600">¥15/份</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Menu; 