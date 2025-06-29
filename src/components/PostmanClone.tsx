import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  Send, 
  Plus, 
  X, 
  Copy, 
  Download, 
  Upload, 
  Settings, 
  Folder, 
  FolderOpen,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Code,
  FileText,
  Key,
  Hash,
  Globe,
  Zap,
  Variable,
  Database,
  MoreHorizontal,
  Save,
  RefreshCw,
  Search,
  Filter,
  Palette
} from 'lucide-react';

// Types
interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface Param {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}

interface Variable {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'secret';
  description?: string;
  scope: 'global' | 'environment';
}

interface Environment {
  id: string;
  name: string;
  variables: Variable[];
  isActive: boolean;
}

interface RequestBody {
  type: 'none' | 'json' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary';
  json?: string;
  formData?: Array<{ id: string; key: string; value: string; type: 'text' | 'file'; enabled: boolean }>;
  raw?: string;
  rawType?: 'text' | 'javascript' | 'json' | 'html' | 'xml';
}

interface Request {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Header[];
  params: Param[];
  body: RequestBody;
  description?: string;
}

interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

interface Tab {
  id: string;
  request: Request;
  response?: Response;
  isLoading: boolean;
  hasChanges: boolean;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  requests: Request[];
  isExpanded: boolean;
}

interface History {
  id: string;
  request: Request;
  response: Response;
  timestamp: Date;
}

const PostmanClone: React.FC = () => {
  // State
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnvironment, setActiveEnvironment] = useState<string>('');
  const [globalVariables, setGlobalVariables] = useState<Variable[]>([]);
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<'collections' | 'history' | 'environments'>('collections');
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);

  // Request UI State
  const [activeRequestTab, setActiveRequestTab] = useState<'params' | 'headers' | 'body'>('params');
  const [activeResponseTab, setActiveResponseTab] = useState<'body' | 'headers' | 'cookies'>('body');

  // Load data from localStorage
  useEffect(() => {
    const savedCollections = localStorage.getItem('postman-collections');
    const savedHistory = localStorage.getItem('postman-history');
    const savedEnvironments = localStorage.getItem('postman-environments');
    const savedGlobalVars = localStorage.getItem('postman-global-variables');
    const savedActiveEnv = localStorage.getItem('postman-active-environment');

    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }

    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }

    if (savedEnvironments) {
      setEnvironments(JSON.parse(savedEnvironments));
    }

    if (savedGlobalVars) {
      setGlobalVariables(JSON.parse(savedGlobalVars));
    }

    if (savedActiveEnv) {
      setActiveEnvironment(savedActiveEnv);
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

  useEffect(() => {
    localStorage.setItem('postman-global-variables', JSON.stringify(globalVariables));
  }, [globalVariables]);

  useEffect(() => {
    localStorage.setItem('postman-active-environment', activeEnvironment);
  }, [activeEnvironment]);

  // Helper functions
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const createNewRequest = (): Request => ({
    id: generateId(),
    name: 'Untitled Request',
    method: 'GET',
    url: '',
    headers: [{ id: generateId(), key: '', value: '', enabled: true }],
    params: [{ id: generateId(), key: '', value: '', enabled: true }],
    body: { type: 'none' }
  });

  const createNewTab = () => {
    const newTab: Tab = {
      id: generateId(),
      request: createNewRequest(),
      isLoading: false,
      hasChanges: false
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
        createNewTab();
      }
      return newTabs;
    });
  };

  const updateActiveTab = (updates: Partial<Tab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, ...updates, hasChanges: true }
        : tab
    ));
  };

  const updateActiveRequest = (updates: Partial<Request>) => {
    updateActiveTab({
      request: {
        ...getActiveTab()?.request!,
        ...updates
      }
    });
  };

  const getActiveTab = () => tabs.find(tab => tab.id === activeTabId);

  // Variable resolution
  const resolveVariables = (text: string): string => {
    let resolved = text;
    
    // Get active environment variables
    const activeEnv = environments.find(env => env.id === activeEnvironment);
    const envVars = activeEnv?.variables || [];
    
    // Combine global and environment variables
    const allVariables = [...globalVariables, ...envVars];
    
    // Replace variables in format {{variableName}}
    allVariables.forEach(variable => {
      const regex = new RegExp(`{{\\s*${variable.key}\\s*}}`, 'g');
      resolved = resolved.replace(regex, variable.value);
    });
    
    return resolved;
  };

  // Add/Remove functions for dynamic arrays
  const addHeader = () => {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    const newHeader: Header = {
      id: generateId(),
      key: '',
      value: '',
      enabled: true
    };
    
    updateActiveRequest({
      headers: [...activeTab.request.headers, newHeader]
    });
  };

  const removeHeader = (headerId: string) => {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    updateActiveRequest({
      headers: activeTab.request.headers.filter(h => h.id !== headerId)
    });
  };

  const updateHeader = (headerId: string, updates: Partial<Header>) => {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    updateActiveRequest({
      headers: activeTab.request.headers.map(h => 
        h.id === headerId ? { ...h, ...updates } : h
      )
    });
  };

  const addParam = () => {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    const newParam: Param = {
      id: generateId(),
      key: '',
      value: '',
      enabled: true
    };
    
    updateActiveRequest({
      params: [...activeTab.request.params, newParam]
    });
  };

  const removeParam = (paramId: string) => {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    updateActiveRequest({
      params: activeTab.request.params.filter(p => p.id !== paramId)
    });
  };

  const updateParam = (paramId: string, updates: Partial<Param>) => {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    updateActiveRequest({
      params: activeTab.request.params.map(p => 
        p.id === paramId ? { ...p, ...updates } : p
      )
    });
  };

  // Form data functions
  const addFormDataField = () => {
    const activeTab = getActiveTab();
    if (!activeTab || activeTab.request.body.type !== 'form-data') return;
    
    const newField = {
      id: generateId(),
      key: '',
      value: '',
      type: 'text' as const,
      enabled: true
    };
    
    updateActiveRequest({
      body: {
        ...activeTab.request.body,
        formData: [...(activeTab.request.body.formData || []), newField]
      }
    });
  };

  const removeFormDataField = (fieldId: string) => {
    const activeTab = getActiveTab();
    if (!activeTab || activeTab.request.body.type !== 'form-data') return;
    
    updateActiveRequest({
      body: {
        ...activeTab.request.body,
        formData: activeTab.request.body.formData?.filter(f => f.id !== fieldId) || []
      }
    });
  };

  const updateFormDataField = (fieldId: string, updates: any) => {
    const activeTab = getActiveTab();
    if (!activeTab || activeTab.request.body.type !== 'form-data') return;
    
    updateActiveRequest({
      body: {
        ...activeTab.request.body,
        formData: activeTab.request.body.formData?.map(f => 
          f.id === fieldId ? { ...f, ...updates } : f
        ) || []
      }
    });
  };

  // Send request
  const sendRequest = async () => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    updateActiveTab({ isLoading: true });

    try {
      const request = activeTab.request;
      
      // Resolve variables in URL
      let resolvedUrl = resolveVariables(request.url);
      
      // Add query parameters
      const enabledParams = request.params.filter(p => p.enabled && p.key);
      if (enabledParams.length > 0) {
        const urlObj = new URL(resolvedUrl.startsWith('http') ? resolvedUrl : `http://${resolvedUrl}`);
        enabledParams.forEach(param => {
          urlObj.searchParams.set(param.key, resolveVariables(param.value));
        });
        resolvedUrl = urlObj.toString();
      }

      // Prepare headers
      const headers: Record<string, string> = {};
      request.headers
        .filter(h => h.enabled && h.key)
        .forEach(header => {
          headers[header.key] = resolveVariables(header.value);
        });

      // Prepare body
      let data: any = undefined;
      if (request.body.type === 'json' && request.body.json) {
        data = JSON.parse(resolveVariables(request.body.json));
        headers['Content-Type'] = 'application/json';
      } else if (request.body.type === 'form-data' && request.body.formData) {
        const formData = new FormData();
        request.body.formData
          .filter(f => f.enabled && f.key)
          .forEach(field => {
            formData.append(field.key, resolveVariables(field.value));
          });
        data = formData;
      } else if (request.body.type === 'x-www-form-urlencoded' && request.body.formData) {
        const params = new URLSearchParams();
        request.body.formData
          .filter(f => f.enabled && f.key)
          .forEach(field => {
            params.append(field.key, resolveVariables(field.value));
          });
        data = params;
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if (request.body.type === 'raw' && request.body.raw) {
        data = resolveVariables(request.body.raw);
        if (request.body.rawType === 'json') {
          headers['Content-Type'] = 'application/json';
        } else if (request.body.rawType === 'xml') {
          headers['Content-Type'] = 'application/xml';
        } else {
          headers['Content-Type'] = 'text/plain';
        }
      }

      const startTime = Date.now();
      
      const response: AxiosResponse = await axios({
        method: request.method.toLowerCase() as any,
        url: resolvedUrl,
        headers,
        data,
        timeout: 30000
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const responseData: Response = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        time: responseTime,
        size: JSON.stringify(response.data).length
      };

      updateActiveTab({ 
        response: responseData, 
        isLoading: false 
      });

      // Add to history
      const historyItem: History = {
        id: generateId(),
        request: { ...request },
        response: responseData,
        timestamp: new Date()
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 99)]); // Keep last 100

    } catch (error) {
      const axiosError = error as AxiosError;
      const endTime = Date.now();
      
      const errorResponse: Response = {
        status: axiosError.response?.status || 0,
        statusText: axiosError.response?.statusText || 'Network Error',
        headers: axiosError.response?.headers as Record<string, string> || {},
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

  // Environment functions
  const createEnvironment = (name: string) => {
    const newEnv: Environment = {
      id: generateId(),
      name,
      variables: [],
      isActive: false
    };
    
    setEnvironments(prev => [...prev, newEnv]);
    return newEnv;
  };

  const addVariable = (scope: 'global' | 'environment', environmentId?: string) => {
    const newVariable: Variable = {
      id: generateId(),
      key: '',
      value: '',
      type: 'text',
      scope
    };

    if (scope === 'global') {
      setGlobalVariables(prev => [...prev, newVariable]);
    } else if (environmentId) {
      setEnvironments(prev => prev.map(env => 
        env.id === environmentId 
          ? { ...env, variables: [...env.variables, newVariable] }
          : env
      ));
    }
  };

  const updateVariable = (variableId: string, updates: Partial<Variable>, environmentId?: string) => {
    if (updates.scope === 'global') {
      setGlobalVariables(prev => prev.map(v => 
        v.id === variableId ? { ...v, ...updates } : v
      ));
    } else if (environmentId) {
      setEnvironments(prev => prev.map(env => 
        env.id === environmentId 
          ? { 
              ...env, 
              variables: env.variables.map(v => 
                v.id === variableId ? { ...v, ...updates } : v
              )
            }
          : env
      ));
    }
  };

  const removeVariable = (variableId: string, scope: 'global' | 'environment', environmentId?: string) => {
    if (scope === 'global') {
      setGlobalVariables(prev => prev.filter(v => v.id !== variableId));
    } else if (environmentId) {
      setEnvironments(prev => prev.map(env => 
        env.id === environmentId 
          ? { ...env, variables: env.variables.filter(v => v.id !== variableId) }
          : env
      ));
    }
  };

  // Collection functions
  const createCollection = (name: string, description?: string, color?: string) => {
    const newCollection: Collection = {
      id: generateId(),
      name,
      description,
      color: color || '#10b981',
      requests: [],
      isExpanded: true
    };
    
    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  };

  const saveRequestToCollection = (collectionId: string, request: Request) => {
    const requestCopy = { ...request, id: generateId() };
    
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, requests: [...collection.requests, requestCopy] }
        : collection
    ));
  };

  const activeTab = getActiveTab();

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              API Testing Tool
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Environment Selector */}
            <select
              value={activeEnvironment}
              onChange={(e) => setActiveEnvironment(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">No Environment</option>
              {environments.map(env => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowEnvironmentModal(true)}
              className="px-4 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              <Variable className="w-4 h-4" />
            </button>
            
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
        <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          sidebarCollapsed ? 'w-12' : 'w-80'
        }`}>
          {!sidebarCollapsed && (
            <div className="p-4">
              {/* Sidebar Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                {[
                  { id: 'collections', label: 'Collections', icon: Folder },
                  { id: 'history', label: 'History', icon: Clock },
                  { id: 'environments', label: 'Variables', icon: Variable }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === tab.id
                        ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Collections Section */}
              {activeSection === 'collections' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Collections</h3>
                    <button
                      onClick={() => setShowCollectionModal(true)}
                      className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {collections.map(collection => (
                    <div key={collection.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div 
                        className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        onClick={() => setCollections(prev => prev.map(c => 
                          c.id === collection.id ? { ...c, isExpanded: !c.isExpanded } : c
                        ))}
                      >
                        {collection.isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: collection.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
                          {collection.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCollection(collection);
                            setShowCollectionModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {collection.isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-2 space-y-1">
                          {collection.requests.map(request => (
                            <div
                              key={request.id}
                              className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer"
                              onClick={() => {
                                const newTab: Tab = {
                                  id: generateId(),
                                  request: { ...request, id: generateId() },
                                  isLoading: false,
                                  hasChanges: false
                                };
                                setTabs(prev => [...prev, newTab]);
                                setActiveTabId(newTab.id);
                              }}
                            >
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                request.method === 'GET' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                request.method === 'POST' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                                request.method === 'PUT' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                                request.method === 'DELETE' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                              }`}>
                                {request.method}
                              </span>
                              <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                                {request.name}
                              </span>
                            </div>
                          ))}
                          
                          {activeTab && (
                            <button
                              onClick={() => saveRequestToCollection(collection.id, activeTab.request)}
                              className="w-full flex items-center gap-2 p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded text-sm"
                            >
                              <Plus className="w-4 h-4" />
                              Save Current Request
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* History Section */}
              {activeSection === 'history' && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">History</h3>
                  {history.slice(0, 20).map(item => (
                    <div
                      key={item.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => {
                        const newTab: Tab = {
                          id: generateId(),
                          request: { ...item.request, id: generateId() },
                          response: item.response,
                          isLoading: false,
                          hasChanges: false
                        };
                        setTabs(prev => [...prev, newTab]);
                        setActiveTabId(newTab.id);
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          item.request.method === 'GET' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          item.request.method === 'POST' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                          item.request.method === 'PUT' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                          item.request.method === 'DELETE' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {item.request.method}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.response.status >= 200 && item.response.status < 300 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          item.response.status >= 400 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {item.response.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-100 truncate">
                        {item.request.url}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Variables Section */}
              {activeSection === 'environments' && (
                <div className="space-y-4">
                  {/* Global Variables */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Global Variables</h3>
                      <button
                        onClick={() => addVariable('global')}
                        className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {globalVariables.map(variable => (
                        <div key={variable.id} className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <input
                              type="text"
                              value={variable.key}
                              onChange={(e) => updateVariable(variable.id, { key: e.target.value })}
                              placeholder="Variable name"
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <button
                              onClick={() => removeVariable(variable.id, 'global')}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <input
                            type={variable.type === 'secret' ? 'password' : 'text'}
                            value={variable.value}
                            onChange={(e) => updateVariable(variable.id, { value: e.target.value })}
                            placeholder="Variable value"
                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Environment Variables */}
                  {environments.map(env => (
                    <div key={env.id}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{env.name}</h3>
                        <button
                          onClick={() => addVariable('environment', env.id)}
                          className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {env.variables.map(variable => (
                          <div key={variable.id} className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={variable.key}
                                onChange={(e) => updateVariable(variable.id, { key: e.target.value }, env.id)}
                                placeholder="Variable name"
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                              <button
                                onClick={() => removeVariable(variable.id, 'environment', env.id)}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <input
                              type={variable.type === 'secret' ? 'password' : 'text'}
                              value={variable.value}
                              onChange={(e) => updateVariable(variable.id, { value: e.target.value }, env.id)}
                              placeholder="Variable value"
                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 -right-3 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 transform rotate-90" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-3 border-r border-gray-200 dark:border-gray-700 cursor-pointer min-w-0 ${
                    activeTabId === tab.id
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    tab.request.method === 'GET' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    tab.request.method === 'POST' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                    tab.request.method === 'PUT' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                    tab.request.method === 'DELETE' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {tab.request.method}
                  </span>
                  <span className="text-sm truncate max-w-32">
                    {tab.request.name}
                  </span>
                  {tab.hasChanges && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
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

          {/* Request Builder */}
          {activeTab && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Request URL Bar */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-3 mb-3">
                  <select
                    value={activeTab.request.method}
                    onChange={(e) => updateActiveRequest({ method: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
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
                    placeholder="Enter request URL"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  
                  <button
                    onClick={sendRequest}
                    disabled={activeTab.isLoading}
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
                
                <input
                  type="text"
                  value={activeTab.request.name}
                  onChange={(e) => updateActiveRequest({ name: e.target.value })}
                  placeholder="Request name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Request Section */}
                <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                  {/* Request Tabs */}
                  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex">
                      {[
                        { id: 'params', label: 'Params', icon: Hash },
                        { id: 'headers', label: 'Headers', icon: Key },
                        { id: 'body', label: 'Body', icon: FileText }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveRequestTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                            activeRequestTab === tab.id
                              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900/30'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Request Content */}
                  <div className="flex-1 overflow-auto p-4">
                    {/* Params Tab */}
                    {activeRequestTab === 'params' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Query Parameters</h3>
                          <button
                            onClick={addParam}
                            className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {activeTab.request.params.map(param => (
                          <div key={param.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={param.enabled}
                              onChange={(e) => updateParam(param.id, { enabled: e.target.checked })}
                              className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500"
                            />
                            <input
                              type="text"
                              value={param.key}
                              onChange={(e) => updateParam(param.id, { key: e.target.value })}
                              placeholder="Key"
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <input
                              type="text"
                              value={param.value}
                              onChange={(e) => updateParam(param.id, { value: e.target.value })}
                              placeholder="Value"
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <button
                              onClick={() => removeParam(param.id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Headers Tab */}
                    {activeRequestTab === 'headers' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Headers</h3>
                          <button
                            onClick={addHeader}
                            className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {activeTab.request.headers.map(header => (
                          <div key={header.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={header.enabled}
                              onChange={(e) => updateHeader(header.id, { enabled: e.target.checked })}
                              className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500"
                            />
                            <input
                              type="text"
                              value={header.key}
                              onChange={(e) => updateHeader(header.id, { key: e.target.value })}
                              placeholder="Header"
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <input
                              type="text"
                              value={header.value}
                              onChange={(e) => updateHeader(header.id, { value: e.target.value })}
                              placeholder="Value"
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <button
                              onClick={() => removeHeader(header.id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Body Tab */}
                    {activeRequestTab === 'body' && (
                      <div className="space-y-4">
                        {/* Body Type Selector */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Body Type
                          </label>
                          <select
                            value={activeTab.request.body.type}
                            onChange={(e) => updateActiveRequest({
                              body: { type: e.target.value as any }
                            })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="none">None</option>
                            <option value="json">JSON</option>
                            <option value="form-data">Form Data</option>
                            <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
                            <option value="raw">Raw</option>
                          </select>
                        </div>

                        {/* JSON Body */}
                        {activeTab.request.body.type === 'json' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                              JSON
                            </label>
                            <textarea
                              value={activeTab.request.body.json || ''}
                              onChange={(e) => updateActiveRequest({
                                body: { ...activeTab.request.body, json: e.target.value }
                              })}
                              placeholder='{\n  "key": "value"\n}'
                              rows={10}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                            />
                          </div>
                        )}

                        {/* Form Data Body */}
                        {(activeTab.request.body.type === 'form-data' || activeTab.request.body.type === 'x-www-form-urlencoded') && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {activeTab.request.body.type === 'form-data' ? 'Form Data' : 'URL Encoded'}
                              </label>
                              <button
                                onClick={addFormDataField}
                                className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {(activeTab.request.body.formData || []).map(field => (
                              <div key={field.id} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={field.enabled}
                                  onChange={(e) => updateFormDataField(field.id, { enabled: e.target.checked })}
                                  className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500"
                                />
                                <input
                                  type="text"
                                  value={field.key}
                                  onChange={(e) => updateFormDataField(field.id, { key: e.target.value })}
                                  placeholder="Key"
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <input
                                  type="text"
                                  value={field.value}
                                  onChange={(e) => updateFormDataField(field.id, { value: e.target.value })}
                                  placeholder="Value"
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <button
                                  onClick={() => removeFormDataField(field.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Raw Body */}
                        {activeTab.request.body.type === 'raw' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Raw
                              </label>
                              <select
                                value={activeTab.request.body.rawType || 'text'}
                                onChange={(e) => updateActiveRequest({
                                  body: { ...activeTab.request.body, rawType: e.target.value as any }
                                })}
                                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="text">Text</option>
                                <option value="javascript">JavaScript</option>
                                <option value="json">JSON</option>
                                <option value="html">HTML</option>
                                <option value="xml">XML</option>
                              </select>
                            </div>
                            <textarea
                              value={activeTab.request.body.raw || ''}
                              onChange={(e) => updateActiveRequest({
                                body: { ...activeTab.request.body, raw: e.target.value }
                              })}
                              placeholder="Enter raw body content"
                              rows={10}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Section */}
                <div className="w-1/2 flex flex-col">
                  {/* Response Tabs */}
                  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {[
                          { id: 'body', label: 'Body', icon: FileText },
                          { id: 'headers', label: 'Headers', icon: Key },
                          { id: 'cookies', label: 'Cookies', icon: Database }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveResponseTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                              activeResponseTab === tab.id
                                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900/30'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                          >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      
                      {activeTab.response && (
                        <div className="flex items-center gap-4 px-4">
                          <span className={`text-sm font-medium px-2 py-1 rounded ${
                            activeTab.response.status >= 200 && activeTab.response.status < 300 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            activeTab.response.status >= 400 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                            'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {activeTab.response.status} {activeTab.response.statusText}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {activeTab.response.time}ms
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {(activeTab.response.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Response Content */}
                  <div className="flex-1 overflow-auto p-4">
                    {activeTab.response ? (
                      <>
                        {/* Response Body */}
                        {activeResponseTab === 'body' && (
                          <div>
                            <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded border overflow-auto">
                              <code className="text-gray-900 dark:text-gray-100">
                                {typeof activeTab.response.data === 'string' 
                                  ? activeTab.response.data 
                                  : JSON.stringify(activeTab.response.data, null, 2)
                                }
                              </code>
                            </pre>
                          </div>
                        )}

                        {/* Response Headers */}
                        {activeResponseTab === 'headers' && (
                          <div className="space-y-2">
                            {Object.entries(activeTab.response.headers).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 min-w-0 flex-1">
                                  {key}:
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-1">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Response Cookies */}
                        {activeResponseTab === 'cookies' && (
                          <div className="text-center py-8">
                            <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">No cookies in response</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Send className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 dark:text-gray-400">Send a request to see the response</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collection Modal */}
      {showCollectionModal && (
        <CollectionModal
          collection={editingCollection}
          onSave={(name, description, color) => {
            if (editingCollection) {
              setCollections(prev => prev.map(c => 
                c.id === editingCollection.id 
                  ? { ...c, name, description, color }
                  : c
              ));
            } else {
              createCollection(name, description, color);
            }
            setShowCollectionModal(false);
            setEditingCollection(null);
          }}
          onClose={() => {
            setShowCollectionModal(false);
            setEditingCollection(null);
          }}
          onDelete={editingCollection ? (id) => {
            setCollections(prev => prev.filter(c => c.id !== id));
            setShowCollectionModal(false);
            setEditingCollection(null);
          } : undefined}
        />
      )}

      {/* Environment Modal */}
      {showEnvironmentModal && (
        <EnvironmentModal
          environments={environments}
          globalVariables={globalVariables}
          onSave={(envs, globals) => {
            setEnvironments(envs);
            setGlobalVariables(globals);
            setShowEnvironmentModal(false);
          }}
          onClose={() => setShowEnvironmentModal(false)}
        />
      )}
    </div>
  );
};

// Collection Modal Component
interface CollectionModalProps {
  collection?: Collection | null;
  onSave: (name: string, description?: string, color?: string) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({ collection, onSave, onClose, onDelete }) => {
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [color, setColor] = useState(collection?.color || '#10b981');

  const colors = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4',
    '#84cc16', '#f97316', '#ec4899', '#6366f1', '#14b8a6', '#a855f7',
    '#22c55e', '#eab308', '#dc2626', '#0ea5e9'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {collection ? 'Edit Collection' : 'New Collection'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Collection name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Collection description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="grid grid-cols-8 gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === c ? 'border-gray-400' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <div>
              {collection && onDelete && (
                <button
                  onClick={() => onDelete(collection.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(name, description, color)}
                disabled={!name.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {collection ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Environment Modal Component
interface EnvironmentModalProps {
  environments: Environment[];
  globalVariables: Variable[];
  onSave: (environments: Environment[], globalVariables: Variable[]) => void;
  onClose: () => void;
}

const EnvironmentModal: React.FC<EnvironmentModalProps> = ({ 
  environments, 
  globalVariables, 
  onSave, 
  onClose 
}) => {
  const [localEnvironments, setLocalEnvironments] = useState<Environment[]>(environments);
  const [localGlobalVariables, setLocalGlobalVariables] = useState<Variable[]>(globalVariables);
  const [activeTab, setActiveTab] = useState<'global' | string>('global');

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const addEnvironment = () => {
    const newEnv: Environment = {
      id: generateId(),
      name: 'New Environment',
      variables: [],
      isActive: false
    };
    setLocalEnvironments(prev => [...prev, newEnv]);
    setActiveTab(newEnv.id);
  };

  const addVariable = (scope: 'global' | 'environment', environmentId?: string) => {
    const newVariable: Variable = {
      id: generateId(),
      key: '',
      value: '',
      type: 'text',
      scope
    };

    if (scope === 'global') {
      setLocalGlobalVariables(prev => [...prev, newVariable]);
    } else if (environmentId) {
      setLocalEnvironments(prev => prev.map(env => 
        env.id === environmentId 
          ? { ...env, variables: [...env.variables, newVariable] }
          : env
      ));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Manage Variables & Environments
          </h3>
        </div>
        
        <div className="flex h-96">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('global')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'global'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                }`}
              >
                Global Variables
              </button>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Environments</span>
                  <button
                    onClick={addEnvironment}
                    className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {localEnvironments.map(env => (
                  <button
                    key={env.id}
                    onClick={() => setActiveTab(env.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === env.id
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {env.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 overflow-auto">
            {activeTab === 'global' ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Global Variables</h4>
                  <button
                    onClick={() => addVariable('global')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variable
                  </button>
                </div>
                
                <div className="space-y-3">
                  {localGlobalVariables.map(variable => (
                    <div key={variable.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <input
                        type="text"
                        value={variable.key}
                        onChange={(e) => setLocalGlobalVariables(prev => prev.map(v => 
                          v.id === variable.id ? { ...v, key: e.target.value } : v
                        ))}
                        placeholder="Variable name"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <input
                        type={variable.type === 'secret' ? 'password' : 'text'}
                        value={variable.value}
                        onChange={(e) => setLocalGlobalVariables(prev => prev.map(v => 
                          v.id === variable.id ? { ...v, value: e.target.value } : v
                        ))}
                        placeholder="Variable value"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <select
                        value={variable.type}
                        onChange={(e) => setLocalGlobalVariables(prev => prev.map(v => 
                          v.id === variable.id ? { ...v, type: e.target.value as any } : v
                        ))}
                        className="px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="text">Text</option>
                        <option value="secret">Secret</option>
                      </select>
                      <button
                        onClick={() => setLocalGlobalVariables(prev => prev.filter(v => v.id !== variable.id))}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              localEnvironments.find(env => env.id === activeTab) && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={localEnvironments.find(env => env.id === activeTab)?.name || ''}
                      onChange={(e) => setLocalEnvironments(prev => prev.map(env => 
                        env.id === activeTab ? { ...env, name: e.target.value } : env
                      ))}
                      className="text-lg font-medium bg-transparent border-none outline-none text-gray-900 dark:text-gray-100"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => addVariable('environment', activeTab)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Variable
                      </button>
                      <button
                        onClick={() => {
                          setLocalEnvironments(prev => prev.filter(env => env.id !== activeTab));
                          setActiveTab('global');
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {localEnvironments.find(env => env.id === activeTab)?.variables.map(variable => (
                      <div key={variable.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <input
                          type="text"
                          value={variable.key}
                          onChange={(e) => setLocalEnvironments(prev => prev.map(env => 
                            env.id === activeTab 
                              ? { 
                                  ...env, 
                                  variables: env.variables.map(v => 
                                    v.id === variable.id ? { ...v, key: e.target.value } : v
                                  )
                                }
                              : env
                          ))}
                          placeholder="Variable name"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type={variable.type === 'secret' ? 'password' : 'text'}
                          value={variable.value}
                          onChange={(e) => setLocalEnvironments(prev => prev.map(env => 
                            env.id === activeTab 
                              ? { 
                                  ...env, 
                                  variables: env.variables.map(v => 
                                    v.id === variable.id ? { ...v, value: e.target.value } : v
                                  )
                                }
                              : env
                          ))}
                          placeholder="Variable value"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <select
                          value={variable.type}
                          onChange={(e) => setLocalEnvironments(prev => prev.map(env => 
                            env.id === activeTab 
                              ? { 
                                  ...env, 
                                  variables: env.variables.map(v => 
                                    v.id === variable.id ? { ...v, type: e.target.value as any } : v
                                  )
                                }
                              : env
                          ))}
                          className="px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="text">Text</option>
                          <option value="secret">Secret</option>
                        </select>
                        <button
                          onClick={() => setLocalEnvironments(prev => prev.map(env => 
                            env.id === activeTab 
                              ? { ...env, variables: env.variables.filter(v => v.id !== variable.id) }
                              : env
                          ))}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(localEnvironments, localGlobalVariables)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostmanClone;