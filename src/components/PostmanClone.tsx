import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  Send, 
  Plus, 
  X, 
  Copy, 
  Download, 
  Upload, 
  Save, 
  Folder, 
  FolderOpen, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Globe,
  Lock,
  Zap,
  Code,
  FileText,
  Hash,
  Palette,
  Tag,
  User,
  Calendar,
  Info,
  Shield
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
  body: string;
  bodyType: 'json' | 'form-data' | 'raw' | 'none';
  createdAt: Date;
  collectionId?: string;
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  author: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  modifiedAt: Date;
  requestCount: number;
  requests: RequestData[];
}

interface Tab {
  id: string;
  request: RequestData;
  response?: ResponseData;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

interface Environment {
  id: string;
  name: string;
  variables: { [key: string]: string };
}

const PostmanClone: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnvironment, setActiveEnvironment] = useState<string>('');
  const [history, setHistory] = useState<RequestData[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Collection Modal State
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    author: '',
    tags: [] as string[],
    color: '#10b981', // Verde como padrão
    icon: '📁',
    isPrivate: false
  });
  const [activeModalTab, setActiveModalTab] = useState<'general' | 'appearance' | 'settings'>('general');
  const [newTag, setNewTag] = useState('');

  const predefinedColors = [
    '#10b981', '#059669', '#047857', '#065f46', // Verdes
    '#16a34a', '#15803d', '#166534', '#14532d', // Mais verdes
    '#22c55e', '#84cc16'  // Verde claro e lime
  ];

  const predefinedIcons = [
    '📁', '📂', '🗂️', '📋', '📊', '🔧', '⚙️', '🛠️', '🔨', '🎯',
    '🚀', '⭐', '💎', '🔥', '⚡', '🌟', '🎨', '🎪', '🎭', '🎬',
    '🎵', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '📱', '💻'
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedCollections = localStorage.getItem('postman-collections');
    const savedHistory = localStorage.getItem('postman-history');
    const savedEnvironments = localStorage.getItem('postman-environments');
    
    if (savedCollections) {
      try {
        const parsed = JSON.parse(savedCollections);
        setCollections(parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          modifiedAt: new Date(c.modifiedAt),
          requests: c.requests?.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt)
          })) || []
        })));
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    }
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((h: any) => ({
          ...h,
          createdAt: new Date(h.createdAt)
        })));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
    
    if (savedEnvironments) {
      try {
        setEnvironments(JSON.parse(savedEnvironments));
      } catch (error) {
        console.error('Error loading environments:', error);
      }
    }

    // Create initial tab if none exist
    if (tabs.length === 0) {
      createNewTab();
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('postman-collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('postman-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('postman-environments', JSON.stringify(environments));
  }, [environments]);

  const createNewTab = useCallback((request?: RequestData) => {
    const newRequest: RequestData = request || {
      id: Date.now().toString(),
      name: 'Nova Requisição',
      method: 'GET',
      url: '',
      headers: [{ key: '', value: '', enabled: true }],
      body: '',
      bodyType: 'json',
      createdAt: new Date()
    };

    const newTab: Tab = {
      id: Date.now().toString(),
      request: newRequest,
      isLoading: false,
      hasUnsavedChanges: false
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        createNewTab();
      }
      return newTabs;
    });
  }, [activeTabId, createNewTab]);

  const updateActiveTab = useCallback((updates: Partial<RequestData>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { 
            ...tab, 
            request: { ...tab.request, ...updates },
            hasUnsavedChanges: true
          }
        : tab
    ));
  }, [activeTabId]);

  const sendRequest = useCallback(async () => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const { request } = activeTab;
    
    // Replace environment variables
    let processedUrl = request.url;
    if (activeEnvironment) {
      const env = environments.find(e => e.id === activeEnvironment);
      if (env) {
        Object.entries(env.variables).forEach(([key, value]) => {
          processedUrl = processedUrl.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
      }
    }

    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, isLoading: true } : tab
    ));

    try {
      const startTime = Date.now();
      
      const headers: Record<string, string> = {};
      request.headers.forEach(header => {
        if (header.enabled && header.key && header.value) {
          headers[header.key] = header.value;
        }
      });

      let data: any = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
        if (request.bodyType === 'json') {
          try {
            data = JSON.parse(request.body);
            headers['Content-Type'] = 'application/json';
          } catch {
            data = request.body;
          }
        } else {
          data = request.body;
        }
      }

      const response: AxiosResponse = await axios({
        method: request.method.toLowerCase() as any,
        url: processedUrl,
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

      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, response: responseData, isLoading: false }
          : tab
      ));

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

      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, response: errorResponse, isLoading: false }
          : tab
      ));
    }
  }, [tabs, activeTabId, environments, activeEnvironment]);

  const saveRequest = useCallback((collectionId?: string) => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const { request } = activeTab;
    
    if (collectionId) {
      // Save to collection
      setCollections(prev => prev.map(collection => 
        collection.id === collectionId
          ? {
              ...collection,
              requests: [...collection.requests, request],
              requestCount: collection.requests.length + 1,
              modifiedAt: new Date()
            }
          : collection
      ));
    }

    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, hasUnsavedChanges: false } : tab
    ));
  }, [tabs, activeTabId]);

  const createCollection = useCallback(() => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name: collectionForm.name || 'Nova Collection',
      description: collectionForm.description,
      color: collectionForm.color,
      icon: collectionForm.icon,
      author: collectionForm.author,
      tags: collectionForm.tags,
      isPrivate: collectionForm.isPrivate,
      createdAt: new Date(),
      modifiedAt: new Date(),
      requestCount: 0,
      requests: []
    };

    setCollections(prev => [...prev, newCollection]);
    setShowCollectionModal(false);
    resetCollectionForm();
  }, [collectionForm]);

  const updateCollection = useCallback(() => {
    if (!editingCollection) return;

    setCollections(prev => prev.map(collection => 
      collection.id === editingCollection.id
        ? {
            ...collection,
            name: collectionForm.name,
            description: collectionForm.description,
            color: collectionForm.color,
            icon: collectionForm.icon,
            author: collectionForm.author,
            tags: collectionForm.tags,
            isPrivate: collectionForm.isPrivate,
            modifiedAt: new Date()
          }
        : collection
    ));

    setShowCollectionModal(false);
    setEditingCollection(null);
    resetCollectionForm();
  }, [editingCollection, collectionForm]);

  const deleteCollection = useCallback((collectionId: string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
    setExpandedCollections(prev => {
      const newSet = new Set(prev);
      newSet.delete(collectionId);
      return newSet;
    });
  }, []);

  const renameCollection = useCallback((collectionId: string, newName: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? { ...collection, name: newName, modifiedAt: new Date() }
        : collection
    ));
  }, []);

  const resetCollectionForm = () => {
    setCollectionForm({
      name: '',
      description: '',
      author: '',
      tags: [],
      color: '#10b981',
      icon: '📁',
      isPrivate: false
    });
    setActiveModalTab('general');
    setNewTag('');
  };

  const openCollectionModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setCollectionForm({
        name: collection.name,
        description: collection.description,
        author: collection.author,
        tags: collection.tags,
        color: collection.color,
        icon: collection.icon,
        isPrivate: collection.isPrivate
      });
    } else {
      setEditingCollection(null);
      resetCollectionForm();
    }
    setShowCollectionModal(true);
  };

  const addTag = () => {
    if (newTag.trim() && !collectionForm.tags.includes(newTag.trim())) {
      setCollectionForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCollectionForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const toggleCollectionExpansion = (collectionId: string) => {
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

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                API Testing Tool
              </h1>
            </div>
            
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Folder className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {environments.length > 0 && (
              <select
                value={activeEnvironment}
                onChange={(e) => setActiveEnvironment(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="">Nenhum Ambiente</option>
                {environments.map(env => (
                  <option key={env.id} value={env.id}>{env.name}</option>
                ))}
              </select>
            )}
            
            <button
              onClick={() => createNewTab()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Nova Aba
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Collections Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Collections</h2>
                <button
                  onClick={() => openCollectionModal()}
                  className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar collections..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Collections List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredCollections.length === 0 ? (
                <div className="text-center py-8">
                  <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {searchTerm ? 'Nenhuma collection encontrada' : 'Nenhuma collection criada'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => openCollectionModal()}
                      className="mt-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                    >
                      Criar primeira collection
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCollections.map(collection => (
                    <div key={collection.id} className="group">
                      <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <button
                          onClick={() => toggleCollectionExpansion(collection.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          {expandedCollections.has(collection.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </button>
                        
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: collection.color }}
                        />
                        
                        <span className="text-lg">{collection.icon}</span>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {collection.name}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openCollectionModal(collection)}
                                className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteCollection(collection.id)}
                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {collection.requestCount} requisições
                          </div>
                        </div>
                      </div>

                      {/* Collection Requests */}
                      {expandedCollections.has(collection.id) && (
                        <div className="ml-8 mt-2 space-y-1">
                          {collection.requests.map(request => (
                            <button
                              key={request.id}
                              onClick={() => createNewTab(request)}
                              className="w-full flex items-center gap-3 p-2 text-left rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Histórico Recente</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {history.slice(0, 10).map((request, index) => (
                    <button
                      key={`${request.id}-${index}`}
                      onClick={() => createNewTab(request)}
                      className="w-full flex items-center gap-2 p-2 text-left rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {request.url || 'URL não definida'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center overflow-x-auto">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-3 border-r border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                    tab.id === activeTabId 
                      ? 'bg-green-50 dark:bg-green-900/20 border-b-2 border-green-500' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
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
                  
                  <span className="text-sm text-gray-900 dark:text-gray-100 max-w-32 truncate">
                    {tab.request.name}
                  </span>
                  
                  {tab.hasUnsavedChanges && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Panel */}
          {activeTab && (
            <div className="flex-1 flex flex-col">
              {/* Request Configuration */}
              <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                {/* Request Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={activeTab.request.name}
                    onChange={(e) => updateActiveTab({ name: e.target.value })}
                    className="text-lg font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 w-full"
                    placeholder="Nome da requisição"
                  />
                </div>

                {/* URL Bar */}
                <div className="flex gap-3 mb-6">
                  <select
                    value={activeTab.request.method}
                    onChange={(e) => updateActiveTab({ method: e.target.value as any })}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
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
                    onChange={(e) => updateActiveTab({ url: e.target.value })}
                    placeholder="https://api.exemplo.com/endpoint"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  
                  <button
                    onClick={sendRequest}
                    disabled={activeTab.isLoading || !activeTab.request.url}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {activeTab.isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar
                      </>
                    )}
                  </button>
                </div>

                {/* Request Options */}
                <div className="flex gap-4 mb-4">
                  <button className="px-4 py-2 text-green-600 dark:text-green-400 border-b-2 border-green-500 font-medium">
                    Headers
                  </button>
                  {['POST', 'PUT', 'PATCH'].includes(activeTab.request.method) && (
                    <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                      Body
                    </button>
                  )}
                </div>

                {/* Headers */}
                <div className="space-y-3">
                  {activeTab.request.headers.map((header, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => {
                          const newHeaders = [...activeTab.request.headers];
                          newHeaders[index].enabled = e.target.checked;
                          updateActiveTab({ headers: newHeaders });
                        }}
                        className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500"
                      />
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => {
                          const newHeaders = [...activeTab.request.headers];
                          newHeaders[index].key = e.target.value;
                          updateActiveTab({ headers: newHeaders });
                        }}
                        placeholder="Header"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => {
                          const newHeaders = [...activeTab.request.headers];
                          newHeaders[index].value = e.target.value;
                          updateActiveTab({ headers: newHeaders });
                        }}
                        placeholder="Valor"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        onClick={() => {
                          const newHeaders = activeTab.request.headers.filter((_, i) => i !== index);
                          updateActiveTab({ headers: newHeaders });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => {
                      const newHeaders = [...activeTab.request.headers, { key: '', value: '', enabled: true }];
                      updateActiveTab({ headers: newHeaders });
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Header
                  </button>
                </div>

                {/* Body (for POST, PUT, PATCH) */}
                {['POST', 'PUT', 'PATCH'].includes(activeTab.request.method) && (
                  <div className="mt-6">
                    <div className="flex gap-4 mb-4">
                      <select
                        value={activeTab.request.bodyType}
                        onChange={(e) => updateActiveTab({ bodyType: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="json">JSON</option>
                        <option value="raw">Raw</option>
                        <option value="form-data">Form Data</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    
                    {activeTab.request.bodyType !== 'none' && (
                      <textarea
                        value={activeTab.request.body}
                        onChange={(e) => updateActiveTab({ body: e.target.value })}
                        placeholder={
                          activeTab.request.bodyType === 'json' 
                            ? '{\n  "key": "value"\n}'
                            : 'Conteúdo do corpo da requisição'
                        }
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                      />
                    )}
                  </div>
                )}

                {/* Save Options */}
                <div className="flex gap-3 mt-6">
                  {collections.length > 0 && (
                    <select
                      onChange={(e) => e.target.value && saveRequest(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue=""
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

              {/* Response Panel */}
              {activeTab.response && (
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 overflow-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {/* Response Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            activeTab.response.status >= 200 && activeTab.response.status < 300
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : activeTab.response.status >= 400
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {activeTab.response.status} {activeTab.response.statusText}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {activeTab.response.time}ms
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {(activeTab.response.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                        
                        <button
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(activeTab.response.data, null, 2))}
                          className="flex items-center gap-2 px-3 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copiar
                        </button>
                      </div>
                    </div>

                    {/* Response Body */}
                    <div className="p-4">
                      <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                        <code className="text-gray-800 dark:text-gray-200">
                          {JSON.stringify(activeTab.response.data, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCollectionModal(false)} />
          
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {editingCollection ? 'Editar Collection' : 'Nova Collection'}
              </h3>
              <button
                onClick={() => setShowCollectionModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'general', label: 'Geral', icon: Info },
                { id: 'appearance', label: 'Aparência', icon: Palette },
                { id: 'settings', label: 'Configurações', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModalTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeModalTab === tab.id
                        ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* General Tab */}
              {activeModalTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome da Collection *
                    </label>
                    <input
                      type="text"
                      value={collectionForm.name}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: API de Usuários"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={collectionForm.description}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o propósito desta collection..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Autor
                    </label>
                    <input
                      type="text"
                      value={collectionForm.author}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Adicionar tag"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {collectionForm.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeModalTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Cor da Collection
                    </label>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCollectionForm(prev => ({ ...prev, color }))}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            collectionForm.color === color 
                              ? 'border-gray-400 dark:border-gray-300 scale-110' 
                              : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={collectionForm.color}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={collectionForm.color}
                          onChange={(e) => setCollectionForm(prev => ({ ...prev, color: e.target.value }))}
                          placeholder="#10b981"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Ícone da Collection
                    </label>
                    <div className="grid grid-cols-10 gap-2 mb-4">
                      {predefinedIcons.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setCollectionForm(prev => ({ ...prev, icon }))}
                          className={`w-10 h-10 text-xl rounded-lg border-2 transition-all hover:scale-110 ${
                            collectionForm.icon === icon 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                              : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={collectionForm.icon}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="📁"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center text-xl"
                      maxLength={2}
                    />
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Preview
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: collectionForm.color }}
                      />
                      <span className="text-lg">{collectionForm.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {collectionForm.name || 'Nome da Collection'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          0 requisições
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeModalTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={collectionForm.isPrivate}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                        className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Collection Privada</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Collections privadas não são visíveis para outros usuários
                        </p>
                      </div>
                    </label>
                  </div>

                  {editingCollection && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Metadados</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Criada em:</span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {editingCollection.createdAt.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Modificada em:</span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {editingCollection.modifiedAt.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Requisições:</span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {editingCollection.requestCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Sobre Collections
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                          Collections ajudam a organizar suas requisições por projeto, API ou funcionalidade. 
                          Você pode personalizar a aparência e adicionar tags para facilitar a busca.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCollectionModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingCollection ? updateCollection : createCollection}
                disabled={!collectionForm.name.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Save className="w-4 h-4" />
                {editingCollection ? 'Salvar Alterações' : 'Criar Collection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostmanClone;