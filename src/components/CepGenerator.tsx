import React, { useState, useCallback } from 'react';
import { 
  MapPin, 
  Search, 
  Copy, 
  RefreshCw, 
  Download, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Navigation,
  Building,
  Map,
  Globe,
  Target,
  Hash,
  Eye,
  EyeOff,
  Shield,
  Info,
  Zap,
  Users
} from 'lucide-react';

interface CepInfo {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  estado: string;
  regiao: string;
  fuso_horario: string;
  area_km2: string;
  populacao: string;
}

interface GeneratedCep {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  endereco_completo: string;
  ddd: string;
  regiao: string;
  ibge: string;
  area_km2: string;
  populacao: string;
  fuso_horario: string;
}

const CepGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'searcher'>('generator');
  const [generatedCep, setGeneratedCep] = useState<GeneratedCep | null>(null);
  const [searchedCep, setSearchedCep] = useState<CepInfo | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchCep, setSearchCep] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(true);

  const brazilianStates = [
    {
      code: 'AC', name: 'Acre', region: 'Norte', ddd: ['68'], timezone: 'UTC-5',
      cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'],
      cepRanges: [69900000, 69999999], area: '164.123', population: '906.876'
    },
    {
      code: 'AL', name: 'Alagoas', region: 'Nordeste', ddd: ['82'], timezone: 'UTC-3',
      cities: ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Rio Largo', 'Penedo'],
      cepRanges: [57000000, 57999999], area: '27.843', population: '3.365.351'
    },
    {
      code: 'AP', name: 'Amapá', region: 'Norte', ddd: ['96'], timezone: 'UTC-3',
      cities: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Mazagão'],
      cepRanges: [68900000, 68999999], area: '142.470', population: '877.613'
    },
    {
      code: 'AM', name: 'Amazonas', region: 'Norte', ddd: ['92', '97'], timezone: 'UTC-4',
      cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'],
      cepRanges: [69000000, 69899999], area: '1.559.168', population: '4.269.995'
    },
    {
      code: 'BA', name: 'Bahia', region: 'Nordeste', ddd: ['71', '73', '74', '75', '77'], timezone: 'UTC-3',
      cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro', 'Ilhéus', 'Itabuna', 'Lauro de Freitas'],
      cepRanges: [40000000, 48999999], area: '564.760', population: '14.985.284'
    },
    {
      code: 'CE', name: 'Ceará', region: 'Nordeste', ddd: ['85', '88'], timezone: 'UTC-3',
      cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato', 'Itapipoca'],
      cepRanges: [60000000, 63999999], area: '148.894', population: '9.240.580'
    },
    {
      code: 'DF', name: 'Distrito Federal', region: 'Centro-Oeste', ddd: ['61'], timezone: 'UTC-3',
      cities: ['Brasília', 'Taguatinga', 'Ceilândia', 'Samambaia', 'Planaltina', 'Águas Claras'],
      cepRanges: [70000000, 72999999], area: '5.760', population: '3.094.325'
    },
    {
      code: 'ES', name: 'Espírito Santo', region: 'Sudeste', ddd: ['27', '28'], timezone: 'UTC-3',
      cities: ['Vitória', 'Vila Velha', 'Cariacica', 'Serra', 'Cachoeiro de Itapemirim', 'Linhares'],
      cepRanges: [29000000, 29999999], area: '46.074', population: '4.108.508'
    },
    {
      code: 'GO', name: 'Goiás', region: 'Centro-Oeste', ddd: ['62', '64'], timezone: 'UTC-3',
      cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Águas Lindas'],
      cepRanges: [72800000, 76999999], area: '340.242', population: '7.206.589'
    },
    {
      code: 'MA', name: 'Maranhão', region: 'Nordeste', ddd: ['98', '99'], timezone: 'UTC-3',
      cities: ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 'Codó'],
      cepRanges: [65000000, 65999999], area: '329.642', population: '7.153.262'
    },
    {
      code: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste', ddd: ['65', '66'], timezone: 'UTC-4',
      cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 'Cáceres'],
      cepRanges: [78000000, 78899999], area: '903.207', population: '3.567.234'
    },
    {
      code: 'MS', name: 'Mato Grosso do Sul', region: 'Centro-Oeste', ddd: ['67'], timezone: 'UTC-4',
      cities: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã', 'Naviraí'],
      cepRanges: [79000000, 79999999], area: '357.145', population: '2.839.188'
    },
    {
      code: 'MG', name: 'Minas Gerais', region: 'Sudeste', ddd: ['31', '32', '33', '34', '35', '37', '38'], timezone: 'UTC-3',
      cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Ribeirão das Neves', 'Uberaba'],
      cepRanges: [30000000, 39999999], area: '586.521', population: '21.411.923'
    },
    {
      code: 'PA', name: 'Pará', region: 'Norte', ddd: ['91', '93', '94'], timezone: 'UTC-3',
      cities: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal'],
      cepRanges: [66000000, 68899999], area: '1.245.870', population: '8.777.124'
    },
    {
      code: 'PB', name: 'Paraíba', region: 'Nordeste', ddd: ['83'], timezone: 'UTC-3',
      cities: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Sousa'],
      cepRanges: [58000000, 58999999], area: '56.467', population: '4.059.905'
    },
    {
      code: 'PR', name: 'Paraná', region: 'Sul', ddd: ['41', '42', '43', '44', '45', '46'], timezone: 'UTC-3',
      cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu'],
      cepRanges: [80000000, 87999999], area: '199.307', population: '11.597.484'
    },
    {
      code: 'PE', name: 'Pernambuco', region: 'Nordeste', ddd: ['81', '87'], timezone: 'UTC-3',
      cities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista'],
      cepRanges: [50000000, 56999999], area: '98.067', population: '9.674.793'
    },
    {
      code: 'PI', name: 'Piauí', region: 'Nordeste', ddd: ['86', '89'], timezone: 'UTC-3',
      cities: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 'Campo Maior'],
      cepRanges: [64000000, 64999999], area: '251.756', population: '3.289.290'
    },
    {
      code: 'RJ', name: 'Rio de Janeiro', region: 'Sudeste', ddd: ['21', '22', '24'], timezone: 'UTC-3',
      cities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo', 'Campos dos Goytacazes'],
      cepRanges: [20000000, 28999999], area: '43.750', population: '17.463.349'
    },
    {
      code: 'RN', name: 'Rio Grande do Norte', region: 'Nordeste', ddd: ['84'], timezone: 'UTC-3',
      cities: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba', 'Ceará-Mirim'],
      cepRanges: [59000000, 59999999], area: '52.809', population: '3.560.903'
    },
    {
      code: 'RS', name: 'Rio Grande do Sul', region: 'Sul', ddd: ['51', '53', '54', '55'], timezone: 'UTC-3',
      cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Gravataí', 'Viamão'],
      cepRanges: [90000000, 99999999], area: '281.707', population: '11.466.630'
    },
    {
      code: 'RO', name: 'Rondônia', region: 'Norte', ddd: ['69'], timezone: 'UTC-4',
      cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal', 'Rolim de Moura'],
      cepRanges: [76800000, 76999999], area: '237.765', population: '1.815.278'
    },
    {
      code: 'RR', name: 'Roraima', region: 'Norte', ddd: ['95'], timezone: 'UTC-4',
      cities: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Alto Alegre', 'Mucajaí'],
      cepRanges: [69300000, 69399999], area: '223.644', population: '652.713'
    },
    {
      code: 'SC', name: 'Santa Catarina', region: 'Sul', ddd: ['47', '48', '49'], timezone: 'UTC-3',
      cities: ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó', 'Itajaí', 'Criciúma', 'Lages'],
      cepRanges: [88000000, 89999999], area: '95.730', population: '7.338.473'
    },
    {
      code: 'SP', name: 'São Paulo', region: 'Sudeste', ddd: ['11', '12', '13', '14', '15', '16', '17', '18', '19'], timezone: 'UTC-3',
      cities: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco', 'Ribeirão Preto', 'Sorocaba'],
      cepRanges: [1000000, 19999999], area: '248.219', population: '46.649.132'
    },
    {
      code: 'SE', name: 'Sergipe', region: 'Nordeste', ddd: ['79'], timezone: 'UTC-3',
      cities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão'],
      cepRanges: [49000000, 49999999], area: '21.925', population: '2.338.474'
    },
    {
      code: 'TO', name: 'Tocantins', region: 'Norte', ddd: ['63'], timezone: 'UTC-3',
      cities: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins'],
      cepRanges: [77000000, 77999999], area: '277.423', population: '1.607.363'
    }
  ];

  const neighborhoods = [
    'Centro', 'Vila Nova', 'Jardim das Flores', 'Bairro Alto', 'Vila São José',
    'Parque Industrial', 'Cidade Nova', 'Jardim América', 'Vila Esperança', 'Bela Vista',
    'Copacabana', 'Ipanema', 'Leblon', 'Botafogo', 'Flamengo', 'Tijuca', 'Barra da Tijuca',
    'Vila Madalena', 'Pinheiros', 'Moema', 'Brooklin', 'Vila Olímpia', 'Itaim Bibi',
    'Savassi', 'Funcionários', 'Lourdes', 'Santo Agostinho', 'Cidade Jardim',
    'Boa Viagem', 'Madalena', 'Casa Forte', 'Graças', 'Espinheiro', 'Derby'
  ];

  const streetTypes = [
    'Rua', 'Avenida', 'Travessa', 'Alameda', 'Praça', 'Largo', 'Estrada',
    'Rodovia', 'Via', 'Beco', 'Viela', 'Quadra', 'Conjunto', 'Loteamento'
  ];

  const streetNames = [
    'das Flores', 'São João', 'da Paz', 'Brasil', 'Paulista', 'Central', 'do Comércio',
    '15 de Novembro', 'Getúlio Vargas', 'Sete de Setembro', 'Presidente Vargas',
    'Dom Pedro II', 'da República', 'Independência', 'Marechal Deodoro',
    'Barão do Rio Branco', 'Santos Dumont', 'Tiradentes', 'José Bonifácio',
    'Rui Barbosa', 'Campos Sales', 'Prudente de Morais', 'Afonso Pena'
  ];

  // Função para gerar CEP válido baseado no range do estado
  const generateValidCEP = (state: any): string => {
    const [minCep, maxCep] = state.cepRanges;
    const randomCep = Math.floor(Math.random() * (maxCep - minCep + 1)) + minCep;
    
    // Garantir que o CEP tenha 8 dígitos
    const cepString = randomCep.toString().padStart(8, '0');
    
    // Formatar como CEP brasileiro (XXXXX-XXX)
    return cepString.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const generateCEP = useCallback(() => {
    if (!selectedState || !selectedCity) {
      setError('Por favor, selecione um estado e uma cidade.');
      return;
    }

    const state = brazilianStates.find(s => s.code === selectedState);
    if (!state) return;

    // Gerar CEP válido baseado no range do estado
    const validCep = generateValidCEP(state);

    // Gerar endereço completo
    const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const logradouro = `${streetType} ${streetName}`;
    const numero = Math.floor(Math.random() * 9999) + 1;
    const bairro = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    const complemento = Math.random() > 0.7 ? `Apto ${Math.floor(Math.random() * 200) + 1}` : '';
    const ddd = state.ddd[Math.floor(Math.random() * state.ddd.length)];

    // Gerar código IBGE baseado no estado
    const stateIbgeCodes: { [key: string]: string } = {
      'AC': '12', 'AL': '27', 'AP': '16', 'AM': '13', 'BA': '29', 'CE': '23', 'DF': '53',
      'ES': '32', 'GO': '52', 'MA': '21', 'MT': '51', 'MS': '50', 'MG': '31', 'PA': '15',
      'PB': '25', 'PR': '41', 'PE': '26', 'PI': '22', 'RJ': '33', 'RN': '24', 'RS': '43',
      'RO': '11', 'RR': '14', 'SC': '42', 'SP': '35', 'SE': '28', 'TO': '17'
    };
    
    const stateCode = stateIbgeCodes[selectedState] || '35';
    const ibgeCode = `${stateCode}${Math.floor(Math.random() * 90000) + 10000}`;

    const generatedData: GeneratedCep = {
      cep: validCep,
      estado: state.name,
      cidade: selectedCity,
      bairro,
      logradouro,
      numero: numero.toString(),
      complemento,
      endereco_completo: `${logradouro}, ${numero}${complemento ? `, ${complemento}` : ''} - ${bairro}, ${selectedCity} - ${selectedState}, ${validCep}`,
      ddd,
      regiao: state.region,
      ibge: ibgeCode,
      area_km2: state.area,
      populacao: state.population,
      fuso_horario: state.timezone
    };

    setGeneratedCep(generatedData);
    setError('');
  }, [selectedState, selectedCity]);

  const searchCEP = useCallback(async () => {
    if (!searchCep || searchCep.length < 8) {
      setError('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSearchedCep(null);

    try {
      const cleanCep = searchCep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro na consulta do CEP');
      }

      const data = await response.json();
      
      if (data.erro) {
        setError('CEP não encontrado. Verifique se o CEP está correto.');
        return;
      }

      // Buscar informações adicionais do estado
      const state = brazilianStates.find(s => s.code === data.uf);
      
      const enrichedData: CepInfo = {
        ...data,
        estado: state?.name || data.uf,
        regiao: state?.region || 'Não informado',
        fuso_horario: state?.timezone || 'UTC-3',
        area_km2: state?.area || 'Não informado',
        populacao: state?.population || 'Não informado'
      };

      setSearchedCep(enrichedData);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setError('Erro ao consultar o CEP. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [searchCep]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const exportToJSON = (data: GeneratedCep | CepInfo) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cep-${data.cep.replace('-', '')}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2');
  };

  const handleCepInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setSearchCep(formatted);
  };

  const renderField = (label: string, value: string, icon: React.ElementType, sensitive = false) => {
    const Icon = icon;
    const shouldHide = sensitive && !showDetails;
    const displayValue = shouldHide ? '••••••••••••' : value;
    
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{label}:</span>
            {sensitive && (
              <Shield className="w-3 h-3 text-amber-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 font-mono">{displayValue}</span>
            <button
              onClick={() => copyToClipboard(value, label)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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

  const availableCities = selectedState 
    ? brazilianStates.find(s => s.code === selectedState)?.cities || []
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Gerador e Buscador de CEP
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Gere CEPs brasileiros válidos por estado e cidade ou busque informações completas de qualquer CEP
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className="w-5 h-5" />
            Gerador de CEP
          </button>
          
          <button
            onClick={() => setActiveTab('searcher')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'searcher'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Search className="w-5 h-5" />
            Buscador de CEP
          </button>
        </div>

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity('');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione um estado</option>
                  {brazilianStates.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione uma cidade</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={generateCEP}
                disabled={!selectedState || !selectedCity}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <RefreshCw className="w-5 h-5" />
                Gerar CEP Válido
              </button>

              {generatedCep && (
                <button
                  onClick={() => exportToJSON(generatedCep)}
                  className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  Exportar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Searcher Tab */}
        {activeTab === 'searcher' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digite o CEP
                </label>
                <input
                  type="text"
                  value={searchCep}
                  onChange={handleCepInputChange}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={searchCEP}
                  disabled={isLoading || searchCep.length < 8}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>

            {searchedCep && (
              <div className="flex gap-3">
                <button
                  onClick={() => exportToJSON(searchedCep)}
                  className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  Exportar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {(generatedCep || searchedCep) && (
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Informações do CEP
                {generatedCep && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    CEP VÁLIDO
                  </span>
                )}
              </h2>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  showDetails
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                {showDetails ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderField('CEP', (generatedCep || searchedCep)?.cep || '', Hash)}
                {renderField('Estado', generatedCep?.estado || searchedCep?.estado || '', Map)}
                {renderField('Cidade', generatedCep?.cidade || searchedCep?.localidade || '', Building)}
                {renderField('Bairro', generatedCep?.bairro || searchedCep?.bairro || '', Navigation)}
              </div>
              
              <div className="space-y-4">
                {renderField('Logradouro', generatedCep?.logradouro || searchedCep?.logradouro || '', MapPin)}
                {generatedCep && renderField('Número', generatedCep.numero, Hash)}
                {(generatedCep?.complemento || searchedCep?.complemento) && 
                  renderField('Complemento', generatedCep?.complemento || searchedCep?.complemento || '', Building)}
                {renderField('DDD', generatedCep?.ddd || searchedCep?.ddd || '', Hash)}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {showDetails && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  Informações Geográficas
                </h2>

                <div className="space-y-4">
                  {renderField('Região', generatedCep?.regiao || searchedCep?.regiao || '', Globe)}
                  {renderField('Código IBGE', generatedCep?.ibge || searchedCep?.ibge || '', Hash)}
                  {renderField('Área (km²)', generatedCep?.area_km2 || searchedCep?.area_km2 || '', Target)}
                  {renderField('Fuso Horário', generatedCep?.fuso_horario || searchedCep?.fuso_horario || '', Globe)}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-600" />
                  Dados Adicionais
                </h2>

                <div className="space-y-4">
                  {renderField('População', generatedCep?.populacao || searchedCep?.populacao || '', Users)}
                  {searchedCep?.gia && renderField('Código GIA', searchedCep.gia, Hash)}
                  {searchedCep?.siafi && renderField('Código SIAFI', searchedCep.siafi, Hash)}
                  {renderField('UF', (generatedCep?.estado || searchedCep?.estado || '').substring(0, 2), Map)}
                </div>
              </div>
            </div>
          )}

          {/* Complete Address */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-red-600" />
              Endereço Completo
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Endereço formatado:</p>
                  <code className="text-sm text-gray-800 bg-white p-3 rounded border block">
                    {generatedCep?.endereco_completo || 
                     `${searchedCep?.logradouro || ''} - ${searchedCep?.bairro || ''}, ${searchedCep?.localidade || ''} - ${searchedCep?.uf || ''}, ${searchedCep?.cep || ''}`}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(
                    generatedCep?.endereco_completo || 
                    `${searchedCep?.logradouro || ''} - ${searchedCep?.bairro || ''}, ${searchedCep?.localidade || ''} - ${searchedCep?.uf || ''}, ${searchedCep?.cep || ''}`,
                    'Endereço Completo'
                  )}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  {copiedField === 'Endereço Completo' ? (
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
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📮 Sobre CEPs Brasileiros</h3>
            <div className="text-blue-800 leading-relaxed space-y-2">
              <p>
                O Código de Endereçamento Postal (CEP) é um sistema de códigos postais usado pelos 
                Correios do Brasil para facilitar a organização e entrega de correspondências.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Gerador
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• CEPs válidos por estado</li>
                    <li>• Baseado em ranges oficiais</li>
                    <li>• Endereços completos realistas</li>
                    <li>• Dados geográficos precisos</li>
                  </ul>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Buscador
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Consulta via API ViaCEP</li>
                    <li>• Dados oficiais dos Correios</li>
                    <li>• Informações sempre atualizadas</li>
                    <li>• Validação automática</li>
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

export default CepGenerator;