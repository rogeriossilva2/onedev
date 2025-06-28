import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  Globe,
  CheckCircle,
  Activity,
  Database,
  Lock,
  Eye,
  Cpu,
  Trash2,
  Info
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import ClearDataModal from './ClearDataModal';

const Dashboard: React.FC = () => {
  const { analyticsData, cookieConsent, clearAllData } = useAnalytics();
  const { toolUsage, sessionData, totalUsage } = analyticsData;
  const [showClearModal, setShowClearModal] = useState(false);

  const mostUsedTool = toolUsage.length > 0 
    ? toolUsage.reduce((prev, current) => (prev.uses > current.uses ? prev : current))
    : null;

  const stats = [
    {
      title: 'Ferramentas Utilizadas',
      value: toolUsage.filter(tool => tool.uses > 0).length,
      total: toolUsage.length,
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900'
    },
    {
      title: 'Total de Usos',
      value: totalUsage,
      total: null,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-900'
    },
    {
      title: 'Sessões Ativas',
      value: sessionData.totalSessions,
      total: null,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-900'
    },
    {
      title: 'Privacidade',
      value: '100%',
      total: null,
      icon: Shield,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-900'
    }
  ];

  const formatDate = (date: Date | null) => {
    if (!date) return 'Nunca usado';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Visão geral do seu uso das ferramentas OneDev - dados armazenados localmente no seu navegador
        </p>
      </div>

      {/* Tool Usage Tracking Notice */}
      <div className="mb-8 p-4 rounded-lg border bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-900">
              📊 Contagem de Uso de Ferramentas
            </h3>
            <p className="text-sm text-blue-700">
              A contagem de uso das ferramentas é <strong>obrigatória</strong> e sempre ativa para melhorar sua experiência. 
              Todos os dados permanecem localmente no seu navegador.
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Consent Status */}
      {cookieConsent !== null && (
        <div className={`mb-8 p-4 rounded-lg border ${
          cookieConsent 
            ? 'bg-green-50 border-green-200' 
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <Shield className={`w-5 h-5 ${
              cookieConsent ? 'text-green-600' : 'text-amber-600'
            }`} />
            <div>
              <h3 className={`font-medium ${
                cookieConsent ? 'text-green-900' : 'text-amber-900'
              }`}>
                {cookieConsent ? '✅ Cookies Aceitos' : '⚠️ Cookies Limitados'}
              </h3>
              <p className={`text-sm ${
                cookieConsent ? 'text-green-700' : 'text-amber-700'
              }`}>
                {cookieConsent 
                  ? 'Todas as funcionalidades de analytics estão ativas.'
                  : 'Apenas contagem de uso de ferramentas está ativa (obrigatória). Outras funcionalidades de analytics estão desabilitadas.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">🔒 Dados 100% Locais</h3>
            <p className="text-green-800 leading-relaxed">
              Todas as estatísticas mostradas neste dashboard são armazenadas localmente no seu navegador. 
              <strong> Nenhum dado é enviado para nossos servidores ou terceiros.</strong> A contagem de uso 
              das ferramentas é obrigatória para melhorar sua experiência, mas permanece sempre no seu dispositivo.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} border rounded-2xl p-6 transition-all hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.total && (
                  <span className="text-xs text-gray-500">
                    de {stat.total}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {typeof stat.value === 'number' && stat.total ? 
                    `${stat.value}/${stat.total}` : 
                    stat.value
                  }
                </p>
                <p className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Tool Usage - SEMPRE DISPONÍVEL */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">Uso das Ferramentas</h2>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              SEMPRE ATIVO
            </span>
          </div>

          <div className="space-y-4">
            {toolUsage
              .sort((a, b) => b.uses - a.uses)
              .map((tool) => {
                const percentage = totalUsage > 0 ? (tool.uses / totalUsage) * 100 : 0;
                
                return (
                  <div key={tool.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{tool.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {tool.uses} {tool.uses === 1 ? 'uso' : 'usos'}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{percentage.toFixed(1)}% do total</span>
                      <span>Último uso: {formatDate(tool.lastUsed)}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Session Info & Privacy */}
        <div className="space-y-6">
          {/* Session Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Informações da Sessão</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Sessão Atual:</span>
                  <span className="text-sm text-blue-700">#{sessionData.currentSession}</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-900">Total de Sessões:</span>
                  <span className="text-sm text-purple-700">{sessionData.totalSessions}</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Iniciada em:</span>
                  <span className="text-sm text-green-700">
                    {formatDate(sessionData.startTime)}
                  </span>
                </div>
              </div>

              {mostUsedTool && mostUsedTool.uses > 0 && (
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-900">Ferramenta Favorita:</span>
                    <span className="text-sm text-amber-700">{mostUsedTool.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Features */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Recursos de Privacidade</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900">Processamento Local</p>
                  <p className="text-xs text-green-700">Dados nunca saem do seu navegador</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Database className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Zero Coleta</p>
                  <p className="text-xs text-blue-700">Nenhum dado pessoal é coletado</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Lock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Criptografia Nativa</p>
                  <p className="text-xs text-purple-700">Proteção automática do navegador</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <Cpu className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Client-Side Only</p>
                  <p className="text-xs text-amber-700">Arquitetura 100% local</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Activity className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">🗂️ Gerenciar Dados Locais</h3>
            <p className="text-amber-800 leading-relaxed mb-4">
              Todos os dados mostrados neste dashboard são armazenados localmente no seu navegador. 
              A contagem de uso das ferramentas é obrigatória para melhorar sua experiência, mas você 
              pode limpar essas informações a qualquer momento:
            </p>
            
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="space-y-2 text-sm text-amber-700">
                  <p>• <strong>Chrome/Edge:</strong> Configurações → Privacidade → Limpar dados de navegação</p>
                  <p>• <strong>Firefox:</strong> Configurações → Privacidade → Limpar dados</p>
                  <p>• <strong>Safari:</strong> Preferências → Privacidade → Gerenciar dados do site</p>
                  <p>• <strong>OneDev:</strong> Use o botão abaixo para limpeza completa e segura</p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowClearModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Trash2 className="w-5 h-5" />
                  Limpar Todos os Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Data Modal */}
      <ClearDataModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearData}
      />
    </div>
  );
};

export default Dashboard;