import React, { useState, useCallback } from 'react';
import { 
  FileText, 
  Wand2, 
  Download, 
  Copy, 
  CheckCircle, 
  Star,
  Code,
  Globe,
  Shield,
  Users,
  Zap,
  Heart,
  GitBranch,
  Package,
  Settings,
  Eye,
  EyeOff,
  Info,
  Plus,
  Minus,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ProjectInfo {
  name: string;
  description: string;
  longDescription: string;
  author: string;
  email: string;
  github: string;
  website: string;
  license: string;
  version: string;
  
  // Technology
  language: string;
  framework: string;
  database: string;
  deployment: string;
  
  // Features
  features: string[];
  
  // Installation
  prerequisites: string[];
  installationSteps: string[];
  
  // Usage
  usageExamples: string[];
  
  // Configuration
  hasEnvFile: boolean;
  envVariables: string[];
  
  // Contributing
  hasContributing: boolean;
  contributingGuidelines: string;
  
  // Additional
  hasChangelog: boolean;
  hasTests: boolean;
  testCommand: string;
  buildCommand: string;
  startCommand: string;
  
  // Badges
  includeBadges: boolean;
  customBadges: string[];
  
  // Sections
  includeToc: boolean;
  includeScreenshots: boolean;
  includeRoadmap: boolean;
  includeFaq: boolean;
  includeSupport: boolean;
}

interface Badge {
  name: string;
  url: string;
  color: string;
  logo?: string;
}

const ReadmeGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    description: '',
    longDescription: '',
    author: '',
    email: '',
    github: '',
    website: '',
    license: 'MIT',
    version: '1.0.0',
    
    language: '',
    framework: '',
    database: '',
    deployment: '',
    
    features: [''],
    
    prerequisites: [''],
    installationSteps: [''],
    
    usageExamples: [''],
    
    hasEnvFile: false,
    envVariables: [''],
    
    hasContributing: true,
    contributingGuidelines: '',
    
    hasChangelog: false,
    hasTests: false,
    testCommand: 'npm test',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    
    includeBadges: true,
    customBadges: [''],
    
    includeToc: true,
    includeScreenshots: false,
    includeRoadmap: false,
    includeFaq: false,
    includeSupport: true
  });

  const steps = [
    { title: 'Informações Básicas', icon: Info },
    { title: 'Tecnologias', icon: Code },
    { title: 'Funcionalidades', icon: Star },
    { title: 'Instalação', icon: Package },
    { title: 'Uso & Configuração', icon: Settings },
    { title: 'Seções Adicionais', icon: Plus },
    { title: 'Preview & Geração', icon: Eye }
  ];

  const licenses = [
    'MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 
    'LGPL-2.1', 'MPL-2.0', 'AGPL-3.0', 'Unlicense', 'Custom'
  ];

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 
    'Go', 'Rust', 'C++', 'Ruby', 'Swift', 'Kotlin', 'Dart'
  ];

  const frameworks = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
    'Express.js', 'Fastify', 'Django', 'Flask', 'Spring Boot',
    'Laravel', 'Symfony', 'Ruby on Rails', 'ASP.NET', 'Gin',
    'Actix', 'Flutter', 'React Native', 'Ionic'
  ];

  const databases = [
    'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis', 
    'Elasticsearch', 'Firebase', 'Supabase', 'PlanetScale'
  ];

  const deployments = [
    'Vercel', 'Netlify', 'Heroku', 'AWS', 'Google Cloud', 
    'Azure', 'DigitalOcean', 'Railway', 'Render', 'Docker'
  ];

  const updateProjectInfo = (field: keyof ProjectInfo, value: any) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof ProjectInfo, index: number, value: string) => {
    const currentArray = projectInfo[field] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateProjectInfo(field, newArray);
  };

  const addArrayItem = (field: keyof ProjectInfo) => {
    const currentArray = projectInfo[field] as string[];
    updateProjectInfo(field, [...currentArray, '']);
  };

  const removeArrayItem = (field: keyof ProjectInfo, index: number) => {
    const currentArray = projectInfo[field] as string[];
    if (currentArray.length > 1) {
      updateProjectInfo(field, currentArray.filter((_, i) => i !== index));
    }
  };

  const generateBadges = useCallback(() => {
    const badges: Badge[] = [];
    
    if (!projectInfo.includeBadges) return '';

    // Version badge
    if (projectInfo.version) {
      badges.push({
        name: 'Version',
        url: `https://img.shields.io/badge/version-${projectInfo.version}-blue.svg`,
        color: 'blue'
      });
    }

    // License badge
    if (projectInfo.license) {
      badges.push({
        name: 'License',
        url: `https://img.shields.io/badge/license-${projectInfo.license}-green.svg`,
        color: 'green'
      });
    }

    // Language badge
    if (projectInfo.language) {
      badges.push({
        name: projectInfo.language,
        url: `https://img.shields.io/badge/language-${projectInfo.language}-yellow.svg`,
        color: 'yellow'
      });
    }

    // Framework badge
    if (projectInfo.framework) {
      badges.push({
        name: projectInfo.framework,
        url: `https://img.shields.io/badge/framework-${projectInfo.framework}-purple.svg`,
        color: 'purple'
      });
    }

    // GitHub badges
    if (projectInfo.github) {
      badges.push({
        name: 'Stars',
        url: `https://img.shields.io/github/stars/${projectInfo.github}.svg?style=social`,
        color: 'social'
      });
      
      badges.push({
        name: 'Forks',
        url: `https://img.shields.io/github/forks/${projectInfo.github}.svg?style=social`,
        color: 'social'
      });
    }

    return badges.map(badge => `![${badge.name}](${badge.url})`).join(' ');
  }, [projectInfo]);

  const generateReadme = useCallback(() => {
    let content = '';

    // Title and description
    content += `# ${projectInfo.name}\n\n`;
    
    if (projectInfo.description) {
      content += `${projectInfo.description}\n\n`;
    }

    // Badges
    if (projectInfo.includeBadges) {
      const badges = generateBadges();
      if (badges) {
        content += `${badges}\n\n`;
      }
    }

    // Long description
    if (projectInfo.longDescription) {
      content += `${projectInfo.longDescription}\n\n`;
    }

    // Table of Contents
    if (projectInfo.includeToc) {
      content += `## 📋 Índice\n\n`;
      content += `- [Funcionalidades](#-funcionalidades)\n`;
      content += `- [Tecnologias](#-tecnologias)\n`;
      content += `- [Pré-requisitos](#-pré-requisitos)\n`;
      content += `- [Instalação](#-instalação)\n`;
      content += `- [Uso](#-uso)\n`;
      
      if (projectInfo.hasEnvFile) {
        content += `- [Configuração](#-configuração)\n`;
      }
      
      if (projectInfo.includeScreenshots) {
        content += `- [Screenshots](#-screenshots)\n`;
      }
      
      if (projectInfo.hasTests) {
        content += `- [Testes](#-testes)\n`;
      }
      
      if (projectInfo.includeRoadmap) {
        content += `- [Roadmap](#-roadmap)\n`;
      }
      
      if (projectInfo.hasContributing) {
        content += `- [Contribuindo](#-contribuindo)\n`;
      }
      
      if (projectInfo.includeFaq) {
        content += `- [FAQ](#-faq)\n`;
      }
      
      content += `- [Licença](#-licença)\n`;
      
      if (projectInfo.includeSupport) {
        content += `- [Suporte](#-suporte)\n`;
      }
      
      content += `\n`;
    }

    // Features
    if (projectInfo.features.some(f => f.trim())) {
      content += `## ✨ Funcionalidades\n\n`;
      projectInfo.features.filter(f => f.trim()).forEach(feature => {
        content += `- ${feature}\n`;
      });
      content += `\n`;
    }

    // Technologies
    content += `## 🚀 Tecnologias\n\n`;
    content += `Este projeto foi desenvolvido com as seguintes tecnologias:\n\n`;
    
    if (projectInfo.language) content += `- **Linguagem:** ${projectInfo.language}\n`;
    if (projectInfo.framework) content += `- **Framework:** ${projectInfo.framework}\n`;
    if (projectInfo.database) content += `- **Banco de Dados:** ${projectInfo.database}\n`;
    if (projectInfo.deployment) content += `- **Deploy:** ${projectInfo.deployment}\n`;
    content += `\n`;

    // Prerequisites
    if (projectInfo.prerequisites.some(p => p.trim())) {
      content += `## 📋 Pré-requisitos\n\n`;
      content += `Antes de começar, você vai precisar ter instalado em sua máquina:\n\n`;
      projectInfo.prerequisites.filter(p => p.trim()).forEach(prereq => {
        content += `- ${prereq}\n`;
      });
      content += `\n`;
    }

    // Installation
    if (projectInfo.installationSteps.some(s => s.trim())) {
      content += `## 🔧 Instalação\n\n`;
      content += `Siga os passos abaixo para instalar e configurar o projeto:\n\n`;
      
      if (projectInfo.github) {
        content += `\`\`\`bash\n`;
        content += `# Clone este repositório\n`;
        content += `git clone https://github.com/${projectInfo.github}.git\n\n`;
        content += `# Acesse a pasta do projeto\n`;
        content += `cd ${projectInfo.name.toLowerCase().replace(/\s+/g, '-')}\n`;
        content += `\`\`\`\n\n`;
      }
      
      projectInfo.installationSteps.filter(s => s.trim()).forEach((step, index) => {
        content += `${index + 1}. ${step}\n`;
      });
      content += `\n`;
    }

    // Usage
    if (projectInfo.usageExamples.some(u => u.trim())) {
      content += `## 💻 Uso\n\n`;
      
      if (projectInfo.startCommand) {
        content += `Para executar o projeto:\n\n`;
        content += `\`\`\`bash\n${projectInfo.startCommand}\n\`\`\`\n\n`;
      }
      
      content += `### Exemplos de uso:\n\n`;
      projectInfo.usageExamples.filter(u => u.trim()).forEach(example => {
        content += `${example}\n\n`;
      });
    }

    // Configuration
    if (projectInfo.hasEnvFile && projectInfo.envVariables.some(v => v.trim())) {
      content += `## ⚙️ Configuração\n\n`;
      content += `Crie um arquivo \`.env\` na raiz do projeto com as seguintes variáveis:\n\n`;
      content += `\`\`\`env\n`;
      projectInfo.envVariables.filter(v => v.trim()).forEach(variable => {
        content += `${variable}\n`;
      });
      content += `\`\`\`\n\n`;
    }

    // Screenshots
    if (projectInfo.includeScreenshots) {
      content += `## 📱 Screenshots\n\n`;
      content += `<!-- Adicione suas screenshots aqui -->\n`;
      content += `![Screenshot 1](./screenshots/screenshot1.png)\n`;
      content += `![Screenshot 2](./screenshots/screenshot2.png)\n\n`;
    }

    // Tests
    if (projectInfo.hasTests) {
      content += `## 🧪 Testes\n\n`;
      content += `Para executar os testes:\n\n`;
      content += `\`\`\`bash\n${projectInfo.testCommand}\n\`\`\`\n\n`;
      
      if (projectInfo.buildCommand) {
        content += `Para fazer o build do projeto:\n\n`;
        content += `\`\`\`bash\n${projectInfo.buildCommand}\n\`\`\`\n\n`;
      }
    }

    // Roadmap
    if (projectInfo.includeRoadmap) {
      content += `## 🗺️ Roadmap\n\n`;
      content += `- [x] Funcionalidade básica\n`;
      content += `- [ ] Melhorias de performance\n`;
      content += `- [ ] Novas funcionalidades\n`;
      content += `- [ ] Testes automatizados\n`;
      content += `- [ ] Documentação completa\n\n`;
    }

    // Contributing
    if (projectInfo.hasContributing) {
      content += `## 🤝 Contribuindo\n\n`;
      
      if (projectInfo.contributingGuidelines) {
        content += `${projectInfo.contributingGuidelines}\n\n`;
      } else {
        content += `Contribuições são sempre bem-vindas!\n\n`;
        content += `1. Faça um fork do projeto\n`;
        content += `2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)\n`;
        content += `3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)\n`;
        content += `4. Push para a branch (\`git push origin feature/AmazingFeature\`)\n`;
        content += `5. Abra um Pull Request\n\n`;
      }
    }

    // FAQ
    if (projectInfo.includeFaq) {
      content += `## ❓ FAQ\n\n`;
      content += `### Como posso reportar um bug?\n`;
      content += `Abra uma issue no GitHub descrevendo o problema encontrado.\n\n`;
      content += `### Como posso sugerir uma nova funcionalidade?\n`;
      content += `Abra uma issue no GitHub com a tag "enhancement" descrevendo sua sugestão.\n\n`;
    }

    // License
    content += `## 📝 Licença\n\n`;
    if (projectInfo.license && projectInfo.github) {
      content += `Este projeto está sob a licença ${projectInfo.license}. Veja o arquivo [LICENSE](https://github.com/${projectInfo.github}/blob/main/LICENSE) para mais detalhes.\n\n`;
    } else {
      content += `Este projeto está sob a licença ${projectInfo.license}.\n\n`;
    }

    // Support
    if (projectInfo.includeSupport) {
      content += `## 💬 Suporte\n\n`;
      content += `Se você tiver alguma dúvida ou precisar de ajuda, entre em contato:\n\n`;
      
      if (projectInfo.email) {
        content += `- 📧 Email: ${projectInfo.email}\n`;
      }
      
      if (projectInfo.github) {
        content += `- 🐛 Issues: [GitHub Issues](https://github.com/${projectInfo.github}/issues)\n`;
      }
      
      if (projectInfo.website) {
        content += `- 🌐 Website: [${projectInfo.website}](${projectInfo.website})\n`;
      }
      
      content += `\n`;
    }

    // Footer
    content += `---\n\n`;
    content += `<div align="center">\n`;
    
    if (projectInfo.author) {
      content += `Feito com ❤️ por **${projectInfo.author}**\n\n`;
    }
    
    if (projectInfo.github) {
      content += `⭐ Não esqueça de dar uma estrela no projeto!\n`;
    }
    
    content += `</div>\n`;

    return content;
  }, [projectInfo, generateBadges]);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const downloadFile = (content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setProjectInfo({
      name: '',
      description: '',
      longDescription: '',
      author: '',
      email: '',
      github: '',
      website: '',
      license: 'MIT',
      version: '1.0.0',
      
      language: '',
      framework: '',
      database: '',
      deployment: '',
      
      features: [''],
      
      prerequisites: [''],
      installationSteps: [''],
      
      usageExamples: [''],
      
      hasEnvFile: false,
      envVariables: [''],
      
      hasContributing: true,
      contributingGuidelines: '',
      
      hasChangelog: false,
      hasTests: false,
      testCommand: 'npm test',
      buildCommand: 'npm run build',
      startCommand: 'npm start',
      
      includeBadges: true,
      customBadges: [''],
      
      includeToc: true,
      includeScreenshots: false,
      includeRoadmap: false,
      includeFaq: false,
      includeSupport: true
    });
    setCurrentStep(0);
    setShowPreview(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const readmeContent = generateReadme();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Gerador de README.md Inteligente
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Crie um README.md profissional respondendo algumas perguntas sobre seu projeto
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  isActive 
                    ? 'border-emerald-500 bg-emerald-500 text-white' 
                    : isCompleted
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-sm text-gray-600">
            Passo {currentStep + 1} de {steps.length}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            
            {/* Step 0: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    value={projectInfo.name}
                    onChange={(e) => updateProjectInfo('name', e.target.value)}
                    placeholder="Ex: Meu Projeto Incrível"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Curta *
                  </label>
                  <input
                    type="text"
                    value={projectInfo.description}
                    onChange={(e) => updateProjectInfo('description', e.target.value)}
                    placeholder="Uma breve descrição do que o projeto faz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Detalhada
                  </label>
                  <textarea
                    value={projectInfo.longDescription}
                    onChange={(e) => updateProjectInfo('longDescription', e.target.value)}
                    rows={4}
                    placeholder="Descrição mais detalhada do projeto, seus objetivos e benefícios..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Autor
                    </label>
                    <input
                      type="text"
                      value={projectInfo.author}
                      onChange={(e) => updateProjectInfo('author', e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={projectInfo.email}
                      onChange={(e) => updateProjectInfo('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub (usuário/repositório)
                    </label>
                    <input
                      type="text"
                      value={projectInfo.github}
                      onChange={(e) => updateProjectInfo('github', e.target.value)}
                      placeholder="usuario/meu-projeto"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={projectInfo.website}
                      onChange={(e) => updateProjectInfo('website', e.target.value)}
                      placeholder="https://meusite.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Licença
                    </label>
                    <select
                      value={projectInfo.license}
                      onChange={(e) => updateProjectInfo('license', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {licenses.map(license => (
                        <option key={license} value={license}>{license}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Versão
                    </label>
                    <input
                      type="text"
                      value={projectInfo.version}
                      onChange={(e) => updateProjectInfo('version', e.target.value)}
                      placeholder="1.0.0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Technologies */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Linguagem Principal
                  </label>
                  <select
                    value={projectInfo.language}
                    onChange={(e) => updateProjectInfo('language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione uma linguagem</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Framework/Biblioteca
                  </label>
                  <select
                    value={projectInfo.framework}
                    onChange={(e) => updateProjectInfo('framework', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione um framework</option>
                    {frameworks.map(framework => (
                      <option key={framework} value={framework}>{framework}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banco de Dados
                  </label>
                  <select
                    value={projectInfo.database}
                    onChange={(e) => updateProjectInfo('database', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione um banco de dados</option>
                    {databases.map(db => (
                      <option key={db} value={db}>{db}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plataforma de Deploy
                  </label>
                  <select
                    value={projectInfo.deployment}
                    onChange={(e) => updateProjectInfo('deployment', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione uma plataforma</option>
                    {deployments.map(deploy => (
                      <option key={deploy} value={deploy}>{deploy}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Features */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Principais Funcionalidades
                  </label>
                  
                  {projectInfo.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateArrayField('features', index, e.target.value)}
                        placeholder="Ex: Interface responsiva e moderna"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeArrayItem('features', index)}
                        className="p-3 text-red-600 hover:text-red-800 transition-colors"
                        disabled={projectInfo.features.length === 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('features')}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Funcionalidade
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Installation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Pré-requisitos
                  </label>
                  
                  {projectInfo.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={prereq}
                        onChange={(e) => updateArrayField('prerequisites', index, e.target.value)}
                        placeholder="Ex: Node.js 18+ instalado"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeArrayItem('prerequisites', index)}
                        className="p-3 text-red-600 hover:text-red-800 transition-colors"
                        disabled={projectInfo.prerequisites.length === 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('prerequisites')}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Pré-requisito
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Passos de Instalação
                  </label>
                  
                  {projectInfo.installationSteps.map((step, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateArrayField('installationSteps', index, e.target.value)}
                        placeholder="Ex: Instale as dependências com npm install"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeArrayItem('installationSteps', index)}
                        className="p-3 text-red-600 hover:text-red-800 transition-colors"
                        disabled={projectInfo.installationSteps.length === 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('installationSteps')}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Passo
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Usage & Configuration */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comando para Iniciar
                    </label>
                    <input
                      type="text"
                      value={projectInfo.startCommand}
                      onChange={(e) => updateProjectInfo('startCommand', e.target.value)}
                      placeholder="npm start"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comando de Build
                    </label>
                    <input
                      type="text"
                      value={projectInfo.buildCommand}
                      onChange={(e) => updateProjectInfo('buildCommand', e.target.value)}
                      placeholder="npm run build"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comando de Teste
                    </label>
                    <input
                      type="text"
                      value={projectInfo.testCommand}
                      onChange={(e) => updateProjectInfo('testCommand', e.target.value)}
                      placeholder="npm test"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Exemplos de Uso
                  </label>
                  
                  {projectInfo.usageExamples.map((example, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <textarea
                        value={example}
                        onChange={(e) => updateArrayField('usageExamples', index, e.target.value)}
                        placeholder="Ex: Para criar um novo usuário, execute: npm run create-user"
                        rows={2}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeArrayItem('usageExamples', index)}
                        className="p-3 text-red-600 hover:text-red-800 transition-colors"
                        disabled={projectInfo.usageExamples.length === 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('usageExamples')}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Exemplo
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={projectInfo.hasEnvFile}
                      onChange={(e) => updateProjectInfo('hasEnvFile', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      O projeto usa variáveis de ambiente (.env)
                    </span>
                  </label>

                  {projectInfo.hasEnvFile && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variáveis de Ambiente
                      </label>
                      
                      {projectInfo.envVariables.map((variable, index) => (
                        <div key={index} className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={variable}
                            onChange={(e) => updateArrayField('envVariables', index, e.target.value)}
                            placeholder="DATABASE_URL=sua_url_aqui"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                          />
                          
                          <button
                            type="button"
                            onClick={() => removeArrayItem('envVariables', index)}
                            className="p-3 text-red-600 hover:text-red-800 transition-colors"
                            disabled={projectInfo.envVariables.length === 1}
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addArrayItem('envVariables')}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Variável
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Additional Sections */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Seções Opcionais</h3>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.includeToc}
                        onChange={(e) => updateProjectInfo('includeToc', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Índice (Table of Contents)</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.includeBadges}
                        onChange={(e) => updateProjectInfo('includeBadges', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Badges (versão, licença, etc.)</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.includeScreenshots}
                        onChange={(e) => updateProjectInfo('includeScreenshots', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Seção de Screenshots</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.includeRoadmap}
                        onChange={(e) => updateProjectInfo('includeRoadmap', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Roadmap</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.includeFaq}
                        onChange={(e) => updateProjectInfo('includeFaq', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">FAQ</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.includeSupport}
                        onChange={(e) => updateProjectInfo('includeSupport', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Seção de Suporte</span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Desenvolvimento</h3>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.hasTests}
                        onChange={(e) => updateProjectInfo('hasTests', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Seção de Testes</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.hasContributing}
                        onChange={(e) => updateProjectInfo('hasContributing', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Guia de Contribuição</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectInfo.hasChangelog}
                        onChange={(e) => updateProjectInfo('hasChangelog', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Changelog</span>
                    </label>
                  </div>
                </div>

                {projectInfo.hasContributing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diretrizes de Contribuição (opcional)
                    </label>
                    <textarea
                      value={projectInfo.contributingGuidelines}
                      onChange={(e) => updateProjectInfo('contributingGuidelines', e.target.value)}
                      rows={4}
                      placeholder="Instruções específicas para contribuidores..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Preview */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    README.md Gerado com Sucesso!
                  </h3>
                  <p className="text-gray-600">
                    Seu README.md profissional está pronto. Você pode visualizar, copiar ou fazer download.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => copyToClipboard(readmeContent)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {copiedContent ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copiar README.md
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadFile(readmeContent)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    Download README.md
                  </button>

                  <button
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Novo README
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  {showPreview ? 'Ocultar' : 'Mostrar'} Preview
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              Resumo do Projeto
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nome:</span>
                <span className="text-sm font-medium text-gray-900">
                  {projectInfo.name || 'Não informado'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Linguagem:</span>
                <span className="text-sm font-medium text-gray-900">
                  {projectInfo.language || 'Não informado'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Framework:</span>
                <span className="text-sm font-medium text-gray-900">
                  {projectInfo.framework || 'Não informado'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Funcionalidades:</span>
                <span className="text-sm font-medium text-gray-900">
                  {projectInfo.features.filter(f => f.trim()).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Seções:</span>
                <span className="text-sm font-medium text-gray-900">
                  {[
                    projectInfo.includeToc,
                    projectInfo.includeBadges,
                    projectInfo.includeScreenshots,
                    projectInfo.includeRoadmap,
                    projectInfo.includeFaq,
                    projectInfo.includeSupport,
                    projectInfo.hasTests,
                    projectInfo.hasContributing
                  ].filter(Boolean).length}
                </span>
              </div>
            </div>
          </div>

          {/* Preview */}
          {(showPreview || currentStep === 6) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Preview do README.md</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(readmeContent)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Copiar README.md"
                  >
                    {copiedContent ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => downloadFile(readmeContent)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Download README.md"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap text-gray-800">
                  {readmeContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Wand2 className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">📝 Sobre o Gerador de README</h3>
            <div className="text-emerald-800 leading-relaxed space-y-3">
              <p>
                Este gerador cria um README.md profissional e completo baseado nas informações do seu projeto. 
                O arquivo gerado segue as melhores práticas da comunidade open source.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="font-semibold text-emerald-900 mb-1 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Recursos Incluídos
                  </div>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• Badges automáticos (versão, licença, linguagem)</li>
                    <li>• Índice navegável</li>
                    <li>• Seções organizadas e profissionais</li>
                    <li>• Instruções de instalação e uso</li>
                    <li>• Guias de contribuição</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="font-semibold text-emerald-900 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Benefícios
                  </div>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• Economiza tempo na documentação</li>
                    <li>• Padronização profissional</li>
                    <li>• Melhora a apresentação do projeto</li>
                    <li>• Facilita contribuições da comunidade</li>
                    <li>• Aumenta a credibilidade do projeto</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadmeGenerator;