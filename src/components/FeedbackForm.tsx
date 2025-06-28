import React, { useState } from 'react';
import { 
  Bug, 
  Lightbulb, 
  Send, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Star, 
  MessageSquare,
  User,
  Globe,
  Smartphone,
  Monitor,
  Info,
  Zap,
  Heart,
  Shield,
  X
} from 'lucide-react';

interface FeedbackData {
  type: 'bug' | 'feature';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  steps?: string;
  expected?: string;
  actual?: string;
  browser: string;
  device: string;
  email: string;
  emailNotifications: boolean;
}

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackData>({
    type: 'bug',
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    steps: '',
    expected: '',
    actual: '',
    browser: '',
    device: '',
    email: '',
    emailNotifications: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bugCategories = [
    'Interface/UI',
    'Funcionalidade',
    'Performance',
    'Compatibilidade',
    'Dados/Resultados',
    'Navegação',
    'Responsividade',
    'Acessibilidade',
    'Outro'
  ];

  const featureCategories = [
    'Nova Ferramenta',
    'Melhoria de Ferramenta',
    'Interface/UX',
    'Exportação/Importação',
    'Configurações',
    'Integração',
    'Performance',
    'Acessibilidade',
    'Outro'
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baixa', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { value: 'medium', label: 'Média', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { value: 'high', label: 'Alta', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { value: 'critical', label: 'Crítica', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (formData.type === 'bug') {
      if (!formData.steps?.trim()) {
        newErrors.steps = 'Passos para reproduzir são obrigatórios';
      }
      if (!formData.expected?.trim()) {
        newErrors.expected = 'Resultado esperado é obrigatório';
      }
      if (!formData.actual?.trim()) {
        newErrors.actual = 'Resultado atual é obrigatório';
      }
    }

    if (formData.emailNotifications && !formData.email.trim()) {
      newErrors.email = 'Email é obrigatório quando notificações estão ativadas';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio (em produção, seria uma API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real para sua API
      console.log('Feedback enviado:', formData);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'bug',
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      steps: '',
      expected: '',
      actual: '',
      browser: '',
      device: '',
      email: '',
      emailNotifications: false
    });
    setIsSubmitted(false);
    setErrors({});
  };

  const detectBrowserAndDevice = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Desconhecido';
    let device = 'Desktop';

    // Detectar navegador
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Detectar dispositivo
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      device = 'Mobile';
    } else if (/iPad/i.test(userAgent)) {
      device = 'Tablet';
    }

    setFormData(prev => ({ ...prev, browser, device }));
  };

  React.useEffect(() => {
    detectBrowserAndDevice();
  }, []);

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center">
          <div className="mb-6">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full inline-block mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ✅ Feedback Enviado com Sucesso!
            </h2>
            <p className="text-gray-600">
              Obrigado por contribuir para melhorar o OneDev. Sua {formData.type === 'bug' ? 'reportagem de bug' : 'solicitação de funcionalidade'} foi recebida.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-1">Próximos Passos</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Nossa equipe analisará seu feedback</li>
                  <li>• Priorizaremos baseado na urgência e impacto</li>
                  {formData.emailNotifications && (
                    <li>• Você receberá atualizações no email fornecido</li>
                  )}
                  <li>• Acompanhe o changelog para ver implementações</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetForm}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
              Enviar Outro Feedback
            </button>
            
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toolChange', { detail: 'dashboard' }))}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <X className="w-5 h-5" />
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Feedback & Sugestões
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Ajude-nos a melhorar o OneDev reportando bugs ou sugerindo novas funcionalidades
        </p>
      </div>

      {/* Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Tipo de Feedback
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange('type', 'bug')}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  formData.type === 'bug'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-red-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Bug className={`w-6 h-6 ${formData.type === 'bug' ? 'text-red-600' : 'text-gray-600'}`} />
                  <h3 className={`text-lg font-semibold ${formData.type === 'bug' ? 'text-red-900' : 'text-gray-900'}`}>
                    🐛 Reportar Bug
                  </h3>
                </div>
                <p className={`text-sm ${formData.type === 'bug' ? 'text-red-700' : 'text-gray-600'}`}>
                  Algo não está funcionando como esperado? Reporte aqui para que possamos corrigir.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange('type', 'feature')}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  formData.type === 'feature'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb className={`w-6 h-6 ${formData.type === 'feature' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <h3 className={`text-lg font-semibold ${formData.type === 'feature' ? 'text-blue-900' : 'text-gray-900'}`}>
                    💡 Sugerir Funcionalidade
                  </h3>
                </div>
                <p className={`text-sm ${formData.type === 'feature' ? 'text-blue-700' : 'text-gray-600'}`}>
                  Tem uma ideia para melhorar o OneDev? Compartilhe sua sugestão conosco.
                </p>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={formData.type === 'bug' ? 'Ex: Erro ao gerar QR Code com texto longo' : 'Ex: Adicionar suporte para exportar em PDF'}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Category and Priority */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {(formData.type === 'bug' ? bugCategories : featureCategories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('priority', option.value)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      formData.priority === option.value
                        ? `${option.bgColor} ${option.borderColor} ${option.color}`
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição Detalhada *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              placeholder={formData.type === 'bug' 
                ? 'Descreva o problema em detalhes. Inclua informações sobre quando acontece, em quais condições, etc.'
                : 'Descreva sua ideia em detalhes. Explique como funcionaria, qual problema resolveria, etc.'
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Bug-specific fields */}
          {formData.type === 'bug' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Informações do Bug
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-red-900 mb-2">
                      Passos para Reproduzir *
                    </label>
                    <textarea
                      value={formData.steps}
                      onChange={(e) => handleInputChange('steps', e.target.value)}
                      rows={3}
                      placeholder="1. Vá para a ferramenta X&#10;2. Digite 'exemplo' no campo Y&#10;3. Clique em 'Gerar'&#10;4. Observe o erro"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.steps ? 'border-red-500' : 'border-red-300'
                      }`}
                    />
                    {errors.steps && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.steps}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-900 mb-2">
                        Resultado Esperado *
                      </label>
                      <textarea
                        value={formData.expected}
                        onChange={(e) => handleInputChange('expected', e.target.value)}
                        rows={2}
                        placeholder="O que deveria acontecer?"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                          errors.expected ? 'border-red-500' : 'border-red-300'
                        }`}
                      />
                      {errors.expected && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.expected}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-900 mb-2">
                        Resultado Atual *
                      </label>
                      <textarea
                        value={formData.actual}
                        onChange={(e) => handleInputChange('actual', e.target.value)}
                        rows={2}
                        placeholder="O que realmente acontece?"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                          errors.actual ? 'border-red-500' : 'border-red-300'
                        }`}
                      />
                      {errors.actual && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.actual}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Environment Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Informações do Ambiente
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Navegador
                </label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.browser}
                    onChange={(e) => handleInputChange('browser', e.target.value)}
                    placeholder="Ex: Chrome 120, Firefox 121"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispositivo
                </label>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.device}
                    onChange={(e) => handleInputChange('device', e.target.value)}
                    placeholder="Ex: Desktop, iPhone 14, Android"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Notificações por Email (Opcional)
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="emailNotifications" className="text-sm font-medium text-blue-900 cursor-pointer">
                    Quero receber atualizações sobre este feedback
                  </label>
                  <p className="text-xs text-blue-700 mt-1">
                    Você receberá notificações quando houver progresso ou quando o item for implementado/corrigido.
                  </p>
                </div>
              </div>

              {formData.emailNotifications && (
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Seu Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-blue-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-blue-600">
                    Seu email será usado apenas para notificações sobre este feedback e não será compartilhado.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-green-900 mb-1">
                  🔒 Privacidade Garantida
                </h3>
                <p className="text-xs text-green-700 leading-relaxed">
                  Suas informações serão usadas apenas para processar este feedback. Não compartilhamos 
                  dados com terceiros e você pode solicitar a remoção a qualquer momento.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar {formData.type === 'bug' ? 'Bug Report' : 'Sugestão'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <X className="w-5 h-5" />
              Limpar Formulário
            </button>
          </div>
        </form>
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Heart className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">💜 Obrigado por Contribuir!</h3>
            <p className="text-purple-800 leading-relaxed mb-4">
              Seu feedback é essencial para tornar o OneDev cada vez melhor. Cada bug reportado e 
              cada sugestão nos ajuda a criar uma experiência mais útil e agradável para todos.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-lg p-3">
                <div className="font-semibold text-purple-900 mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Resposta Rápida
                </div>
                <p className="text-sm text-purple-700">
                  Bugs críticos são priorizados e corrigidos rapidamente. Outras melhorias são implementadas conforme roadmap.
                </p>
              </div>
              
              <div className="bg-white/50 rounded-lg p-3">
                <div className="font-semibold text-purple-900 mb-1 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Reconhecimento
                </div>
                <p className="text-sm text-purple-700">
                  Contribuições significativas são reconhecidas no changelog e na seção "Sobre" da aplicação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;