import React, { useState } from 'react';

interface Beer {
  Name: string;
  "Price (SGD)": number;
  Type: string;
  ABV: string;
  Origin: string;
  Volume: string;
  Description: string;
}

interface Snack {
  Name: string;
  "Price (SGD)": number;
}

const menuData = {
  "Beer Menu": [
    {
      "Name": "Freedom",
      "Price (SGD)": 15,
      "Type": "Lager",
      "ABV": "5%",
      "Origin": "Singapore",
      "Volume": "475ml",
      "Description": "This unfiltered craft beer celebrates finesse and elegance, with a soft malt profile and balanced noble hop aroma for a refreshing, crushable experience."
    },
    // ... 其他啤酒数据
  ],
  "Snack Menu": [
    {
      "Name": "Lychee - shaped Shrimp Balls",
      "Price (SGD)": 12
    },
    // ... 其他小吃数据
  ]
};

function Menu() {
  const [activeTab, setActiveTab] = useState<'beer' | 'snack'>('beer');

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">酒品与小吃</h1>
      
      {/* 标签切换 */}
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'beer'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('beer')}
        >
          精酿啤酒
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'snack'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('snack')}
        >
          精选小吃
        </button>
      </div>

      {/* 菜单内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'beer' && menuData["Beer Menu"].map((beer, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{beer.Name}</h3>
            <div className="text-red-500 text-lg mb-2">${beer["Price (SGD)"]}</div>
            <div className="text-sm text-gray-600 mb-2">
              {beer.Type} | {beer.ABV} | {beer.Volume}
            </div>
            <div className="text-sm text-gray-500 mb-2">产地: {beer.Origin}</div>
            <p className="text-gray-700 text-sm">{beer.Description}</p>
          </div>
        ))}

        {activeTab === 'snack' && menuData["Snack Menu"].map((snack, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{snack.Name}</h3>
            <div className="text-red-500 text-lg">${snack["Price (SGD)"]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu; 