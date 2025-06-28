import React, { useState } from 'react';
import { Cookie, Shield, BarChart3, Palette, Clock, X, Save, Info } from 'lucide-react';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: CookieSettings) => void;
  currentSettings: CookieSettings;
}

export interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  functional: boolean;
}

const CookieSettingsModal: React.FC<CookieSettingsProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings 
}) => {
  const [settings, setSettings] = useState<CookieSettings>(currentSettings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const cookieTypes = [
    {
      id: 'essential' as keyof CookieSettings,
      name: 'Cookies Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      required: true,
      details: [
        'Funcionamento básico da aplicação',
        'Navegação entre páginas',
        'Segurança da sessão',
        'Contagem de uso de ferramentas (OBRIGATÓRIO)'
      ]
    },
    {
      id: 'analytics' as keyof CookieSettings,
      name: 'Cookies de Análise',
      description: 'Contabilizam sessões e dados estatísticos (dados locais)',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      required: false,
      details: [
        'Estatísticas de sessão',
        'Dados de performance local',
        'Análise de padrões de uso'
      ]
    },
    {
      id: 'preferences' as keyof CookieSettings,
      name: 'Cookies de Preferências',
      description: 'Salvam suas configurações personalizadas',
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      required: false,
      details: [
        'Tema claro/escuro',
        'Configurações de ferramentas',
        'Idioma preferido'
      ]
    },
    {
      id: 'functional' as keyof CookieSettings,
      name: 'Cookies Funcionais',
      description: 'Melhoram a experiência de uso',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      required: false,
      details: [
        'Última ferramenta utilizada',
        'Histórico de navegação local',
        'Configurações de layout'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Cookie className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Configurações de Cookies
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-900 mb-1">
                  🔒 Privacidade Garantida
                </h4>
                <p className="text-xs text-green-700 leading-relaxed">
                  Todos os cookies são armazenados localmente no seu navegador. 
                  Nenhum dado é enviado para nossos servidores ou terceiros.
                </p>
              </div>
            </div>
          </div>

          {/* Mandatory Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  📊 Contagem Obrigatória
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  A contagem de uso das ferramentas é sempre ativa para melhorar sua experiência. 
                  Esta funcionalidade não pode ser desabilitada, mas os dados permanecem apenas no seu navegador.
                </p>
              </div>
            </div>
          </div>

          {/* Cookie Types */}
          <div className="space-y-4">
            {cookieTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className={`${type.bgColor} ${type.borderColor} border rounded-lg p-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className={`w-5 h-5 ${type.color} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {type.name}
                          </h4>
                          {type.required && (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                              Obrigatório
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {type.description}
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {type.details.map((detail, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-gray-400 rounded-full" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[type.id]}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            [type.id]: e.target.checked
                          }))}
                          disabled={type.required}
                          className="sr-only peer"
                        />
                        <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${type.required ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Save className="w-4 h-4" />
              Salvar Preferências
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            A contagem de uso das ferramentas permanece sempre ativa. Suas outras preferências são salvas localmente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieSettingsModal;