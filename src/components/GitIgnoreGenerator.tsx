import React, { useState, useCallback } from 'react';
import { 
  FileX, 
  Settings, 
  Download, 
  Copy, 
  CheckCircle, 
  Search,
  Filter,
  Code,
  Globe,
  Database,
  Smartphone,
  Monitor,
  Server,
  Zap,
  Eye,
  EyeOff,
  Info,
  Star,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';

interface Language {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  patterns: string[];
  description: string;
}

interface EditorConfigOptions {
  charset: 'utf-8' | 'latin1' | 'utf-16be' | 'utf-16le';
  endOfLine: 'lf' | 'crlf' | 'cr';
  insertFinalNewline: boolean;
  trimTrailingWhitespace: boolean;
  indentStyle: 'space' | 'tab';
  indentSize: number;
  tabWidth: number;
  maxLineLength: number | null;
}

const GitIgnoreGenerator: React.FC = () => {
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(true);
  const [copiedFile, setCopiedFile] = useState<string>('');
  const [customPatterns, setCustomPatterns] = useState<string>('');
  
  const [editorConfig, setEditorConfig] = useState<EditorConfigOptions>({
    charset: 'utf-8',
    endOfLine: 'lf',
    insertFinalNewline: true,
    trimTrailingWhitespace: true,
    indentStyle: 'space',
    indentSize: 2,
    tabWidth: 4,
    maxLineLength: 120
  });

  const languages: Language[] = [
    // Frontend
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'Frontend',
      icon: Code,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'JavaScript e Node.js',
      patterns: [
        '# Dependencies',
        'node_modules/',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
        'pnpm-debug.log*',
        '',
        '# Runtime data',
        'pids',
        '*.pid',
        '*.seed',
        '*.pid.lock',
        '',
        '# Coverage directory used by tools like istanbul',
        'coverage/',
        '*.lcov',
        '',
        '# Build outputs',
        'dist/',
        'build/',
        '.next/',
        '.nuxt/',
        '.vuepress/dist',
        '',
        '# Environment variables',
        '.env',
        '.env.local',
        '.env.development.local',
        '.env.test.local',
        '.env.production.local'
      ]
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Frontend',
      icon: Code,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'TypeScript projects',
      patterns: [
        '# TypeScript',
        '*.tsbuildinfo',
        '*.d.ts.map',
        '',
        '# Build outputs',
        'dist/',
        'lib/',
        'es/',
        'types/',
        '',
        '# TypeScript cache',
        '.tscache/'
      ]
    },
    {
      id: 'react',
      name: 'React',
      category: 'Frontend',
      icon: Code,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'React applications',
      patterns: [
        '# React',
        '.eslintcache',
        '',
        '# Storybook',
        'storybook-static/',
        '',
        '# React Native',
        '.expo/',
        '.expo-shared/',
        'web-build/',
        '',
        '# Metro',
        '.metro-health-check*'
      ]
    },
    {
      id: 'vue',
      name: 'Vue.js',
      category: 'Frontend',
      icon: Code,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Vue.js applications',
      patterns: [
        '# Vue.js',
        '.vuepress/dist',
        '',
        '# Nuxt.js',
        '.nuxt/',
        'dist/',
        '',
        '# Vite',
        '.vite/',
        'vite.config.*.timestamp-*'
      ]
    },
    {
      id: 'angular',
      name: 'Angular',
      category: 'Frontend',
      icon: Code,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Angular applications',
      patterns: [
        '# Angular',
        '.angular/',
        '',
        '# Build outputs',
        '/dist/',
        '/tmp/',
        '/out-tsc/',
        '',
        '# Angular specific',
        '*.ngfactory.ts',
        '*.ngstyle.ts',
        '*.ngsummary.json',
        '*.shim.ts'
      ]
    },

    // Backend
    {
      id: 'python',
      name: 'Python',
      category: 'Backend',
      icon: Server,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Python applications',
      patterns: [
        '# Python',
        '__pycache__/',
        '*.py[cod]',
        '*$py.class',
        '*.so',
        '',
        '# Distribution / packaging',
        '.Python',
        'build/',
        'develop-eggs/',
        'dist/',
        'downloads/',
        'eggs/',
        '.eggs/',
        'lib/',
        'lib64/',
        'parts/',
        'sdist/',
        'var/',
        'wheels/',
        '*.egg-info/',
        '.installed.cfg',
        '*.egg',
        '',
        '# Virtual environments',
        'venv/',
        'env/',
        'ENV/',
        '.venv/',
        '.env/',
        '',
        '# Django',
        '*.log',
        'local_settings.py',
        'db.sqlite3',
        'media/',
        '',
        '# Flask',
        'instance/',
        '.webassets-cache',
        '',
        '# Jupyter Notebook',
        '.ipynb_checkpoints',
        '',
        '# pytest',
        '.pytest_cache/',
        '.coverage'
      ]
    },
    {
      id: 'java',
      name: 'Java',
      category: 'Backend',
      icon: Server,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Java applications',
      patterns: [
        '# Java',
        '*.class',
        '*.jar',
        '*.war',
        '*.ear',
        '*.nar',
        'hs_err_pid*',
        '',
        '# Maven',
        'target/',
        'pom.xml.tag',
        'pom.xml.releaseBackup',
        'pom.xml.versionsBackup',
        'pom.xml.next',
        'release.properties',
        'dependency-reduced-pom.xml',
        'buildNumber.properties',
        '.mvn/timing.properties',
        '',
        '# Gradle',
        '.gradle/',
        'build/',
        '!gradle/wrapper/gradle-wrapper.jar',
        '',
        '# Spring Boot',
        '*.log',
        'application-*.properties',
        'application-*.yml'
      ]
    },
    {
      id: 'csharp',
      name: 'C#',
      category: 'Backend',
      icon: Server,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '.NET applications',
      patterns: [
        '# .NET',
        'bin/',
        'obj/',
        '*.user',
        '*.suo',
        '*.userosscache',
        '*.sln.docstates',
        '',
        '# Build results',
        '[Dd]ebug/',
        '[Dd]ebugPublic/',
        '[Rr]elease/',
        '[Rr]eleases/',
        'x64/',
        'x86/',
        'bld/',
        '[Bb]in/',
        '[Oo]bj/',
        '',
        '# Visual Studio',
        '.vs/',
        '*.vscode/',
        '',
        '# NuGet',
        '*.nupkg',
        '**/packages/*',
        '!**/packages/build/',
        '',
        '# Entity Framework',
        '*.edmx.diagram'
      ]
    },
    {
      id: 'php',
      name: 'PHP',
      category: 'Backend',
      icon: Server,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'PHP applications',
      patterns: [
        '# PHP',
        '*.log',
        '',
        '# Composer',
        'vendor/',
        'composer.phar',
        'composer.lock',
        '',
        '# Laravel',
        '.env',
        '.env.backup',
        '.phpunit.result.cache',
        'Homestead.json',
        'Homestead.yaml',
        'npm-debug.log',
        'yarn-error.log',
        'storage/app/*',
        'storage/framework/cache/*',
        'storage/framework/sessions/*',
        'storage/framework/testing/*',
        'storage/framework/views/*',
        'storage/logs/*',
        'bootstrap/cache/*',
        '',
        '# WordPress',
        'wp-config.php',
        'wp-content/uploads/',
        'wp-content/cache/',
        'wp-content/backup-db/',
        'wp-content/advanced-cache.php',
        'wp-content/wp-cache-config.php'
      ]
    },

    // Mobile
    {
      id: 'android',
      name: 'Android',
      category: 'Mobile',
      icon: Smartphone,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Android applications',
      patterns: [
        '# Android',
        '*.apk',
        '*.ap_',
        '*.aab',
        '',
        '# Files for the ART/Dalvik VM',
        '*.dex',
        '',
        '# Generated files',
        'bin/',
        'gen/',
        'out/',
        'release/',
        '',
        '# Gradle files',
        '.gradle/',
        'build/',
        '',
        '# Local configuration file',
        'local.properties',
        '',
        '# Android Studio',
        '.idea/',
        '*.iml',
        '*.iws',
        '*.ipr',
        '*~',
        '*.swp',
        '',
        '# Keystore files',
        '*.jks',
        '*.keystore',
        '',
        '# External native build',
        '.externalNativeBuild/',
        '.cxx/'
      ]
    },
    {
      id: 'ios',
      name: 'iOS',
      category: 'Mobile',
      icon: Smartphone,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'iOS applications',
      patterns: [
        '# iOS',
        '*.ipa',
        '*.dSYM.zip',
        '*.dSYM',
        '',
        '# Xcode',
        'build/',
        'DerivedData/',
        '*.pbxuser',
        '!default.pbxuser',
        '*.mode1v3',
        '!default.mode1v3',
        '*.mode2v3',
        '!default.mode2v3',
        '*.perspectivev3',
        '!default.perspectivev3',
        'xcuserdata/',
        '*.moved-aside',
        '*.xccheckout',
        '*.xcscmblueprint',
        '',
        '# CocoaPods',
        'Pods/',
        '*.xcworkspace',
        '',
        '# Carthage',
        'Carthage/Build/',
        '',
        '# Swift Package Manager',
        '.swiftpm/',
        'Package.resolved'
      ]
    },
    {
      id: 'flutter',
      name: 'Flutter',
      category: 'Mobile',
      icon: Smartphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Flutter applications',
      patterns: [
        '# Flutter',
        '.dart_tool/',
        '.flutter-plugins',
        '.flutter-plugins-dependencies',
        '.packages',
        '.pub-cache/',
        '.pub/',
        'build/',
        '',
        '# Web',
        'lib/generated_plugin_registrant.dart',
        '',
        '# Symbolication related',
        'app.*.symbols',
        '',
        '# Obfuscation related',
        'app.*.map.json',
        '',
        '# Android Studio',
        '.idea/',
        '*.iml',
        '*.iws',
        '*.ipr',
        '',
        '# IntelliJ',
        '*.iml',
        '*.ipr',
        '*.iws',
        '.idea/',
        '',
        '# Visual Studio Code',
        '.vscode/',
        '',
        '# Flutter/Dart/Pub related',
        '**/doc/api/',
        '.dart_tool/',
        '.flutter-plugins',
        '.flutter-plugins-dependencies',
        '.packages',
        '.pub-cache/',
        '.pub/',
        'build/'
      ]
    },

    // Database
    {
      id: 'mysql',
      name: 'MySQL',
      category: 'Database',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'MySQL databases',
      patterns: [
        '# MySQL',
        '*.sql',
        '*.dump',
        '*.backup',
        '',
        '# MySQL Workbench',
        '*.mwb',
        '*.mwb.bak'
      ]
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      category: 'Database',
      icon: Database,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'PostgreSQL databases',
      patterns: [
        '# PostgreSQL',
        '*.sql',
        '*.dump',
        '*.backup',
        '*.psql',
        '',
        '# pgAdmin',
        'pgadmin4.db'
      ]
    },

    // DevOps
    {
      id: 'docker',
      name: 'Docker',
      category: 'DevOps',
      icon: Monitor,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Docker containers',
      patterns: [
        '# Docker',
        '.dockerignore',
        'Dockerfile*',
        'docker-compose*.yml',
        'docker-compose*.yaml',
        '',
        '# Docker volumes',
        '.docker/',
        'volumes/'
      ]
    },
    {
      id: 'terraform',
      name: 'Terraform',
      category: 'DevOps',
      icon: Monitor,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Infrastructure as Code',
      patterns: [
        '# Terraform',
        '*.tfstate',
        '*.tfstate.*',
        '*.tfvars',
        '*.tfplan',
        '',
        '# Terraform directories',
        '.terraform/',
        '.terraform.lock.hcl',
        '',
        '# Crash log files',
        'crash.log',
        'crash.*.log'
      ]
    },

    // Tools
    {
      id: 'vscode',
      name: 'VS Code',
      category: 'Tools',
      icon: Code,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Visual Studio Code',
      patterns: [
        '# VS Code',
        '.vscode/',
        '!.vscode/settings.json',
        '!.vscode/tasks.json',
        '!.vscode/launch.json',
        '!.vscode/extensions.json',
        '*.code-workspace'
      ]
    },
    {
      id: 'git',
      name: 'Git',
      category: 'Tools',
      icon: Code,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Git version control',
      patterns: [
        '# Git',
        '.git/',
        '*.orig',
        '*.rej',
        '*.patch'
      ]
    }
  ];

  const categories = ['all', ...Array.from(new Set(languages.map(lang => lang.category)))];

  const filteredLanguages = languages.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lang.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || lang.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLanguage = (languageId: string) => {
    const newSelected = new Set(selectedLanguages);
    if (newSelected.has(languageId)) {
      newSelected.delete(languageId);
    } else {
      newSelected.add(languageId);
    }
    setSelectedLanguages(newSelected);
  };

  const generateGitIgnore = useCallback(() => {
    const selectedLangs = languages.filter(lang => selectedLanguages.has(lang.id));
    
    let content = '# Generated by OneDev - GitIgnore Generator\n';
    content += `# Created on ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `# Languages: ${selectedLangs.map(l => l.name).join(', ')}\n\n`;

    // Add OS-specific patterns
    content += '# OS generated files\n';
    content += '.DS_Store\n';
    content += '.DS_Store?\n';
    content += '._*\n';
    content += '.Spotlight-V100\n';
    content += '.Trashes\n';
    content += 'ehthumbs.db\n';
    content += 'Thumbs.db\n\n';

    // Add IDE patterns
    content += '# IDE files\n';
    content += '.idea/\n';
    content += '.vscode/\n';
    content += '*.swp\n';
    content += '*.swo\n';
    content += '*~\n\n';

    // Add language-specific patterns
    selectedLangs.forEach(lang => {
      content += `# ${lang.name}\n`;
      content += lang.patterns.join('\n') + '\n\n';
    });

    // Add custom patterns
    if (customPatterns.trim()) {
      content += '# Custom patterns\n';
      content += customPatterns.trim() + '\n\n';
    }

    // Add common patterns
    content += '# Logs\n';
    content += '*.log\n';
    content += 'logs/\n\n';

    content += '# Runtime data\n';
    content += 'pids\n';
    content += '*.pid\n';
    content += '*.seed\n\n';

    content += '# Temporary files\n';
    content += 'tmp/\n';
    content += 'temp/\n';
    content += '*.tmp\n';
    content += '*.temp\n\n';

    content += '# Environment variables\n';
    content += '.env\n';
    content += '.env.local\n';
    content += '.env.*.local\n\n';

    return content;
  }, [selectedLanguages, customPatterns]);

  const generateEditorConfig = useCallback(() => {
    let content = '# Generated by OneDev - EditorConfig Generator\n';
    content += `# Created on ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += '# https://editorconfig.org\n\n';

    content += 'root = true\n\n';

    content += '[*]\n';
    content += `charset = ${editorConfig.charset}\n`;
    content += `end_of_line = ${editorConfig.endOfLine}\n`;
    content += `insert_final_newline = ${editorConfig.insertFinalNewline}\n`;
    content += `trim_trailing_whitespace = ${editorConfig.trimTrailingWhitespace}\n`;
    content += `indent_style = ${editorConfig.indentStyle}\n`;
    content += `indent_size = ${editorConfig.indentSize}\n`;
    
    if (editorConfig.indentStyle === 'tab') {
      content += `tab_width = ${editorConfig.tabWidth}\n`;
    }
    
    if (editorConfig.maxLineLength) {
      content += `max_line_length = ${editorConfig.maxLineLength}\n`;
    }

    // Add specific rules for different file types
    const hasJS = selectedLanguages.has('javascript') || selectedLanguages.has('typescript') || selectedLanguages.has('react') || selectedLanguages.has('vue') || selectedLanguages.has('angular');
    const hasPython = selectedLanguages.has('python');
    const hasJava = selectedLanguages.has('java');
    const hasCSharp = selectedLanguages.has('csharp');

    if (hasJS) {
      content += '\n[*.{js,jsx,ts,tsx,vue}]\n';
      content += 'indent_size = 2\n';
    }

    if (hasPython) {
      content += '\n[*.py]\n';
      content += 'indent_size = 4\n';
      content += 'max_line_length = 88\n';
    }

    if (hasJava) {
      content += '\n[*.java]\n';
      content += 'indent_size = 4\n';
    }

    if (hasCSharp) {
      content += '\n[*.cs]\n';
      content += 'indent_size = 4\n';
    }

    content += '\n[*.md]\n';
    content += 'trim_trailing_whitespace = false\n';

    content += '\n[*.{yml,yaml}]\n';
    content += 'indent_size = 2\n';

    content += '\n[*.{json,jsonc}]\n';
    content += 'indent_size = 2\n';

    return content;
  }, [editorConfig, selectedLanguages]);

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setSelectedLanguages(new Set());
    setCustomPatterns('');
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const selectPopular = () => {
    const popular = ['javascript', 'typescript', 'react', 'python', 'java', 'vscode', 'git'];
    setSelectedLanguages(new Set(popular));
  };

  const gitIgnoreContent = generateGitIgnore();
  const editorConfigContent = generateEditorConfig();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl">
            <FileX className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
            Gerador .gitignore + .editorconfig
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Gere arquivos .gitignore e .editorconfig personalizados para seus projetos
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Language Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Selecionar Linguagens e Frameworks</h2>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar linguagens..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas as Categorias' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={selectPopular}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Star className="w-4 h-4" />
                Populares
              </button>
              
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Limpar Tudo
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{selectedLanguages.size} selecionadas</span>
              </div>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLanguages.map((language) => {
                const Icon = language.icon;
                const isSelected = selectedLanguages.has(language.id);
                
                return (
                  <button
                    key={language.id}
                    onClick={() => toggleLanguage(language.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? `${language.bgColor} border-current ${language.color}`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? language.color : 'text-gray-600'}`} />
                      <span className={`font-medium ${isSelected ? language.color : 'text-gray-900'}`}>
                        {language.name}
                      </span>
                      {isSelected && (
                        <CheckCircle className={`w-4 h-4 ml-auto ${language.color}`} />
                      )}
                    </div>
                    <p className={`text-xs ${isSelected ? language.color : 'text-gray-600'}`}>
                      {language.description}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {language.category}
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredLanguages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Nenhuma linguagem encontrada</p>
              </div>
            )}
          </div>

          {/* Custom Patterns */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Padrões Personalizados</h3>
            </div>
            
            <textarea
              value={customPatterns}
              onChange={(e) => setCustomPatterns(e.target.value)}
              placeholder="Adicione padrões personalizados, um por linha:&#10;*.custom&#10;temp/&#10;my-folder/"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Adicione padrões específicos do seu projeto, um por linha
            </p>
          </div>
        </div>

        {/* Configuration and Preview */}
        <div className="space-y-6">
          {/* EditorConfig Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Configurações EditorConfig</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charset
                </label>
                <select
                  value={editorConfig.charset}
                  onChange={(e) => setEditorConfig(prev => ({ ...prev, charset: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="utf-8">UTF-8</option>
                  <option value="latin1">Latin1</option>
                  <option value="utf-16be">UTF-16BE</option>
                  <option value="utf-16le">UTF-16LE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final de Linha
                </label>
                <select
                  value={editorConfig.endOfLine}
                  onChange={(e) => setEditorConfig(prev => ({ ...prev, endOfLine: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="lf">LF (Unix/Linux)</option>
                  <option value="crlf">CRLF (Windows)</option>
                  <option value="cr">CR (Mac Classic)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo de Indentação
                </label>
                <select
                  value={editorConfig.indentStyle}
                  onChange={(e) => setEditorConfig(prev => ({ ...prev, indentStyle: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="space">Espaços</option>
                  <option value="tab">Tabs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho da Indentação
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={editorConfig.indentSize}
                  onChange={(e) => setEditorConfig(prev => ({ ...prev, indentSize: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {editorConfig.indentStyle === 'tab' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largura do Tab
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={editorConfig.tabWidth}
                    onChange={(e) => setEditorConfig(prev => ({ ...prev, tabWidth: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprimento Máximo da Linha
                </label>
                <input
                  type="number"
                  min="80"
                  max="200"
                  value={editorConfig.maxLineLength || ''}
                  onChange={(e) => setEditorConfig(prev => ({ 
                    ...prev, 
                    maxLineLength: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  placeholder="Deixe vazio para não limitar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editorConfig.insertFinalNewline}
                    onChange={(e) => setEditorConfig(prev => ({ ...prev, insertFinalNewline: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Inserir nova linha no final</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editorConfig.trimTrailingWhitespace}
                    onChange={(e) => setEditorConfig(prev => ({ ...prev, trimTrailingWhitespace: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Remover espaços no final</span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview Toggle */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Preview dos Arquivos</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showPreview && (
              <div className="space-y-4">
                {/* .gitignore Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">.gitignore</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(gitIgnoreContent, '.gitignore')}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Copiar .gitignore"
                      >
                        {copiedFile === '.gitignore' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => downloadFile(gitIgnoreContent, '.gitignore')}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Download .gitignore"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs overflow-x-auto max-h-40 font-mono">
                    {gitIgnoreContent}
                  </pre>
                </div>

                {/* .editorconfig Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">.editorconfig</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(editorConfigContent, '.editorconfig')}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Copiar .editorconfig"
                      >
                        {copiedFile === '.editorconfig' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => downloadFile(editorConfigContent, '.editorconfig')}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Download .editorconfig"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs overflow-x-auto max-h-40 font-mono">
                    {editorConfigContent}
                  </pre>
                </div>
              </div>
            )}

            {/* Download Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => downloadFile(gitIgnoreContent, '.gitignore')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-lg hover:from-gray-600 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download .gitignore
              </button>
              
              <button
                onClick={() => downloadFile(editorConfigContent, '.editorconfig')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download .editorconfig
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📁 Sobre os Arquivos de Configuração</h3>
            <div className="text-blue-800 leading-relaxed space-y-3">
              <div>
                <h4 className="font-semibold mb-1">.gitignore</h4>
                <p className="text-sm">
                  Especifica quais arquivos e diretórios o Git deve ignorar. Evita que arquivos 
                  desnecessários (como dependências, builds, logs) sejam commitados no repositório.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">.editorconfig</h4>
                <p className="text-sm">
                  Mantém estilos de codificação consistentes entre diferentes editores e IDEs. 
                  Define indentação, charset, finais de linha e outras configurações de formatação.
                </p>
              </div>

              <div className="bg-white/50 rounded-lg p-3 mt-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Dicas de Uso:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Coloque ambos os arquivos na raiz do seu projeto</li>
                  <li>• Commite os arquivos no Git para compartilhar com a equipe</li>
                  <li>• O .editorconfig funciona automaticamente em editores compatíveis</li>
                  <li>• Personalize os padrões conforme necessário para seu projeto</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitIgnoreGenerator;