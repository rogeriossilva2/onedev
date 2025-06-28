import React from 'react';
import { Shield, Cookie, Info, CheckCircle, AlertTriangle, Eye, Lock } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Política de Cookies
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Transparência total sobre como utilizamos cookies em nossa plataforma
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 space-y-8">
        
        {/* Important Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">🔒 Privacidade Garantida</h3>
              <p className="text-green-800 leading-relaxed">
                <strong>O OneDev não armazena, coleta ou processa nenhum dado pessoal ou informação inserida pelos usuários.</strong> 
                Todas as operações são realizadas localmente no seu navegador, garantindo total privacidade e segurança.
              </p>
            </div>
          </div>
        </div>

        {/* What are Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            O que são Cookies?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. 
            Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente e fornecer 
            informações aos proprietários do site.
          </p>
        </section>

        {/* How We Use Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Cookie className="w-6 h-6 text-amber-600" />
            Como Utilizamos Cookies
          </h2>
          
          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Cookies Essenciais</h3>
                  <p className="text-blue-800 text-sm leading-relaxed mb-3">
                    Estes cookies são necessários para o funcionamento básico do site e não podem ser desabilitados.
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Preferências de tema (claro/escuro)</li>
                    <li>• Configurações de idioma</li>
                    <li>• Estado da sessão de navegação</li>
                    <li>• Preferências de layout das ferramentas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Cookies Funcionais</h3>
                  <p className="text-purple-800 text-sm leading-relaxed mb-3">
                    Melhoram a funcionalidade do site e personalizam sua experiência.
                  </p>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Lembrança da última ferramenta utilizada</li>
                    <li>• Configurações personalizadas de cada ferramenta</li>
                    <li>• Preferências de formatação (indentação, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What We DON'T Use */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">O que NÃO Utilizamos</h3>
                  <p className="text-red-800 text-sm leading-relaxed mb-3">
                    Para garantir sua privacidade, não utilizamos:
                  </p>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Cookies de rastreamento ou analytics</li>
                    <li>• Cookies de publicidade</li>
                    <li>• Cookies de terceiros para coleta de dados</li>
                    <li>• Cookies que armazenam dados pessoais</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Processing */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-green-600" />
            Processamento Local de Dados
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Importante:</strong> Todos os dados que você insere nas ferramentas do OneDev são processados 
              localmente no seu navegador. Isso significa que:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Seus dados nunca saem do seu dispositivo
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Não temos acesso às informações que você processa
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Não armazenamos histórico de uso das ferramentas
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Sua privacidade está 100% protegida
              </li>
            </ul>
          </div>
        </section>

        {/* Managing Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gerenciando Cookies</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Você pode controlar e/ou excluir cookies conforme desejar. Você pode excluir todos os cookies 
            que já estão no seu computador e pode configurar a maioria dos navegadores para impedir que 
            sejam colocados.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Atenção</h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Se você desabilitar os cookies, algumas funcionalidades do OneDev podem não funcionar 
                  corretamente, como a lembrança de suas preferências e configurações.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contato</h2>
          <p className="text-gray-700 leading-relaxed">
            Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato conosco através do 
            email: <a href="mailto:contato@agencione.com.br" className="text-blue-600 hover:text-blue-800 underline">
            contato@agencione.com.br</a>
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

export default CookiePolicy;