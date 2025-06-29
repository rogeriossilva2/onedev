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
  Star
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
  const [showCollections, setShowCollections] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showEnvironments, setShowEnvironments] = useState(false);
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Collection Modal State
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    author: '',
    tags: [] as string[],
    color: '#10b981',
    icon: '📁',
    isPrivate: false
  });
  const [newTag, setNewTag] = useState('');
  const [activeModalTab, setActiveModalTab] = useState<'general' | 'appearance' | 'settings'>('general');

  const predefinedColors = [
    '#10b981', '#059669', '#047857', '#065f46',
    '#16a34a', '#15803d', '#166534', '#14532d',
    '#22c55e', '#16a34a', '#15803d', '#166534',
    '#84cc16', '#65a30d', '#4d7c0f', '#365314'
  ];

  const predefinedIcons = [
    '📁', '📂', '🗂️', '📋', '📊', '📈', '📉', '🔧', '⚙️', '🛠️',
    '🔨', '🔩', '⚡', '🚀', '🎯', '🎨', '🎭', '🎪', '🎨', '🎯',
    '💡', '🔍', '🔎', '🔬', '🧪', '⚗️', '🧬', '🔭', '📡', '🛰️'
  ];

  // Load data from localStorage on mount
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

  // Save data to localStorage when state changes
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
      name: 'Untitled Request',
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
    
    // Update tab loading state
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, isLoading: true, response: undefined }
        : tab
    ));

    try {
      const startTime = Date.now();
      
      // Prepare headers
      const headers: Record<string, string> = {};
      request.headers.forEach(header => {
        if (header.enabled && header.key && header.value) {
          headers[header.key] = header.value;
        }
      });

      // Prepare request config
      const config: any = {
        method: request.method.toLowerCase(),
        url: request.url,
        headers,
        timeout: 30000
      };

      // Add body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
        if (request.bodyType === 'json') {
          try {
            config.data = JSON.parse(request.body);
            headers['Content-Type'] = 'application/json';
          } catch (error) {
            throw new Error('Invalid JSON in request body');
          }
        } else {
          config.data = request.body;
        }
      }

      const response: AxiosResponse = await axios(config);
      const endTime = Date.now();

      const responseData: ResponseData = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        time: endTime - startTime,
        size: JSON.stringify(response.data).length
      };

      // Update tab with response
      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, isLoading: false, response: responseData }
          : tab
      ));

      // Add to history
      setHistory(prev => [request, ...prev.slice(0, 99)]); // Keep last 100 requests

    } catch (error) {
      const endTime = Date.now();
      const axiosError = error as AxiosError;
      
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
          ? { ...tab, isLoading: false, response: errorResponse }
          : tab
      ));
    }
  }, [tabs, activeTabId]);

  const addHeader = useCallback(() => {
    updateActiveTab({
      headers: [...(tabs.find(tab => tab.id === activeTabId)?.request.headers || []), 
                { key: '', value: '', enabled: true }]
    });
  }, [tabs, activeTabId, updateActiveTab]);

  const updateHeader = useCallback((index: number, field: keyof Header, value: string | boolean) => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const newHeaders = [...activeTab.request.headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    updateActiveTab({ headers: newHeaders });
  }, [tabs, activeTabId, updateActiveTab]);

  const removeHeader = useCallback((index: number) => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const newHeaders = activeTab.request.headers.filter((_, i) => i !== index);
    updateActiveTab({ headers: newHeaders });
  }, [tabs, activeTabId, updateActiveTab]);

  const saveRequest = useCallback((collectionId?: string) => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const request = { ...activeTab.request };
    
    if (collectionId) {
      request.collectionId = collectionId;
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

    // Mark tab as saved
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, hasUnsavedChanges: false }
        : tab
    ));
  }, [tabs, activeTabId]);

  const createCollection = useCallback(() => {
    setCollectionForm({
      name: '',
      description: '',
      author: '',
      tags: [],
      color: '#10b981',
      icon: '📁',
      isPrivate: false
    });
    setEditingCollection(null);
    setActiveModalTab('general');
    setShowCollectionModal(true);
  }, []);

  const editCollection = useCallback((collection: Collection) => {
    setCollectionForm({
      name: collection.name,
      description: collection.description,
      author: collection.author,
      tags: [...collection.tags],
      color: collection.color,
      icon: collection.icon,
      isPrivate: collection.isPrivate
    });
    setEditingCollection(collection);
    setActiveModalTab('general');
    setShowCollectionModal(true);
  }, []);

  const handleSaveCollection = useCallback(() => {
    if (!collectionForm.name.trim()) return;

    const collectionData = {
      ...collectionForm,
      name: collectionForm.name.trim(),
      description: collectionForm.description.trim(),
      author: collectionForm.author.trim()
    };

    if (editingCollection) {
      // Update existing collection
      setCollections(prev => prev.map(collection => 
        collection.id === editingCollection.id
          ? {
              ...collection,
              ...collectionData,
              modifiedAt: new Date()
            }
          : collection
      ));
    } else {
      // Create new collection
      const newCollection: Collection = {
        id: Date.now().toString(),
        ...collectionData,
        createdAt: new Date(),
        modifiedAt: new Date(),
        requestCount: 0,
        requests: []
      };
      setCollections(prev => [...prev, newCollection]);
    }

    setShowCollectionModal(false);
    setEditingCollection(null);
  }, [collectionForm, editingCollection]);

  const deleteCollection = useCallback((collectionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta collection?')) {
      setCollections(prev => prev.filter(c => c.id !== collectionId));
    }
  }, []);

  const renameCollection = useCallback((collectionId: string, newName: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? { ...collection, name: newName, modifiedAt: new Date() }
        : collection
    ));
  }, []);

  const addTag = useCallback(() => {
    if (newTag.trim() && !collectionForm.tags.includes(newTag.trim())) {
      setCollectionForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  }, [newTag, collectionForm.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setCollectionForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50 border-green-200';
    if (status >= 300 && status < 400) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (status >= 500) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-50 border-green-200';
      case 'POST': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'PUT': return 'text-green-600 bg-green-50 border-green-200';
      case 'DELETE': return 'text-red-600 bg-red-50 border-red-200';
      case 'PATCH': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              API Testing Tool
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={activeEnvironment}
              onChange={(e) => setActiveEnvironment(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">No Environment</option>
              {environments.map(env => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>
            
            <button
              onClick={createNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setShowCollections(!showCollections)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showCollections 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Folder className="w-4 h-4" />
                Collections
              </button>
              
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showHistory 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                History
              </button>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Collections */}
            {showCollections && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Collections</h3>
                  <button
                    onClick={createCollection}
                    className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {collections.map(collection => (
                    <div key={collection.id} className="group">
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <button
                          onClick={() => setExpandedCollections(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(collection.id)) {
                              newSet.delete(collection.id);
                            } else {
                              newSet.add(collection.id);
                            }
                            return newSet;
                          })}
                          className="p-1"
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
                        
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1 truncate">
                          {collection.icon} {collection.name}
                        </span>
                        
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                          <button
                            onClick={() => editCollection(collection)}
                            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteCollection(collection.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {expandedCollections.has(collection.id) && (
                        <div className="ml-6 space-y-1">
                          {collection.requests.map(request => (
                            <button
                              key={request.id}
                              onClick={() => createNewTab(request)}
                              className="w-full flex items-center gap-2 p-2 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <span className={`px-2 py-1 text-xs font-medium rounded border ${getMethodColor(request.method)}`}>
                                {request.method}
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {request.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {showHistory && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">History</h3>
                <div className="space-y-2">
                  {history.slice(0, 20).map((request, index) => (
                    <button
                      key={`${request.id}-${index}`}
                      onClick={() => createNewTab(request)}
                      className="w-full flex items-center gap-2 p-2 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getMethodColor(request.method)}`}>
                        {request.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {request.url || 'Untitled Request'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {request.createdAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center overflow-x-auto">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer min-w-0 ${
                    tab.id === activeTabId
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getMethodColor(tab.request.method)}`}>
                    {tab.request.method}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-32">
                    {tab.request.name}
                  </span>
                  {tab.hasUnsavedChanges && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
                {/* Request Line */}
                <div className="flex items-center gap-3 mb-4">
                  <select
                    value={activeTab.request.method}
                    onChange={(e) => updateActiveTab({ method: e.target.value as any })}
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
                    onChange={(e) => updateActiveTab({ url: e.target.value })}
                    placeholder="Enter request URL"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  
                  <button
                    onClick={sendRequest}
                    disabled={activeTab.isLoading || !activeTab.request.url}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {activeTab.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </button>
                </div>

                {/* Request Name and Save */}
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    value={activeTab.request.name}
                    onChange={(e) => updateActiveTab({ name: e.target.value })}
                    placeholder="Request name"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  
                  <select
                    onChange={(e) => e.target.value && saveRequest(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue=""
                  >
                    <option value="">Save to Collection</option>
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Headers */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Headers</h3>
                    <button
                      onClick={addHeader}
                      className="flex items-center gap-1 px-3 py-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {activeTab.request.headers.map((header, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={header.enabled}
                          onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                          className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500"
                        />
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => updateHeader(index, 'key', e.target.value)}
                          placeholder="Header name"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          placeholder="Header value"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => removeHeader(index)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                {['POST', 'PUT', 'PATCH'].includes(activeTab.request.method) && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Body</h3>
                      <select
                        value={activeTab.request.bodyType}
                        onChange={(e) => updateActiveTab({ bodyType: e.target.value as any })}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      >
                        <option value="none">None</option>
                        <option value="json">JSON</option>
                        <option value="form-data">Form Data</option>
                        <option value="raw">Raw</option>
                      </select>
                    </div>
                    
                    {activeTab.request.bodyType !== 'none' && (
                      <textarea
                        value={activeTab.request.body}
                        onChange={(e) => updateActiveTab({ body: e.target.value })}
                        placeholder={
                          activeTab.request.bodyType === 'json' 
                            ? '{\n  "key": "value"\n}'
                            : 'Request body content'
                        }
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Response Panel */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
                {activeTab.response ? (
                  <div>
                    {/* Response Status */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded border ${getStatusColor(activeTab.response.status)}`}>
                        {activeTab.response.status} {activeTab.response.statusText}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Time: {activeTab.response.time}ms
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Size: {activeTab.response.size} bytes
                      </span>
                    </div>

                    {/* Response Body */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Response Body</h3>
                      </div>
                      <div className="p-4">
                        <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                          {JSON.stringify(activeTab.response.data, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Response Headers */}
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Response Headers</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          {Object.entries(activeTab.response.headers).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                              <span className="font-medium text-gray-700 dark:text-gray-300 min-w-32">
                                {key}:
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Send a request to see the response</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCollectionModal(false)} />
          
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {editingCollection ? 'Editar Collection' : 'Nova Collection'}
              </h2>
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
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                      activeModalTab === tab.id
                        ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Content */}
            <div className="p-6">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Cor da Collection
                    </label>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCollectionForm(prev => ({ ...prev, color }))}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            collectionForm.color === color
                              ? 'border-gray-900 dark:border-gray-100 scale-110'
                              : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={collectionForm.color}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor Personalizada</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{collectionForm.color}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Ícone da Collection
                    </label>
                    <div className="grid grid-cols-10 gap-2">
                      {predefinedIcons.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setCollectionForm(prev => ({ ...prev, icon }))}
                          className={`w-10 h-10 text-lg rounded-lg border-2 transition-all hover:scale-110 ${
                            collectionForm.icon === icon
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Preview</h3>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: collectionForm.color }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {collectionForm.icon} {collectionForm.name || 'Nome da Collection'}
                      </span>
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
                        <div className="font-medium text-gray-900 dark:text-gray-100">Collection Privada</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Apenas você pode ver e editar esta collection
                        </div>
                      </div>
                    </label>
                  </div>

                  {editingCollection && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Metadados</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Criada em: {editingCollection.createdAt.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Modificada em: {editingCollection.modifiedAt.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {editingCollection.requestCount} requisições
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Sobre Collections
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Collections ajudam a organizar suas requisições por projeto, API ou funcionalidade. 
                          Você pode personalizar cores e ícones para facilitar a identificação.
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
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCollection}
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