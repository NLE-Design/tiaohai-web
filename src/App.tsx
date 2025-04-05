import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { OrderProvider } from './contexts/OrderContext';
import Order from './pages/Order';

const App: React.FC = () => {

  return (
    <Router basename="/tiaohai-web">
      <OrderProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </OrderProvider>
    </Router>
  );
};

export default App;