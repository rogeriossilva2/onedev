import React, { useState } from 'react';
import { Menu, X, Search, Calculator, Palette, Code, Settings, Home, CreditCard, Code2, Link, FileText, BarChart3, Shield, Scale, Cookie, Heart, Cog, Hash, QrCode, GitBranch, Monitor, Key, Lock, Type, Smartphone, User, Server, Building2, MapPin, Activity, MessageSquare, FileX, Wand2 } from 'lucide-react';
import CookieSettingsModal, { CookieSettings } from './CookieSettings';
import ThemeToggle from './ThemeToggle';
import { useAnalytics } from '../hooks/useAnalytics';

interface LayoutProps {
  children: React.ReactNode;
  currentTool?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentTool = 'seo' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  
  const { cookieSettings, updateCookieSettings, acceptCookies } = useAnalytics();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, active: currentTool === 'dashboard' },
    { id: 'seo', name: 'Gerador de SEO', icon: Search, active: currentTool === 'seo' },
    { id: 'gitignore-generator', name: 'Gerador .gitignore', icon: FileX, active: currentTool === 'gitignore-generator' },
    { id: 'readme-generator', name: 'Gerador README.md', icon: Wand2, active: currentTool === 'readme-generator' },
    { id: 'device-generator', name: 'Gerador de Dispositivo', icon: Smartphone, active: currentTool === 'device-generator' },
    
    { id: 'person-generator', name: 'Gerador de Pessoa', icon: User, active: currentTool === 'person-generator' },
    { id: 'company-generator', name: 'Gerador de Empresa', icon: Building2, active: currentTool === 'company-generator' },
    { id: 'cep-generator', name: 'Gerador de CEP', icon: MapPin, active: currentTool === 'cep-generator' },
    { id: 'imc-calculator', name: 'Calculadora de IMC', icon: Activity, active: currentTool === 'imc-calculator' },
    { id: 'lorem-ipsum', name: 'Gerador Lorem Ipsum', icon: Type, active: currentTool === 'lorem-ipsum' },
    { id: 'fake-rest-api', name: 'Gerador REST API Fake', icon: Server, active: currentTool === 'fake-rest-api' },
  ];

  const supportItems = [
    { id: 'feedback', name: 'Bugs & Sugestões', icon: MessageSquare, active: currentTool === 'feedback' },
  ];

  const policyItems = [
    { id: 'privacy', name: 'Política de Privacidade', icon: Shield, active: currentTool === 'privacy' },
    { id: 'cookies', name: 'Política de Cookies', icon: Cookie, active: currentTool === 'cookies' },
    { id: 'lgpd', name: 'Conformidade LGPD', icon: Scale, active: currentTool === 'lgpd' },
    { id: 'changelog', name: 'Changelog', icon: GitBranch, active: currentTool === 'changelog' },
    { id: 'about', name: 'Sobre o OneDev', icon: Heart, active: currentTool === 'about' },
  ];

  const handleMenuClick = (toolId: string) => {
    window.dispatchEvent(new CustomEvent('toolChange', { detail: toolId }));
    setSidebarOpen(false);
  };

  const handleSaveCookieSettings = (settings: CookieSettings) => {
    updateCookieSettings(settings);
    acceptCookies(settings);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col overflow-hidden transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 shadow-sm z-50 flex-shrink-0 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden transition-colors duration-200"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OneDev
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <button
                onClick={() => setShowCookieSettings(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <Cog className="w-4 h-4" />
                Cookies
              </button>
              <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
                Ferramentas úteis para desenvolvedores
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl transform transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-0 lg:flex lg:flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-6 space-y-6">
                {/* Main Tools */}
                <div>
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Ferramentas
                  </h3>
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleMenuClick(item.id)}
                          className={`
                            w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                            ${item.active 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Support */}
                <div>
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Suporte
                  </h3>
                  <div className="space-y-2">
                    {supportItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleMenuClick(item.id)}
                          className={`
                            w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                            ${item.active 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Policies & Info */}
                <div>
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Informações
                  </h3>
                  <div className="space-y-2">
                    {policyItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleMenuClick(item.id)}
                          className={`
                            w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                            ${item.active 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Settings */}
                <div>
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Configurações
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowCookieSettings(true)}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Cog className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate">Configurar Cookies</span>
                    </button>
                  </div>
                </div>
              </nav>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    🔒 Privacidade Total
                  </h3>
                  <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                    Todos os dados são processados localmente no seu navegador. 
                    Nenhuma informação é enviada para nossos servidores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      <CookieSettingsModal
        isOpen={showCookieSettings}
        onClose={() => setShowCookieSettings(false)}
        onSave={handleSaveCookieSettings}
        currentSettings={cookieSettings}
      />
    </div>
  );
};

export default Layout;