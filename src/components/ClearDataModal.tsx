import React, { useState } from 'react';
import { 
  Trash2, 
  X, 
  AlertTriangle, 
  Shield, 
  Database, 
  Clock, 
  BarChart3, 
  Settings, 
  CheckCircle,
  Loader2,
  Info,
  Zap
} from 'lucide-react';

interface ClearDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearDataModal: React.FC<ClearDataModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isClearing, setIsClearing] = useState(false);
  const [step, setStep] = useState<'confirm' | 'clearing' | 'success'>('confirm');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setStep('clearing');
    setIsClearing(true);
    
    // Simular processo de limpeza com delay para melhor UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onConfirm();
    setStep('success');
    
    // Fechar modal após sucesso
    setTimeout(() => {
      setIsClearing(false);
      setStep('confirm');
      onClose();
    }, 2000);
  };

  const dataTypes = [
    {
      icon: BarChart3,
      name: 'Estatísticas de Uso',
      description: 'Contagem de uso das ferramentas',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Clock,
      name: 'Dados de Sessão',
      description: 'Informações de sessões ativas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Settings,
      name: 'Preferências',
      description: 'Configurações de cookies e tema',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Database,
      name: 'Histórico Local',
      description: 'Histórico de cálculos e resultados',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all">
        {step === 'confirm' && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Limpar Todos os Dados
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-red-900 mb-2">
                    ⚠️ Ação Irreversível
                  </h4>
                  <p className="text-red-800 leading-relaxed">
                    Esta ação irá <strong>remover permanentemente</strong> todos os dados armazenados 
                    localmente no seu navegador. Esta operação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Types */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Dados que serão removidos:
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {dataTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div key={index} className={`${type.bgColor} border border-gray-200 rounded-lg p-3`}>
                      <div className="flex items-start gap-2">
                        <Icon className={`w-4 h-4 ${type.color} mt-0.5 flex-shrink-0`} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{type.name}</div>
                          <div className="text-xs text-gray-600">{type.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    🔒 Dados Locais
                  </h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Todos os dados são armazenados apenas no seu navegador. Nenhuma informação 
                    é enviada para nossos servidores, garantindo total privacidade.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-900 mb-2">
                    📋 O que acontecerá:
                  </h4>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• Todas as estatísticas de uso serão zeradas</li>
                    <li>• Histórico de cálculos será removido</li>
                    <li>• Configurações voltarão ao padrão</li>
                    <li>• Cookies de sessão serão limpos</li>
                    <li>• Modal de cookies aparecerá novamente</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
                Sim, Limpar Tudo
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Certifique-se de que realmente deseja remover todos os dados antes de confirmar.
            </p>
          </div>
        )}

        {step === 'clearing' && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full inline-block mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Limpando Dados...
              </h3>
              <p className="text-gray-600">
                Removendo todos os dados armazenados localmente
              </p>
            </div>

            <div className="space-y-3">
              {dataTypes.map((type, index) => {
                const Icon = type.icon;
                const delay = index * 500;
                
                return (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition-all duration-500 ${
                      isClearing ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
                    }`}
                    style={{ transitionDelay: `${delay}ms` }}
                  >
                    <Icon className={`w-4 h-4 ${type.color}`} />
                    <span className="text-sm text-gray-700 flex-1 text-left">{type.name}</span>
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full inline-block mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ✅ Dados Limpos com Sucesso!
              </h3>
              <p className="text-gray-600">
                Todos os dados foram removidos do seu navegador
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <h4 className="text-sm font-medium text-green-900">Limpeza Concluída</h4>
                  <p className="text-xs text-green-700">
                    O OneDev foi resetado para o estado inicial. Você pode começar a usar novamente!
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Este modal será fechado automaticamente...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClearDataModal;