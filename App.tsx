
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import BookConsultation from './pages/BookConsultation';
import News from './pages/News';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import MyLearning from './pages/MyLearning';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import OrderSuccess from './pages/OrderSuccess';
import { Toaster } from 'react-hot-toast';

// ScrollToTop component to ensure view resets on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        {/* Admin Route - No Layout */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Standard Routes */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news" element={<News />} />
              <Route path="/store" element={<Store />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/book-consultation" element={<BookConsultation />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
