import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Scan, 
  Menu,
  X,
  AlertTriangle,
  Barcode,
  LogIn,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import BarcodeGenerator from './components/BarcodeGenerator';
import BarcodeScanner from './components/BarcodeScanner';
import PricingPlans from './components/PricingPlans';
import Dashboard from './components/Dashboard';
import PaymentModal from './components/PaymentModal';
import AuthModal from './components/AuthModal';
import LanguageSelector from './components/LanguageSelector';
import BulkGenerator from './components/BulkGenerator';
import QRGenerator from './components/QRGenerator';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import BoycottPage from './components/BoycottPage';
import CountryCodesPage from './components/CountryCodesPage';
import AdBanner from './components/AdBanner';
import { AboutPage, ContactPage, HelpCenterPage, PrivacyPage, TermsPage } from './components/FooterPages';
import { useTheme } from './hooks/useTheme';
import { detectLanguageByIP } from './i18n/config';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem('userLanguage');
    if (!savedLang) {
      detectLanguageByIP().then((lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('userLanguage', lang);
      });
    }
  }, [i18n]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/bulk-generator" element={<BulkGeneratorPage />} />
        <Route path="/qr-generator" element={<QRGeneratorPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/boycott" element={<BoycottPage />} />
        <Route path="/country-codes" element={<CountryCodesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </Router>
  );
}

// Navigation Component
const Navigation = ({ user, onLogin, onLogout }: { user: any; onLogin: () => void; onLogout: () => void }) => {
  const { t } = useTranslation();
  const { getThemeColors, randomizeTheme } = useTheme();
  const colors = getThemeColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b-2 border-red-600 ${
        isScrolled ? 'bg-black/90 backdrop-blur-lg shadow-lg' : 'bg-black/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2" onClick={randomizeTheme}>
            <div className={`bg-gradient-to-r ${colors.primary} p-1.5 sm:p-2 rounded-lg`}>
              <Scan className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-white hidden sm:inline">BarcodeHub 🇵🇸</span>
            <span className="text-lg font-bold text-white sm:hidden">🇵🇸</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/generator" className="text-gray-300 hover:text-white transition text-sm font-semibold" onClick={randomizeTheme}>
              {t('nav.generator')}
            </Link>
            <Link to="/scanner" className="text-gray-300 hover:text-white transition text-sm font-semibold" onClick={randomizeTheme}>
              {t('nav.scanner')}
            </Link>
            <Link to="/boycott" className="text-red-400 hover:text-red-300 transition text-sm font-semibold flex items-center" onClick={randomizeTheme}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              Boykot
            </Link>
            <Link to="/country-codes" className="text-green-400 hover:text-green-300 transition text-sm font-semibold flex items-center" onClick={randomizeTheme}>
              <Barcode className="w-3 h-3 mr-1" />
              Kodlar
            </Link>
            <LanguageSelector />
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">{user.name}</span>
                <button onClick={onLogout} className="text-red-400 hover:text-red-300">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition text-sm font-semibold flex items-center"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Giriş
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageSelector />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-lg border-t-2 border-red-600 overflow-y-auto max-h-[80vh]"
          >
            <div className="px-3 py-3 space-y-2">
              {user && (
                <div className="pb-2 border-b border-white/10 mb-2">
                  <div className="flex items-center space-x-2 text-white">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm">{user.name}</span>
                  </div>
                </div>
              )}
              <Link to="/generator" className="block text-gray-300 hover:text-white transition py-2 text-sm" onClick={() => { setIsMenuOpen(false); randomizeTheme(); }}>
                {t('nav.generator')}
              </Link>
              <Link to="/scanner" className="block text-gray-300 hover:text-white transition py-2 text-sm" onClick={() => { setIsMenuOpen(false); randomizeTheme(); }}>
                {t('nav.scanner')}
              </Link>
              
              <div className="border-t border-red-600/50 pt-2 mt-2">
                <h3 className="text-red-400 font-bold text-xs mb-2 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Boykot & Farkındalık
                </h3>
                <Link to="/boycott" className="block text-gray-300 hover:text-white transition py-1.5 pl-3 text-sm" onClick={() => { setIsMenuOpen(false); randomizeTheme(); }}>
                  🚫 İsrail Markaları
                </Link>
                <Link to="/boycott" className="block text-gray-300 hover:text-white transition py-1.5 pl-3 text-sm" onClick={() => { setIsMenuOpen(false); randomizeTheme(); }}>
                  ✅ Alternatifler
                </Link>
                <Link to="/country-codes" className="block text-gray-300 hover:text-white transition py-1.5 pl-3 text-sm" onClick={() => { setIsMenuOpen(false); randomizeTheme(); }}>
                  📊 Ülke Kodları
                </Link>
              </div>

              <Link to="/pricing" className="block text-gray-300 hover:text-white transition py-2 text-sm" onClick={() => { setIsMenuOpen(false); randomizeTheme(); }}>
                {t('nav.pricing')}
              </Link>
              <Link to="/dashboard" className="block text-gray-300 hover:text-white transition py-2 text-sm" onClick={() => { setIsMenuOpen(false); randomizeTheme(); }}>
                {t('nav.dashboard')}
              </Link>
              
              {user ? (
                <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="w-full text-left text-red-400 hover:text-red-300 py-2 text-sm flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış Yap
                </button>
              ) : (
                <button 
                  onClick={() => { onLogin(); setIsMenuOpen(false); }}
                  className={`w-full bg-gradient-to-r ${colors.primary} text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center mt-2`}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Giriş Yap
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Footer Component
const Footer = () => {
  const { t } = useTranslation();
  const { getThemeColors, randomizeTheme } = useTheme();
  const colors = getThemeColors();

  return (
    <footer className="bg-black/80 border-t-2 border-red-600 py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className={`bg-gradient-to-r ${colors.primary} p-1.5 sm:p-2 rounded-lg`} onClick={randomizeTheme}>
                <Scan className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">🇵🇸</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">{t('footer.description')}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">{t('footer.product')}</h4>
            <div className="space-y-2">
              <Link to="/generator" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>{t('nav.generator')}</Link>
              <Link to="/scanner" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>{t('nav.scanner')}</Link>
              <Link to="/pricing" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>{t('nav.pricing')}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-red-400 font-semibold mb-3 text-sm">Boykot</h4>
            <div className="space-y-2">
              <Link to="/boycott" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>İsrail Markaları</Link>
              <Link to="/boycott" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>Alternatifler</Link>
              <Link to="/country-codes" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>Ülke Kodları</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">{t('footer.company')}</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>{t('footer.about')}</Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>{t('footer.contact')}</Link>
              <Link to="/help" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>{t('footer.helpCenter')}</Link>
              <Link to="/privacy" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>Gizlilik</Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white text-xs sm:text-sm" onClick={randomizeTheme}>Koşullar</Link>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-red-600/30 pt-6 text-center text-gray-400">
          <p className="text-xs sm:text-sm">&copy; 2024 BarcodeHub. {t('footer.copyright')}</p>
          <p className="mt-2 text-base sm:text-lg font-bold text-white">🇵🇸 Free Palestine 🇵🇸</p>
        </div>
      </div>
    </footer>
  );
};

function HomePage() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background}`}>
      <Navigation user={user} onLogin={() => setShowAuthModal(true)} onLogout={handleLogout} />
      
      <div className="pt-20 pb-12 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Ad Banner */}
          <div className="mb-8 flex justify-center">
            <AdBanner position="top" />
          </div>

          {/* Hero Section - Simplified for mobile */}
          <div className="text-center mb-12">
            <div className="text-5xl sm:text-6xl mb-4">🇵🇸</div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Bilinçli Tüketim
            </h1>
            <p className="text-base sm:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Barkod kodlarını kontrol edin, boykotu destekleyin!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/country-codes"
                className={`bg-gradient-to-r ${colors.primary} text-white px-6 py-3 rounded-full text-sm sm:text-base font-semibold hover:shadow-lg transition`}
              >
                <Barcode className="w-4 h-4 inline mr-2" />
                Ülke Kodları
              </Link>
              <Link
                to="/boycott"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition border-2 border-white"
              >
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Boykot Listesi
              </Link>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white text-center mb-8">Planlar</h2>
            <PricingPlans onSelectPlan={(plan) => { setSelectedPlan(plan); setShowPaymentModal(true); }} />
          </div>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
        {showPaymentModal && <PaymentModal plan={selectedPlan} onClose={() => setShowPaymentModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

// Simplified page wrappers
function GeneratorPage() {
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background}`}>
      <Navigation user={user} onLogin={() => setShowAuthModal(true)} onLogout={() => { localStorage.removeItem('user'); setUser(null); }} />
      <div className="pt-20 px-2 sm:px-4"><BarcodeGenerator /></div>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={setUser} />}
    </div>
  );
}

function BulkGeneratorPage() {
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background}`}>
      <Navigation user={user} onLogin={() => setShowAuthModal(true)} onLogout={() => { localStorage.removeItem('user'); setUser(null); }} />
      <div className="pt-20 px-2 sm:px-4"><BulkGenerator /></div>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={setUser} />}
    </div>
  );
}

function QRGeneratorPage() {
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background}`}>
      <Navigation user={user} onLogin={() => setShowAuthModal(true)} onLogout={() => { localStorage.removeItem('user'); setUser(null); }} />
      <div className="pt-20 px-2 sm:px-4"><QRGenerator /></div>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={setUser} />}
    </div>
  );
}

function ScannerPage() {
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background}`}>
      <Navigation user={user} onLogin={() => setShowAuthModal(true)} onLogout={() => { localStorage.removeItem('user'); setUser(null); }} />
      <div className="pt-20 px-2 sm:px-4"><BarcodeScanner /></div>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={setUser} />}
    </div>
  );
}

function PricingPage() {
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background}`}>
      <Navigation user={user} onLogin={() => setShowAuthModal(true)} onLogout={() => { localStorage.removeItem('user'); setUser(null); }} />
      <div className="pt-20 px-2 sm:px-4 pb-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-white text-center mb-8">Fiyatlandırma</h1>
        <PricingPlans onSelectPlan={(plan) => { setSelectedPlan(plan); setShowPaymentModal(true); }} />
      </div>
      <Footer />
      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={setUser} />}
        {showPaymentModal && <PaymentModal plan={selectedPlan} onClose={() => setShowPaymentModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AnalyticsPage() {
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background}`}>
      <Navigation user={user} onLogin={() => setShowAuthModal(true)} onLogout={() => { localStorage.removeItem('user'); setUser(null); }} />
      <div className="pt-20 px-2 sm:px-4"><AdvancedAnalytics /></div>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={setUser} />}
    </div>
  );
}

export default App;
