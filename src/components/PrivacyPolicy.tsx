import React from 'react';
import { Shield, Lock, Eye, Database, Mail, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Seu compromisso com a proteção de dados e transparência total
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 space-y-8">
        
        {/* Privacy Guarantee */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">🔐 Garantia de Privacidade Total</h3>
              <p className="text-green-800 leading-relaxed">
                <strong>O OneDev é uma aplicação 100% client-side.</strong> Isso significa que todos os dados 
                que você insere são processados localmente no seu navegador e nunca são enviados para nossos 
                servidores ou qualquer terceiro. Sua privacidade é nossa prioridade absoluta.
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Introdução
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Agencione, desenvolvedora do OneDev, está comprometida em proteger e respeitar sua privacidade. 
            Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações quando 
            você utiliza nossa plataforma de ferramentas para desenvolvedores.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) 
            e outras regulamentações aplicáveis de proteção de dados.
          </p>
        </section>

        {/* Data We DON'T Collect */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-red-600" />
            Dados que NÃO Coletamos
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 leading-relaxed mb-4">
              <strong>O OneDev não coleta, armazena ou processa nenhum dos seguintes dados:</strong>
            </p>
            <ul className="text-red-700 space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                Conteúdo inserido nas ferramentas (JSON, URLs, texto, etc.)
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                Dados pessoais ou informações sensíveis
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                Histórico de uso das ferramentas
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                Endereço IP ou localização geográfica
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                Informações do dispositivo ou navegador
              </li>
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-600" />
            Como Funciona o Processamento Local
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                No Seu Navegador
              </h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li>• Todos os dados permanecem no seu dispositivo</li>
                <li>• Processamento 100% local via JavaScript</li>
                <li>• Nenhuma comunicação com servidores externos</li>
                <li>• Controle total sobre seus dados</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Segurança Garantida
              </h3>
              <ul className="text-green-800 text-sm space-y-2">
                <li>• Dados nunca saem do seu navegador</li>
                <li>• Sem risco de vazamento ou interceptação</li>
                <li>• Privacidade preservada por design</li>
                <li>• Conformidade automática com LGPD</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cookies and Local Storage */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies e Armazenamento Local</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Utilizamos apenas cookies essenciais e armazenamento local para:
          </p>
          <ul className="text-gray-700 space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              Salvar suas preferências de tema e configurações
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              Lembrar a última ferramenta utilizada
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              Manter configurações personalizadas das ferramentas
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Estes dados são armazenados apenas no seu navegador e podem ser removidos a qualquer momento 
            através das configurações do navegador.
          </p>
        </section>

        {/* LGPD Compliance */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conformidade com a LGPD</h2>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <p className="text-purple-800 leading-relaxed mb-4">
              O OneDev está em total conformidade com a Lei Geral de Proteção de Dados (LGPD) porque:
            </p>
            <ul className="text-purple-700 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <strong>Não coletamos dados pessoais:</strong> Nenhuma informação pessoal é processada ou armazenada
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <strong>Processamento local:</strong> Todos os dados permanecem sob seu controle
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <strong>Transparência total:</strong> Esta política explica claramente nossas práticas
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <strong>Privacidade por design:</strong> A arquitetura garante proteção automática
              </li>
            </ul>
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seus Direitos</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Embora não coletemos dados pessoais, você tem os seguintes direitos:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Controle Total</h3>
              <p className="text-gray-700 text-sm">
                Você mantém controle absoluto sobre todos os dados que processa na plataforma.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Transparência</h3>
              <p className="text-gray-700 text-sm">
                Acesso completo a informações sobre como a plataforma funciona.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Portabilidade</h3>
              <p className="text-gray-700 text-sm">
                Todos os resultados podem ser copiados ou exportados livremente.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Exclusão</h3>
              <p className="text-gray-700 text-sm">
                Limpe cookies e dados locais a qualquer momento pelo navegador.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Contato e Responsável
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Agencione - Controlador de Dados</h3>
            <div className="text-blue-800 space-y-2">
              <p><strong>Email:</strong> contato@agencione.com.br</p>
              <p><strong>Responsável pela Proteção de Dados:</strong> Equipe Agencione</p>
              <p><strong>Endereço:</strong> Brasil</p>
            </div>
            <p className="text-blue-700 text-sm mt-4">
              Entre em contato conosco se tiver dúvidas sobre esta política ou sobre o funcionamento da plataforma.
            </p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Alterações nesta Política</h2>
          <p className="text-gray-700 leading-relaxed">
            Podemos atualizar esta Política de Privacidade ocasionalmente. Quando fizermos isso, 
            revisaremos a data de "última atualização" na parte inferior desta página. 
            Recomendamos que você revise esta política periodicamente para se manter informado 
            sobre como estamos protegendo suas informações.
          </p>
        </section>

        {/* Last Updated */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Última atualização: Janeiro de 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;