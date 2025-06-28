import React from 'react';
import { Heart, Code, Shield, Zap, Globe, Mail, ExternalLink, Star, Users, Cpu } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Sobre o OneDev
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Ferramentas essenciais para desenvolvedores, criadas com amor pela Agencione
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 space-y-8">
        
        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-600" />
            Nossa Missão
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O OneDev nasceu da necessidade de ter ferramentas rápidas, confiáveis e seguras para o 
            dia a dia do desenvolvimento. Nossa missão é fornecer utilitários essenciais que funcionem 
            inteiramente no seu navegador, garantindo máxima privacidade e performance.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <p className="text-gray-800 leading-relaxed italic">
              "Acreditamos que ferramentas poderosas não precisam comprometer sua privacidade. 
              O OneDev prova que é possível ter funcionalidade completa com segurança total."
            </p>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            Por que Escolher o OneDev?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Privacidade Total</h3>
                  <p className="text-green-800 text-sm leading-relaxed">
                    Processamento 100% client-side. Seus dados nunca saem do seu navegador, 
                    garantindo privacidade absoluta e conformidade com LGPD.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Cpu className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Performance Nativa</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Sem latência de rede. Todas as operações são executadas localmente, 
                    proporcionando velocidade máxima e disponibilidade offline.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Code className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Código Limpo</h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    Desenvolvido com as melhores práticas, usando React, TypeScript e 
                    Tailwind CSS para máxima qualidade e manutenibilidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Acesso Universal</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Funciona em qualquer navegador moderno, em qualquer dispositivo. 
                    Sem instalações, sem cadastros, sem complicações.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-indigo-600" />
            Ferramentas Disponíveis
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🔍 Gerador de SEO</h3>
              <p className="text-gray-700 text-sm">
                Crie meta tags otimizadas com preview de redes sociais e validação em tempo real.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📋 Formatador JSON</h3>
              <p className="text-gray-700 text-sm">
                Valide, formate e minifique JSON com detecção de erros e localização precisa.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🆔 Gerador CPF/CNPJ</h3>
              <p className="text-gray-700 text-sm">
                Gere documentos válidos para testes com algoritmo oficial brasileiro.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🔐 Base64 Encoder</h3>
              <p className="text-gray-700 text-sm">
                Codifique e decodifique texto em Base64 com suporte completo a UTF-8.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🔗 URL Encoder</h3>
              <p className="text-gray-700 text-sm">
                Codifique URLs e parâmetros com caracteres especiais de forma segura.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📝 Editor Markdown</h3>
              <p className="text-gray-700 text-sm">
                Editor ao vivo com preview em tempo real e exportação em múltiplos formatos.
              </p>
            </div>
          </div>
        </section>

        {/* Agencione */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-600" />
            Sobre a Agencione
          </h2>
          
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-900 mb-3">Criado com ❤️ pela Agencione</h3>
                <p className="text-rose-800 leading-relaxed mb-4">
                  A Agencione é uma agência de desenvolvimento focada em criar soluções web modernas, 
                  seguras e centradas no usuário. Especializamos em aplicações React, TypeScript e 
                  arquiteturas que priorizam privacidade e performance.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-rose-900">Nossos Valores:</h4>
                  <ul className="text-rose-700 text-sm space-y-1">
                    <li>• <strong>Privacidade por Design:</strong> Proteção de dados desde a concepção</li>
                    <li>• <strong>Código Aberto:</strong> Transparência e colaboração</li>
                    <li>• <strong>Experiência do Usuário:</strong> Interfaces intuitivas e acessíveis</li>
                    <li>• <strong>Performance:</strong> Aplicações rápidas e eficientes</li>
                    <li>• <strong>Qualidade:</strong> Código limpo e bem documentado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stack Tecnológico</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• React 18 + TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Lucide React Icons</li>
                  <li>• Vite Build Tool</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Arquitetura</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 100% Client-Side</li>
                  <li>• Progressive Web App</li>
                  <li>• Responsive Design</li>
                  <li>• Offline Capable</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Qualidade</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• ESLint + Prettier</li>
                  <li>• TypeScript Strict</li>
                  <li>• Component Testing</li>
                  <li>• Accessibility First</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Entre em Contato
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 leading-relaxed mb-4">
              Tem sugestões, encontrou um bug ou quer colaborar? Adoraríamos ouvir de você!
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Email</p>
                  <a 
                    href="mailto:contato@agencione.com.br" 
                    className="text-blue-700 hover:text-blue-900 underline"
                  >
                    contato@agencione.com.br
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Website</p>
                  <a 
                    href="https://agencione.com.br" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                  >
                    agencione.com.br
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Code className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Projeto Open Source</h3>
                <p className="text-purple-800 leading-relaxed mb-3">
                  O OneDev é um projeto de código aberto. Acreditamos na transparência e na colaboração 
                  da comunidade para criar ferramentas cada vez melhores.
                </p>
                <p className="text-purple-700 text-sm">
                  Contribuições, sugestões e feedback são sempre bem-vindos!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Version */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            OneDev v1.0.0 • Desenvolvido com ❤️ pela Agencione • Janeiro 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;