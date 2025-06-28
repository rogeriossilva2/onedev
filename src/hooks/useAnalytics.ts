import { useState, useEffect, useCallback } from 'react';

export interface ToolUsage {
  id: string;
  name: string;
  uses: number;
  lastUsed: Date | null;
}

export interface SessionData {
  sessionId: string;
  startTime: Date;
  totalSessions: number;
  currentSession: number;
  lastVisit: Date;
}

export interface AnalyticsData {
  toolUsage: ToolUsage[];
  sessionData: SessionData;
  totalUsage: number;
}

const STORAGE_KEYS = {
  TOOL_USAGE: 'onedev-tool-usage',
  SESSION_DATA: 'onedev-session-data',
  COOKIE_CONSENT: 'onedev-cookie-consent',
  COOKIE_SETTINGS: 'onedev-cookie-settings'
};

const COOKIE_KEYS = {
  SESSION_ID: 'onedev-session-id',
  LAST_VISIT: 'onedev-last-visit'
};

const DEFAULT_TOOLS: ToolUsage[] = [
  { id: 'seo', name: 'Gerador de SEO', uses: 0, lastUsed: null },
  { id: 'json', name: 'Formatador JSON', uses: 0, lastUsed: null },
  { id: 'cpf-cnpj', name: 'Gerador CPF/CNPJ', uses: 0, lastUsed: null },
  { id: 'credit-card', name: 'Gerador de Cartão', uses: 0, lastUsed: null },
  { id: 'line-counter', name: 'Contador de Linhas', uses: 0, lastUsed: null },
  { id: 'qr-code', name: 'Gerador de QR Code', uses: 0, lastUsed: null },
  { id: 'responsive-tester', name: 'Testador Responsivo', uses: 0, lastUsed: null },
  { id: 'uuid-hash-token', name: 'UUID, Hash & Token', uses: 0, lastUsed: null },
  { id: 'jwt-validator', name: 'Validador JWT', uses: 0, lastUsed: null },
  { id: 'base64', name: 'Base64 Encode/Decode', uses: 0, lastUsed: null },
  { id: 'url', name: 'URL Encode/Decode', uses: 0, lastUsed: null },
  { id: 'markdown', name: 'Editor de Markdown', uses: 0, lastUsed: null },
  { id: 'lorem-ipsum', name: 'Gerador Lorem Ipsum', uses: 0, lastUsed: null },
  { id: 'device-generator', name: 'Gerador de Dispositivo', uses: 0, lastUsed: null },
  { id: 'person-generator', name: 'Gerador de Pessoa', uses: 0, lastUsed: null },
  { id: 'company-generator', name: 'Gerador de Empresa', uses: 0, lastUsed: null },
  { id: 'cep-generator', name: 'Gerador de CEP', uses: 0, lastUsed: null },
  { id: 'bank-account-generator', name: 'Gerador de Conta Bancária', uses: 0, lastUsed: null },
  { id: 'gitignore-generator', name: 'Gerador .gitignore', uses: 0, lastUsed: null },
  { id: 'readme-generator', name: 'Gerador README.md', uses: 0, lastUsed: null },
  { id: 'composer-generator', name: 'Gerador Composer', uses: 0, lastUsed: null },
  { id: 'slug-formatter', name: 'Slug Formatter', uses: 0, lastUsed: null },
  { id: 'imc-calculator', name: 'Calculadora de IMC', uses: 0, lastUsed: null },
  { id: 'fake-rest-api', name: 'Gerador REST API Fake', uses: 0, lastUsed: null },
];

// Funções para gerenciar cookies
const setCookie = (name: string, value: string, hours: number = 24) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (hours * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    toolUsage: DEFAULT_TOOLS,
    sessionData: {
      sessionId: '',
      startTime: new Date(),
      totalSessions: 0,
      currentSession: 0,
      lastVisit: new Date()
    },
    totalUsage: 0
  });

  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: true,
    preferences: true,
    functional: true
  });

  // Initialize analytics data - SEMPRE carrega dados de uso de ferramentas
  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
    const settings = localStorage.getItem(STORAGE_KEYS.COOKIE_SETTINGS);
    
    if (consent) {
      setCookieConsent(JSON.parse(consent));
    }
    
    if (settings) {
      setCookieSettings(JSON.parse(settings));
    }

    // SEMPRE carrega dados de analytics (uso de ferramentas é obrigatório)
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = useCallback(() => {
    try {
      // SEMPRE carrega tool usage (obrigatório)
      const savedUsage = localStorage.getItem(STORAGE_KEYS.TOOL_USAGE);
      let toolUsage = DEFAULT_TOOLS;
      
      if (savedUsage) {
        const parsed = JSON.parse(savedUsage);
        toolUsage = parsed.map((item: any) => ({
          ...item,
          lastUsed: item.lastUsed ? new Date(item.lastUsed) : null
        }));
      }

      // Verificar sessão via cookies
      const existingSessionId = getCookie(COOKIE_KEYS.SESSION_ID);
      const lastVisitCookie = getCookie(COOKIE_KEYS.LAST_VISIT);
      const now = new Date();
      
      // Load or create session data
      const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      let sessionData: SessionData;
      
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        sessionData = {
          ...parsed,
          startTime: new Date(parsed.startTime),
          lastVisit: new Date(parsed.lastVisit || parsed.startTime)
        };
      } else {
        // Primeira visita
        sessionData = {
          sessionId: generateSessionId(),
          startTime: now,
          totalSessions: 0,
          currentSession: 0,
          lastVisit: now
        };
      }

      // Verificar se é uma nova sessão
      const isNewSession = !existingSessionId || !lastVisitCookie || 
        (lastVisitCookie && (now.getTime() - new Date(lastVisitCookie).getTime()) > 24 * 60 * 60 * 1000);

      if (isNewSession) {
        // Nova sessão
        sessionData.currentSession = sessionData.totalSessions + 1;
        sessionData.totalSessions = sessionData.currentSession;
        sessionData.sessionId = generateSessionId();
        sessionData.startTime = now;
        sessionData.lastVisit = now;

        // Definir cookies de sessão (24 horas) - SEMPRE
        setCookie(COOKIE_KEYS.SESSION_ID, sessionData.sessionId, 24);
        setCookie(COOKIE_KEYS.LAST_VISIT, now.toISOString(), 24);
      } else {
        // Sessão existente - apenas atualizar último acesso
        sessionData.lastVisit = now;
        setCookie(COOKIE_KEYS.LAST_VISIT, now.toISOString(), 24);
      }

      // SEMPRE salva dados da sessão e uso de ferramentas
      localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));

      const totalUsage = toolUsage.reduce((sum, tool) => sum + tool.uses, 0);

      setAnalyticsData({
        toolUsage,
        sessionData,
        totalUsage
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  }, []);

  const generateSessionId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // SEMPRE rastreia uso de ferramentas (obrigatório)
  const trackToolUsage = useCallback((toolId: string) => {
    setAnalyticsData(prev => {
      const updatedUsage = prev.toolUsage.map(tool => 
        tool.id === toolId 
          ? { ...tool, uses: tool.uses + 1, lastUsed: new Date() }
          : tool
      );

      const totalUsage = updatedUsage.reduce((sum, tool) => sum + tool.uses, 0);

      // SEMPRE salva no localStorage (obrigatório)
      try {
        localStorage.setItem(STORAGE_KEYS.TOOL_USAGE, JSON.stringify(updatedUsage));
      } catch (error) {
        console.error('Error saving tool usage:', error);
      }

      return {
        ...prev,
        toolUsage: updatedUsage,
        totalUsage
      };
    });
  }, []); // Removida dependência de cookieConsent - sempre executa

  const acceptCookies = useCallback((settings = cookieSettings) => {
    setCookieConsent(true);
    setCookieSettings(settings);
    
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, 'true');
    localStorage.setItem(STORAGE_KEYS.COOKIE_SETTINGS, JSON.stringify(settings));
    
    // Recarrega dados se necessário (mas uso de ferramentas já está sempre ativo)
    loadAnalyticsData();
  }, [cookieSettings, loadAnalyticsData]);

  const declineCookies = useCallback(() => {
    setCookieConsent(false);
    setCookieSettings({
      essential: true,
      analytics: false,
      preferences: false,
      functional: false
    });
    
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, 'false');
    localStorage.setItem(STORAGE_KEYS.COOKIE_SETTINGS, JSON.stringify({
      essential: true,
      analytics: false,
      preferences: false,
      functional: false
    }));

    // NÃO remove dados de uso de ferramentas (obrigatório)
    // Apenas remove cookies de sessão se analytics for desabilitado
    // Mas mantém funcionalidade básica de contagem
  }, []);

  const updateCookieSettings = useCallback((newSettings: typeof cookieSettings) => {
    setCookieSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.COOKIE_SETTINGS, JSON.stringify(newSettings));
    
    // NÃO limpa dados de uso de ferramentas (sempre obrigatório)
    // Apenas recarrega se necessário
    if (cookieConsent) {
      loadAnalyticsData();
    }
  }, [cookieConsent, loadAnalyticsData]);

  const clearAllData = useCallback(() => {
    // Remove TODOS os dados incluindo uso de ferramentas
    localStorage.removeItem(STORAGE_KEYS.TOOL_USAGE);
    localStorage.removeItem(STORAGE_KEYS.SESSION_DATA);
    localStorage.removeItem(STORAGE_KEYS.COOKIE_CONSENT);
    localStorage.removeItem(STORAGE_KEYS.COOKIE_SETTINGS);
    
    // Clear session cookies
    deleteCookie(COOKIE_KEYS.SESSION_ID);
    deleteCookie(COOKIE_KEYS.LAST_VISIT);
    
    setCookieConsent(null);
    setCookieSettings({
      essential: true,
      analytics: true,
      preferences: true,
      functional: true
    });
    
    setAnalyticsData({
      toolUsage: DEFAULT_TOOLS,
      sessionData: {
        sessionId: '',
        startTime: new Date(),
        totalSessions: 0,
        currentSession: 0,
        lastVisit: new Date()
      },
      totalUsage: 0
    });
  }, []);

  return {
    analyticsData,
    cookieConsent,
    cookieSettings,
    trackToolUsage,
    acceptCookies,
    declineCookies,
    updateCookieSettings,
    clearAllData,
    loadAnalyticsData
  };
};