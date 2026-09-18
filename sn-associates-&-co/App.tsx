import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Toaster, toast } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy loaded pages for memory and performance optimization
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Contact = lazy(() => import('./pages/Contact'));
const BookConsultation = lazy(() => import('./pages/BookConsultation'));
const News = lazy(() => import('./pages/News'));
const Store = lazy(() => import('./pages/Store'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const MyLearning = lazy(() => import('./pages/MyLearning'));
const Cart = lazy(() => import('./pages/Cart'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Careers = lazy(() => import('./pages/Careers'));
const SnacAcademy = lazy(() => import('./pages/SnacAcademy'));
const Enrollment = lazy(() => import('./pages/Enrollment'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Resources = lazy(() => import('./pages/Resources'));
const Blog = lazy(() => import('./pages/Blog'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));

// Dedicated Statutory Service Landing Hubs
const CompanyRegistration = lazy(() => import('./pages/service-pages/CompanyRegistration'));
const GstServices = lazy(() => import('./pages/service-pages/GstServices'));
const IncomeTaxServices = lazy(() => import('./pages/service-pages/IncomeTaxServices'));
const TrademarkServices = lazy(() => import('./pages/service-pages/TrademarkServices'));
const StartupIndiaServices = lazy(() => import('./pages/service-pages/StartupIndiaServices'));

// Interactive Statutory & Tax Calculator Tools
const GstCalculatorPage = lazy(() => import('./pages/tools/GstCalculatorPage'));
const IncomeTaxCalculatorPage = lazy(() => import('./pages/tools/IncomeTaxCalculatorPage'));
const IncorporationEstimatorPage = lazy(() => import('./pages/tools/IncorporationEstimatorPage'));

// Compliance Calendar & Real Client Proof
const ComplianceCalendar = lazy(() => import('./pages/ComplianceCalendar'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));

// Lightweight page loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-slate-500 font-medium text-sm animate-pulse">Loading content...</span>
  </div>
);

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
      toast.error(friendlyError);
      navigate('/login');
      return;
    }

    // Supabase success redirects for recovery
    if (hash.includes('type=recovery') || hash.includes('access_token=')) {
      toast.success("Authentication successful. Please set a new password.");
      setTimeout(() => navigate('/reset-password'), 200);
    }
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AuthHashHandler />
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin Route - No Layout */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Standard Routes */}
            <Route path="*" element={
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/tax" element={<Services />} />
                    <Route path="/services/audit" element={<Services />} />
                    <Route path="/services/gst" element={<Services />} />

                    {/* Dedicated High-Value Statutory Service Pages */}
                    <Route path="/services/company-registration" element={<CompanyRegistration />} />
                    <Route path="/services/gst-registration-filing" element={<GstServices />} />
                    <Route path="/services/income-tax-filing" element={<IncomeTaxServices />} />
                    <Route path="/services/trademark-registration" element={<TrademarkServices />} />
                    <Route path="/services/startup-india-msme" element={<StartupIndiaServices />} />

                    {/* Interactive Financial & Statutory Tools */}
                    <Route path="/tools/gst-calculator" element={<GstCalculatorPage />} />
                    <Route path="/tools/income-tax-calculator" element={<IncomeTaxCalculatorPage />} />
                    <Route path="/tools/incorporation-estimator" element={<IncorporationEstimatorPage />} />

                    {/* Compliance Hub & Client Proof */}
                    <Route path="/compliance-calendar" element={<ComplianceCalendar />} />
                    <Route path="/case-studies" element={<CaseStudies />} />

                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/blog" element={<Blog />} />
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
                </Suspense>
              </Layout>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
