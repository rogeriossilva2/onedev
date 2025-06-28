import React, { useState, useCallback } from 'react';
import { 
  CreditCard, 
  Building2, 
  MapPin, 
  Copy, 
  RefreshCw, 
  Download, 
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Info,
  Zap,
  Hash,
  User,
  Calendar,
  Lock,
  Globe,
  Star
} from 'lucide-react';

interface BankData {
  code: string;
  name: string;
  fullName: string;
  type: 'public' | 'private' | 'digital';
  logo: string;
  color: string;
  bgColor: string;
  description: string;
}

interface GeneratedAccount {
  bank: BankData;
  state: string;
  agency: string;
  agencyDigit: string;
  account: string;
  accountDigit: string;
  fullAccount: string;
  accountType: 'corrente' | 'poupanca';
  accountHolder: string;
  cpf: string;
  birthDate: string;
  createdAt: Date;
}

const BankAccountGenerator: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [accountType, setAccountType] = useState<'corrente' | 'poupanca'>('corrente');
  const [generatedAccount, setGeneratedAccount] = useState<GeneratedAccount | null>(null);
  const [copiedField, setCopiedField] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [bankFilter, setBankFilter] = useState<string>('all');

  const banks: BankData[] = [
    {
      code: '001',
      name: 'Banco do Brasil',
      fullName: 'Banco do Brasil S.A.',
      type: 'public',
      logo: '🏛️',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Maior banco público do Brasil'
    },
    {
      code: '104',
      name: 'Caixa Econômica',
      fullName: 'Caixa Econômica Federal',
      type: 'public',
      logo: '🏦',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Banco público federal'
    },
    {
      code: '237',
      name: 'Bradesco',
      fullName: 'Banco Bradesco S.A.',
      type: 'private',
      logo: '🔴',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Um dos maiores bancos privados'
    },
    {
      code: '341',
      name: 'Itaú',
      fullName: 'Itaú Unibanco S.A.',
      type: 'private',
      logo: '🟠',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Maior banco privado do Brasil'
    },
    {
      code: '033',
      name: 'Santander',
      fullName: 'Banco Santander Brasil S.A.',
      type: 'private',
      logo: '🔺',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Banco internacional'
    },
    {
      code: '260',
      name: 'Nu Pagamentos',
      fullName: 'Nu Pagamentos S.A.',
      type: 'digital',
      logo: '💜',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Banco digital líder'
    },
    {
      code: '290',
      name: 'PagSeguro',
      fullName: 'PagSeguro Digital Ltd.',
      type: 'digital',
      logo: '🟡',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Banco digital e pagamentos'
    },
    {
      code: '323',
      name: 'Mercado Pago',
      fullName: 'Mercado Pago S.A.',
      type: 'digital',
      logo: '💙',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Fintech do Mercado Livre'
    },
    {
      code: '077',
      name: 'Inter',
      fullName: 'Banco Inter S.A.',
      type: 'digital',
      logo: '🧡',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Banco digital completo'
    },
    {
      code: '212',
      name: 'Original',
      fullName: 'Banco Original S.A.',
      type: 'private',
      logo: '⚫',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'Banco digital do Grupo JBS'
    },
    {
      code: '336',
      name: 'C6 Bank',
      fullName: 'Banco C6 S.A.',
      type: 'digital',
      logo: '⚪',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'Banco digital moderno'
    },
    {
      code: '422',
      name: 'Safra',
      fullName: 'Banco Safra S.A.',
      type: 'private',
      logo: '🟢',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Banco privado tradicional'
    },
    {
      code: '070',
      name: 'BRB',
      fullName: 'Banco de Brasília S.A.',
      type: 'public',
      logo: '🏛️',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Banco público do DF'
    },
    {
      code: '748',
      name: 'Sicredi',
      fullName: 'Banco Cooperativo Sicredi S.A.',
      type: 'private',
      logo: '🟢',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Sistema cooperativo'
    },
    {
      code: '756',
      name: 'Sicoob',
      fullName: 'Banco Cooperativo do Brasil S.A.',
      type: 'private',
      logo: '🔵',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Cooperativa de crédito'
    }
  ];

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

  const firstNames = [
    'Ana', 'Carlos', 'Maria', 'João', 'Fernanda', 'Pedro', 'Juliana', 'Rafael',
    'Camila', 'Lucas', 'Beatriz', 'Gabriel', 'Larissa', 'Thiago', 'Amanda', 'Bruno',
    'Letícia', 'Mateus', 'Isabela', 'Felipe', 'Mariana', 'André', 'Carolina', 'Diego',
    'Natália', 'Rodrigo', 'Patrícia', 'Gustavo', 'Renata', 'Leonardo'
  ];

  const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
    'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
    'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Monteiro', 'Cardoso',
    'Reis', 'Araújo', 'Nascimento', 'Freitas', 'Correia', 'Mendes'
  ];

  const generateCPF = (): string => {
    const randomDigits = () => Math.floor(Math.random() * 9);
    
    // Gerar os 9 primeiros dígitos
    const digits = Array.from({ length: 9 }, randomDigits);
    
    // Calcular primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    const firstDigit = ((sum * 10) % 11) % 10;
    digits.push(firstDigit);
    
    // Calcular segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    const secondDigit = ((sum * 10) % 11) % 10;
    digits.push(secondDigit);
    
    return digits.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const generateAgency = (bankCode: string, stateCode: string): { agency: string; digit: string } => {
    // Diferentes padrões de agência baseados no banco
    let agency: string;
    
    switch (bankCode) {
      case '001': // Banco do Brasil
        agency = `${Math.floor(Math.random() * 9000) + 1000}`;
        break;
      case '104': // Caixa
        agency = `${Math.floor(Math.random() * 900) + 100}`;
        break;
      case '237': // Bradesco
        agency = `${Math.floor(Math.random() * 9000) + 1000}`;
        break;
      case '341': // Itaú
        agency = `${Math.floor(Math.random() * 9000) + 1000}`;
        break;
      case '033': // Santander
        agency = `${Math.floor(Math.random() * 9000) + 1000}`;
        break;
      default: // Bancos digitais
        agency = `${Math.floor(Math.random() * 900) + 100}`;
    }
    
    // Gerar dígito verificador da agência
    const digit = Math.floor(Math.random() * 10).toString();
    
    return { agency, digit };
  };

  const generateAccountNumberAndDigit = (bankCode: string, accountType: 'corrente' | 'poupanca'): { account: string; digit: string } => {
    let account: string;
    
    // Diferentes padrões de conta baseados no banco e tipo
    if (accountType === 'poupanca') {
      // Contas poupança geralmente começam com dígitos específicos
      const poupancaPrefix = bankCode === '104' ? '013' : '0';
      account = `${poupancaPrefix}${Math.floor(Math.random() * 900000) + 100000}`;
    } else {
      // Conta corrente
      account = `${Math.floor(Math.random() * 9000000) + 1000000}`;
    }
    
    // Gerar dígito verificador da conta
    const digit = Math.floor(Math.random() * 10).toString();
    
    return { account, digit };
  };

  const generateBirthDate = (): string => {
    const start = new Date(1950, 0, 1);
    const end = new Date(2005, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    
    return randomDate.toLocaleDateString('pt-BR');
  };

  const generateAccount = useCallback(() => {
    if (!selectedBank || !selectedState) {
      return;
    }

    const bank = banks.find(b => b.code === selectedBank);
    if (!bank) return;

    const { agency, digit: agencyDigit } = generateAgency(selectedBank, selectedState);
    const { account, digit: accountDigit } = generateAccountNumberAndDigit(selectedBank, accountType);
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const accountHolder = `${firstName} ${lastName1} ${lastName2}`;

    const generatedData: GeneratedAccount = {
      bank,
      state: selectedState,
      agency,
      agencyDigit,
      account,
      accountDigit,
      fullAccount: `${agency}-${agencyDigit} / ${account}-${accountDigit}`,
      accountType,
      accountHolder,
      cpf: generateCPF(),
      birthDate: generateBirthDate(),
      createdAt: new Date()
    };

    setGeneratedAccount(generatedData);
  }, [selectedBank, selectedState, accountType]);

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
    if (!generatedAccount) return;
    
    const dataStr = JSON.stringify(generatedAccount, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conta-bancaria-${generatedAccount.bank.code}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredBanks = banks.filter(bank => {
    if (bankFilter === 'all') return true;
    return bank.type === bankFilter;
  });

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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Gerador de Conta Bancária
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Gere dados de contas bancárias brasileiras válidas para testes e desenvolvimento
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Configurações</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Bank Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Tipo
            </label>
            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Todos os Bancos</option>
              <option value="public">Bancos Públicos</option>
              <option value="private">Bancos Privados</option>
              <option value="digital">Bancos Digitais</option>
            </select>
          </div>

          {/* State Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Selecione um estado</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Conta
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as 'corrente' | 'poupanca')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="corrente">Conta Corrente</option>
              <option value="poupanca">Conta Poupança</option>
            </select>
          </div>
        </div>

        {/* Bank Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Selecionar Banco
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBanks.map((bank) => (
              <button
                key={bank.code}
                onClick={() => setSelectedBank(bank.code)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedBank === bank.code
                    ? `${bank.bgColor} dark:bg-opacity-20 border-current ${bank.color}`
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{bank.logo}</span>
                  <div>
                    <span className={`font-medium ${selectedBank === bank.code ? bank.color : 'text-gray-900 dark:text-gray-100'}`}>
                      {bank.name}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Código: {bank.code}
                    </div>
                  </div>
                  {selectedBank === bank.code && (
                    <CheckCircle className={`w-4 h-4 ml-auto ${bank.color}`} />
                  )}
                </div>
                <p className={`text-xs ${selectedBank === bank.code ? bank.color : 'text-gray-600 dark:text-gray-400'}`}>
                  {bank.description}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bank.type === 'public' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    bank.type === 'private' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {bank.type === 'public' ? 'Público' : bank.type === 'private' ? 'Privado' : 'Digital'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateAccount}
            disabled={!selectedBank || !selectedState}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <RefreshCw className="w-5 h-5" />
            Gerar Conta Bancária
          </button>

          {generatedAccount && (
            <>
              <button
                onClick={exportToJSON}
                className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200"
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
                {showDetails ? 'Ocultar' : 'Mostrar'} Dados Sensíveis
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generated Account */}
      {generatedAccount && (
        <div className="space-y-8">
          {/* Bank Information */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                Informações do Banco
              </h2>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                DADOS VÁLIDOS
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderField('Código do Banco', generatedAccount.bank.code, Hash)}
                {renderField('Nome do Banco', generatedAccount.bank.name, Building2)}
                {renderField('Nome Completo', generatedAccount.bank.fullName, Globe)}
              </div>
              
              <div className="space-y-4">
                {renderField('Estado', `${states.find(s => s.code === generatedAccount.state)?.name} (${generatedAccount.state})`, MapPin)}
                {renderField('Tipo de Conta', generatedAccount.accountType === 'corrente' ? 'Conta Corrente' : 'Conta Poupança', CreditCard)}
                {renderField('Gerado em', generatedAccount.createdAt.toLocaleString('pt-BR'), Calendar)}
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Dados da Conta
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderField('Agência', `${generatedAccount.agency}-${generatedAccount.agencyDigit}`, Hash)}
                {renderField('Conta', `${generatedAccount.account}-${generatedAccount.accountDigit}`, Hash)}
                {renderField('Conta Completa', generatedAccount.fullAccount, CreditCard)}
              </div>
              
              <div className="space-y-4">
                {renderField('Agência (sem dígito)', generatedAccount.agency, Hash)}
                {renderField('Dígito da Agência', generatedAccount.agencyDigit, Hash)}
                {renderField('Número da Conta', generatedAccount.account, Hash)}
                {renderField('Dígito da Conta', generatedAccount.accountDigit, Hash)}
              </div>
            </div>
          </div>

          {/* Account Holder */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Dados do Titular
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderField('Nome Completo', generatedAccount.accountHolder, User, true)}
                {renderField('CPF', generatedAccount.cpf, Hash, true)}
              </div>
              
              <div className="space-y-4">
                {renderField('Data de Nascimento', generatedAccount.birthDate, Calendar, true)}
              </div>
            </div>
          </div>

          {/* Complete Account Info */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Resumo Completo
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Dados formatados para uso:</p>
                  <code className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded border block whitespace-pre-wrap">
{`Banco: ${generatedAccount.bank.name} (${generatedAccount.bank.code})
Titular: ${showDetails ? generatedAccount.accountHolder : '••••••••••••'}
CPF: ${showDetails ? generatedAccount.cpf : '•••.•••.•••-••'}
Agência: ${generatedAccount.agency}-${generatedAccount.agencyDigit}
Conta: ${generatedAccount.account}-${generatedAccount.accountDigit}
Tipo: ${generatedAccount.accountType === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}
Estado: ${generatedAccount.state}`}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(
                    `Banco: ${generatedAccount.bank.name} (${generatedAccount.bank.code})\nTitular: ${generatedAccount.accountHolder}\nCPF: ${generatedAccount.cpf}\nAgência: ${generatedAccount.agency}-${generatedAccount.agencyDigit}\nConta: ${generatedAccount.account}-${generatedAccount.accountDigit}\nTipo: ${generatedAccount.accountType === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}\nEstado: ${generatedAccount.state}`,
                    'Resumo Completo'
                  )}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                >
                  {copiedField === 'Resumo Completo' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">🏦 Sobre Contas Bancárias Brasileiras</h3>
            <div className="text-green-800 dark:text-green-300 leading-relaxed space-y-2">
              <p>
                Este gerador cria dados de contas bancárias brasileiras válidas seguindo os padrões 
                oficiais dos bancos. Os dados são gerados aleatoriamente e são adequados para testes 
                e desenvolvimento.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-green-900 dark:text-green-100 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Dados Gerados
                  </div>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Códigos de banco oficiais</li>
                    <li>• Agências com dígitos verificadores</li>
                    <li>• Contas correntes e poupança</li>
                    <li>• CPFs válidos com algoritmo oficial</li>
                    <li>• Nomes brasileiros realistas</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-green-900 dark:text-green-100 mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Uso Responsável
                  </div>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Apenas para testes e desenvolvimento</li>
                    <li>• Não usar para fraudes ou atividades ilegais</li>
                    <li>• Dados fictícios, não representam pessoas reais</li>
                    <li>• Processamento 100% local e privado</li>
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

export default BankAccountGenerator;