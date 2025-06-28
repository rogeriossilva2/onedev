import React, { useState, useCallback } from 'react';
import { 
  Package, 
  Settings, 
  Download, 
  Copy, 
  CheckCircle, 
  Plus,
  Minus,
  Code,
  Globe,
  User,
  Mail,
  Key,
  Shield,
  Info,
  Zap,
  Star,
  Eye,
  EyeOff,
  RotateCcw,
  FileText,
  Terminal,
  Database,
  Server,
  Smartphone
} from 'lucide-react';

interface Dependency {
  name: string;
  version: string;
  type: 'require' | 'require-dev';
}

interface Author {
  name: string;
  email: string;
  homepage?: string;
  role?: string;
}

interface ComposerConfig {
  // Basic Info
  name: string;
  description: string;
  type: string;
  keywords: string[];
  homepage: string;
  license: string;
  
  // Authors
  authors: Author[];
  
  // Dependencies
  dependencies: Dependency[];
  
  // PHP Version
  phpVersion: string;
  
  // Autoload
  autoloadPsr4: { [key: string]: string };
  autoloadFiles: string[];
  autoloadClassmap: string[];
  
  // Scripts
  scripts: { [key: string]: string };
  
  // Config
  config: {
    optimizeAutoloader: boolean;
    sortPackages: boolean;
    allowPlugins: boolean;
    preferStable: boolean;
  };
  
  // Support
  support: {
    issues?: string;
    source?: string;
    docs?: string;
    forum?: string;
    chat?: string;
  };
  
  // Extra
  extra: { [key: string]: any };
}

const ComposerGenerator: React.FC = () => {
  const [config, setConfig] = useState<ComposerConfig>({
    name: '',
    description: '',
    type: 'library',
    keywords: [],
    homepage: '',
    license: 'MIT',
    authors: [{ name: '', email: '' }],
    dependencies: [],
    phpVersion: '^8.1',
    autoloadPsr4: { '': 'src/' },
    autoloadFiles: [],
    autoloadClassmap: [],
    scripts: {},
    config: {
      optimizeAutoloader: true,
      sortPackages: true,
      allowPlugins: true,
      preferStable: true
    },
    support: {},
    extra: {}
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'dependencies' | 'autoload' | 'scripts' | 'advanced'>('basic');
  const [showPreview, setShowPreview] = useState(true);
  const [copiedContent, setCopiedContent] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newDependency, setNewDependency] = useState({ name: '', version: '', type: 'require' as const });
  const [newScript, setNewScript] = useState({ name: '', command: '' });

  const packageTypes = [
    { value: 'library', label: 'Library', description: 'Biblioteca reutilizável' },
    { value: 'project', label: 'Project', description: 'Aplicação completa' },
    { value: 'metapackage', label: 'Metapackage', description: 'Pacote que agrupa outros' },
    { value: 'composer-plugin', label: 'Composer Plugin', description: 'Plugin para Composer' },
    { value: 'symfony-bundle', label: 'Symfony Bundle', description: 'Bundle para Symfony' },
    { value: 'laravel-package', label: 'Laravel Package', description: 'Pacote para Laravel' },
    { value: 'wordpress-plugin', label: 'WordPress Plugin', description: 'Plugin para WordPress' },
    { value: 'drupal-module', label: 'Drupal Module', description: 'Módulo para Drupal' }
  ];

  const licenses = [
    'MIT', 'Apache-2.0', 'GPL-2.0', 'GPL-3.0', 'LGPL-2.1', 'LGPL-3.0', 
    'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'MPL-2.0', 'proprietary'
  ];

  const popularDependencies = [
    { name: 'symfony/console', description: 'Console component' },
    { name: 'symfony/http-foundation', description: 'HTTP foundation' },
    { name: 'guzzlehttp/guzzle', description: 'HTTP client' },
    { name: 'monolog/monolog', description: 'Logging library' },
    { name: 'doctrine/orm', description: 'Object-relational mapper' },
    { name: 'twig/twig', description: 'Template engine' },
    { name: 'phpunit/phpunit', description: 'Testing framework' },
    { name: 'psr/log', description: 'PSR-3 logging interface' },
    { name: 'vlucas/phpdotenv', description: 'Environment loader' },
    { name: 'ramsey/uuid', description: 'UUID generator' }
  ];

  const generateComposerJson = useCallback(() => {
    const composer: any = {
      name: config.name,
      description: config.description,
      type: config.type,
      license: config.license
    };

    if (config.keywords.length > 0) {
      composer.keywords = config.keywords;
    }

    if (config.homepage) {
      composer.homepage = config.homepage;
    }

    // Authors
    if (config.authors.some(author => author.name || author.email)) {
      composer.authors = config.authors.filter(author => author.name || author.email);
    }

    // Support
    if (Object.keys(config.support).some(key => config.support[key as keyof typeof config.support])) {
      composer.support = Object.fromEntries(
        Object.entries(config.support).filter(([_, value]) => value)
      );
    }

    // Require
    const requireDeps = config.dependencies.filter(dep => dep.type === 'require' && dep.name);
    if (requireDeps.length > 0 || config.phpVersion) {
      composer.require = {};
      if (config.phpVersion) {
        composer.require.php = config.phpVersion;
      }
      requireDeps.forEach(dep => {
        composer.require[dep.name] = dep.version || '*';
      });
    }

    // Require-dev
    const devDeps = config.dependencies.filter(dep => dep.type === 'require-dev' && dep.name);
    if (devDeps.length > 0) {
      composer['require-dev'] = {};
      devDeps.forEach(dep => {
        composer['require-dev'][dep.name] = dep.version || '*';
      });
    }

    // Autoload
    const autoload: any = {};
    
    if (Object.keys(config.autoloadPsr4).length > 0) {
      autoload['psr-4'] = config.autoloadPsr4;
    }
    
    if (config.autoloadFiles.length > 0) {
      autoload.files = config.autoloadFiles;
    }
    
    if (config.autoloadClassmap.length > 0) {
      autoload.classmap = config.autoloadClassmap;
    }
    
    if (Object.keys(autoload).length > 0) {
      composer.autoload = autoload;
    }

    // Scripts
    if (Object.keys(config.scripts).length > 0) {
      composer.scripts = config.scripts;
    }

    // Config
    if (Object.values(config.config).some(value => value !== true)) {
      composer.config = Object.fromEntries(
        Object.entries(config.config).filter(([key, value]) => {
          // Include only non-default values
          const defaults = { optimizeAutoloader: true, sortPackages: true, allowPlugins: true, preferStable: true };
          return value !== defaults[key as keyof typeof defaults];
        })
      );
    }

    // Extra
    if (Object.keys(config.extra).length > 0) {
      composer.extra = config.extra;
    }

    return JSON.stringify(composer, null, 2);
  }, [config]);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !config.keywords.includes(newKeyword.trim())) {
      setConfig(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setConfig(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addAuthor = () => {
    setConfig(prev => ({
      ...prev,
      authors: [...prev.authors, { name: '', email: '' }]
    }));
  };

  const updateAuthor = (index: number, field: keyof Author, value: string) => {
    setConfig(prev => ({
      ...prev,
      authors: prev.authors.map((author, i) => 
        i === index ? { ...author, [field]: value } : author
      )
    }));
  };

  const removeAuthor = (index: number) => {
    setConfig(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index)
    }));
  };

  const addDependency = () => {
    if (newDependency.name.trim()) {
      setConfig(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, { ...newDependency, name: newDependency.name.trim() }]
      }));
      setNewDependency({ name: '', version: '', type: 'require' });
    }
  };

  const removeDependency = (index: number) => {
    setConfig(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter((_, i) => i !== index)
    }));
  };

  const addScript = () => {
    if (newScript.name.trim() && newScript.command.trim()) {
      setConfig(prev => ({
        ...prev,
        scripts: { ...prev.scripts, [newScript.name.trim()]: newScript.command.trim() }
      }));
      setNewScript({ name: '', command: '' });
    }
  };

  const removeScript = (name: string) => {
    setConfig(prev => ({
      ...prev,
      scripts: Object.fromEntries(Object.entries(prev.scripts).filter(([key]) => key !== name))
    }));
  };

  const resetForm = () => {
    setConfig({
      name: '',
      description: '',
      type: 'library',
      keywords: [],
      homepage: '',
      license: 'MIT',
      authors: [{ name: '', email: '' }],
      dependencies: [],
      phpVersion: '^8.1',
      autoloadPsr4: { '': 'src/' },
      autoloadFiles: [],
      autoloadClassmap: [],
      scripts: {},
      config: {
        optimizeAutoloader: true,
        sortPackages: true,
        allowPlugins: true,
        preferStable: true
      },
      support: {},
      extra: {}
    });
    setActiveTab('basic');
  };

  const composerContent = generateComposerJson();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Gerador de Pacotes Composer
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Configure seu projeto PHP e gere um composer.json completo e profissional
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'basic', label: 'Básico', icon: Info },
                { id: 'dependencies', label: 'Dependências', icon: Package },
                { id: 'autoload', label: 'Autoload', icon: Code },
                { id: 'scripts', label: 'Scripts', icon: Terminal },
                { id: 'advanced', label: 'Avançado', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Basic Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Pacote *
                    </label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="vendor/package-name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Formato: vendor/package-name (minúsculas, hífens)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo do Pacote
                    </label>
                    <select
                      value={config.type}
                      onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {packageTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição clara e concisa do que o pacote faz"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Homepage
                    </label>
                    <input
                      type="url"
                      value={config.homepage}
                      onChange={(e) => setConfig(prev => ({ ...prev, homepage: e.target.value }))}
                      placeholder="https://github.com/vendor/package"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Licença
                    </label>
                    <select
                      value={config.license}
                      onChange={(e) => setConfig(prev => ({ ...prev, license: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {licenses.map(license => (
                        <option key={license} value={license}>{license}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Palavras-chave
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Adicionar palavra-chave"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <button
                      onClick={addKeyword}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {config.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(index)}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Authors */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Autores
                    </label>
                    <button
                      onClick={addAuthor}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                  <div className="space-y-4">
                    {config.authors.map((author, index) => (
                      <div key={index} className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <input
                          type="text"
                          value={author.name}
                          onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                          placeholder="Nome"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type="email"
                          value={author.email}
                          onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                          placeholder="Email"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={author.role || ''}
                            onChange={(e) => updateAuthor(index, 'role', e.target.value)}
                            placeholder="Função"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                          {config.authors.length > 1 && (
                            <button
                              onClick={() => removeAuthor(index)}
                              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dependencies Tab */}
            {activeTab === 'dependencies' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Versão do PHP
                  </label>
                  <input
                    type="text"
                    value={config.phpVersion}
                    onChange={(e) => setConfig(prev => ({ ...prev, phpVersion: e.target.value }))}
                    placeholder="^8.1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dependências
                    </label>
                  </div>

                  {/* Add Dependency */}
                  <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
                    <input
                      type="text"
                      value={newDependency.name}
                      onChange={(e) => setNewDependency(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="vendor/package"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="text"
                      value={newDependency.version}
                      onChange={(e) => setNewDependency(prev => ({ ...prev, version: e.target.value }))}
                      placeholder="^1.0"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <select
                      value={newDependency.type}
                      onChange={(e) => setNewDependency(prev => ({ ...prev, type: e.target.value as 'require' | 'require-dev' }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="require">Produção</option>
                      <option value="require-dev">Desenvolvimento</option>
                    </select>
                    <button
                      onClick={addDependency}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Popular Dependencies */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dependências Populares:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {popularDependencies.map(dep => (
                        <button
                          key={dep.name}
                          onClick={() => setNewDependency(prev => ({ ...prev, name: dep.name }))}
                          className="text-left p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <div className="font-medium text-blue-900 dark:text-blue-100 text-sm">{dep.name}</div>
                          <div className="text-blue-700 dark:text-blue-300 text-xs">{dep.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dependencies List */}
                  <div className="space-y-2">
                    {config.dependencies.map((dep, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{dep.name}</span>
                          <span className="text-gray-600 dark:text-gray-400">{dep.version || '*'}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            dep.type === 'require' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                            {dep.type === 'require' ? 'Produção' : 'Dev'}
                          </span>
                        </div>
                        <button
                          onClick={() => removeDependency(index)}
                          className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Autoload Tab */}
            {activeTab === 'autoload' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    PSR-4 Autoloading
                  </label>
                  <div className="space-y-3">
                    {Object.entries(config.autoloadPsr4).map(([namespace, path], index) => (
                      <div key={index} className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={namespace}
                          onChange={(e) => {
                            const newPsr4 = { ...config.autoloadPsr4 };
                            delete newPsr4[namespace];
                            newPsr4[e.target.value] = path;
                            setConfig(prev => ({ ...prev, autoloadPsr4: newPsr4 }));
                          }}
                          placeholder="App\\"
                          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={path}
                            onChange={(e) => {
                              setConfig(prev => ({
                                ...prev,
                                autoloadPsr4: { ...prev.autoloadPsr4, [namespace]: e.target.value }
                              }));
                            }}
                            placeholder="src/"
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                          <button
                            onClick={() => {
                              const newPsr4 = { ...config.autoloadPsr4 };
                              delete newPsr4[namespace];
                              setConfig(prev => ({ ...prev, autoloadPsr4: newPsr4 }));
                            }}
                            className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setConfig(prev => ({
                          ...prev,
                          autoloadPsr4: { ...prev.autoloadPsr4, '': 'src/' }
                        }));
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Namespace
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Arquivos para Autoload
                  </label>
                  <div className="space-y-2">
                    {config.autoloadFiles.map((file, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={file}
                          onChange={(e) => {
                            const newFiles = [...config.autoloadFiles];
                            newFiles[index] = e.target.value;
                            setConfig(prev => ({ ...prev, autoloadFiles: newFiles }));
                          }}
                          placeholder="src/helpers.php"
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => {
                            setConfig(prev => ({
                              ...prev,
                              autoloadFiles: prev.autoloadFiles.filter((_, i) => i !== index)
                            }));
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setConfig(prev => ({
                          ...prev,
                          autoloadFiles: [...prev.autoloadFiles, '']
                        }));
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Arquivo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Scripts Tab */}
            {activeTab === 'scripts' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Scripts Composer
                    </label>
                  </div>

                  {/* Add Script */}
                  <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
                    <input
                      type="text"
                      value={newScript.name}
                      onChange={(e) => setNewScript(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="test"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="text"
                      value={newScript.command}
                      onChange={(e) => setNewScript(prev => ({ ...prev, command: e.target.value }))}
                      placeholder="phpunit"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={addScript}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Common Scripts */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scripts Comuns:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        { name: 'test', command: 'phpunit' },
                        { name: 'test-coverage', command: 'phpunit --coverage-html coverage' },
                        { name: 'cs-fix', command: 'php-cs-fixer fix' },
                        { name: 'cs-check', command: 'php-cs-fixer fix --dry-run --diff' },
                        { name: 'phpstan', command: 'phpstan analyse' },
                        { name: 'psalm', command: 'psalm' }
                      ].map(script => (
                        <button
                          key={script.name}
                          onClick={() => setNewScript(script)}
                          className="text-left p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <div className="font-medium text-blue-900 dark:text-blue-100 text-sm">{script.name}</div>
                          <div className="text-blue-700 dark:text-blue-300 text-xs font-mono">{script.command}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scripts List */}
                  <div className="space-y-2">
                    {Object.entries(config.scripts).map(([name, command]) => (
                      <div key={name} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{name}</span>
                          <div className="text-gray-600 dark:text-gray-400 text-sm font-mono">{command}</div>
                        </div>
                        <button
                          onClick={() => removeScript(name)}
                          className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Configurações do Composer
                  </label>
                  <div className="space-y-3">
                    {Object.entries(config.config).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            config: { ...prev.config, [key]: e.target.checked }
                          }))}
                          className="w-4 h-4 text-orange-600 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {key === 'optimizeAutoloader' && 'Otimizar autoloader'}
                          {key === 'sortPackages' && 'Ordenar pacotes'}
                          {key === 'allowPlugins' && 'Permitir plugins'}
                          {key === 'preferStable' && 'Preferir versões estáveis'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Suporte
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      value={config.support.issues || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        support: { ...prev.support, issues: e.target.value }
                      }))}
                      placeholder="URL para issues"
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="url"
                      value={config.support.source || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        support: { ...prev.support, source: e.target.value }
                      }))}
                      placeholder="URL do código fonte"
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="url"
                      value={config.support.docs || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        support: { ...prev.support, docs: e.target.value }
                      }))}
                      placeholder="URL da documentação"
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="url"
                      value={config.support.chat || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        support: { ...prev.support, chat: e.target.value }
                      }))}
                      placeholder="URL do chat/Discord"
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                Limpar Tudo
              </button>
            </div>
          </div>
        </div>

        {/* Preview and Export */}
        <div className="space-y-6">
          {/* Preview Toggle */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Preview composer.json</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showPreview && (
              <div className="space-y-4">
                <pre className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-xs overflow-x-auto max-h-96 font-mono text-gray-800 dark:text-gray-200">
                  {composerContent}
                </pre>
              </div>
            )}

            {/* Export Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => copyToClipboard(composerContent)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {copiedContent ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                {copiedContent ? 'Copiado!' : 'Copiar composer.json'}
              </button>
              
              <button
                onClick={() => downloadFile(composerContent, 'composer.json')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download composer.json
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Estatísticas</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Dependências:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {config.dependencies.filter(d => d.type === 'require').length} produção, {config.dependencies.filter(d => d.type === 'require-dev').length} dev
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Autores:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {config.authors.filter(a => a.name || a.email).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Scripts:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {Object.keys(config.scripts).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Palavras-chave:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {config.keywords.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">📦 Sobre o Composer</h3>
            <div className="text-orange-800 dark:text-orange-300 leading-relaxed space-y-3">
              <p>
                O Composer é o gerenciador de dependências padrão para PHP. O arquivo composer.json 
                define as dependências, configurações e metadados do seu projeto.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-orange-900 dark:text-orange-100 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Funcionalidades
                  </div>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>• Gerenciamento de dependências</li>
                    <li>• Autoloading PSR-4</li>
                    <li>• Scripts personalizados</li>
                    <li>• Configurações avançadas</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-orange-900 dark:text-orange-100 mb-1 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Boas Práticas
                  </div>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>• Use versionamento semântico</li>
                    <li>• Separe deps de produção e dev</li>
                    <li>• Configure autoloading PSR-4</li>
                    <li>• Adicione scripts úteis</li>
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

export default ComposerGenerator;