
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import Careers from './pages/Careers';
import SnacAcademy from './pages/SnacAcademy';
import Enrollment from './pages/Enrollment';
import ResetPassword from './pages/ResetPassword';
import Resources from './pages/Resources';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AuthCallback from './pages/AuthCallback';
import { Toaster } from 'react-hot-toast';

// ScrollToTop component to ensure view resets on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Handles Supabase authentication redirects within a Hash Router
const AuthHashHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    // Supabase error redirects look like #error=access_denied&error_code=otp_expired...
    if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.slice(1));
      const errorDesc = params.get('error_description') || 'Authentication link is invalid or expired.';
      const friendlyError = decodeURIComponent(errorDesc.replace(/\+/g, ' '));
      import('react-hot-toast').then(({ toast }) => toast.error(friendlyError));
      navigate('/login');
      return;
    }

    // Supabase success redirects for recovery
    if (hash.includes('type=recovery') || hash.includes('access_token=')) {
      import('react-hot-toast').then(({ toast }) => toast.success("Authentication successful. Please set a new password."));
      setTimeout(() => navigate('/reset-password'), 200);
    }
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthHashHandler />
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
              <Route path="/services/tax" element={<Services />} />
              <Route path="/services/audit" element={<Services />} />
              <Route path="/services/gst" element={<Services />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news" element={<News />} />
              <Route path="/store" element={<Store />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/book-consultation" element={<BookConsultation />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/snac-academy" element={<SnacAcademy />} />
              <Route path="/enrollment" element={<Enrollment />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
