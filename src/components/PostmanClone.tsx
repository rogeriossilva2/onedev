import React, { useState, useEffect, useRef } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  Send, 
  Plus, 
  Copy, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  ChevronDown, 
  ChevronRight, 
  MoreVertical, 
  FolderPlus, 
  Settings,
  Palette,
  Tag,
  FileText,
  Clock,
  User,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestData {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Header[];
  body: {
    type: 'none' | 'json' | 'form-data' | 'raw';
    content: string;
    formData: { key: string; value: string; type: 'text' | 'file' }[];
  };
  params: { key: string; value: string; enabled: boolean }[];
  auth: {
    type: 'none' | 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    key?: string;
    value?: string;
  };
  tests: string;
  preRequestScript: string;
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

interface Tab {
  id: string;
  request: RequestData;
  response: ResponseData | null;
  isLoading: boolean;
  isSaved: boolean;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  requests: RequestData[];
}

interface Environment {
  id: string;
  name: string;
  variables: { key: string; value: string; enabled: boolean }[];
}

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
  onSave: (collection: Collection) => void;
  mode: 'create' | 'edit';
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  collection,
  onSave,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Collection>>({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '📁',
    tags: [],
    isPrivate: false,
    author: 'Usuário'
  });
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'settings'>('general');

  const colorOptions = [
    { name: 'Azul', value: '#3B82F6', bg: 'bg-blue-500' },
    { name: 'Verde', value: '#10B981', bg: 'bg-emerald-500' },
    { name: 'Roxo', value: '#8B5CF6', bg: 'bg-violet-500' },
    { name: 'Rosa', value: '#EC4899', bg: 'bg-pink-500' },
    { name: 'Laranja', value: '#F59E0B', bg: 'bg-amber-500' },
    { name: 'Vermelho', value: '#EF4444', bg: 'bg-red-500' },
    { name: 'Índigo', value: '#6366F1', bg: 'bg-indigo-500' },
    { name: 'Teal', value: '#14B8A6', bg: 'bg-teal-500' },
    { name: 'Cinza', value: '#6B7280', bg: 'bg-gray-500' },
    { name: 'Slate', value: '#475569', bg: 'bg-slate-500' }
  ];

  const iconOptions = [
    '📁', '🚀', '⚡', '🔥', '💎', '🎯', '🛠️', '🔧', '⚙️', '🎨',
    '📊', '📈', '🔍', '💡', '🌟', '🎪', '🎭', '🎨', '🎵', '🎮',
    '🏆', '🎖️', '🏅', '🎗️', '🎀', '🎁', '🎂', '🎉', '🎊', '🎈'
  ];

  useEffect(() => {
    if (collection && mode === 'edit') {
      setFormData({
        name: collection.name,
        description: collection.description,
        color: collection.color,
        icon: collection.icon,
        tags: [...collection.tags],
        isPrivate: collection.isPrivate,
        author: collection.author
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: '📁',
        tags: [],
        isPrivate: false,
        author: 'Usuário'
      });
    }
  }, [collection, mode, isOpen]);

  const handleSave = () => {
    if (!formData.name?.trim()) return;

    const now = new Date();
    const savedCollection: Collection = {
      id: collection?.id || Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description || '',
      color: formData.color || '#3B82F6',
      icon: formData.icon || '📁',
      tags: formData.tags || [],
      isPrivate: formData.isPrivate || false,
      author: formData.author || 'Usuário',
      createdAt: collection?.createdAt || now,
      updatedAt: now,
      requests: collection?.requests || []
    };

    onSave(savedCollection);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg text-white text-xl"
              style={{ backgroundColor: formData.color }}
            >
              {formData.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {mode === 'create' ? 'Nova Collection' : 'Editar Collection'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'create' ? 'Crie uma nova collection para organizar suas requisições' : 'Personalize sua collection'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'general', label: 'Geral', icon: FileText },
            { id: 'appearance', label: 'Aparência', icon: Palette },
            { id: 'settings', label: 'Configurações', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Collection *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: API de Usuários, Testes E-commerce..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito desta collection..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Autor
                </label>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Seu nome"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Cor da Collection
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`relative p-4 rounded-lg ${color.bg} transition-all hover:scale-105 ${
                        formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-300' : ''
                      }`}
                      title={color.name}
                    >
                      {formData.color === color.value && (
                        <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cor personalizada:</span>
                  <input
                    type="color"
                    value={formData.color || '#3B82F6'}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    {formData.color}
                  </span>
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ícone da Collection
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`p-3 text-xl rounded-lg border-2 transition-all hover:scale-110 ${
                        formData.icon === icon
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preview
                </label>
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg text-white text-lg"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {formData.name || 'Nome da Collection'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.description || 'Descrição da collection'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Privacy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Privacidade
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="privacy"
                      checked={!formData.isPrivate}
                      onChange={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Pública</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Visível para todos os usuários
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="privacy"
                      checked={formData.isPrivate}
                      onChange={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-600" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Privada</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Visível apenas para você
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Informações
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Criada em:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {collection?.createdAt ? new Date(collection.createdAt).toLocaleDateString('pt-BR') : 'Agora'}
                      </span>
                    </div>
                  </div>

                  {collection?.updatedAt && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Edit3 className="w-4 h-4 text-gray-500" />
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Última modificação:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {new Date(collection.updatedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Requisições:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {collection?.requests?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Sobre Collections
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      Collections ajudam a organizar suas requisições por projeto, funcionalidade ou ambiente. 
                      Use cores e ícones para identificar rapidamente cada collection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'create' ? 'Crie uma nova collection' : 'Salve as alterações'}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name?.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Save className="w-4 h-4" />
              {mode === 'create' ? 'Criar Collection' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostmanClone: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([
    {
      id: 'local',
      name: 'Local',
      variables: [
        { key: 'baseUrl', value: 'http://localhost:3000', enabled: true },
        { key: 'apiKey', value: 'your-api-key', enabled: true }
      ]
    }
  ]);
  const [activeEnvironment, setActiveEnvironment] = useState<string>('local');
  const [history, setHistory] = useState<RequestData[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [collectionModalMode, setCollectionModalMode] = useState<'create' | 'edit'>('create');

  // Collection management
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [collectionMenuOpen, setCollectionMenuOpen] = useState<string>('');
  const [editingCollectionName, setEditingCollectionName] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string>('');

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setCollectionMenuOpen('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedTabs = localStorage.getItem('postman-tabs');
    const savedCollections = localStorage.getItem('postman-collections');
    const savedEnvironments = localStorage.getItem('postman-environments');
    const savedHistory = localStorage.getItem('postman-history');

    if (savedTabs) {
      const parsedTabs = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      if (parsedTabs.length > 0) {
        setActiveTabId(parsedTabs[0].id);
      }
    }

    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }

    if (savedEnvironments) {
      setEnvironments(JSON.parse(savedEnvironments));
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('postman-tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('postman-collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('postman-environments', JSON.stringify(environments));
  }, [environments]);

  useEffect(() => {
    localStorage.setItem('postman-history', JSON.stringify(history));
  }, [history]);

  const createNewRequest = (): RequestData => ({
    id: Date.now().toString(),
    name: 'Nova Requisição',
    method: 'GET',
    url: '',
    headers: [{ key: '', value: '', enabled: true }],
    body: {
      type: 'none',
      content: '',
      formData: []
    },
    params: [{ key: '', value: '', enabled: true }],
    auth: { type: 'none' },
    tests: '',
    preRequestScript: ''
  });

  const addNewTab = () => {
    const newRequest = createNewRequest();
    const newTab: Tab = {
      id: newRequest.id,
      request: newRequest,
      response: null,
      isLoading: false,
      isSaved: false
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
      } else if (newTabs.length === 0) {
        setActiveTabId('');
      }
      return newTabs;
    });
  };

  const updateActiveTab = (updates: Partial<Tab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, ...updates, isSaved: false }
        : tab
    ));
  };

  const updateActiveRequest = (updates: Partial<RequestData>) => {
    updateActiveTab({
      request: { ...getActiveTab()?.request!, ...updates }
    });
  };

  const getActiveTab = () => tabs.find(tab => tab.id === activeTabId);

  const replaceVariables = (text: string): string => {
    const env = environments.find(e => e.id === activeEnvironment);
    if (!env) return text;

    let result = text;
    env.variables.forEach(variable => {
      if (variable.enabled) {
        result = result.replace(new RegExp(`{{${variable.key}}}`, 'g'), variable.value);
      }
    });
    return result;
  };

  const sendRequest = async () => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    const { request } = activeTab;
    if (!request.url.trim()) return;

    updateActiveTab({ isLoading: true });

    try {
      const url = replaceVariables(request.url);
      const headers: Record<string, string> = {};
      
      request.headers.forEach(header => {
        if (header.enabled && header.key && header.value) {
          headers[header.key] = replaceVariables(header.value);
        }
      });

      // Add auth headers
      if (request.auth.type === 'bearer' && request.auth.token) {
        headers['Authorization'] = `Bearer ${replaceVariables(request.auth.token)}`;
      } else if (request.auth.type === 'api-key' && request.auth.key && request.auth.value) {
        headers[request.auth.key] = replaceVariables(request.auth.value);
      }

      let data: any = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        if (request.body.type === 'json') {
          headers['Content-Type'] = 'application/json';
          data = JSON.parse(replaceVariables(request.body.content));
        } else if (request.body.type === 'raw') {
          data = replaceVariables(request.body.content);
        } else if (request.body.type === 'form-data') {
          const formData = new FormData();
          request.body.formData.forEach(item => {
            if (item.key && item.value) {
              formData.append(item.key, replaceVariables(item.value));
            }
          });
          data = formData;
        }
      }

      const startTime = Date.now();
      const response: AxiosResponse = await axios({
        method: request.method.toLowerCase() as any,
        url,
        headers,
        data,
        timeout: 30000
      });

      const endTime = Date.now();
      const responseData: ResponseData = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        time: endTime - startTime,
        size: JSON.stringify(response.data).length
      };

      updateActiveTab({ 
        response: responseData, 
        isLoading: false 
      });

      // Add to history
      setHistory(prev => [request, ...prev.slice(0, 49)]);

    } catch (error) {
      const axiosError = error as AxiosError;
      const endTime = Date.now();
      
      const errorResponse: ResponseData = {
        status: axiosError.response?.status || 0,
        statusText: axiosError.response?.statusText || 'Network Error',
        headers: axiosError.response?.headers || {},
        data: axiosError.response?.data || { error: axiosError.message },
        time: endTime - Date.now(),
        size: 0
      };

      updateActiveTab({ 
        response: errorResponse, 
        isLoading: false 
      });
    }
  };

  const saveToCollection = (collectionId: string) => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? {
            ...collection,
            requests: [...collection.requests, { ...activeTab.request, id: Date.now().toString() }],
            updatedAt: new Date()
          }
        : collection
    ));

    updateActiveTab({ isSaved: true });
  };

  const openCollectionModal = (mode: 'create' | 'edit', collection?: Collection) => {
    setCollectionModalMode(mode);
    setEditingCollection(collection || null);
    setShowCollectionModal(true);
  };

  const handleSaveCollection = (collection: Collection) => {
    if (collectionModalMode === 'create') {
      setCollections(prev => [...prev, collection]);
    } else {
      setCollections(prev => prev.map(c => c.id === collection.id ? collection : c));
    }
  };

  const toggleCollection = (collectionId: string) => {
    setExpandedCollections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId);
      } else {
        newSet.add(collectionId);
      }
      return newSet;
    });
  };

  const openCollectionMenu = (collectionId: string) => {
    setCollectionMenuOpen(collectionMenuOpen === collectionId ? '' : collectionId);
  };

  const startRenaming = (collection: Collection) => {
    setEditingCollectionName(collection.id);
    setCollectionMenuOpen('');
  };

  const finishRenaming = (collectionId: string, newName: string) => {
    if (newName.trim()) {
      setCollections(prev => prev.map(c => 
        c.id === collectionId 
          ? { ...c, name: newName.trim(), updatedAt: new Date() }
          : c
      ));
    }
    setEditingCollectionName('');
  };

  const duplicateCollection = (collection: Collection) => {
    const duplicated: Collection = {
      ...collection,
      id: Date.now().toString(),
      name: `${collection.name} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      requests: collection.requests.map(req => ({ ...req, id: Date.now().toString() + Math.random() }))
    };
    setCollections(prev => [...prev, duplicated]);
    setCollectionMenuOpen('');
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
    setShowDeleteConfirm('');
    setCollectionMenuOpen('');
  };

  const removeRequestFromCollection = (collectionId: string, requestId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? {
            ...collection,
            requests: collection.requests.filter(req => req.id !== requestId),
            updatedAt: new Date()
          }
        : collection
    ));
  };

  const openRequestInTab = (request: RequestData) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      request: { ...request, id: Date.now().toString() },
      response: null,
      isLoading: false,
      isSaved: true
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const activeTab = getActiveTab();

  return (
    <div className="max-w-full mx-auto h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">API Testing Tool</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teste suas APIs com facilidade</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={activeEnvironment}
              onChange={(e) => setActiveEnvironment(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {environments.map(env => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>
            
            <button
              onClick={addNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Requisição
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Collections Tab */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20">
              <FolderPlus className="w-4 h-4" />
              Collections
            </button>
          </div>

          {/* Collections Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* New Collection Button */}
              <button
                onClick={() => openCollectionModal('create')}
                className="w-full flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
              >
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-orange-600">
                  Nova Collection
                </span>
              </button>

              {/* Collections List */}
              {collections.map(collection => (
                <div key={collection.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCollection(collection.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {expandedCollections.has(collection.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      <div 
                        className="p-1.5 rounded text-white text-sm"
                        style={{ backgroundColor: collection.color }}
                      >
                        {collection.icon}
                      </div>
                      
                      {editingCollectionName === collection.id ? (
                        <input
                          type="text"
                          defaultValue={collection.name}
                          autoFocus
                          onBlur={(e) => finishRenaming(collection.id, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              finishRenaming(collection.id, e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingCollectionName('');
                            }
                          }}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      ) : (
                        <div 
                          className="flex-1 cursor-pointer"
                          onDoubleClick={() => startRenaming(collection)}
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {collection.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {collection.requests.length} requisições
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => openCollectionMenu(collection.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {collectionMenuOpen === collection.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => openCollectionModal('edit', collection)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg"
                          >
                            <Settings className="w-4 h-4" />
                            Personalizar
                          </button>
                          <button
                            onClick={() => startRenaming(collection)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Edit3 className="w-4 h-4" />
                            Renomear
                          </button>
                          <button
                            onClick={() => duplicateCollection(collection)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicar
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(collection.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {expandedCollections.has(collection.id) && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      {collection.requests.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                          Nenhuma requisição nesta collection
                        </div>
                      ) : (
                        collection.requests.map(request => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 group"
                          >
                            <div 
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                              onClick={() => openRequestInTab(request)}
                            >
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                request.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                request.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                request.method === 'PUT' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                request.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {request.method}
                              </span>
                              <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                                {request.name}
                              </span>
                            </div>
                            <button
                              onClick={() => removeRequestFromCollection(collection.id, request.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          {tabs.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex overflow-x-auto">
                {tabs.map(tab => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-3 border-r border-gray-200 dark:border-gray-700 cursor-pointer min-w-0 ${
                      activeTabId === tab.id
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-b-2 border-orange-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      tab.request.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      tab.request.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      tab.request.method === 'PUT' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      tab.request.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {tab.request.method}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-32">
                      {tab.request.name}
                    </span>
                    {!tab.isSaved && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Editor */}
          {activeTab ? (
            <div className="flex-1 flex flex-col">
              {/* Request URL Bar */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-3 mb-4">
                  <select
                    value={activeTab.request.method}
                    onChange={(e) => updateActiveRequest({ method: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                    <option value="HEAD">HEAD</option>
                    <option value="OPTIONS">OPTIONS</option>
                  </select>
                  
                  <input
                    type="text"
                    value={activeTab.request.url}
                    onChange={(e) => updateActiveRequest({ url: e.target.value })}
                    placeholder="Digite a URL da requisição..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  
                  <button
                    onClick={sendRequest}
                    disabled={activeTab.isLoading || !activeTab.request.url.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {activeTab.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Enviar
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={activeTab.request.name}
                    onChange={(e) => updateActiveRequest({ name: e.target.value })}
                    placeholder="Nome da requisição"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  
                  {collections.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          saveToCollection(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Salvar em collection...</option>
                      {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>
                          {collection.icon} {collection.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex-1 flex">
                {/* Request Details */}
                <div className="flex-1 bg-white dark:bg-gray-800 p-4">
                  <div className="space-y-4">
                    {/* Headers */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Headers</h3>
                      <div className="space-y-2">
                        {activeTab.request.headers.map((header, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={header.key}
                              onChange={(e) => {
                                const newHeaders = [...activeTab.request.headers];
                                newHeaders[index] = { ...header, key: e.target.value };
                                updateActiveRequest({ headers: newHeaders });
                              }}
                              placeholder="Header"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            />
                            <input
                              type="text"
                              value={header.value}
                              onChange={(e) => {
                                const newHeaders = [...activeTab.request.headers];
                                newHeaders[index] = { ...header, value: e.target.value };
                                updateActiveRequest({ headers: newHeaders });
                              }}
                              placeholder="Valor"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            />
                            <button
                              onClick={() => {
                                const newHeaders = activeTab.request.headers.filter((_, i) => i !== index);
                                if (newHeaders.length === 0) {
                                  newHeaders.push({ key: '', value: '', enabled: true });
                                }
                                updateActiveRequest({ headers: newHeaders });
                              }}
                              className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            updateActiveRequest({
                              headers: [...activeTab.request.headers, { key: '', value: '', enabled: true }]
                            });
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar Header
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    {['POST', 'PUT', 'PATCH'].includes(activeTab.request.method) && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Body</h3>
                        <div className="space-y-3">
                          <select
                            value={activeTab.request.body.type}
                            onChange={(e) => updateActiveRequest({
                              body: { ...activeTab.request.body, type: e.target.value as any }
                            })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="none">Nenhum</option>
                            <option value="json">JSON</option>
                            <option value="raw">Raw</option>
                            <option value="form-data">Form Data</option>
                          </select>

                          {activeTab.request.body.type === 'json' && (
                            <textarea
                              value={activeTab.request.body.content}
                              onChange={(e) => updateActiveRequest({
                                body: { ...activeTab.request.body, content: e.target.value }
                              })}
                              placeholder='{"key": "value"}'
                              rows={8}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                            />
                          )}

                          {activeTab.request.body.type === 'raw' && (
                            <textarea
                              value={activeTab.request.body.content}
                              onChange={(e) => updateActiveRequest({
                                body: { ...activeTab.request.body, content: e.target.value }
                              })}
                              placeholder="Conteúdo raw..."
                              rows={8}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Resposta</h3>
                  
                  {activeTab.response ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-2 py-1 rounded font-medium ${
                          activeTab.response.status >= 200 && activeTab.response.status < 300
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : activeTab.response.status >= 400
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {activeTab.response.status} {activeTab.response.statusText}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {activeTab.response.time}ms
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {(activeTab.response.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <pre className="text-sm text-gray-900 dark:text-gray-100 overflow-auto max-h-96">
                          {JSON.stringify(activeTab.response.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Envie uma requisição para ver a resposta</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <Send className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Bem-vindo ao API Testing Tool
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Crie uma nova requisição ou abra uma collection para começar
                </p>
                <button
                  onClick={addNewTab}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Nova Requisição
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collection Modal */}
      <CollectionModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        collection={editingCollection}
        onSave={handleSaveCollection}
        mode={collectionModalMode}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteConfirm('')} />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Excluir Collection
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir esta collection? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm('')}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteCollection(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostmanClone;