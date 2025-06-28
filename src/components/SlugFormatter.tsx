import React, { useState, useCallback, useEffect } from 'react';
import { 
  Link, 
  Copy, 
  CheckCircle, 
  Type,
  Globe,
  Hash,
  Zap,
  Settings,
  RotateCcw,
  Eye,
  EyeOff,
  Info,
  Star,
  ArrowRight,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

interface SlugOptions {
  separator: string;
  lowercase: boolean;
  removeAccents: boolean;
  removeSpecialChars: boolean;
  maxLength: number | null;
  customReplacements: { [key: string]: string };
  preserveCase: boolean;
  removeStopWords: boolean;
  camelCase: boolean;
  pascalCase: boolean;
  snakeCase: boolean;
  kebabCase: boolean;
}

interface SlugResult {
  original: string;
  slug: string;
  variations: {
    kebab: string;
    snake: string;
    camel: string;
    pascal: string;
    dot: string;
    underscore: string;
  };
  stats: {
    originalLength: number;
    slugLength: number;
    charactersRemoved: number;
    wordsCount: number;
  };
}

const SlugFormatter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<SlugResult[]>([]);
  const [options, setOptions] = useState<SlugOptions>({
    separator: '-',
    lowercase: true,
    removeAccents: true,
    removeSpecialChars: true,
    maxLength: null,
    customReplacements: {},
    preserveCase: false,
    removeStopWords: false,
    camelCase: false,
    pascalCase: false,
    snakeCase: false,
    kebabCase: true
  });
  
  const [showOptions, setShowOptions] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [customReplacement, setCustomReplacement] = useState({ from: '', to: '' });

  const stopWords = [
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it',
    'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'o', 'a', 'os', 'as', 'um', 'uma',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'sem', 'sobre'
  ];

  const removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const generateSlug = useCallback((text: string): SlugResult => {
    let processed = text.trim();
    const original = processed;

    // Apply custom replacements first
    Object.entries(options.customReplacements).forEach(([from, to]) => {
      if (from) {
        processed = processed.replace(new RegExp(from, 'gi'), to);
      }
    });

    // Remove accents
    if (options.removeAccents) {
      processed = removeAccents(processed);
    }

    // Remove special characters
    if (options.removeSpecialChars) {
      processed = processed.replace(/[^\w\s-]/g, '');
    }

    // Remove stop words
    if (options.removeStopWords) {
      const words = processed.split(/\s+/);
      processed = words.filter(word => 
        !stopWords.includes(word.toLowerCase())
      ).join(' ');
    }

    // Handle case
    if (options.lowercase && !options.preserveCase) {
      processed = processed.toLowerCase();
    }

    // Replace spaces and multiple separators
    processed = processed.replace(/\s+/g, options.separator);
    processed = processed.replace(new RegExp(`\\${options.separator}+`, 'g'), options.separator);

    // Remove leading/trailing separators
    processed = processed.replace(new RegExp(`^\\${options.separator}+|\\${options.separator}+$`, 'g'), '');

    // Apply max length
    if (options.maxLength && processed.length > options.maxLength) {
      processed = processed.substring(0, options.maxLength);
      // Remove trailing separator if cut in the middle
      processed = processed.replace(new RegExp(`\\${options.separator}+$`, 'g'), '');
    }

    // Generate variations
    const baseSlug = processed.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const words = baseSlug.split('-').filter(word => word.length > 0);
    
    const variations = {
      kebab: words.join('-'),
      snake: words.join('_'),
      camel: words.map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join(''),
      pascal: words.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(''),
      dot: words.join('.'),
      underscore: words.join('_')
    };

    const stats = {
      originalLength: original.length,
      slugLength: processed.length,
      charactersRemoved: original.length - processed.length,
      wordsCount: words.length
    };

    return {
      original,
      slug: processed,
      variations,
      stats
    };
  }, [options]);

  const handleSingleGenerate = () => {
    if (inputText.trim()) {
      const result = generateSlug(inputText);
      setResults([result]);
    }
  };

  const handleBulkGenerate = () => {
    if (bulkInput.trim()) {
      const lines = bulkInput.split('\n').filter(line => line.trim());
      const bulkResults = lines.map(line => generateSlug(line.trim()));
      setResults(bulkResults);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSlug(`${type}-${text}`);
      setTimeout(() => setCopiedSlug(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const exportResults = () => {
    const data = results.map(result => ({
      original: result.original,
      slug: result.slug,
      variations: result.variations,
      stats: result.stats
    }));
    
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `slugs-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addCustomReplacement = () => {
    if (customReplacement.from.trim()) {
      setOptions(prev => ({
        ...prev,
        customReplacements: {
          ...prev.customReplacements,
          [customReplacement.from]: customReplacement.to
        }
      }));
      setCustomReplacement({ from: '', to: '' });
    }
  };

  const removeCustomReplacement = (key: string) => {
    setOptions(prev => ({
      ...prev,
      customReplacements: Object.fromEntries(
        Object.entries(prev.customReplacements).filter(([k]) => k !== key)
      )
    }));
  };

  const resetOptions = () => {
    setOptions({
      separator: '-',
      lowercase: true,
      removeAccents: true,
      removeSpecialChars: true,
      maxLength: null,
      customReplacements: {},
      preserveCase: false,
      removeStopWords: false,
      camelCase: false,
      pascalCase: false,
      snakeCase: false,
      kebabCase: true
    });
  };

  const clearAll = () => {
    setInputText('');
    setBulkInput('');
    setResults([]);
  };

  // Auto-generate on input change for single mode
  useEffect(() => {
    if (activeTab === 'single' && inputText.trim()) {
      const result = generateSlug(inputText);
      setResults([result]);
    } else if (activeTab === 'single' && !inputText.trim()) {
      setResults([]);
    }
  }, [inputText, options, activeTab, generateSlug]);

  const presetConfigs = [
    {
      name: 'URL Padrão',
      config: { separator: '-', lowercase: true, removeAccents: true, removeSpecialChars: true }
    },
    {
      name: 'Arquivo/Pasta',
      config: { separator: '_', lowercase: true, removeAccents: true, removeSpecialChars: true }
    },
    {
      name: 'Variável JS',
      config: { separator: '', lowercase: false, removeAccents: true, removeSpecialChars: true, camelCase: true }
    },
    {
      name: 'Classe CSS',
      config: { separator: '-', lowercase: true, removeAccents: true, removeSpecialChars: true }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Link className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Slug Formatter
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Transforme texto comum em URLs amigáveis e identificadores limpos
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input and Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('single')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'single'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Type className="w-5 h-5" />
                Texto Único
              </button>
              
              <button
                onClick={() => setActiveTab('bulk')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'bulk'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Upload className="w-5 h-5" />
                Processamento em Lote
              </button>
            </div>

            {/* Single Text Input */}
            {activeTab === 'single' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Texto para Converter
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Digite o texto que deseja converter em slug..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    O slug é gerado automaticamente conforme você digita
                  </p>
                </div>
              </div>
            )}

            {/* Bulk Input */}
            {activeTab === 'bulk' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Textos para Converter (um por linha)
                  </label>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Linha 1: Meu Primeiro Artigo&#10;Linha 2: Como Fazer URLs Amigáveis&#10;Linha 3: Guia Completo de SEO"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <button
                  onClick={handleBulkGenerate}
                  disabled={!bulkInput.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Zap className="w-5 h-5" />
                  Gerar Slugs em Lote
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {showOptions ? <EyeOff className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {showOptions ? 'Ocultar' : 'Configurações'}
              </button>

              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Tudo
              </button>

              {results.length > 0 && (
                <button
                  onClick={exportResults}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              )}
            </div>
          </div>

          {/* Configuration Options */}
          {showOptions && (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Configurações Avançadas</h2>
              </div>

              {/* Presets */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Configurações Predefinidas
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {presetConfigs.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setOptions(prev => ({ ...prev, ...preset.config }))}
                      className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Opções Básicas</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Separador
                    </label>
                    <select
                      value={options.separator}
                      onChange={(e) => setOptions(prev => ({ ...prev, separator: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="-">Hífen (-)</option>
                      <option value="_">Underscore (_)</option>
                      <option value=".">Ponto (.)</option>
                      <option value="">Sem separador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comprimento Máximo
                    </label>
                    <input
                      type="number"
                      value={options.maxLength || ''}
                      onChange={(e) => setOptions(prev => ({ 
                        ...prev, 
                        maxLength: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      placeholder="Sem limite"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={options.lowercase}
                        onChange={(e) => setOptions(prev => ({ ...prev, lowercase: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Converter para minúsculas</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={options.removeAccents}
                        onChange={(e) => setOptions(prev => ({ ...prev, removeAccents: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Remover acentos</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={options.removeSpecialChars}
                        onChange={(e) => setOptions(prev => ({ ...prev, removeSpecialChars: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Remover caracteres especiais</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={options.removeStopWords}
                        onChange={(e) => setOptions(prev => ({ ...prev, removeStopWords: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Remover palavras irrelevantes</span>
                    </label>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Substituições Personalizadas</h3>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customReplacement.from}
                        onChange={(e) => setCustomReplacement(prev => ({ ...prev, from: e.target.value }))}
                        placeholder="De"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                      <input
                        type="text"
                        value={customReplacement.to}
                        onChange={(e) => setCustomReplacement(prev => ({ ...prev, to: e.target.value }))}
                        placeholder="Para"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        onClick={addCustomReplacement}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(options.customReplacements).map(([from, to]) => (
                        <div key={from} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            "{from}" → "{to}"
                          </span>
                          <button
                            onClick={() => removeCustomReplacement(from)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetOptions}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Padrões
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center gap-2 mb-6">
                <Hash className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Resultados ({results.length})
                </h2>
              </div>

              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {/* Original Text */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Texto Original:</div>
                      <div className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-2 rounded text-sm">
                        {result.original}
                      </div>
                    </div>

                    {/* Main Slug */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug Principal:</div>
                        <button
                          onClick={() => copyToClipboard(result.slug, 'main')}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {copiedSlug === `main-${result.slug}` ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-3 rounded-lg">
                        <code className="text-green-800 dark:text-green-300 font-mono text-sm break-all">
                          {result.slug}
                        </code>
                      </div>
                    </div>

                    {/* Variations */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Variações:</div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(result.variations).map(([type, value]) => (
                          <div key={type} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-16">
                                {type}:
                              </span>
                              <code className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                                {value}
                              </code>
                            </div>
                            <button
                              onClick={() => copyToClipboard(value, type)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                              {copiedSlug === `${type}-${value}` ? (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Estatísticas:</div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-blue-800 dark:text-blue-300">
                        <div>Caracteres: {result.stats.originalLength} → {result.stats.slugLength}</div>
                        <div>Palavras: {result.stats.wordsCount}</div>
                        <div>Removidos: {result.stats.charactersRemoved}</div>
                        <div>Redução: {((result.stats.charactersRemoved / result.stats.originalLength) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Exemplos</h3>
            </div>

            <div className="space-y-3">
              {[
                { input: 'Como Criar URLs Amigáveis?', output: 'como-criar-urls-amigaveis' },
                { input: 'Guia Completo de SEO 2024', output: 'guia-completo-seo-2024' },
                { input: 'Melhores Práticas & Dicas', output: 'melhores-praticas-dicas' },
                { input: 'Tutorial: JavaScript Avançado', output: 'tutorial-javascript-avancado' }
              ].map((example, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex-1 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">{example.input}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 text-sm">
                    <code className="text-green-600 dark:text-green-400 font-mono">{example.output}</code>
                  </div>
                  <button
                    onClick={() => setInputText(example.input)}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 text-xs"
                  >
                    Testar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">🔗 Sobre URLs Amigáveis</h3>
            <div className="text-blue-800 dark:text-blue-300 leading-relaxed space-y-3">
              <p>
                URLs amigáveis (slugs) são versões simplificadas de texto que podem ser usadas em URLs, 
                nomes de arquivos, identificadores CSS/JS e muito mais.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Benefícios
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Melhora SEO e indexação</li>
                    <li>• URLs mais legíveis</li>
                    <li>• Compatibilidade universal</li>
                    <li>• Fácil compartilhamento</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Casos de Uso
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• URLs de páginas e posts</li>
                    <li>• Nomes de arquivos</li>
                    <li>• IDs CSS e JavaScript</li>
                    <li>• Identificadores de API</li>
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

export default SlugFormatter;