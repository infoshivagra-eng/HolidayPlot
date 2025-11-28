
import React from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Menu, X, Facebook, Twitter, Instagram, MapPin, Phone, Mail, Sparkles, RefreshCw } from 'lucide-react';
import Home from './pages/Home';
import PackageList from './pages/PackageList';
import PackageDetail from './pages/PackageDetail';
import Taxi from './pages/Taxi';
import DriverDashboard from './pages/DriverDashboard';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import AiPlanner from './pages/AiPlanner';
import { CurrencyProvider, useCurrency } from './CurrencyContext';
import { GlobalProvider, useGlobal } from './GlobalContext';

// Currency Toggle Component
const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();
  return (
    <button 
      onClick={toggleCurrency}
      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold transition-colors border border-gray-300"
      title="Toggle Currency"
    >
      <RefreshCw size={12} />
      {currency === 'USD' ? 'USD ($)' : 'INR (₹)'}
    </button>
  );
};

// Footer Component
const Footer = () => {
  const { companyProfile } = useGlobal();
  
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                    H
                  </div>
                  <span className="text-xl font-bold text-white">{companyProfile.name}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your gateway to incredible Indian adventures. We craft premium travel experiences and provide reliable transport solutions.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href={companyProfile.facebook} className="text-gray-400 hover:text-brand-blue transition-colors"><Facebook size={20} /></a>
                <a href={companyProfile.twitter} className="text-gray-400 hover:text-brand-blue transition-colors"><Twitter size={20} /></a>
                <a href={companyProfile.instagram} className="text-gray-400 hover:text-brand-blue transition-colors"><Instagram size={20} /></a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/ai-planner" className="hover:text-brand-green">AI Planner</Link></li>
                <li><Link to="/taxi" className="hover:text-brand-green">Careers / Drivers</Link></li>
                <li><Link to="/blog" className="hover:text-brand-green">Travel Blog</Link></li>
                <li><Link to="/admin" className="hover:text-brand-green">Admin Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-brand-green">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-green">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-brand-green">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-green">Cancellation Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-brand-orange mt-0.5" />
                  <span>{companyProfile.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-brand-orange" />
                  <span>{companyProfile.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-brand-orange" />
                  <span>{companyProfile.email}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 {companyProfile.name}. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-500">
               <span>Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </footer>
  );
};

// Shared Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'AI Planner', path: '/ai-planner' },
    { name: 'Taxi & Drivers', path: '/taxi' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                H
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-green">
                HolidayPot
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-brand-blue ${
                    location.pathname === link.path ? 'text-brand-blue font-bold' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                  {link.name === 'AI Planner' && <Sparkles size={12} className="inline ml-1 -mt-1 text-brand-orange"/>}
                </Link>
              ))}
              
              <CurrencyToggle />

              <Link to="/admin" className="text-xs font-semibold text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded">
                Admin
              </Link>
              <Link
                to="/packages"
                className="bg-brand-orange text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600 transition-shadow shadow-md hover:shadow-lg text-sm"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <CurrencyToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-brand-blue focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 h-screen overflow-y-auto pb-20">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-4 rounded-xl text-base font-medium transition-all ${
                    link.name === 'AI Planner' 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-brand-blue border border-blue-100 shadow-sm' 
                    : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.name}</span>
                    {link.name === 'AI Planner' && <Sparkles size={18} className="text-brand-orange"/>}
                  </div>
                </Link>
              ))}
               <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-4 rounded-xl text-base font-medium text-gray-400 hover:text-brand-blue hover:bg-gray-50 border border-transparent hover:border-gray-100"
                >
                  Admin Panel
                </Link>
              <Link
                to="/packages"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center mt-6 bg-brand-orange text-white px-4 py-4 rounded-xl font-bold shadow-md text-lg"
              >
                Find Packages
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <GlobalProvider>
      <CurrencyProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<PackageList />} />
              <Route path="/package/:id" element={<PackageDetail />} />
              <Route path="/taxi" element={<Taxi />} />
              <Route path="/driver-dashboard" element={<DriverDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/ai-planner" element={<AiPlanner />} />
              <Route path="*" element={<div className="h-screen flex items-center justify-center">404 - Page Not Found</div>} />
            </Routes>
          </Layout>
        </HashRouter>
      </CurrencyProvider>
    </GlobalProvider>
  );
};

export default App;
