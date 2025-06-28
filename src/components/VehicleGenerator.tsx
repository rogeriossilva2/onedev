import React, { useState, useCallback } from 'react';
import { 
  Car, 
  Truck, 
  Bike, 
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
  Calendar,
  Building2,
  FileText,
  Star,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Filter,
  Fuel,
  Gauge,
  Palette,
  Shield,
  User,
  CreditCard,
  Navigation,
  Settings
} from 'lucide-react';

interface VehicleData {
  // Identificação
  plate: string;
  plateFormat: 'old' | 'mercosul';
  renavam: string;
  chassi: string;
  
  // Dados do Veículo
  brand: string;
  model: string;
  year: number;
  modelYear: number;
  color: string;
  fuel: string;
  category: string;
  type: string;
  
  // Motor e Performance
  engine: string;
  power: string;
  displacement: string;
  transmission: string;
  
  // Documentação
  state: string;
  city: string;
  
  // Proprietário
  ownerName: string;
  ownerCpf: string;
  
  // Datas
  firstRegistration: string;
  lastLicensing: string;
  
  // Status
  isValid: boolean;
  restrictions: string[];
}

interface GeneratedVehicle {
  vehicle: VehicleData;
  createdAt: Date;
}

const VehicleGenerator: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('SP');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('automovel');
  const [plateFormat, setPlateFormat] = useState<'old' | 'mercosul'>('mercosul');
  const [generatedVehicles, setGeneratedVehicles] = useState<GeneratedVehicle[]>([]);
  const [copiedField, setCopiedField] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [filterBrand, setFilterBrand] = useState<string>('all');

  const states = [
    { code: 'AC', name: 'Acre', cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'] },
    { code: 'AL', name: 'Alagoas', cities: ['Maceió', 'Arapiraca', 'Palmeira dos Índios'] },
    { code: 'AP', name: 'Amapá', cities: ['Macapá', 'Santana', 'Laranjal do Jari'] },
    { code: 'AM', name: 'Amazonas', cities: ['Manaus', 'Parintins', 'Itacoatiara'] },
    { code: 'BA', name: 'Bahia', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'] },
    { code: 'CE', name: 'Ceará', cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'] },
    { code: 'DF', name: 'Distrito Federal', cities: ['Brasília', 'Taguatinga', 'Ceilândia'] },
    { code: 'ES', name: 'Espírito Santo', cities: ['Vitória', 'Vila Velha', 'Cariacica'] },
    { code: 'GO', name: 'Goiás', cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'] },
    { code: 'MA', name: 'Maranhão', cities: ['São Luís', 'Imperatriz', 'São José de Ribamar'] },
    { code: 'MT', name: 'Mato Grosso', cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis'] },
    { code: 'MS', name: 'Mato Grosso do Sul', cities: ['Campo Grande', 'Dourados', 'Três Lagoas'] },
    { code: 'MG', name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem'] },
    { code: 'PA', name: 'Pará', cities: ['Belém', 'Ananindeua', 'Santarém'] },
    { code: 'PB', name: 'Paraíba', cities: ['João Pessoa', 'Campina Grande', 'Santa Rita'] },
    { code: 'PR', name: 'Paraná', cities: ['Curitiba', 'Londrina', 'Maringá'] },
    { code: 'PE', name: 'Pernambuco', cities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda'] },
    { code: 'PI', name: 'Piauí', cities: ['Teresina', 'Parnaíba', 'Picos'] },
    { code: 'RJ', name: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias'] },
    { code: 'RN', name: 'Rio Grande do Norte', cities: ['Natal', 'Mossoró', 'Parnamirim'] },
    { code: 'RS', name: 'Rio Grande do Sul', cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'] },
    { code: 'RO', name: 'Rondônia', cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes'] },
    { code: 'RR', name: 'Roraima', cities: ['Boa Vista', 'Rorainópolis', 'Caracaraí'] },
    { code: 'SC', name: 'Santa Catarina', cities: ['Florianópolis', 'Joinville', 'Blumenau'] },
    { code: 'SP', name: 'São Paulo', cities: ['São Paulo', 'Guarulhos', 'Campinas'] },
    { code: 'SE', name: 'Sergipe', cities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto'] },
    { code: 'TO', name: 'Tocantins', cities: ['Palmas', 'Araguaína', 'Gurupi'] }
  ];

  const vehicleBrands = {
    nacionais: [
      { name: 'Volkswagen', models: ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Tiguan', 'Amarok'] },
      { name: 'Chevrolet', models: ['Onix', 'Prisma', 'Tracker', 'Equinox', 'S10', 'Spin'] },
      { name: 'Fiat', models: ['Argo', 'Cronos', 'Toro', 'Strada', 'Mobi', 'Pulse'] },
      { name: 'Ford', models: ['Ka', 'EcoSport', 'Ranger', 'Territory', 'Bronco Sport'] },
      { name: 'Renault', models: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Oroch'] },
      { name: 'Hyundai', models: ['HB20', 'Creta', 'Tucson', 'Santa Fe', 'ix35'] },
      { name: 'Toyota', models: ['Etios', 'Yaris', 'Corolla', 'RAV4', 'Hilux', 'SW4'] },
      { name: 'Honda', models: ['Fit', 'City', 'Civic', 'HR-V', 'CR-V', 'Pilot'] },
      { name: 'Nissan', models: ['March', 'Versa', 'Sentra', 'Kicks', 'X-Trail', 'Frontier'] },
      { name: 'Jeep', models: ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee'] }
    ],
    importadas: [
      { name: 'BMW', models: ['Série 1', 'Série 3', 'X1', 'X3', 'X5', 'Z4'] },
      { name: 'Mercedes-Benz', models: ['Classe A', 'Classe C', 'GLA', 'GLC', 'GLE', 'AMG GT'] },
      { name: 'Audi', models: ['A3', 'A4', 'Q3', 'Q5', 'Q7', 'TT'] },
      { name: 'Porsche', models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'] },
      { name: 'Land Rover', models: ['Evoque', 'Discovery Sport', 'Defender', 'Range Rover'] },
      { name: 'Volvo', models: ['XC40', 'XC60', 'XC90', 'S60', 'V60'] },
      { name: 'Lexus', models: ['IS', 'ES', 'NX', 'RX', 'LX'] },
      { name: 'Infiniti', models: ['Q50', 'QX50', 'QX60', 'QX80'] }
    ],
    motos: [
      { name: 'Honda', models: ['CG 160', 'CB 600F', 'CBR 1000RR', 'PCX 150', 'ADV 150'] },
      { name: 'Yamaha', models: ['Factor 150', 'MT-07', 'R1', 'NMAX 160', 'Tenere 250'] },
      { name: 'Suzuki', models: ['Intruder 150', 'GSX-R1000', 'V-Strom 650', 'Burgman 400'] },
      { name: 'Kawasaki', models: ['Ninja 400', 'Z900', 'Versys 650', 'Vulcan S'] },
      { name: 'BMW', models: ['G 310 R', 'F 850 GS', 'R 1250 GS', 'S 1000 RR'] },
      { name: 'Ducati', models: ['Monster 821', 'Panigale V4', 'Multistrada 1260'] },
      { name: 'Harley-Davidson', models: ['Iron 883', 'Street 750', 'Fat Boy', 'Road King'] }
    ],
    comerciais: [
      { name: 'Mercedes-Benz', models: ['Sprinter', 'Accelo', 'Atego', 'Axor'] },
      { name: 'Volkswagen', models: ['Delivery', 'Constellation', 'Meteor'] },
      { name: 'Ford', models: ['Cargo', 'F-4000', 'F-350'] },
      { name: 'Iveco', models: ['Daily', 'Tector', 'Stralis'] },
      { name: 'Scania', models: ['P-Series', 'G-Series', 'R-Series'] },
      { name: 'Volvo', models: ['VM', 'FH', 'FMX'] }
    ]
  };

  const vehicleCategories = [
    { id: 'automovel', name: 'Automóvel', icon: Car, brands: ['nacionais', 'importadas'] },
    { id: 'motocicleta', name: 'Motocicleta', icon: Bike, brands: ['motos'] },
    { id: 'comercial', name: 'Comercial', icon: Truck, brands: ['comerciais', 'nacionais'] }
  ];

  const colors = [
    'Branco', 'Prata', 'Preto', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo',
    'Marrom', 'Bege', 'Dourado', 'Laranja', 'Rosa', 'Roxo', 'Vinho'
  ];

  const fuels = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'GNV', 'Elétrico', 'Híbrido'];

  const firstNames = [
    'Ana', 'Carlos', 'Maria', 'João', 'Fernanda', 'Pedro', 'Juliana', 'Rafael',
    'Camila', 'Lucas', 'Beatriz', 'Gabriel', 'Larissa', 'Thiago', 'Amanda', 'Bruno'
  ];

  const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
    'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes'
  ];

  // Gerar CPF válido
  const generateCPF = (): string => {
    const randomDigits = () => Math.floor(Math.random() * 9);
    const digits = Array.from({ length: 9 }, randomDigits);
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    const firstDigit = ((sum * 10) % 11) % 10;
    digits.push(firstDigit);
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    const secondDigit = ((sum * 10) % 11) % 10;
    digits.push(secondDigit);
    
    return digits.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Gerar placa
  const generatePlate = (format: 'old' | 'mercosul', state: string): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    if (format === 'mercosul') {
      // Formato Mercosul: ABC1D23
      const letter1 = letters[Math.floor(Math.random() * letters.length)];
      const letter2 = letters[Math.floor(Math.random() * letters.length)];
      const letter3 = letters[Math.floor(Math.random() * letters.length)];
      const number1 = numbers[Math.floor(Math.random() * numbers.length)];
      const letter4 = letters[Math.floor(Math.random() * letters.length)];
      const number2 = numbers[Math.floor(Math.random() * numbers.length)];
      const number3 = numbers[Math.floor(Math.random() * numbers.length)];
      
      return `${letter1}${letter2}${letter3}${number1}${letter4}${number2}${number3}`;
    } else {
      // Formato antigo: ABC-1234
      const letter1 = letters[Math.floor(Math.random() * letters.length)];
      const letter2 = letters[Math.floor(Math.random() * letters.length)];
      const letter3 = letters[Math.floor(Math.random() * letters.length)];
      const number1 = numbers[Math.floor(Math.random() * numbers.length)];
      const number2 = numbers[Math.floor(Math.random() * numbers.length)];
      const number3 = numbers[Math.floor(Math.random() * numbers.length)];
      const number4 = numbers[Math.floor(Math.random() * numbers.length)];
      
      return `${letter1}${letter2}${letter3}-${number1}${number2}${number3}${number4}`;
    }
  };

  // Gerar RENAVAM
  const generateRenavam = (): string => {
    const digits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    
    // Calcular dígito verificador
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }
    const remainder = sum % 11;
    const digit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
    
    return [...digits, digit].join('');
  };

  // Gerar chassi
  const generateChassi = (): string => {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ123456789'; // Sem I, O, Q
    let chassi = '';
    
    // 17 caracteres
    for (let i = 0; i < 17; i++) {
      chassi += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return chassi;
  };

  const generateVehicle = useCallback((): VehicleData => {
    const state = states.find(s => s.code === selectedState)!;
    const category = vehicleCategories.find(c => c.id === selectedCategory)!;
    
    // Selecionar marca e modelo
    let availableBrands: any[] = [];
    category.brands.forEach(brandType => {
      availableBrands = [...availableBrands, ...vehicleBrands[brandType as keyof typeof vehicleBrands]];
    });
    
    let selectedBrandData;
    if (selectedBrand && selectedBrand !== '') {
      selectedBrandData = availableBrands.find(b => b.name === selectedBrand);
    }
    
    if (!selectedBrandData) {
      selectedBrandData = availableBrands[Math.floor(Math.random() * availableBrands.length)];
    }
    
    const model = selectedBrandData.models[Math.floor(Math.random() * selectedBrandData.models.length)];
    const currentYear = new Date().getFullYear();
    const year = currentYear - Math.floor(Math.random() * 15); // Até 15 anos
    const modelYear = year + (Math.random() > 0.7 ? 1 : 0); // Às vezes ano/modelo é diferente
    
    // Gerar dados do motor baseado na categoria
    let engine, power, displacement;
    if (selectedCategory === 'motocicleta') {
      const engines = ['150cc', '250cc', '300cc', '600cc', '1000cc'];
      engine = engines[Math.floor(Math.random() * engines.length)];
      power = `${Math.floor(Math.random() * 150) + 10} cv`;
      displacement = engine;
    } else if (selectedCategory === 'comercial') {
      const engines = ['2.0', '2.5', '3.0', '4.0', '6.0'];
      engine = engines[Math.floor(Math.random() * engines.length)];
      power = `${Math.floor(Math.random() * 300) + 100} cv`;
      displacement = `${engine}L`;
    } else {
      const engines = ['1.0', '1.3', '1.4', '1.6', '1.8', '2.0', '2.4', '3.0'];
      engine = engines[Math.floor(Math.random() * engines.length)];
      power = `${Math.floor(Math.random() * 200) + 70} cv`;
      displacement = `${engine}L`;
    }
    
    const transmissions = ['Manual', 'Automática', 'CVT', 'Automatizada'];
    const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
    
    // Gerar datas
    const firstRegistration = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const lastLicensing = new Date(currentYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    // Gerar proprietário
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const ownerName = `${firstName} ${lastName1} ${lastName2}`;
    
    // Gerar restrições aleatórias
    const possibleRestrictions = [
      'Alienação Fiduciária',
      'Arrendamento',
      'Reserva de Domínio',
      'Penhor',
      'Bloqueio Judicial'
    ];
    
    const restrictions: string[] = [];
    if (Math.random() > 0.7) { // 30% chance de ter restrições
      const numRestrictions = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numRestrictions; i++) {
        const restriction = possibleRestrictions[Math.floor(Math.random() * possibleRestrictions.length)];
        if (!restrictions.includes(restriction)) {
          restrictions.push(restriction);
        }
      }
    }
    
    return {
      // Identificação
      plate: generatePlate(plateFormat, selectedState),
      plateFormat,
      renavam: generateRenavam(),
      chassi: generateChassi(),
      
      // Dados do Veículo
      brand: selectedBrandData.name,
      model,
      year,
      modelYear,
      color: colors[Math.floor(Math.random() * colors.length)],
      fuel: fuels[Math.floor(Math.random() * fuels.length)],
      category: category.name,
      type: selectedCategory,
      
      // Motor e Performance
      engine,
      power,
      displacement,
      transmission,
      
      // Documentação
      state: selectedState,
      city: state.cities[Math.floor(Math.random() * state.cities.length)],
      
      // Proprietário
      ownerName,
      ownerCpf: generateCPF(),
      
      // Datas
      firstRegistration: firstRegistration.toLocaleDateString('pt-BR'),
      lastLicensing: lastLicensing.toLocaleDateString('pt-BR'),
      
      // Status
      isValid: true,
      restrictions
    };
  }, [selectedState, selectedBrand, selectedCategory, plateFormat]);

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
      vehicles: generatedVehicles,
      exportedAt: new Date().toISOString(),
      tool: 'OneDev Vehicle Generator'
    };
    
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veiculos-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setGeneratedVehicles([]);
  };

  const handleGenerate = () => {
    const vehicle = generateVehicle();
    const generatedVehicle: GeneratedVehicle = {
      vehicle,
      createdAt: new Date()
    };
    
    setGeneratedVehicles(prev => [generatedVehicle, ...prev.slice(0, 9)]);
  };

  const getAvailableBrands = () => {
    const category = vehicleCategories.find(c => c.id === selectedCategory);
    if (!category) return [];
    
    let brands: any[] = [];
    category.brands.forEach(brandType => {
      brands = [...brands, ...vehicleBrands[brandType as keyof typeof vehicleBrands]];
    });
    
    return brands.sort((a, b) => a.name.localeCompare(b.name));
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
          <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Gerador de Veículos
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Gere dados completos de veículos brasileiros por estado e marca com documentação válida
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Configurações do Veículo</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedBrand(''); // Reset brand when category changes
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {vehicleCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Marca (Opcional)
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Aleatória</option>
              {getAvailableBrands().map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Plate Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Formato da Placa
            </label>
            <select
              value={plateFormat}
              onChange={(e) => setPlateFormat(e.target.value as 'old' | 'mercosul')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="mercosul">Mercosul (ABC1D23)</option>
              <option value="old">Antiga (ABC-1234)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            Gerar Veículo
          </button>

          {generatedVehicles.length > 0 && (
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

      {/* Generated Vehicles */}
      {generatedVehicles.length > 0 && (
        <div className="space-y-8">
          {generatedVehicles.map((item, index) => {
            const { vehicle } = item;
            const CategoryIcon = vehicleCategories.find(c => c.id === vehicle.type)?.icon || Car;
            
            return (
              <div key={index} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg">
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {vehicle.year}/{vehicle.modelYear} • {vehicle.color} • {vehicle.fuel}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                      VÁLIDO
                    </span>
                    {vehicle.restrictions.length > 0 && (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm rounded-full">
                        {vehicle.restrictions.length} RESTRIÇÃO{vehicle.restrictions.length > 1 ? 'ÕES' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vehicle Identification */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Identificação
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Placa', vehicle.plate, Navigation, true)}
                      {renderField('RENAVAM', vehicle.renavam, Hash, true)}
                    </div>
                    <div className="space-y-4">
                      {renderField('Chassi', vehicle.chassi, Hash, true)}
                      {renderField('Formato da Placa', vehicle.plateFormat === 'mercosul' ? 'Mercosul' : 'Antiga', FileText)}
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Car className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Dados do Veículo
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      {renderField('Marca', vehicle.brand, Building2)}
                      {renderField('Modelo', vehicle.model, Car)}
                      {renderField('Categoria', vehicle.category, FileText)}
                    </div>
                    <div className="space-y-4">
                      {renderField('Ano/Modelo', `${vehicle.year}/${vehicle.modelYear}`, Calendar)}
                      {renderField('Cor', vehicle.color, Palette)}
                      {renderField('Combustível', vehicle.fuel, Fuel)}
                    </div>
                    <div className="space-y-4">
                      {renderField('Motor', vehicle.engine, Gauge)}
                      {renderField('Potência', vehicle.power, Zap)}
                      {renderField('Transmissão', vehicle.transmission, Settings)}
                    </div>
                  </div>
                </div>

                {/* Location and Owner */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Localização e Proprietário
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Estado', vehicle.state, MapPin)}
                      {renderField('Cidade', vehicle.city, Building2)}
                    </div>
                    <div className="space-y-4">
                      {renderField('Proprietário', vehicle.ownerName, User, true)}
                      {renderField('CPF', vehicle.ownerCpf, CreditCard, true)}
                    </div>
                  </div>
                </div>

                {/* Dates and Status */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Datas e Status
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Primeiro Emplacamento', vehicle.firstRegistration, Calendar)}
                      {renderField('Último Licenciamento', vehicle.lastLicensing, Calendar)}
                    </div>
                    <div className="space-y-4">
                      {vehicle.restrictions.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Restrições:</span>
                          </div>
                          <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                            {vehicle.restrictions.map((restriction, idx) => (
                              <li key={idx}>• {restriction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Complete Vehicle Info */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    Resumo Completo
                  </h4>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <code className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded border block whitespace-pre-wrap">
{`Veículo: ${vehicle.brand} ${vehicle.model}
Placa: ${showDetails ? vehicle.plate : '•••••••'}
RENAVAM: ${showDetails ? vehicle.renavam : '•••••••••••'}
Chassi: ${showDetails ? vehicle.chassi : '•••••••••••••••••'}
Ano/Modelo: ${vehicle.year}/${vehicle.modelYear}
Cor: ${vehicle.color}
Combustível: ${vehicle.fuel}
Motor: ${vehicle.engine} (${vehicle.power})
Proprietário: ${showDetails ? vehicle.ownerName : '••••••••••••'}
CPF: ${showDetails ? vehicle.ownerCpf : '•••.•••.•••-••'}
Estado: ${vehicle.state}
Cidade: ${vehicle.city}
Categoria: ${vehicle.category}
Restrições: ${vehicle.restrictions.length > 0 ? vehicle.restrictions.join(', ') : 'Nenhuma'}`}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(
                        `Veículo: ${vehicle.brand} ${vehicle.model}\nPlaca: ${vehicle.plate}\nRENAVAM: ${vehicle.renavam}\nChassi: ${vehicle.chassi}\nAno/Modelo: ${vehicle.year}/${vehicle.modelYear}\nCor: ${vehicle.color}\nCombustível: ${vehicle.fuel}\nMotor: ${vehicle.engine} (${vehicle.power})\nProprietário: ${vehicle.ownerName}\nCPF: ${vehicle.ownerCpf}\nEstado: ${vehicle.state}\nCidade: ${vehicle.city}\nCategoria: ${vehicle.category}\nRestrições: ${vehicle.restrictions.length > 0 ? vehicle.restrictions.join(', ') : 'Nenhuma'}`,
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
            );
          })}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">🚗 Sobre o Gerador de Veículos</h3>
            <div className="text-red-800 dark:text-red-300 leading-relaxed space-y-3">
              <p>
                Este gerador cria dados completos de veículos brasileiros seguindo os padrões oficiais 
                do DETRAN, incluindo placas Mercosul, RENAVAM válido e documentação realista.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-red-900 dark:text-red-100 mb-1 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Automóveis
                  </div>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Marcas nacionais e importadas</li>
                    <li>• Modelos atualizados</li>
                    <li>• Dados técnicos realistas</li>
                    <li>• Documentação completa</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-red-900 dark:text-red-100 mb-1 flex items-center gap-2">
                    <Bike className="w-4 h-4" />
                    Motocicletas
                  </div>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Principais fabricantes</li>
                    <li>• Cilindradas variadas</li>
                    <li>• Categorias específicas</li>
                    <li>• Placas adequadas</li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="font-semibold text-red-900 dark:text-red-100 mb-1 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Comerciais
                  </div>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Caminhões e utilitários</li>
                    <li>• Motores diesel</li>
                    <li>• Capacidades variadas</li>
                    <li>• Uso comercial</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-4">
                <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Uso Responsável
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Os dados gerados são fictícios e destinados apenas para testes e desenvolvimento. 
                  Não devem ser usados para fraudes ou atividades ilegais. 
                  Todos os algoritmos seguem padrões oficiais brasileiros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleGenerator;