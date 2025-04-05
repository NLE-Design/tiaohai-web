import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface Beer {
  Name: string;
  Price: string;
  Type: string;
  ABV: string;
  Description: string;
  image?: string;
}

interface Order {
  beers: Beer[];
  total: number;
}

interface OrderContextType {
  order: Order;
  addToOrder: (beer: Beer) => void;
  removeFromOrder: (beerName: string) => void;
  checkout: () => void;
}

const OrderContext = createContext<OrderContextType>({
  order: { beers: [], total: 0 },
  addToOrder: () => {},
  removeFromOrder: () => {},
  checkout: () => {},
});

export const useOrder = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<Order>({ beers: [], total: 0 });
  const navigate = useNavigate();

  const addToOrder = (beer: Beer) => {
    setOrder(prev => {
      const newBeers = [...prev.beers, beer];
      const newTotal = newBeers.reduce((sum, beer) => {
        // 确保Price是数字，无论它是字符串还是数字类型
        const price = typeof beer.Price === 'string' ? parseFloat(beer.Price) : beer.Price;
        return sum + price;
      }, 0);
      return {
        beers: newBeers,
        total: newTotal,
      };
    });
  };

  const removeFromOrder = (beerName: string) => {
    setOrder(prev => {
      const newBeers = prev.beers.filter(beer => beer.Name !== beerName);
      const newTotal = newBeers.reduce((sum, beer) => sum + parseFloat(beer.Price), 0);
      return {
        beers: newBeers,
        total: newTotal,
      };
    });
  };

  const checkout = () => {
  if (order.beers.length === 0) {
    alert('请先添加啤酒到订单中！');
    return;
  }
  alert(`订单总额：$${order.total.toFixed(2)}\n即将跳转到支付页面...`);
  navigate('/order');
};

return (
    <OrderContext.Provider value={{ order, addToOrder, removeFromOrder, checkout }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;