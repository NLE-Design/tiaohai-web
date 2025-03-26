import React from 'react';

function Community() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">美食社区</h1>
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">最新动态</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="ml-3">
                  <h3 className="font-medium">美食达人</h3>
                  <p className="text-sm text-gray-500">2分钟前</p>
                </div>
              </div>
              <p className="text-gray-700">今天尝试了新上的特色小龙虾，味道真的很赞！推荐大家都来尝尝。</p>
            </div>
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="ml-3">
                  <h3 className="font-medium">吃货小王</h3>
                  <p className="text-sm text-gray-500">1小时前</p>
                </div>
              </div>
              <p className="text-gray-700">麻辣香锅的配料太丰富了，而且可以自己选择辣度，很贴心。</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">发布动态</h2>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
            placeholder="分享您的美食体验..."
            rows={4}
          ></textarea>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            发布
          </button>
        </div>
      </div>
    </div>
  );
}

export default Community; 