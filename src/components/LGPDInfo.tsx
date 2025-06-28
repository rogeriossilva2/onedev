import React from 'react';
import { Shield, Scale, CheckCircle, Info, Lock, Eye, Database, AlertTriangle } from 'lucide-react';

const LGPDInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Conformidade LGPD
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Como o OneDev garante total conformidade com a Lei Geral de Proteção de Dados
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 space-y-8">
        
        {/* LGPD Compliance Badge */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-8 h-8 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">✅ 100% Conforme com a LGPD</h3>
              <p className="text-green-800 leading-relaxed">
                O OneDev foi desenvolvido com <strong>privacidade por design</strong>, garantindo conformidade 
                automática e total com a Lei Geral de Proteção de Dados (Lei 13.709/2018) e regulamentações 
                internacionais como GDPR.
              </p>
            </div>
          </div>
        </div>

        {/* What is LGPD */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            O que é a LGPD?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) é a legislação brasileira que 
            regula o tratamento de dados pessoais, garantindo maior controle aos cidadãos sobre suas 
            informações pessoais e estabelecendo regras claras para empresas e organizações.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Principais Objetivos da LGPD:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Proteger os direitos fundamentais de liberdade e privacidade</li>
              <li>• Garantir transparência no tratamento de dados pessoais</li>
              <li>• Estabelecer responsabilidades para quem coleta e processa dados</li>
              <li>• Dar controle aos titulares sobre seus dados pessoais</li>
            </ul>
          </div>
        </section>

        {/* How OneDev Complies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Como o OneDev Garante Conformidade
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Privacy by Design */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Privacidade por Design</h3>
                  <p className="text-green-800 text-sm leading-relaxed mb-3">
                    A arquitetura do OneDev foi projetada desde o início para não coletar dados pessoais.
                  </p>
                  <ul className="text-green-700 text-xs space-y-1">
                    <li>• Processamento 100% client-side</li>
                    <li>• Nenhum servidor de dados</li>
                    <li>• Sem coleta automática de informações</li>
                    <li>• Proteção nativa contra vazamentos</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* No Data Collection */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Database className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Zero Coleta de Dados</h3>
                  <p className="text-red-800 text-sm leading-relaxed mb-3">
                    Não coletamos, armazenamos ou processamos nenhum dado pessoal.
                  </p>
                  <ul className="text-red-700 text-xs space-y-1">
                    <li>• Sem formulários de cadastro</li>
                    <li>• Sem tracking ou analytics</li>
                    <li>• Sem cookies de rastreamento</li>
                    <li>• Sem logs de atividade</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Transparency */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Transparência Total</h3>
                  <p className="text-blue-800 text-sm leading-relaxed mb-3">
                    Documentação clara sobre como a plataforma funciona.
                  </p>
                  <ul className="text-blue-700 text-xs space-y-1">
                    <li>• Políticas de privacidade detalhadas</li>
                    <li>• Código aberto e auditável</li>
                    <li>• Explicações técnicas acessíveis</li>
                    <li>• Canal direto de comunicação</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* User Control */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Controle do Usuário</h3>
                  <p className="text-purple-800 text-sm leading-relaxed mb-3">
                    Você mantém controle absoluto sobre todos os dados.
                  </p>
                  <ul className="text-purple-700 text-xs space-y-1">
                    <li>• Dados permanecem no seu dispositivo</li>
                    <li>• Exportação livre de resultados</li>
                    <li>• Limpeza manual de preferências</li>
                    <li>• Sem dependência de terceiros</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LGPD Principles */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Princípios da LGPD e Nossa Conformidade</h2>
          
          <div className="space-y-4">
            {/* Finalidade */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Finalidade</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>LGPD:</strong> Dados devem ser coletados para propósitos específicos e legítimos.<br/>
                    <strong>OneDev:</strong> Não coletamos dados, eliminando qualquer questão de finalidade inadequada.
                  </p>
                </div>
              </div>
            </div>

            {/* Adequação */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adequação</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>LGPD:</strong> Tratamento deve ser compatível com as finalidades informadas.<br/>
                    <strong>OneDev:</strong> Processamento local garante adequação automática aos propósitos do usuário.
                  </p>
                </div>
              </div>
            </div>

            {/* Necessidade */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Necessidade</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>LGPD:</strong> Coleta limitada ao mínimo necessário.<br/>
                    <strong>OneDev:</strong> Coleta zero - o mínimo absoluto possível.
                  </p>
                </div>
              </div>
            </div>

            {/* Transparência */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Transparência</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>LGPD:</strong> Informações claras sobre o tratamento de dados.<br/>
                    <strong>OneDev:</strong> Documentação completa e políticas detalhadas disponíveis.
                  </p>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Segurança</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>LGPD:</strong> Medidas técnicas adequadas para proteger dados.<br/>
                    <strong>OneDev:</strong> Arquitetura client-side oferece máxima segurança por design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rights of Data Subjects */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Direitos dos Titulares de Dados</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A LGPD garante diversos direitos aos titulares de dados. Como o OneDev não coleta dados pessoais, 
            estes direitos são automaticamente respeitados:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Direitos Garantidos
              </h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Confirmação da existência de tratamento (não há)</li>
                <li>• Acesso aos dados (permanecem com você)</li>
                <li>• Correção de dados (controle total)</li>
                <li>• Anonimização (dados já são anônimos)</li>
                <li>• Portabilidade (exportação livre)</li>
                <li>• Eliminação (limpeza local)</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Como Exercer
              </h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Não há dados para solicitar acesso</li>
                <li>• Controle direto via navegador</li>
                <li>• Exportação automática de resultados</li>
                <li>• Limpeza de cookies quando desejar</li>
                <li>• Contato direto para esclarecimentos</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Safeguards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Salvaguardas Técnicas</h2>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="font-semibold text-indigo-900 mb-3">Medidas de Proteção Implementadas:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-indigo-800 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  Arquitetura client-side exclusiva
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  Processamento local via JavaScript
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  Sem comunicação com servidores externos
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  Criptografia nativa do navegador
                </li>
              </ul>
              <ul className="text-indigo-800 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  Isolamento de dados por sessão
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  Limpeza automática ao fechar
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  Código auditável e transparente
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  Atualizações de segurança regulares
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact DPO */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contato - Encarregado de Dados</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Embora não processemos dados pessoais, mantemos um canal de comunicação aberto para 
              esclarecimentos sobre privacidade e proteção de dados:
            </p>
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-2">Agencione - Controlador de Dados</h3>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Email:</strong> contato@agencione.com.br
              </p>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Assunto:</strong> LGPD - OneDev
              </p>
              <p className="text-gray-600 text-xs">
                Responderemos em até 48 horas úteis
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compromisso com a Privacidade</h3>
                <p className="text-gray-700 leading-relaxed">
                  O OneDev representa o futuro das ferramentas web: funcionalidade completa com privacidade total. 
                  Nossa arquitetura garante que você tenha todas as ferramentas necessárias para desenvolvimento 
                  sem comprometer sua privacidade ou dados pessoais.
                </p>
              </div>
            </div>
          </div>
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

export default LGPDInfo;