import React, { useState, useCallback, useEffect } from 'react';
import { Send, Plus, X, Copy, Download, Upload, Save, Folder, Clock, Settings, Play, Pause, RotateCcw, Eye, EyeOff, Code, FileText, Database, Globe, Zap, CheckCircle, AlertTriangle, Info, Search, Filter, Trash2, Edit3, Star, BookOpen, Variable, AirVentIcon as Environment } from 'lucide-react';
import axios, { AxiosResponse, AxiosError } from 'axios';

// Types
interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestBody {
  type: 'none' | 'json' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary';
  content: string;
  formData: Array<{ id: string; key: string; value: string; type: 'text' | 'file'; enabled: boolean }>;
}

interface Variable {
  id: string;
  key: string;
  value: string;
  description?: string;
}

interface Environment {
  id: string;
  name: string;
  variables: Variable[];
  isActive: boolean;
}

interface RequestConfig {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Header[];
  body: RequestBody;
  params: Array<{ id: string; key: string; value: string; enabled: boolean }>;
  auth?: {
    type: 'none' | 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiValue?: string;
  };
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  size: number;
}

interface Tab {
  id: string;
  name: string;
  request: RequestConfig;
  response?: ResponseData;
  isModified: boolean;
  isSaved: boolean;
}

interface Collection {
  id: string;
  name: string;
  requests: RequestConfig[];
  createdAt: Date;
}

interface HistoryItem {
  id: string;
  request: RequestConfig;
  response: ResponseData;
  timestamp: Date;
}

const PostmanClone: React.FC = () => {
  // State
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [globalVariables, setGlobalVariables] = useState<Variable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'collections' | 'history' | 'environments'>('collections');
  const [showVariables, setShowVariables] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTabs = localStorage.getItem('postman-tabs');
    const savedCollections = localStorage.getItem('postman-collections');
    const savedHistory = localStorage.getItem('postman-history');
    const savedEnvironments = localStorage.getItem('postman-environments');
    const savedGlobalVars = localStorage.getItem('postman-global-variables');

    if (savedTabs) {
      const parsedTabs = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      if (parsedTabs.length > 0) {
        setActiveTabId(parsedTabs[0].id);
      }
    } else {
      // Create initial tab
      createNewTab();
    }

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
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('postman-tabs', JSON.stringify(tabs));
  }, [tabs]);

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

  // Helper functions
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const createNewTab = useCallback((request?: RequestConfig) => {
    const newTab: Tab = {
      id: generateId(),
      name: request?.name || 'New Request',
      request: request || {
        id: generateId(),
        name: 'New Request',
        method: 'GET',
        url: '',
        headers: [],
        body: {
          type: 'none',
          content: '',
          formData: []
        },
        params: []
      },
      isModified: false,
      isSaved: !!request
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
      } else if (newTabs.length === 0) {
        createNewTab();
      }
      return newTabs;
    });
  }, [activeTabId, createNewTab]);

  const updateActiveTab = useCallback((updates: Partial<Tab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, ...updates, isModified: true }
        : tab
    ));
  }, [activeTabId]);

  const updateRequest = useCallback((updates: Partial<RequestConfig>) => {
    updateActiveTab({
      request: {
        ...tabs.find(tab => tab.id === activeTabId)?.request!,
        ...updates
      }
    });
  }, [updateActiveTab, tabs, activeTabId]);

  // Variable replacement
  const replaceVariables = useCallback((text: string): string => {
    let result = text;
    
    // Replace global variables
    globalVariables.forEach(variable => {
      const regex = new RegExp(`{{${variable.key}}}`, 'g');
      result = result.replace(regex, variable.value);
    });

    // Replace environment variables
    const activeEnv = environments.find(env => env.isActive);
    if (activeEnv) {
      activeEnv.variables.forEach(variable => {
        const regex = new RegExp(`{{${variable.key}}}`, 'g');
        result = result.replace(regex, variable.value);
      });
    }

    return result;
  }, [globalVariables, environments]);

  // Send request
  const sendRequest = useCallback(async () => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const { request } = activeTab;
    if (!request.url.trim()) return;

    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Process URL and replace variables
      let processedUrl = replaceVariables(request.url);
      
      // Add query parameters
      const enabledParams = request.params.filter(param => param.enabled && param.key);
      if (enabledParams.length > 0) {
        const urlObj = new URL(processedUrl.startsWith('http') ? processedUrl : `https://${processedUrl}`);
        enabledParams.forEach(param => {
          urlObj.searchParams.set(param.key, replaceVariables(param.value));
        });
        processedUrl = urlObj.toString();
      }

      // Process headers
      const headers: Record<string, string> = {};
      request.headers
        .filter(header => header.enabled && header.key)
        .forEach(header => {
          headers[header.key] = replaceVariables(header.value);
        });

      // Process auth
      if (request.auth) {
        switch (request.auth.type) {
          case 'bearer':
            if (request.auth.token) {
              headers['Authorization'] = `Bearer ${replaceVariables(request.auth.token)}`;
            }
            break;
          case 'basic':
            if (request.auth.username && request.auth.password) {
              const credentials = btoa(`${request.auth.username}:${request.auth.password}`);
              headers['Authorization'] = `Basic ${credentials}`;
            }
            break;
          case 'api-key':
            if (request.auth.apiKey && request.auth.apiValue) {
              headers[request.auth.apiKey] = replaceVariables(request.auth.apiValue);
            }
            break;
        }
      }

      // Process body
      let data: any = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        switch (request.body.type) {
          case 'json':
            try {
              data = JSON.parse(replaceVariables(request.body.content));
              headers['Content-Type'] = 'application/json';
            } catch (e) {
              data = replaceVariables(request.body.content);
            }
            break;
          case 'raw':
            data = replaceVariables(request.body.content);
            break;
          case 'x-www-form-urlencoded':
            const formData = new URLSearchParams();
            request.body.formData
              .filter(item => item.enabled && item.key)
              .forEach(item => {
                formData.append(item.key, replaceVariables(item.value));
              });
            data = formData;
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            break;
          case 'form-data':
            const multipartData = new FormData();
            request.body.formData
              .filter(item => item.enabled && item.key)
              .forEach(item => {
                multipartData.append(item.key, replaceVariables(item.value));
              });
            data = multipartData;
            break;
        }
      }

      // Make request
      const response: AxiosResponse = await axios({
        method: request.method.toLowerCase() as any,
        url: processedUrl,
        headers,
        data,
        timeout: 30000,
        validateStatus: () => true // Don't throw on HTTP error status
      });

      const responseTime = Date.now() - startTime;
      const responseSize = JSON.stringify(response.data).length;

      const responseData: ResponseData = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        responseTime,
        size: responseSize
      };

      // Update tab with response
      updateActiveTab({ response: responseData });

      // Add to history
      const historyItem: HistoryItem = {
        id: generateId(),
        request: { ...request },
        response: responseData,
        timestamp: new Date()
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 99)]); // Keep last 100 items

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const axiosError = error as AxiosError;
      
      const errorResponse: ResponseData = {
        status: axiosError.response?.status || 0,
        statusText: axiosError.message || 'Network Error',
        headers: axiosError.response?.headers as Record<string, string> || {},
        data: axiosError.response?.data || { error: axiosError.message },
        responseTime,
        size: 0
      };

      updateActiveTab({ response: errorResponse });
    } finally {
      setIsLoading(false);
    }
  }, [tabs, activeTabId, replaceVariables, updateActiveTab]);

  // Save request to collection
  const saveToCollection = useCallback(() => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const collectionName = prompt('Collection name:') || 'My Collection';
    const existingCollection = collections.find(col => col.name === collectionName);

    if (existingCollection) {
      setCollections(prev => prev.map(col => 
        col.id === existingCollection.id
          ? { ...col, requests: [...col.requests, activeTab.request] }
          : col
      ));
    } else {
      const newCollection: Collection = {
        id: generateId(),
        name: collectionName,
        requests: [activeTab.request],
        createdAt: new Date()
      };
      setCollections(prev => [...prev, newCollection]);
    }

    updateActiveTab({ isSaved: true });
  }, [tabs, activeTabId, collections, updateActiveTab]);

  // Get active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Add header
  const addHeader = useCallback(() => {
    if (!activeTab) return;
    const newHeader: Header = {
      id: generateId(),
      key: '',
      value: '',
      enabled: true
    };
    updateRequest({
      headers: [...activeTab.request.headers, newHeader]
    });
  }, [activeTab, updateRequest]);

  // Update header
  const updateHeader = useCallback((headerId: string, updates: Partial<Header>) => {
    if (!activeTab) return;
    updateRequest({
      headers: activeTab.request.headers.map(header =>
        header.id === headerId ? { ...header, ...updates } : header
      )
    });
  }, [activeTab, updateRequest]);

  // Remove header
  const removeHeader = useCallback((headerId: string) => {
    if (!activeTab) return;
    updateRequest({
      headers: activeTab.request.headers.filter(header => header.id !== headerId)
    });
  }, [activeTab, updateRequest]);

  // Add param
  const addParam = useCallback(() => {
    if (!activeTab) return;
    const newParam = {
      id: generateId(),
      key: '',
      value: '',
      enabled: true
    };
    updateRequest({
      params: [...activeTab.request.params, newParam]
    });
  }, [activeTab, updateRequest]);

  // Update param
  const updateParam = useCallback((paramId: string, updates: any) => {
    if (!activeTab) return;
    updateRequest({
      params: activeTab.request.params.map(param =>
        param.id === paramId ? { ...param, ...updates } : param
      )
    });
  }, [activeTab, updateRequest]);

  // Remove param
  const removeParam = useCallback((paramId: string) => {
    if (!activeTab) return;
    updateRequest({
      params: activeTab.request.params.filter(param => param.id !== paramId)
    });
  }, [activeTab, updateRequest]);

  // Format JSON
  const formatJSON = useCallback((jsonString: string): string => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  }, []);

  // Get status color
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50 border-green-200';
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (status >= 500) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  if (!activeTab) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No active request</p>
          <button
            onClick={() => createNewTab()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="text-center py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
            <Send className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            API Testing Tool
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Professional API testing and development platform
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'collections', label: 'Collections', icon: Folder },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'environments', label: 'Environments', icon: Environment }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    sidebarTab === tab.id
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

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {sidebarTab === 'collections' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Collections</h3>
                  <button
                    onClick={() => {
                      const name = prompt('Collection name:');
                      if (name) {
                        const newCollection: Collection = {
                          id: generateId(),
                          name,
                          requests: [],
                          createdAt: new Date()
                        };
                        setCollections(prev => [...prev, newCollection]);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {collections.map(collection => (
                  <div key={collection.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{collection.name}</h4>
                      <span className="text-xs text-gray-500">{collection.requests.length} requests</span>
                    </div>
                    <div className="space-y-1">
                      {collection.requests.map(request => (
                        <button
                          key={request.id}
                          onClick={() => createNewTab(request)}
                          className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center gap-2"
                        >
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            request.method === 'GET' ? 'bg-green-100 text-green-800' :
                            request.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            request.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                            request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.method}
                          </span>
                          <span className="truncate">{request.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sidebarTab === 'history' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Request History</h3>
                <div className="space-y-2">
                  {history.map(item => (
                    <button
                      key={item.id}
                      onClick={() => createNewTab(item.request)}
                      className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          item.request.method === 'GET' ? 'bg-green-100 text-green-800' :
                          item.request.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          item.request.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                          item.request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.request.method}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(item.response.status)}`}>
                          {item.response.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{item.request.url}</p>
                      <p className="text-xs text-gray-500">{item.timestamp.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sidebarTab === 'environments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Environments</h3>
                  <button
                    onClick={() => setShowVariables(!showVariables)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Variable className="w-4 h-4" />
                  </button>
                </div>

                {showVariables && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Global Variables</h4>
                    <div className="space-y-2">
                      {globalVariables.map(variable => (
                        <div key={variable.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={variable.key}
                            onChange={(e) => {
                              setGlobalVariables(prev => prev.map(v => 
                                v.id === variable.id ? { ...v, key: e.target.value } : v
                              ));
                            }}
                            placeholder="Key"
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                          />
                          <input
                            type="text"
                            value={variable.value}
                            onChange={(e) => {
                              setGlobalVariables(prev => prev.map(v => 
                                v.id === variable.id ? { ...v, value: e.target.value } : v
                              ));
                            }}
                            placeholder="Value"
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                          />
                          <button
                            onClick={() => {
                              setGlobalVariables(prev => prev.filter(v => v.id !== variable.id));
                            }}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setGlobalVariables(prev => [...prev, {
                            id: generateId(),
                            key: '',
                            value: ''
                          }]);
                        }}
                        className="w-full p-2 text-xs text-gray-500 border border-dashed border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Add Variable
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {environments.map(env => (
                    <div key={env.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{env.name}</h4>
                        <button
                          onClick={() => {
                            setEnvironments(prev => prev.map(e => ({
                              ...e,
                              isActive: e.id === env.id
                            })));
                          }}
                          className={`px-2 py-1 text-xs rounded ${
                            env.isActive 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {env.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {env.variables.length} variables
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-3 border-r border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                  tab.id === activeTabId 
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span className={`px-2 py-1 text-xs rounded font-medium ${
                  tab.request.method === 'GET' ? 'bg-green-100 text-green-800' :
                  tab.request.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  tab.request.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                  tab.request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {tab.request.method}
                </span>
                <span className="text-sm">{tab.name}</span>
                {tab.isModified && !tab.isSaved && (
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
            <button
              onClick={() => createNewTab()}
              className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Request Builder */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* URL Bar */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <select
                  value={activeTab.request.method}
                  onChange={(e) => updateRequest({ method: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                  onChange={(e) => updateRequest({ url: e.target.value })}
                  placeholder="Enter request URL"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                
                <button
                  onClick={sendRequest}
                  disabled={isLoading || !activeTab.request.url.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </button>
                
                <button
                  onClick={saveToCollection}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Request Panel */}
              <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
                {/* Request Tabs */}
                <div className="flex bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  {['Params', 'Headers', 'Body', 'Auth'].map(tab => (
                    <button
                      key={tab}
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-orange-500"
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Request Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800">
                  {/* Headers Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Headers</h3>
                      <button
                        onClick={addHeader}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {activeTab.request.headers.map(header => (
                        <div key={header.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={header.enabled}
                            onChange={(e) => updateHeader(header.id, { enabled: e.target.checked })}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <input
                            type="text"
                            value={header.key}
                            onChange={(e) => updateHeader(header.id, { key: e.target.value })}
                            placeholder="Key"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                          <input
                            type="text"
                            value={header.value}
                            onChange={(e) => updateHeader(header.id, { value: e.target.value })}
                            placeholder="Value"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                          <button
                            onClick={() => removeHeader(header.id)}
                            className="p-2 text-red-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Query Parameters */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Query Parameters</h3>
                        <button
                          onClick={addParam}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {activeTab.request.params.map(param => (
                          <div key={param.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={param.enabled}
                              onChange={(e) => updateParam(param.id, { enabled: e.target.checked })}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <input
                              type="text"
                              value={param.key}
                              onChange={(e) => updateParam(param.id, { key: e.target.value })}
                              placeholder="Key"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <input
                              type="text"
                              value={param.value}
                              onChange={(e) => updateParam(param.id, { value: e.target.value })}
                              placeholder="Value"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <button
                              onClick={() => removeParam(param.id)}
                              className="p-2 text-red-400 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Body Section */}
                    {['POST', 'PUT', 'PATCH'].includes(activeTab.request.method) && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Request Body</h3>
                        
                        <div className="flex gap-2 mb-4">
                          {['none', 'json', 'raw', 'form-data', 'x-www-form-urlencoded'].map(type => (
                            <button
                              key={type}
                              onClick={() => updateRequest({
                                body: { ...activeTab.request.body, type: type as any }
                              })}
                              className={`px-3 py-1 text-sm rounded ${
                                activeTab.request.body.type === type
                                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>

                        {activeTab.request.body.type === 'json' && (
                          <textarea
                            value={activeTab.request.body.content}
                            onChange={(e) => updateRequest({
                              body: { ...activeTab.request.body, content: e.target.value }
                            })}
                            placeholder='{"key": "value"}'
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                          />
                        )}

                        {activeTab.request.body.type === 'raw' && (
                          <textarea
                            value={activeTab.request.body.content}
                            onChange={(e) => updateRequest({
                              body: { ...activeTab.request.body, content: e.target.value }
                            })}
                            placeholder="Raw text content"
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Response Panel */}
              <div className="w-1/2 flex flex-col bg-white dark:bg-gray-800">
                {/* Response Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Response</h3>
                    {activeTab.response && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-2 py-1 rounded border ${getStatusColor(activeTab.response.status)}`}>
                          {activeTab.response.status} {activeTab.response.statusText}
                        </span>
                        <span className="text-gray-500">
                          {activeTab.response.responseTime}ms
                        </span>
                        <span className="text-gray-500">
                          {(activeTab.response.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activeTab.response ? (
                    <div className="space-y-4">
                      {/* Response Body */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Body</h4>
                        <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4 text-sm overflow-x-auto">
                          {typeof activeTab.response.data === 'object' 
                            ? JSON.stringify(activeTab.response.data, null, 2)
                            : activeTab.response.data
                          }
                        </pre>
                      </div>

                      {/* Response Headers */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Headers</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4">
                          {Object.entries(activeTab.response.headers).map(([key, value]) => (
                            <div key={key} className="flex text-sm">
                              <span className="font-medium text-gray-700 dark:text-gray-300 w-1/3">{key}:</span>
                              <span className="text-gray-600 dark:text-gray-400">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p>Send a request to see the response</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostmanClone;