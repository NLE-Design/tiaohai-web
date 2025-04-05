import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrderContext from '../contexts/OrderContext';

const Order: React.FC = () => {
  const navigate = useNavigate();
  const { order, removeFromOrder, checkout } = React.useContext(OrderContext);

  const handleCheckout = () => {
    checkout();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">我的订单</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <span className="material-icons">arrow_back</span>
            <span>返回</span>
          </button>
        </div>

        {order.beers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 mb-4">
              <span className="material-icons text-6xl">shopping_cart</span>
            </div>
            <p className="text-xl text-gray-600 mb-4">您的订单还是空的</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              去选购啤酒
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {order.beers.map((beer, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start space-x-4">
                  {beer.image && (
                    <img 
                      src={beer.image} 
                      alt={beer.Name} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{beer.Name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{beer.Type}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{beer.ABV}</span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-red-500">${beer.Price}</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => removeFromOrder(beer.Name)}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex items-center space-x-1"
                      >
                        <span className="material-icons text-sm">delete</span>
                        <span>删除</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex justify-between items-center text-xl font-bold mb-6">
                <span>总计</span>
                <span className="text-red-500">${order.total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span className="material-icons">shopping_cart_checkout</span>
                <span>结账</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;