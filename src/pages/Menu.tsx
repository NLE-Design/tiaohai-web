import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

interface MenuData {
  "Beer Menu": Beer[];
  "Snack Menu": Snack[];
}

const Menu: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [activeTab, setActiveTab] = useState<'beer' | 'snack'>('beer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/menu');
        setMenuData(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标签页 */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === 'beer'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('beer')}
        >
          精酿啤酒
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'snack'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('snack')}
        >
          小吃
        </button>
      </div>

      {/* 菜单内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'beer' && menuData?.["Beer Menu"].map((beer, index) => (
          <div key={index} className="card">
            <h3 className="text-xl font-semibold mb-2">{beer.Name}</h3>
            <div className="text-accent text-lg mb-2">${beer["Price (SGD)"]}</div>
            <div className="text-sm text-gray-600 mb-2">
              {beer.Type} | {beer.ABV} | {beer.Volume}
            </div>
            <div className="text-sm text-gray-500 mb-2">产地: {beer.Origin}</div>
            <p className="text-gray-700">{beer.Description}</p>
          </div>
        ))}

        {activeTab === 'snack' && menuData?.["Snack Menu"].map((snack, index) => (
          <div key={index} className="card">
            <h3 className="text-xl font-semibold mb-2">{snack.Name}</h3>
            <div className="text-accent text-lg">${snack["Price (SGD)"]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu; 