import React, { useState, useCallback } from 'react';
import { 
  CreditCard, 
  Shield, 
  MapPin, 
  Copy, 
  RefreshCw, 
  Download, 
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Info,
  Zap,
  Hash,
  User,
  Calendar,
  Building2,
  FileText,
  Car,
  Vote,
  Star,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Briefcase,
  DollarSign
} from 'lucide-react';

interface CNHData {
  number: string;
  category: string;
  issueDate: string;
  expiryDate: string;
  state: string;
  isValid: boolean;
}

interface InscricaoEstadualData {
  number: string;
  state: string;
  formatted: string;
  isValid: boolean;
}

interface TituloEleitorData {
  number: string;
  zone: string;
  section: string;
  state: string;
  formatted: string;
  isValid: boolean;
}

interface PISPASEPData {
  number: string;
  formatted: string;
  type: 'PIS' | 'PASEP';
  isValid: boolean;
}

interface RENAVAMData {
  number: string;
  formatted: string;
  isValid: boolean;
}

interface GeneratedDocument {
  type: 'cnh' | 'ie' | 'titulo' | 'pis' | 'renavam';
  data: CNHData | InscricaoEstadualData | TituloEleitorData | PISPASEPData | RENAVAMData;
  createdAt: Date;
}

const BrazilianDocumentsGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cnh' | 'ie' | 'titulo' | 'pis' | 'renavam'>('cnh');
  const [selectedState, setSelectedState] = useState<string>('SP');
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [copiedField, setCopiedField] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [validationInput, setValidationInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [validationMode, setValidationMode] = useState<boolean>(false);

  const states = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
  ];

  const cnhCategories = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];

  // Códigos dos estados para Título de Eleitor
  const tituloStateCodes: { [key: string]: string } = {
    'SP': '01', 'MG': '02', 'RJ': '03', 'RS': '04', 'BA': '05', 'PR': '06',
    'CE': '07', 'PE': '08', 'SC': '09', 'GO': '10', 'MA': '11', 'PB': '12',
    'PA': '13', 'ES': '14', 'PI': '15', 'AL': '16', 'RN': '17', 'MT': '18',
    'MS': '19', 'DF': '20', 'SE': '21', 'AM': '22', 'RO': '23', 'AC': '24',
    'AP': '25', 'RR': '26', 'TO': '27', 'EX': '03'
  };

  // Gerar CNH
  const generateCNH = useCallback((): CNHData => {
    // Gerar 9 dígitos base
    const baseDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    // Calcular primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += baseDigits[i] * (9 - i);
    }
    const firstDigit = sum % 11;
    const digit1 = firstDigit < 2 ? 0 : 11 - firstDigit;
    
    // Calcular segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += baseDigits[i] * (1 + i);
    }
    sum += digit1 * 2;
    const secondDigit = sum % 11;
    const digit2 = secondDigit < 2 ? 0 : 11 - secondDigit;
    
    const fullNumber = [...baseDigits, digit1, digit2].join('');
    
    const issueDate = new Date();
    issueDate.setFullYear(issueDate.getFullYear() - Math.floor(Math.random() * 10));
    
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 5);
    
    return {
      number: fullNumber,
      category: cnhCategories[Math.floor(Math.random() * cnhCategories.length)],
      issueDate: issueDate.toLocaleDateString('pt-BR'),
      expiryDate: expiryDate.toLocaleDateString('pt-BR'),
      state: selectedState,
      isValid: true
    };
  }, [selectedState]);

  // Gerar Inscrição Estadual
  const generateInscricaoEstadual = useCallback((): InscricaoEstadualData => {
    const generateSP = (): string => {
      const baseDigits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
      
      // Calcular primeiro dígito
      const weights1 = [1, 3, 4, 5, 6, 7, 8, 10];
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        sum += baseDigits[i] * weights1[i];
      }
      const remainder = sum % 11;
      const digit1 = remainder < 2 ? 0 : 11 - remainder;
      
      // Calcular segundo dígito
      const weights2 = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];
      const allDigits = [...baseDigits, digit1];
      sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += allDigits[i] * weights2[i];
      }
      const remainder2 = sum % 11;
      const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;
      
      const fullNumber = [...baseDigits, digit1, digit2].join('');
      return fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3.$4');
    };

    const generateRJ = (): string => {
      const baseDigits = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10));
      
      const weights = [2, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = 0; i < 7; i++) {
        sum += baseDigits[i] * weights[i];
      }
      const remainder = sum % 11;
      const digit = remainder < 2 ? 0 : 11 - remainder;
      
      const fullNumber = [...baseDigits, digit].join('');
      return fullNumber.replace(/(\d{2})(\d{3})(\d{2})(\d{1})/, '$1.$2.$3-$4');
    };

    const generateMG = (): string => {
      const baseDigits = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10));
      
      // Calcular primeiro dígito
      const weights1 = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
      let sum = 0;
      for (let i = 0; i < 11; i++) {
        const product = baseDigits[i] * weights1[i];
        sum += product > 9 ? Math.floor(product / 10) + (product % 10) : product;
      }
      const digit1 = ((Math.ceil(sum / 10) * 10) - sum) % 10;
      
      // Calcular segundo dígito
      const weights2 = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
      const allDigits = [...baseDigits, digit1];
      sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += allDigits[i] * weights2[i];
      }
      const remainder = sum % 11;
      const digit2 = remainder < 2 ? 0 : 11 - remainder;
      
      const fullNumber = [...baseDigits, digit1, digit2].join('');
      return fullNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4');
    };

    const generateRS = (): string => {
      const baseDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
      
      const weights = [2, 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += baseDigits[i] * weights[i];
      }
      const remainder = sum % 11;
      const digit = remainder < 2 ? 0 : 11 - remainder;
      
      const fullNumber = [...baseDigits, digit].join('');
      return fullNumber.replace(/(\d{3})(\d{7})/, '$1/$2');
    };

    const generateDefault = (): string => {
      // Formato genérico para outros estados
      const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
      return digits.join('');
    };

    let formatted: string;
    let number: string;

    switch (selectedState) {
      case 'SP':
        formatted = generateSP();
        number = formatted.replace(/\D/g, '');
        break;
      case 'RJ':
        formatted = generateRJ();
        number = formatted.replace(/\D/g, '');
        break;
      case 'MG':
        formatted = generateMG();
        number = formatted.replace(/\D/g, '');
        break;
      case 'RS':
        formatted = generateRS();
        number = formatted.replace(/\D/g, '');
        break;
      default:
        number = generateDefault();
        formatted = number;
    }

    return {
      number,
      state: selectedState,
      formatted,
      isValid: true
    };
  }, [selectedState]);

  // Gerar Título de Eleitor
  const generateTituloEleitor = useCallback((): TituloEleitorData => {
    // Gerar 8 dígitos base
    const baseDigits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
    
    // Calcular primeiro dígito verificador
    const weights1 = [2, 3, 4, 5, 6, 7, 8, 9];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += baseDigits[i] * weights1[i];
    }
    const remainder1 = sum % 11;
    const digit1 = remainder1 < 2 ? 0 : 11 - remainder1;
    
    // Código do estado
    const stateCode = tituloStateCodes[selectedState] || '01';
    const stateDigits = stateCode.split('').map(Number);
    
    // Calcular segundo dígito verificador
    const weights2 = [7, 8, 9];
    sum = 0;
    sum += digit1 * weights2[0];
    sum += stateDigits[0] * weights2[1];
    sum += stateDigits[1] * weights2[2];
    
    const remainder2 = sum % 11;
    const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;
    
    const fullNumber = [...baseDigits, digit1, digit2].join('') + stateCode;
    const formatted = fullNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    
    // Gerar zona e seção aleatórias
    const zone = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    const section = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    
    return {
      number: fullNumber,
      zone,
      section,
      state: selectedState,
      formatted,
      isValid: true
    };
  }, [selectedState]);

  // Gerar PIS/PASEP
  const generatePISPASEP = useCallback((): PISPASEPData => {
    // Gerar 10 dígitos base
    const baseDigits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    
    // Calcular dígito verificador
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += baseDigits[i] * weights[i];
    }
    const remainder = sum % 11;
    const digit = remainder < 2 ? 0 : 11 - remainder;
    
    const fullNumber = [...baseDigits, digit].join('');
    const formatted = fullNumber.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
    
    // Determinar tipo (PIS ou PASEP) aleatoriamente
    const type = Math.random() > 0.5 ? 'PIS' : 'PASEP';
    
    return {
      number: fullNumber,
      formatted,
      type,
      isValid: true
    };
  }, []);

  // Gerar RENAVAM
  const generateRENAVAM = useCallback((): RENAVAMData => {
    // Gerar 10 dígitos base
    const baseDigits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    
    // Calcular dígito verificador
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += baseDigits[i] * weights[i];
    }
    const remainder = sum % 11;
    const digit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
    
    const fullNumber = [...baseDigits, digit].join('');
    const formatted = fullNumber; // RENAVAM não tem formatação específica
    
    return {
      number: fullNumber,
      formatted,
      isValid: true
    };
  }, []);

  // Validar CNH
  const validateCNH = (cnh: string): boolean => {
    const cleanCNH = cnh.replace(/\D/g, '');
    if (cleanCNH.length !== 11) return false;
    
    const digits = cleanCNH.split('').map(Number);
    
    // Verificar primeiro dígito
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (9 - i);
    }
    const firstDigit = sum % 11;
    const expectedDigit1 = firstDigit < 2 ? 0 : 11 - firstDigit;
    
    if (digits[9] !== expectedDigit1) return false;
    
    // Verificar segundo dígito
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (1 + i);
    }
    sum += digits[9] * 2;
    const secondDigit = sum % 11;
    const expectedDigit2 = secondDigit < 2 ? 0 : 11 - secondDigit;
    
    return digits[10] === expectedDigit2;
  };

  // Validar Título de Eleitor
  const validateTituloEleitor = (titulo: string): boolean => {
    const cleanTitulo = titulo.replace(/\D/g, '');
    if (cleanTitulo.length !== 12) return false;
    
    const digits = cleanTitulo.split('').map(Number);
    
    // Verificar primeiro dígito
    const weights1 = [2, 3, 4, 5, 6, 7, 8, 9];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += digits[i] * weights1[i];
    }
    const remainder1 = sum % 11;
    const expectedDigit1 = remainder1 < 2 ? 0 : 11 - remainder1;
    
    if (digits[8] !== expectedDigit1) return false;
    
    // Verificar segundo dígito
    const weights2 = [7, 8, 9];
    sum = 0;
    sum += digits[8] * weights2[0];
    sum += digits[9] * weights2[1];
    sum += digits[10] * weights2[2];
    
    const remainder2 = sum % 11;
    const expectedDigit2 = remainder2 < 2 ? 0 : 11 - remainder2;
    
    return digits[11] === expectedDigit2;
  };

  // Validar PIS/PASEP
  const validatePISPASEP = (pis: string): boolean => {
    const cleanPIS = pis.replace(/\D/g, '');
    if (cleanPIS.length !== 11) return false;
    
    const digits = cleanPIS.split('').map(Number);
    
    // Calcular dígito verificador
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }
    const remainder = sum % 11;
    const expectedDigit = remainder < 2 ? 0 : 11 - remainder;
    
    return digits[10] === expectedDigit;
  };

  // Validar RENAVAM
  const validateRENAVAM = (renavam: string): boolean => {
    const cleanRENAVAM = renavam.replace(/\D/g, '');
    if (cleanRENAVAM.length !== 11) return false;
    
    const digits = cleanRENAVAM.split('').map(Number);
    
    // Calcular dígito verificador
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }
    const remainder = sum % 11;
    const expectedDigit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
    
    return digits[10] === expectedDigit;
  };

  const generateDocument = () => {
    let data: CNHData | InscricaoEstadualData | TituloEleitorData | PISPASEPData | RENAVAMData;
    
    switch (activeTab) {
      case 'cnh':
        data = generateCNH();
        break;
      case 'ie':
        data = generateInscricaoEstadual();
        break;
      case 'titulo':
        data = generateTituloEleitor();
        break;
      case 'pis':
        data = generatePISPASEP();
        break;
      case 'renavam':
        data = generateRENAVAM();
        break;
    }
    
    const document: GeneratedDocument = {
      type: activeTab,
      data,
      createdAt: new Date()
    };
    
    setGeneratedDocuments(prev => [document, ...prev.slice(0, 9)]);
  };

  const validateDocument = () => {
    if (!validationInput.trim()) return;
    
    let isValid = false;
    let result: any = { isValid: false, input: validationInput };
    
    switch (activeTab) {
      case 'cnh':
        isValid = validateCNH(validationInput);
        result = {
          ...result,
          isValid,
          type: 'CNH',
          formatted: validationInput.replace(/(\d{11})/, '$1')
        };
        break;
      case 'titulo':
        isValid = validateTituloEleitor(validationInput);
        result = {
          ...result,
          isValid,
          type: 'Título de Eleitor',
          formatted: validationInput.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
        };
        break;
      case 'pis':
        isValid = validatePISPASEP(validationInput);
        result = {
          ...result,
          isValid,
          type: 'PIS/PASEP',
          formatted: validationInput.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4')
        };
        break;
      case 'renavam':
        isValid = validateRENAVAM(validationInput);
        result = {
          ...result,
          isValid,
          type: 'RENAVAM',
          formatted: validationInput
        };
        break;
      default:
        result = {
          ...result,
          isValid: false,
          type: 'Inscrição Estadual',
          message: 'Validação de IE requer implementação específica por estado'
        };
    }
    
    setValidationResult(result);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const exportToJSON = () => {
    const data = {
      documents: generatedDocuments,
      exportedAt: new Date().toISOString(),
      tool: 'OneDev Brazilian Documents Generator'
    };
    
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `documentos-brasileiros-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setGeneratedDocuments([]);
    setValidationInput('');
    setValidationResult(null);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'cnh': return Car;
      case 'ie': return Building2;
      case 'titulo': return Vote;
      case 'pis': return Briefcase;
      case 'renavam': return DollarSign;
      default: return FileText;
    }
  };

  const getDocumentName = (type: string) => {
    switch (type) {
      case 'cnh': return 'CNH';
      case 'ie': return 'Inscrição Estadual';
      case 'titulo': return 'Título de Eleitor';
      case 'pis': return 'PIS/PASEP';
      case 'renavam': return 'RENAVAM';
      default: return 'Documento';
    }
  };

  const renderField = (label: string, value: string, icon: React.ElementType, sensitive = false) => {
    const Icon = icon;
    const shouldHide = sensitive && !showDetails;
    const displayValue = shouldHide ? '••••••••••••' : value;
    
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}:</span>
            {sensitive && (
              <Shield className="w-3 h-3 text-amber-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{displayValue}</span>
            <button
              onClick={() => copyToClipboard(value, label)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={shouldHide}
            >
              {copiedField === label ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Documentos Brasileiros
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Gere e valide CNH, Inscrição Estadual, Título de Eleitor, PIS/PASEP e RENAVAM com algoritmos oficiais
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { id: 'cnh', label: 'CNH', icon: Car, color: 'from-blue-500 to-blue-600' },
            { id: 'ie', label: 'Inscrição Estadual', icon: Building2, color: 'from-green-500 to-green-600' },
            { id: 'titulo', label: 'Título de Eleitor', icon: Vote, color: 'from-purple-500 to-purple-600' },
            { id: 'pis', label: 'PIS/PASEP', icon: Briefcase, color: 'from-orange-500 to-orange-600' },
            { id: 'renavam', label: 'RENAVAM', icon: DollarSign, color: 'from-red-500 to-red-600' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setValidationMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              !validationMode
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Gerar
          </button>
          
          <button
            onClick={() => setValidationMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              validationMode
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Search className="w-4 h-4" />
            Validar
          </button>
        </div>

        {/* Generator Mode */}
        {!validationMode && (
          <div className="space-y-6">
            {(activeTab === 'cnh' || activeTab === 'ie' || activeTab === 'titulo') && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    {states.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name} ({state.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={generateDocument}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Gerar {getDocumentName(activeTab)}
                  </button>
                </div>
              </div>
            )}

            {(activeTab === 'pis' || activeTab === 'renavam') && (
              <div className="flex justify-center">
                <button
                  onClick={generateDocument}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RefreshCw className="w-5 h-5" />
                  Gerar {getDocumentName(activeTab)}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Validation Mode */}
        {validationMode && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Digite o {getDocumentName(activeTab)} para validar
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
                  placeholder={
                    activeTab === 'cnh' ? 'Ex: 12345678901' :
                    activeTab === 'titulo' ? 'Ex: 1234 5678 9012' :
                    activeTab === 'pis' ? 'Ex: 123.45678.90-1' :
                    activeTab === 'renavam' ? 'Ex: 12345678901' :
                    'Digite a Inscrição Estadual'
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={validateDocument}
                  disabled={!validationInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Validation Result */}
            {validationResult && (
              <div className={`p-4 rounded-lg border ${
                validationResult.isValid
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {validationResult.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <span className={`font-medium ${
                    validationResult.isValid
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    {validationResult.isValid ? 'Documento Válido' : 'Documento Inválido'}
                  </span>
                </div>
                <p className={`text-sm ${
                  validationResult.isValid
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {validationResult.type}: {validationResult.formatted || validationResult.input}
                  {validationResult.message && ` - ${validationResult.message}`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          {generatedDocuments.length > 0 && (
            <>
              <button
                onClick={exportToJSON}
                className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                Exportar JSON
              </button>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  showDetails
                    ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                {showDetails ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showDetails ? 'Ocultar' : 'Mostrar'} Dados
              </button>

              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                Limpar Tudo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generated Documents */}
      {generatedDocuments.length > 0 && (
        <div className="space-y-6">
          {generatedDocuments.map((doc, index) => {
            const Icon = getDocumentIcon(doc.type);
            
            return (
              <div key={index} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      doc.type === 'cnh' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      doc.type === 'ie' ? 'bg-green-100 dark:bg-green-900/30' :
                      doc.type === 'titulo' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      doc.type === 'pis' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        doc.type === 'cnh' ? 'text-blue-600 dark:text-blue-400' :
                        doc.type === 'ie' ? 'text-green-600 dark:text-green-400' :
                        doc.type === 'titulo' ? 'text-purple-600 dark:text-purple-400' :
                        doc.type === 'pis' ? 'text-orange-600 dark:text-orange-400' :
                        'text-red-600 dark:text-red-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {getDocumentName(doc.type)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Gerado em {doc.createdAt.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                    VÁLIDO
                  </span>
                </div>

                {/* CNH Fields */}
                {doc.type === 'cnh' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Número da CNH', (doc.data as CNHData).number, Hash, true)}
                      {renderField('Categoria', (doc.data as CNHData).category, Car)}
                      {renderField('Estado', (doc.data as CNHData).state, MapPin)}
                    </div>
                    <div className="space-y-4">
                      {renderField('Data de Emissão', (doc.data as CNHData).issueDate, Calendar)}
                      {renderField('Data de Validade', (doc.data as CNHData).expiryDate, Calendar)}
                    </div>
                  </div>
                )}

                {/* IE Fields */}
                {doc.type === 'ie' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Número', (doc.data as InscricaoEstadualData).number, Hash, true)}
                      {renderField('Formatado', (doc.data as InscricaoEstadualData).formatted, FileText)}
                    </div>
                    <div className="space-y-4">
                      {renderField('Estado', (doc.data as InscricaoEstadualData).state, MapPin)}
                    </div>
                  </div>
                )}

                {/* Título Fields */}
                {doc.type === 'titulo' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Número', (doc.data as TituloEleitorData).number, Hash, true)}
                      {renderField('Formatado', (doc.data as TituloEleitorData).formatted, FileText)}
                      {renderField('Estado', (doc.data as TituloEleitorData).state, MapPin)}
                    </div>
                    <div className="space-y-4">
                      {renderField('Zona Eleitoral', (doc.data as TituloEleitorData).zone, Building2)}
                      {renderField('Seção', (doc.data as TituloEleitorData).section, Hash)}
                    </div>
                  </div>
                )}

                {/* PIS/PASEP Fields */}
                {doc.type === 'pis' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Número', (doc.data as PISPASEPData).number, Hash, true)}
                      {renderField('Formatado', (doc.data as PISPASEPData).formatted, FileText)}
                    </div>
                    <div className="space-y-4">
                      {renderField('Tipo', (doc.data as PISPASEPData).type, Briefcase)}
                    </div>
                  </div>
                )}

                {/* RENAVAM Fields */}
                {doc.type === 'renavam' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Número RENAVAM', (doc.data as RENAVAMData).number, Hash, true)}
                      {renderField('Formatado', (doc.data as RENAVAMData).formatted, FileText)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Sobre os Documentos Brasileiros</h3>
            <div className="text-blue-800 dark:text-blue-300 leading-relaxed space-y-3">
              <p>
                Este gerador utiliza os algoritmos oficiais brasileiros para criar documentos válidos 
                para testes e desenvolvimento. Todos os documentos seguem as regras de dígitos verificadores.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    CNH
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• 11 dígitos com verificadores</li>
                    <li>• Categorias A, B, C, D, E</li>
                    <li>• Algoritmo oficial DETRAN</li>
                    <li>• Validação completa</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Inscrição Estadual
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Algoritmos por estado</li>
                    <li>• SP, RJ, MG, RS específicos</li>
                    <li>• Formatação correta</li>
                    <li>• Dígitos verificadores</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <Vote className="w-4 h-4" />
                    Título de Eleitor
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• 12 dígitos com estado</li>
                    <li>• Zona e seção eleitorais</li>
                    <li>• Algoritmo TSE oficial</li>
                    <li>• Validação por estado</li>
                  </ul>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    PIS/PASEP
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• 11 dígitos com verificador</li>
                    <li>• Algoritmo oficial</li>
                    <li>• Formatação padrão</li>
                    <li>• Validação completa</li>
                  </ul>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    RENAVAM
                  </div>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• 11 dígitos com verificador</li>
                    <li>• Algoritmo oficial DENATRAN</li>
                    <li>• Registro nacional de veículos</li>
                    <li>• Validação automática</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-4">
                <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Uso Responsável
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Estes documentos são gerados apenas para testes e desenvolvimento. 
                  Não devem ser usados para fraudes ou atividades ilegais. 
                  Todos os dados são fictícios e processados localmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrazilianDocumentsGenerator;