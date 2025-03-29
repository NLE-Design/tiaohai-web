import React, { useState } from 'react';

// 导入图片
import placeholderImg from '../images/beers/Ritual De Lo Habitual-NOW.jpg'; // 使用这个作为默认占位图
import freedomImg from '../images/beers/Freedom.jpg';
import yoseRoseImg from '../images/beers/Yose Rose.jpg';
import amongstTheHerdImg from '../images/beers/Amongst The Herd.jpg';
import belliniSourImg from '../images/beers/Bellini Sour.jpg';
import megsyGingerImg from '../images/beers/Megsy Ginger.jpg';
import secretCircleImg from '../images/beers/Secret Circle.jpg';
import springPandanImg from '../images/beers/Spring Pandan.jpg';
import wintermelonOolongImg from '../images/beers/Wintermelon Oolong.jpg';
// 新增图片
import cacaoStoutImg from '../images/beers/Cacao Stout.jpg';
import earthImg from '../images/beers/Earth.jpg';
import raspberryCreamImg from '../images/beers/Raspberry & Cream.jpg';
import theMangoManImg from '../images/beers/The Mango Man.jpg';
import windImg from '../images/beers/Wind.jpg';
import yellowVanImg from '../images/beers/Yellow Van.jpg';

interface Beer {
  Name: string;
  "Price (SGD)": number;
  Type: string;
  ABV: string;
  Origin: string;
  Volume: string;
  Description: string;
  Taste: string;
  Ingredient: string;
  "Suitable mood": string;
  "Suitable Scene": string;
  "Health Level": string;
}

// 导入菜单数据
const menuData: Beer[] = require('../data/menu.json').filter((item: any): item is Beer => 'Type' in item && item.Name);

// 啤酒类型分类
const beerTypes = Array.from(new Set(menuData.map(beer => beer.Type)));

// 图片映射对象
const beerImages: Record<string, string> = {
  'Freedom': freedomImg,
  'Vose Rose': yoseRoseImg,
  'Amongst The Herd': amongstTheHerdImg,
  'Bellini Sour': belliniSourImg,
  'Megsy Ginger': megsyGingerImg,
  'Secret Circle': secretCircleImg,
  'Spring Pandan': springPandanImg,
  'Wintermelon Oolong': wintermelonOolongImg,
  // 新增图片映射
  'Cacao Stout': cacaoStoutImg,
  'Earth': earthImg,
  'Raspberry & Cream': raspberryCreamImg,
  'The Mango Man': theMangoManImg,
  'Wind': windImg,
  'Yellow Van': yellowVanImg,
  // 添加其他啤酒的映射，默认使用占位图
  'Ritual De Lo Habitual-NOW': placeholderImg
};

// 获取啤酒图片
const getBeerImage = (beerName: string): string => {
  console.log(`Trying to get image: ${beerName}`);
  return beerImages[beerName] || placeholderImg;
};

function Menu() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // 过滤啤酒数据
  const filteredBeers = menuData.filter(beer => 
    selectedType === 'all' || beer.Type === selectedType
  );

  // 处理图片加载错误
  const handleImageError = (beerName: string) => {
    console.log(`Image loading failed: ${beerName}`);
    setImageError(prev => ({
      ...prev,
      [beerName]: true
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Tiaohai Craft Beer Menu</h1>
      
      {/* 啤酒类型筛选 */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedType('all')}
        >
          All
        </button>
        {beerTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === type
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 菜单内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeers.map((beer, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
              showDetails === index ? 'transform scale-105 z-10' : ''
            }`}
          >
            {/* 啤酒图片 */}
            <div className="w-full bg-gray-100">
              <img
                src={imageError[beer.Name] ? placeholderImg : getBeerImage(beer.Name)}
                alt={beer.Name}
                className="w-full h-auto aspect-[4/3] object-cover"
                onError={() => {
                  console.log(`Image loading failed: ${beer.Name}`);
                  handleImageError(beer.Name);
                }}
                loading="lazy"
              />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{beer.Name}</h3>
                <div className="text-red-500 text-lg font-medium">
                  ${beer["Price (SGD)"]}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {beer.Type}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {beer.ABV}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {beer.Volume}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Origin:</span> {beer.Origin}
              </div>
              
              <p className="text-gray-700 text-sm mb-4">{beer.Description}</p>

              {showDetails === index && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Taste:</span>
                      <p className="text-gray-600">{beer.Taste}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Ingredients:</span>
                      <p className="text-gray-600">{beer.Ingredient}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Suitable Mood:</span>
                      <p className="text-gray-600">{beer["Suitable mood"]}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Suitable Scene:</span>
                      <p className="text-gray-600">{beer["Suitable Scene"]}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Health Level:</span>
                      <p className="text-gray-600">{beer["Health Level"]}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="mt-4 text-red-500 text-sm font-medium hover:text-red-600"
                onClick={() => setShowDetails(showDetails === index ? null : index)}
              >
                {showDetails === index ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu; 