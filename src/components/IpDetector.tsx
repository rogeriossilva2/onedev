import React, { useState, useEffect, useCallback } from 'react';
import { 
  Globe, 
  MapPin, 
  Wifi, 
  Shield, 
  Copy, 
  CheckCircle, 
  Search,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Info,
  Zap,
  Server,
  Clock,
  Flag,
  Building,
  Navigation,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Hash,
  Monitor,
  Smartphone
} from 'lucide-react';

interface IpInfo {
  ip: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
  hostname?: string;
  threat?: {
    is_tor: boolean;
    is_proxy: boolean;
    is_anonymous: boolean;
    is_known_attacker: boolean;
    is_known_abuser: boolean;
    is_threat: boolean;
    is_bogon: boolean;
  };
}

interface DetectionResult {
  ip: IpInfo;
  detectedAt: Date;
  responseTime: number;
  source: 'auto' | 'manual';
}

const IpDetector: React.FC = () => {
  const [currentIp, setCurrentIp] = useState<DetectionResult | null>(null);
  const [searchIp, setSearchIp] = useState('');
  const [searchResult, setSearchResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [showSensitiveData, setShowSensitiveData] = useState(true);
  const [history, setHistory] = useState<DetectionResult[]>([]);

  // Detectar IP atual automaticamente
  const detectCurrentIp = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const startTime = Date.now();
      const response = await fetch('https://ipapi.co/json/');
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data: IpInfo = await response.json();
      
      if (data.ip) {
        const result: DetectionResult = {
          ip: data,
          detectedAt: new Date(),
          responseTime,
          source: 'auto'
        };
        
        setCurrentIp(result);
        
        // Adicionar ao histórico se não for o mesmo IP
        setHistory(prev => {
          const exists = prev.some(item => item.ip.ip === data.ip);
          if (!exists) {
            return [result, ...prev.slice(0, 9)]; // Manter apenas os 10 mais recentes
          }
          return prev;
        });
      } else {
        throw new Error('Dados de IP inválidos recebidos');
      }
    } catch (error) {
      console.error('Erro ao detectar IP:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido ao detectar IP');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar IP específico
  const searchSpecificIp = useCallback(async () => {
    if (!searchIp.trim()) {
      setError('Digite um endereço IP válido');
      return;
    }

    // Validação básica de IP
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    
    if (!ipv4Regex.test(searchIp) && !ipv6Regex.test(searchIp)) {
      setError('Formato de IP inválido. Use IPv4 (ex: 8.8.8.8) ou IPv6');
      return;
    }

    setIsSearching(true);
    setError('');
    
    try {
      const startTime = Date.now();
      const response = await fetch(`https://ipapi.co/${searchIp}/json/`);
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data: IpInfo = await response.json();
      
      if (data.ip) {
        const result: DetectionResult = {
          ip: data,
          detectedAt: new Date(),
          responseTime,
          source: 'manual'
        };
        
        setSearchResult(result);
        
        // Adicionar ao histórico
        setHistory(prev => {
          const exists = prev.some(item => item.ip.ip === data.ip);
          if (!exists) {
            return [result, ...prev.slice(0, 9)];
          }
          return prev;
        });
      } else {
        throw new Error('IP não encontrado ou dados inválidos');
      }
    } catch (error) {
      console.error('Erro ao buscar IP:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido ao buscar IP');
    } finally {
      setIsSearching(false);
    }
  }, [searchIp]);

  // Detectar IP atual na inicialização
  useEffect(() => {
    detectCurrentIp();
  }, [detectCurrentIp]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const exportData = (data: DetectionResult) => {
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      tool: 'OneDev IP Detector'
    };
    
    const content = JSON.stringify(exportData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ip-info-${data.ip.ip.replace(/[:.]/g, '-')}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getIpVersion = (ip: string) => {
    return ip.includes(':') ? 'IPv6' : 'IPv4';
  };

  const renderIpInfo = (result: DetectionResult, title: string, isMain = false) => {
    const { ip, detectedAt, responseTime, source } = result;
    
    return (
      <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20 ${isMain ? 'ring-2 ring-blue-500/20' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isMain ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{source === 'auto' ? 'Detectado automaticamente' : 'Busca manual'}</span>
                <span>•</span>
                <span>{responseTime}ms</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportData(result)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              title="Exportar dados"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* IP Principal */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-mono text-xl font-bold text-blue-900 dark:text-blue-100">{ip.ip}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {getIpVersion(ip.ip)} • {ip.version}
                </div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(ip.ip, `ip-${ip.ip}`)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              {copiedField === `ip-${ip.ip}` ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Localização */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
              Localização
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">País:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 dark:text-gray-100">{ip.country_name}</span>
                  <button
                    onClick={() => copyToClipboard(ip.country_name, `country-${ip.ip}`)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {copiedField === `country-${ip.ip}` ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {ip.region && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado/Região:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{ip.region}</span>
                    <button
                      onClick={() => copyToClipboard(ip.region, `region-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `region-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {ip.city && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cidade:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{ip.city}</span>
                    <button
                      onClick={() => copyToClipboard(ip.city, `city-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `city-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {ip.postal && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CEP:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{ip.postal}</span>
                    <button
                      onClick={() => copyToClipboard(ip.postal, `postal-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `postal-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Provedor & Rede
            </h4>
            
            <div className="space-y-3">
              {ip.org && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Provedor:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-48 truncate" title={ip.org}>
                      {ip.org}
                    </span>
                    <button
                      onClick={() => copyToClipboard(ip.org, `org-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `org-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {ip.asn && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ASN:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{ip.asn}</span>
                    <button
                      onClick={() => copyToClipboard(ip.asn, `asn-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `asn-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {ip.hostname && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hostname:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-48 truncate" title={ip.hostname}>
                      {ip.hostname}
                    </span>
                    <button
                      onClick={() => copyToClipboard(ip.hostname, `hostname-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `hostname-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coordenadas e Fuso Horário */}
        {showSensitiveData && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-green-600 dark:text-green-400" />
                Coordenadas
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Latitude:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{ip.latitude}</span>
                    <button
                      onClick={() => copyToClipboard(ip.latitude.toString(), `lat-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `lat-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Longitude:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{ip.longitude}</span>
                    <button
                      onClick={() => copyToClipboard(ip.longitude.toString(), `lng-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `lng-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <a
                    href={`https://www.google.com/maps?q=${ip.latitude},${ip.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver no Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Fuso Horário
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{ip.timezone}</span>
                    <button
                      onClick={() => copyToClipboard(ip.timezone, `timezone-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `timezone-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">UTC Offset:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{ip.utc_offset}</span>
                    <button
                      onClick={() => copyToClipboard(ip.utc_offset, `utc-${ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `utc-${ip.ip}` ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Informações do País
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Código ISO:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{ip.country_code}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Capital:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{ip.country_capital}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moeda:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{ip.currency_name} ({ip.currency})</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Idiomas:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{ip.languages}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
              Detecção
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Detectado em:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(detectedAt)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempo de resposta:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{responseTime}ms</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">União Europeia:</span>
                <span className={`text-sm ${ip.in_eu ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {ip.in_eu ? 'Sim' : 'Não'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Código de área:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">+{ip.country_calling_code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Detection (se disponível) */}
        {ip.threat && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Análise de Segurança
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className={`p-2 rounded ${ip.threat.is_tor ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'}`}>
                Tor: {ip.threat.is_tor ? 'Sim' : 'Não'}
              </div>
              <div className={`p-2 rounded ${ip.threat.is_proxy ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'}`}>
                Proxy: {ip.threat.is_proxy ? 'Sim' : 'Não'}
              </div>
              <div className={`p-2 rounded ${ip.threat.is_threat ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'}`}>
                Ameaça: {ip.threat.is_threat ? 'Sim' : 'Não'}
              </div>
              <div className={`p-2 rounded ${ip.threat.is_anonymous ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'}`}>
                Anônimo: {ip.threat.is_anonymous ? 'Sim' : 'Não'}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Detector de IP
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Detecte e analise informações detalhadas sobre endereços IP, incluindo localização e provedor
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Current IP Detection */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Seu IP Atual</h3>
            </div>
            
            <button
              onClick={detectCurrentIp}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {isLoading ? 'Detectando...' : 'Detectar Meu IP'}
            </button>
          </div>

          {/* IP Search */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Buscar IP Específico</h3>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
                placeholder="Ex: 8.8.8.8 ou 2001:4860:4860::8888"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onKeyPress={(e) => e.key === 'Enter' && searchSpecificIp()}
              />
              <button
                onClick={searchSpecificIp}
                disabled={isSearching || !searchIp.trim()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              showSensitiveData
                ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
            }`}
          >
            {showSensitiveData ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showSensitiveData ? 'Ocultar' : 'Mostrar'} Dados Sensíveis
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-300 font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-8">
        {/* Current IP Result */}
        {currentIp && renderIpInfo(currentIp, '🌐 Seu IP Atual', true)}

        {/* Search Result */}
        {searchResult && renderIpInfo(searchResult, '🔍 IP Pesquisado')}

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Histórico de Consultas</h3>
            </div>

            <div className="space-y-3">
              {history.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getIpVersion(item.ip.ip) === 'IPv6' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                      {getIpVersion(item.ip.ip) === 'IPv6' ? (
                        <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">{item.ip.ip}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.ip.city}, {item.ip.country_name} • {formatDate(item.detectedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.source === 'auto' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    }`}>
                      {item.source === 'auto' ? 'Auto' : 'Manual'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.ip.ip, `history-${item.ip.ip}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {copiedField === `history-${item.ip.ip}` ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">🌍 Sobre Detecção de IP</h3>
            <div className="text-blue-800 dark:text-blue-300 leading-relaxed space-y-3">
              <p>
                Este detector utiliza a API ipapi.co para fornecer informações precisas sobre endereços IP, 
                incluindo localização geográfica, provedor de internet e dados de segurança.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Recursos
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Detecção automática do seu IP</li>
                    <li>• Busca de IPs específicos (IPv4/IPv6)</li>
                    <li>• Localização geográfica precisa</li>
                    <li>• Informações do provedor</li>
                    <li>• Análise de segurança</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Privacidade
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Consultas diretas à API</li>
                    <li>• Dados não armazenados</li>
                    <li>• Histórico apenas local</li>
                    <li>• Processamento seguro</li>
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

export default IpDetector;