import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Coffee, 
  User, 
  Lock, 
  Phone, 
  Plus, 
  Trash2, 
  LogOut, 
  Check, 
  AlertTriangle,
  Info,
  ChevronRight,
  Filter,
  Lightbulb,
  PiggyBank,
  Award,
  Shield,
  PieChart,
  RefreshCw,
  Clock,
  ArrowRight,
  Calendar,
  Layers,
  HelpCircle,
  TrendingUp as TrendingUpIcon,
  ChevronDown,
  Lock as LockIcon,
  Settings,
  Smartphone,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType, Transaction, TransactionType } from './types';

// Lista de países de LATAM con su código, bandera y formato de marcador con su moneda predeterminada
const LATAM_COUNTRIES = [
  { code: '+54', name: 'Argentina', flag: '🇦🇷', currency: 'ARS$' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴', currency: 'Bs' },
  { code: '+55', name: 'Brasil', flag: '🇧🇷', currency: 'R$' },
  { code: '+56', name: 'Chile', flag: '🇨🇱', currency: 'CLP$' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴', currency: 'COP$' },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷', currency: '₡' },
  { code: '+53', name: 'Cuba', flag: '🇨🇺', currency: 'CUP$' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨', currency: 'USD$' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻', currency: 'USD$' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹', currency: 'Q' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳', currency: 'L' },
  { code: '+52', name: 'México', flag: '🇲🇽', currency: 'MXN$' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮', currency: 'C$' },
  { code: '+507', name: 'Panamá', flag: '🇵🇦', currency: 'USD$' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾', currency: '₲' },
  { code: '+51', name: 'Perú', flag: '🇵🇪', currency: 'S/.' },
  { code: '+1-787', name: 'Puerto Rico', flag: '🇵🇷', currency: 'USD$' },
  { code: '+1-809', name: 'Rep. Dominicana', flag: '🇩🇴', currency: 'RD$' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾', currency: 'UYU$' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪', currency: 'Bs.D' }
];

// Categorías predefinidas en español para una persona común
const CATEGORIES = {
  income: [
    'Sueldo principal',
    'Trabajo extra / Freelance',
    'Ventas / Emprendimiento',
    'Inversiones',
    'Otros Ingresos'
  ],
  expense: [
    'Alquiler / Hipoteca',
    'Supermercado / Alimentos',
    'Servicios Públicos (Luz, Agua, Gas)',
    'Internet y Planes Móviles',
    'Transporte diario / Combustible',
    'Salud y Medicamentos',
    'Préstamos / Cuotas de Tarjeta',
    'Educación / Cursos',
    'Otros Gastos Fijos'
  ],
  micro: [
    'Cafecito / Té en la calle',
    'Snacks, Antojos y Gaseosas',
    'Comida a domicilio (UberEats, Rappi)',
    'Uber / Cabify cortos (por pereza)',
    'Suscripciones que no usas',
    'Compras en apps / Monedas de juegos',
    'Cervezas, Alcohol o Cigarros',
    'Lotería, Apuestas o Juegos de azar',
    'Compras impulsivas baratas',
    'Otros antojos del día'
  ]
};

const CATEGORY_ICONS: Record<string, string> = {
  'Sueldo principal': '💼', 'Trabajo extra / Freelance': '🚀', 'Ventas / Emprendimiento': '🛍️', 'Inversiones': '📈', 'Otros Ingresos': '💵',
  'Alquiler / Hipoteca': '🏠', 'Supermercado / Alimentos': '🛒', 'Servicios Públicos (Luz, Agua, Gas)': '⚡', 'Internet y Planes Móviles': '📱', 'Transporte diario / Combustible': '🚗', 'Salud y Medicamentos': '💊', 'Préstamos / Cuotas de Tarjeta': '💳', 'Educación / Cursos': '🎓', 'Otros Gastos Fijos': '📦',
  'Cafecito / Té en la calle': '☕', 'Snacks, Antojos y Gaseosas': '🍬', 'Comida a domicilio (UberEats, Rappi)': '🍕', 'Uber / Cabify cortos (por pereza)': '🚕', 'Suscripciones que no usas': '🎞️', 'Compras en apps / Monedas de juegos': '🎮', 'Cervezas, Alcohol o Cigarros': '🍻', 'Lotería, Apuestas o Juegos de azar': '🎲', 'Compras impulsivas baratas': '💸', 'Otros antojos del día': '🍭'
};

const KEYWORD_MAP: Record<TransactionType, { category: string; keywords: string[] }[]> = {
  income: [
    { category: 'Sueldo principal', keywords: ['sueldo', 'salario', 'nomina', 'nómina', 'quincena', 'empresa', 'mensualidad', 'pago quincena'] },
    { category: 'Trabajo extra / Freelance', keywords: ['freelance', 'proyecto', 'consultoria', 'consultoría', 'tigre', 'camaron', 'camarón', 'independiente', 'extra', 'asesor'] },
    { category: 'Ventas / Emprendimiento', keywords: ['venta', 'emprendimiento', 'tienda', 'negocio', 'pago cliente', 'producto', 'ventas', 'comision', 'comisión'] },
    { category: 'Inversiones', keywords: ['dividendo', 'inversion', 'inversión', 'cripto', 'bitcoin', 'ganancia', 'acciones', 'rendimiento', 'intereses'] }
  ],
  expense: [
    { category: 'Alquiler / Hipoteca', keywords: ['alquiler', 'renta', 'hipoteca', 'departamento', 'cuarto', 'arriendo', 'casa', 'apto', 'mensualidad hogar'] },
    { category: 'Supermercado / Alimentos', keywords: ['supermercado', 'super', 'compras', 'despensa', 'mercado', 'comida', 'exito', 'carulla', 'jumbo', 'walmart', 'd1', 'ara', 'carniceria', 'verduras', 'fruver', 'compras casa', 'mercando'] },
    { category: 'Servicios Públicos (Luz, Agua, Gas)', keywords: ['luz', 'agua', 'gas', 'electricidad', 'recibo', 'enel', 'epm', 'acueducto', 'energia', 'energía'] },
    { category: 'Internet y Planes Móviles', keywords: ['internet', 'wifi', 'plan', 'celular', 'movistar', 'claro', 'tigo', 'fibra', 'datos', 'reutilizable'] },
    { category: 'Transporte diario / Combustible', keywords: ['gasolina', 'combustible', 'pasaje', 'metro', 'bus', 'colectivo', 'transmilenio', 'peaje', 'parqueadero', 'estacionamiento'] },
    { category: 'Salud y Medicamentos', keywords: ['farmacia', 'medicina', 'doctor', 'salud', 'eps', 'clinica', 'clínica', 'pastillas', 'odontologo', 'consulta'] },
    { category: 'Préstamos / Cuotas de Tarjeta', keywords: ['prestamo', 'préstamo', 'tarjeta', 'banco', 'cuota', 'interes', 'interés', 'visa', 'mastercard', 'deuda', 'davivienda', 'bancolombia'] },
    { category: 'Educación / Cursos', keywords: ['curso', 'colegio', 'universidad', 'educacion', 'educación', 'clase', 'libro', 'pension', 'pensión', 'matricula', 'matrícula', 'udemy', 'platzi'] }
  ],
  micro: [
    { category: 'Cafecito / Té en la calle', keywords: ['cafe', 'cafecito', 'café', 'starbucks', 'latte', 'espresso', 'tinto', 'juan valdez', 'panaderia', 'panadería', 'taza', 'cappuccino', 'capuchino', 'milo', 'macchiato', 'dunkin'] },
    { category: 'Snacks, Antojos y Gaseosas', keywords: ['oxxo', 'tiendita', 'gaseosa', 'refresco', 'papas', 'chocolate', 'dulce', 'caramelo', 'chicle', 'snack', 'antojo', 'galleta', 'papitas', 'papas fritas', 'cocacola', 'coca-cola', 'sprite', 'gansito', 'paleta', 'helado', 'mecato', 'lays', 'margarita'] },
    { category: 'Comida a domicilio (UberEats, Rappi)', keywords: ['rappi', 'ubereats', 'delivery', 'pedidosya', 'domicilio', 'hamburguesa', 'pizza', 'sushi', 'ifood', 'domicilios', 'perro caliente', 'salchipapa', 'comida rapida', 'kfc', 'mcdonalds', 'mcdonald\'s', 'burger'] },
    { category: 'Uber / Cabify cortos (por pereza)', keywords: ['uber', 'cabify', 'didi', 'taxi', 'pereza', 'corto', 'mototaxi', 'indriver', 'viaje rapido', 'carrera'] },
    { category: 'Suscripciones que no usas', keywords: ['netflix', 'spotify', 'disney', 'prime', 'hbo', 'crunchyroll', 'suscripcion', 'suscripción', 'patreon', 'onlyfans', 'youtube premium', 'icloud', 'drive space'] },
    { category: 'Compras en apps / Monedas de juegos', keywords: ['juego', 'skin', 'fortnite', 'gemas', 'monedas', 'steam', 'playstation', 'xbox', 'app', 'playstore', 'appstore', 'nintendo', 'free fire', 'diamantes'] },
    { category: 'Cervezas, Alcohol o Cigarros', keywords: ['cerveza', 'pola', 'alcohol', 'cigarro', 'cigarros', 'vape', 'vapeador', 'licor', 'trago', 'bar', 'coctel', 'ron', 'aguardiente', 'whisky', 'biela', 'chela', 'fria', 'fría', 'cigarrillos'] },
    { category: 'Lotería, Apuestas o Juegos de azar', keywords: ['apuesta', 'casino', 'loteria', 'lotería', 'rifa', 'azar', 'bet', 'wplay', 'betplay', 'poker', 'bingo'] },
    { category: 'Compras impulsivas baratas', keywords: ['miniso', 'oferta', 'descuento', 'impulsiva', 'calle', 'vendedor', 'novedad', 'baratija', 'aliexpress', 'temu', 'shein', 'chucheria', 'llavero'] }
  ]
};

export default function App() {
  // Estado de autenticación
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    name: '',
    phoneCountryCode: '+51', // Perú por defecto
    phoneNumber: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Estado de transacciones
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Estado del formulario de transacciones
  const [formType, setFormType] = useState<TransactionType>('micro');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAutoClassified, setIsAutoClassified] = useState<boolean>(false);
  const [hasManuallySelected, setHasManuallySelected] = useState<boolean>(false);

  // Filtros del tablero
  const [timeFilter, setTimeFilter] = useState<'all' | '7days' | '30days'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [systemMessage, setSystemMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Estado del Coach AI
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [customAiQuery, setCustomAiQuery] = useState<string>('');

  // Estado para el modal de edición de perfil
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState<boolean>(false);
  const [savingsTargetPercent, setSavingsTargetPercent] = useState<number>(50);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phoneCountryCode: '+51',
    phoneNumber: '',
    currency: ''
  });

  // Estados de Desglose de Transacciones
  const [selectedTransactionForDetail, setSelectedTransactionForDetail] = useState<Transaction | null>(null);
  const [visibleTransactionsCount, setVisibleTransactionsCount] = useState<number>(5);

  // Estado para Meta de Gasto Diario y Reto del Día (SaaS Senior)
  const [dailyExpenseBudget, setDailyExpenseBudget] = useState<number>(() => {
    const stored = localStorage.getItem('cent_active_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.dailyExpenseBudget) return u.dailyExpenseBudget;
      } catch (e) {}
    }
    return 30000; // Valor por defecto amigable en pesos/moneda local
  });

  const [challengeAccepted, setChallengeAccepted] = useState<boolean>(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return localStorage.getItem(`cent_challenge_${todayStr}`) === 'true';
  });

  const handleUpdateDailyBudget = (newVal: number) => {
    const val = isNaN(newVal) || newVal < 0 ? 0 : newVal;
    setDailyExpenseBudget(val);
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      dailyExpenseBudget: val
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('cent_active_user', JSON.stringify(updatedUser));

    const storedUsersStr = localStorage.getItem('cent_users_phone') || '[]';
    const storedUsers: any[] = JSON.parse(storedUsersStr);
    const updatedUsers = storedUsers.map(u => u.id === currentUser.id ? updatedUser : u);
    localStorage.setItem('cent_users_phone', JSON.stringify(updatedUsers));
  };

  const handleAcceptChallenge = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(`cent_challenge_${todayStr}`, 'true');
    setChallengeAccepted(true);
    triggerMessage('🎯 ¡Reto de hoy aceptado! Vamos a mantener tus gastos hormiga bajo control.', 'success');
  };

  // Estado para la navegación por pestañas en móviles (PWA Optimization)
  const [mobileTab, setMobileTab] = useState<'summary' | 'register' | 'history'>('summary');
  const [isMobileSimulated, setIsMobileSimulated] = useState<boolean>(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobileViewport(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = isMobileViewport || isMobileSimulated;

  // Función para escalar dinámicamente los montos rápidos de registro según la divisa del usuario
  const getPresetAmount = (baseUsd: number) => {
    const symbol = getUserCurrency();
    const curr = symbol.toUpperCase().trim();
    
    // Si contiene pesos colombianos (múltiplos de miles)
    if (curr.includes('COP') || curr.includes('COL')) return Math.round(baseUsd * 4000);
    // Si contiene pesos argentinos o chilenos
    if (curr.includes('ARS')) return Math.round(baseUsd * 900);
    if (curr.includes('CLP')) return Math.round(baseUsd * 900);
    // Guaraníes paraguayos
    if (curr.includes('₲') || curr.includes('PYG')) return Math.round(baseUsd * 7500);
    // Colones costarricenses
    if (curr.includes('₡') || curr.includes('CRC')) return Math.round(baseUsd * 500);
    // Pesos uruguayos
    if (curr.includes('UYU')) return Math.round(baseUsd * 40);
    // Pesos mexicanos
    if (curr.includes('MXN')) return Math.round(baseUsd * 18);
    // Bolivianos bolivianos
    if (curr.includes('BS')) return Math.round(baseUsd * 7);
    // Soles peruanos, dólares, etc (mantenemos el valor base o levemente ajustado)
    if (curr.includes('S/.') || curr.includes('PEN')) return Math.round(baseUsd * 3.7 * 10) / 10;
    
    return baseUsd;
  };

  // Manejo de carga rápida mediante presets (Ant-Log)
  const handleQuickAdd = (preset: { description: string; baseUsd: number; category: string }) => {
    if (!currentUser) return;
    const amountNum = getPresetAmount(preset.baseUsd);
    
    const newTransaction: Transaction = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      type: 'micro',
      category: preset.category,
      amount: amountNum,
      description: preset.description,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem(`cent_transactions_${currentUser.id}`, JSON.stringify(updated));

    triggerMessage(`⚡ ¡Gasto Hormiga registrado!: ${preset.description} por ${formatMoney(amountNum)}`, 'success');
  };

  // Estados y efectos para PWA e Instalación Móvil (SaaS Senior)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isInStandaloneMode) {
        // Verificar que no se haya rechazado o cerrado antes en esta sesión
        const dismissed = sessionStorage.getItem('centant_install_dismissed') === 'true';
        if (!dismissed) {
          setShowInstallBanner(true);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detección especial de iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS && !isInStandaloneMode) {
      const dismissed = sessionStorage.getItem('centant_install_dismissed') === 'true';
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
        triggerMessage('🎉 ¡Gracias por instalar CentAnt en tu dispositivo!', 'success');
      }
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        triggerMessage('📱 Presiona "Compartir" 📤 abajo en tu navegador Safari y luego presiona "Agregar a inicio" 📱 para disfrutar de la experiencia nativa de CentAnt.', 'info');
      } else {
        triggerMessage('💡 Puedes instalar CentAnt abriendo el menú de opciones de tu navegador (los tres puntos en la esquina superior) y seleccionando "Instalar aplicación" o "Agregar a la pantalla principal".', 'info');
      }
    }
  };

  const handleDismissInstallBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('centant_install_dismissed', 'true');
  };

  // Funciones de formato de Moneda
  const getUserCurrency = () => {
    if (currentUser?.currency) {
      return currentUser.currency;
    }
    if (currentUser?.phoneCountryCode) {
      const match = LATAM_COUNTRIES.find(c => c.code === currentUser.phoneCountryCode);
      return match ? match.currency : '$';
    }
    return '$';
  };

  const formatMoney = (amount: number) => {
    const symbol = getUserCurrency();
    const formatted = Math.abs(amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
  };

  const handleOpenProfile = () => {
    if (!currentUser) return;
    setProfileForm({
      name: currentUser.name,
      phoneCountryCode: currentUser.phoneCountryCode,
      phoneNumber: currentUser.phoneNumber,
      currency: getUserCurrency()
    });
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    if (!profileForm.name.trim() || !profileForm.phoneNumber.trim()) {
      triggerMessage('Por favor, rellena todos los campos obligatorios.', 'error');
      return;
    }

    const updatedUser: UserType = {
      ...currentUser,
      name: profileForm.name.trim(),
      phoneCountryCode: profileForm.phoneCountryCode,
      phoneNumber: profileForm.phoneNumber.replace(/\D/g, ''),
      currency: profileForm.currency
    };

    // Actualizar en el estado de la sesión activa
    setCurrentUser(updatedUser);
    localStorage.setItem('cent_active_user', JSON.stringify(updatedUser));

    // Actualizar en el listado persistido de usuarios para posteriores inicios de sesión
    const storedUsersStr = localStorage.getItem('cent_users_phone') || '[]';
    const storedUsers: UserType[] = JSON.parse(storedUsersStr);
    const updatedUsers = storedUsers.map(u => u.id === currentUser.id ? updatedUser : u);
    localStorage.setItem('cent_users_phone', JSON.stringify(updatedUsers));

    setIsProfileModalOpen(false);
    triggerMessage('¡Perfil y moneda de preferencia actualizados con éxito!', 'success');
  };

  // Hidratar sesión de usuario y datos desde LocalStorage al cargar
  useEffect(() => {
    const activeUserStr = localStorage.getItem('cent_active_user');
    if (activeUserStr) {
      try {
        const userObj = JSON.parse(activeUserStr);
        setCurrentUser(userObj);
        loadUserTransactions(userObj.id);
      } catch (e) {
        localStorage.removeItem('cent_active_user');
      }
    }
  }, []);

  const loadUserTransactions = (userId: string) => {
    const stored = localStorage.getItem(`cent_transactions_${userId}`);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        setTransactions([]);
      }
    } else {
      // Cargar transacciones semilla iniciales para dar vida al tablero de inmediato
      const initialSeed: Transaction[] = [
        { id: '1', userId, type: 'income', category: 'Sueldo principal', amount: 1800, description: 'Pago de nómina quincenal', date: getRelativeDateStr(-14) },
        { id: '2', userId, type: 'income', category: 'Trabajo extra / Freelance', amount: 350, description: 'Diseño de logo cliente independiente', date: getRelativeDateStr(-5) },
        { id: '3', userId, type: 'expense', category: 'Alquiler / Hipoteca', amount: 650, description: 'Mensualidad del departamento', date: getRelativeDateStr(-10) },
        { id: '4', userId, type: 'expense', category: 'Supermercado / Alimentos', amount: 140, description: 'Compras mensuales para la despensa', date: getRelativeDateStr(-8) },
        { id: '5', userId, type: 'expense', category: 'Servicios Públicos (Luz, Agua, Gas)', amount: 65, description: 'Recibo de luz y agua corriente', date: getRelativeDateStr(-11) },
        { id: '6', userId, type: 'micro', category: 'Cafecito / Té en la calle', amount: 4.50, description: 'Café latte y dona camino al trabajo', date: getRelativeDateStr(-1) },
        { id: '7', userId, type: 'micro', category: 'Cafecito / Té en la calle', amount: 3.80, description: 'Café americano helado para la tarde', date: getRelativeDateStr(-3) },
        { id: '8', userId, type: 'micro', category: 'Comida a domicilio (UberEats, Rappi)', amount: 18.50, description: 'Hamburguesa doble con papas por antojo', date: getRelativeDateStr(-2) },
        { id: '9', userId, type: 'micro', category: 'Snacks, Antojos y Gaseosas', amount: 2.90, description: 'Refresco y papas fritas de la tienda de la esquina', date: getRelativeDateStr(-4) },
        { id: '10', userId, type: 'micro', category: 'Uber / Cabify cortos (por pereza)', amount: 7.20, description: 'Viaje corto de 5 cuadras porque lloviznaba', date: getRelativeDateStr(-2) },
        { id: '11', userId, type: 'micro', category: 'Compras impulsivas baratas', amount: 15.00, description: 'Cargador de celular barato de calle', date: getRelativeDateStr(-6) },
        { id: '12', userId, type: 'micro', category: 'Suscripciones que no usas', amount: 11.99, description: 'Mensualidad de plataforma de streaming que nunca veo', date: getRelativeDateStr(-12) }
      ];
      setTransactions(initialSeed);
      localStorage.setItem(`cent_transactions_${userId}`, JSON.stringify(initialSeed));
    }
  };

  function getRelativeDateStr(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAgo);
    return d.toISOString().split('T')[0];
  }

  // Sincronizar al cambiar el tipo de formulario y resetear estados de autodetección
  useEffect(() => {
    setFormCategory(CATEGORIES[formType][0]);
    setIsAutoClassified(false);
    setHasManuallySelected(false);
  }, [formType]);

  // Autoclasificación inteligente basada en palabras clave de la nota (memo)
  useEffect(() => {
    const desc = formDescription.toLowerCase().trim();
    if (!desc) {
      if (!hasManuallySelected) {
        setFormCategory(CATEGORIES[formType][0]);
      }
      setIsAutoClassified(false);
      return;
    }

    if (hasManuallySelected) return;

    let matchedCategory: string | null = null;
    const typeRules = KEYWORD_MAP[formType] || [];

    for (const rule of typeRules) {
      if (rule.keywords.some(keyword => desc.includes(keyword))) {
        matchedCategory = rule.category;
        break;
      }
    }

    if (matchedCategory) {
      setFormCategory(matchedCategory);
      setIsAutoClassified(true);
    } else {
      // Si no coincide nada, se deja la categoría por defecto (la primera)
      setFormCategory(CATEGORIES[formType][0]);
      setIsAutoClassified(false);
    }
  }, [formDescription, formType, hasManuallySelected]);

  // Manejo de autenticación por teléfono
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const { name, phoneCountryCode, phoneNumber } = authForm;

    if (!phoneNumber || (authMode === 'register' && !name)) {
      setAuthError('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    // Validación básica del número de teléfono
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length < 6 || cleanedPhone.length > 15) {
      setAuthError('Por favor, introduce un número de teléfono válido (entre 6 y 15 dígitos).');
      return;
    }

    const storedUsersStr = localStorage.getItem('cent_users_phone') || '[]';
    const storedUsers: UserType[] = JSON.parse(storedUsersStr);

    const fullPhoneKey = `${phoneCountryCode}-${cleanedPhone}`;

    if (authMode === 'register') {
      const userExists = storedUsers.some(u => `${u.phoneCountryCode}-${u.phoneNumber}` === fullPhoneKey);
      if (userExists) {
        setAuthError('Este número de teléfono ya se encuentra registrado.');
        return;
      }

      const defaultCurrency = LATAM_COUNTRIES.find(c => c.code === phoneCountryCode)?.currency || '$';
      const newUser: UserType = {
        id: 'usr_' + Date.now(),
        name: name.trim(),
        phoneCountryCode,
        phoneNumber: cleanedPhone,
        createdAt: new Date().toISOString(),
        currency: defaultCurrency
      };

      storedUsers.push(newUser);
      localStorage.setItem('cent_users_phone', JSON.stringify(storedUsers));
      
      localStorage.setItem('cent_active_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      loadUserTransactions(newUser.id);
      triggerMessage('¡Cuenta creada con éxito! Bienvenido a CentAnt.', 'success');
    } else {
      // Login
      const user = storedUsers.find(u => 
        u.phoneCountryCode === phoneCountryCode && 
        u.phoneNumber === cleanedPhone
      );
      if (!user) {
        setAuthError('Este número de teléfono no está registrado. Por favor, selecciona "Regístrate aquí" abajo para crear tu cuenta en un instante.');
        return;
      }

      const userWithCurrency: UserType = {
        ...user,
        currency: user.currency || LATAM_COUNTRIES.find(c => c.code === user.phoneCountryCode)?.currency || '$'
      };

      localStorage.setItem('cent_active_user', JSON.stringify(userWithCurrency));
      setCurrentUser(userWithCurrency);
      loadUserTransactions(userWithCurrency.id);
      triggerMessage(`¡Hola de nuevo, ${userWithCurrency.name}!`, 'success');
    }

    // Limpiar el formulario y colocar Perú (+51) por defecto
    setAuthForm({ name: '', phoneCountryCode: '+51', phoneNumber: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('cent_active_user');
    setCurrentUser(null);
    setTransactions([]);
    setAiAnalysis('');
    triggerMessage('Sesión cerrada correctamente.', 'info');
  };

  const triggerMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setSystemMessage({ text, type });
    setTimeout(() => setSystemMessage(null), 4000);
  };

  // Registrar transacción
  const handleLogTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    const amountNum = parseFloat(formAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      triggerMessage('Por favor, introduce un monto válido y mayor a cero.', 'error');
      return;
    }

    if (!formCategory) {
      triggerMessage('Por favor, selecciona una categoría válida.', 'error');
      return;
    }

    const newTransaction: Transaction = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      type: formType,
      category: formCategory,
      amount: amountNum,
      description: formDescription.trim() || `${formCategory}`,
      date: formDate
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem(`cent_transactions_${currentUser.id}`, JSON.stringify(updated));

    // Resetear formulario parcial y estados de autodetección
    setFormAmount('');
    setFormDescription('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setIsAutoClassified(false);
    setHasManuallySelected(false);

    triggerMessage(
      formType === 'micro' 
        ? '¡Gasto Hormiga detectado! Catalogado para el análisis de fugas de dinero.' 
        : 'Transacción guardada correctamente.', 
      'success'
    );
  };

  // Eliminar transacción
  const handleDeleteTransaction = (id: string) => {
    if (!currentUser) return;
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem(`cent_transactions_${currentUser.id}`, JSON.stringify(updated));
    triggerMessage('Transacción eliminada del historial.', 'info');
  };

  // Filtrar transacciones para el listado interactivo
  const getFilteredTransactions = () => {
    let list = [...transactions];

    // Filtrar por tiempo
    const now = new Date();
    if (timeFilter === '7days') {
      const boundary = new Date();
      boundary.setDate(now.getDate() - 7);
      list = list.filter(t => new Date(t.date) >= boundary);
    } else if (timeFilter === '30days') {
      const boundary = new Date();
      boundary.setDate(now.getDate() - 30);
      list = list.filter(t => new Date(t.date) >= boundary);
    }

    // Filtrar por categoría
    if (categoryFilter !== 'all') {
      list = list.filter(t => t.category === categoryFilter);
    }

    // Ordenar de más reciente a más antigua
    return list.sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.id.localeCompare(a.id);
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Métricas financieras clave
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRegularExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalMicroExpenses = transactions
    .filter(t => t.type === 'micro')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = totalRegularExpenses + totalMicroExpenses;
  const netSavings = totalIncome - totalExpenses;

  // Porcentaje de fuga por gastos hormiga (respecto al gasto total)
  const leakRatio = totalExpenses > 0 ? (totalMicroExpenses / totalExpenses) * 100 : 0;

  // Proyección anual del gasto hormiga actual
  const uniqueDays = Array.from(new Set(transactions.map(t => t.date))).length || 1;
  const dailyMicroRate = totalMicroExpenses / Math.max(uniqueDays, 1);
  const projectedYearlyLeak = dailyMicroRate * 365;

  // Rangos de clasificación de fugas financieras
  const getLeakTierInfo = (ratio: number) => {
    if (ratio === 0) return { title: 'Escudo Dorado', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: '¡Increíble! No registras gastos hormiga. Tienes una eficiencia del capital perfecta.' };
    if (ratio < 15) return { title: 'Ahorrador Inteligente', color: 'text-green-700 bg-green-50 border-green-200', desc: 'Tus micro-gastos están controlados. Los pequeños antojos representan una fuga menor.' };
    if (ratio < 30) return { title: 'Fuga Moderada', color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'Cuidado. Los gastos hormiga representan una porción notable de tus salidas. Podrías ahorrar mucho más.' };
    return { title: '¡Goteo Crítico de Capital!', color: 'text-rose-700 bg-rose-50 border-rose-200', desc: '¡Alerta roja! Más del 30% de tu dinero se drena en gastos pequeños cotidianos de los que apenas te das cuenta.' };
  };

  const leakTier = getLeakTierInfo(leakRatio);

  // Gastos del día de hoy (SaaS Senior)
  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString();
  const todayTransactions = transactions.filter(t => t.date === todayStr);

  const todayMicroExpenses = todayTransactions
    .filter(t => t.type === 'micro')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayRegularExpenses = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayTotalExpenses = todayMicroExpenses + todayRegularExpenses;

  // Desglose de Gastos Hormiga por categoría para las barras visuales
  const microBreakdown = CATEGORIES.micro.map(cat => {
    const list = transactions.filter(t => t.type === 'micro' && t.category === cat);
    const amt = list.reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: amt, count: list.length };
  }).filter(c => c.value > 0).sort((a, b) => b.value - a.value);

  // Obtener todos los gastos de todas las categorías de tipo gasto fijo para el filtro
  const allUsedCategories = Array.from(new Set(transactions.map(t => t.category)));

  // Llamada al backend seguro para invocar el Coach Financiero AI (Gemini)
  const generateAiAdvice = async (customQuestion?: string) => {
    if (!currentUser) return;
    setIsAiLoading(true);
    setAiAnalysis('');
    
    // Resumen formateado de datos para que Gemini haga el análisis en perfecto español
    const microSummary = transactions
      .filter(t => t.type === 'micro')
      .map(t => `- $${t.amount.toFixed(2)} en "${t.description}" (${t.category}) el ${t.date}`)
      .join('\n');

    const totalSummaries = `
- Ingresos Totales de este mes: $${totalIncome.toFixed(2)}
- Gastos Fijos (Servicios, alquiler, etc.): $${totalRegularExpenses.toFixed(2)}
- Gastos Hormiga (Compras pequeñas, antojos): $${totalMicroExpenses.toFixed(2)}
- Porcentaje de fuga de dinero (Gastos Hormiga / Gastos Totales): ${leakRatio.toFixed(1)}%
- Gasto hormiga anual proyectado: $${projectedYearlyLeak.toFixed(2)}
    `;

    let userPrompt = '';
    if (customQuestion) {
      userPrompt = `El usuario tiene la siguiente duda o pregunta sobre sus finanzas: "${customQuestion}". 
      Responde detalladamente con base en su información financiera actual:
      ${totalSummaries}
      
      Y su lista de gastos hormiga recientes:
      ${microSummary}
      
      Por favor, responde de forma experta, estructurada y en un español impecable, cercano y motivador. Limita tu respuesta a dos párrafos concisos con viñetas claras.`;
    } else {
      userPrompt = `Realiza una auditoría financiera conductual llamada "Diagnóstico de Fuga Cent AI".
      Aquí están mis métricas actuales:
      ${totalSummaries}
      
      Y aquí está mi historial de pequeños antojos / gastos hormiga:
      ${microSummary}
      
      Instrucciones de respuesta:
      1. Identifica de forma muy clara mis dos mayores fuentes de pérdida de dinero silenciosa (basado en mis antojos reales).
      2. Diseña 3 mini-hábitos conductuales super prácticos adaptados a mi realidad para detener el goteo de capital.
      3. Haz un cálculo matemático estimativo de cuánto dinero acumularía en 5 años si recortara el 50% de estos gastos hormiga y ese capital lo invirtiera de forma automática a una tasa de rendimiento anual del 8% (efecto del interés compuesto).
      Escribe en español, con tono elegante, estimulante, directo y libre de clichés genéricos.`;
    }

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          systemInstruction: 'Eres "Cent Coach Financiero", un asesor de élite en finanzas personales, economía del comportamiento y analista de microfugas de dinero. Eres directo, sumamente práctico, inteligente, motivador y te comunicas siempre en español de forma profesional e impecable.',
          model: 'gemini-3.5-flash'
        })
      });

      if (!res.ok) {
        throw new Error('El servicio de análisis de IA temporalmente no pudo calcular.');
      }

      const data = await res.json();
      setAiAnalysis(data.text || 'No se pudo generar la recomendación del coach en este momento.');
      if (customQuestion) {
        setCustomAiQuery('');
      }
    } catch (e: any) {
      setAiAnalysis(`No pudimos contactar al Coach AI en este momento: ${e.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAskCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAiQuery.trim()) return;
    generateAiAdvice(customAiQuery);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#2C2A29] font-sans flex flex-col antialiased selection:bg-[#E5E3D8] selection:text-[#111110]">
      
      {/* Barra superior flotante de notificaciones del sistema */}
      <AnimatePresence>
        {systemMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 backdrop-blur-md ${
              systemMessage.type === 'success' 
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' 
                : systemMessage.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-800'
                : 'bg-amber-50/95 border-amber-200 text-amber-800'
            }`}>
              {systemMessage.type === 'success' ? (
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : systemMessage.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="text-xs font-semibold">{systemMessage.text}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner de Instalación PWA (Móvil-First) */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40"
          >
            <div className="bg-[#1A1A18] text-[#FAF9F5] border border-[#2D2D2A] rounded-2xl p-4 shadow-xl flex gap-3.5 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-white text-lg flex-shrink-0 shadow-inner">
                🐜
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instala CentAnt</h4>
                  <button 
                    onClick={handleDismissInstallBanner}
                    className="text-[#8A887C] hover:text-white transition-colors text-xs p-1 -mt-1 -mr-1 cursor-pointer"
                    aria-label="Cerrar sugerencia de instalación"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-[#C9C8BD] font-medium leading-normal mt-1">
                  Úsalo como una App en tu pantalla de inicio para un acceso rápido y sin conexión.
                </p>
                <div className="flex gap-2.5 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shadow-3xs"
                  >
                    <Smartphone className="w-3 h-3" />
                    Instalar App
                  </button>
                  <button
                    onClick={handleDismissInstallBanner}
                    className="px-3 py-1.5 bg-[#2E2C28] hover:bg-[#3D3A35] text-[#D4D3C6] rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Quizás luego
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PORTADA DE INGRESO Y REGISTRO (No Autenticado) */}
      {!currentUser ? (
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 min-h-screen">
          
          {/* Panel de presentación de marca (Izquierda en desktop, arriba en mobile) */}
          <div className="lg:col-span-7 bg-[#1A1A18] text-[#EBEAE4] p-8 sm:p-16 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#2E2D2A_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
            
            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-bold font-display text-white text-lg shadow-sm">
                🐜
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">CentAnt</span>
            </div>

            {/* Texto de Valor de Marca */}
            <div className="relative z-10 my-12 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  Control de Gastos Hormiga
                </span>
                <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white mt-4 mb-6 leading-tight">
                  Detén el goteo diario. Domina tus <span className="text-amber-400">gastos hormiga</span>.
                </h1>
                <p className="text-sm text-[#B5B3A8] leading-relaxed mb-8">
                  Toma el control de tus finanzas identificando y optimizando tus pequeños consumos diarios.
                </p>
              </motion.div>

              {/* Punto Clave Destacado con Dibujo Elegante de una Hormiga */}
              <div className="p-5 rounded-xl bg-[#282623] border border-[#3A3834] flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/20 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-amber-400 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="50" cy="72" rx="14" ry="18" className="fill-amber-400/10" />
                    <ellipse cx="50" cy="46" rx="10" ry="12" className="fill-amber-400/20" />
                    <circle cx="50" cy="24" r="8" className="fill-amber-400" />
                    <path d="M40 50 Q25 58 15 70" />
                    <path d="M60 50 Q75 58 85 70" />
                    <path d="M40 46 H20" />
                    <path d="M60 46 H80" />
                    <path d="M40 42 Q25 34 15 22" />
                    <path d="M60 42 Q75 34 85 22" />
                    <path d="M46 17 Q40 5 30 8" />
                    <path d="M54 17 Q60 5 70 8" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-amber-400">
                    <span className="text-xs font-bold font-display uppercase tracking-wider">El Efecto Hormiga / CentAnt Tracker</span>
                  </div>
                  <p className="text-xs text-[#B5B3A8] leading-relaxed">
                    Un café de $4 y un delivery de $10 diarios equivalen a más de **$400 al mes** que desaparecen silenciosamente de tus ahorros. CentAnt te ayuda a visualizarlos, dominarlos y eliminarlos por completo.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer de Presentación */}
            <div className="relative z-10 text-[10px] text-[#8C8A80] border-t border-[#2A2925] pt-4 flex flex-col sm:flex-row justify-between gap-2 font-mono">
              <span>SaaS Ligero para Control Personal (CentAnt)</span>
              <span>Protección y Sandbox del Navegador</span>
            </div>
          </div>

          {/* Formulario de Acceso / Registro (Derecha en desktop) */}
          <div className="lg:col-span-5 bg-[#FAF9F5] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md bg-white border border-[#EBEAE4] rounded-2xl p-8 shadow-xs"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-[#1E1E1C]">
                  {authMode === 'login' ? 'Ingresar a CentAnt' : 'Crear Cuenta Gratis'}
                </h2>
                <p className="text-xs text-[#8A887C] mt-2">
                  {authMode === 'login' 
                    ? 'Accede con tu número de teléfono de Latinoamérica.' 
                    : 'Regístrate solo con tu teléfono para empezar a optimizar tus finanzas.'}
                </p>
              </div>

              {authError && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* Nombre (Solo en registro) */}
                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#615F55] block">Tu Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A193]" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Carlos Mendoza"
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221]"
                      />
                    </div>
                  </div>
                )}

                {/* Teléfono con selector de código de país de LATAM */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#615F55] block">Número de Teléfono (LATAM)</label>
                  
                  <div className="flex gap-2">
                    {/* Selector de país */}
                    <div className="relative w-24 flex-shrink-0">
                      <select
                        value={authForm.phoneCountryCode}
                        onChange={(e) => setAuthForm({ ...authForm, phoneCountryCode: e.target.value })}
                        className="w-full pl-2 pr-6 py-2.5 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221] appearance-none cursor-pointer font-medium"
                      >
                        {LATAM_COUNTRIES.map((country) => (
                          <option key={`${country.name}-${country.code}`} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                        <ChevronDown className="h-3.5 w-3.5 text-[#8A887C]" />
                      </div>
                    </div>

                    {/* Campo de número */}
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A193]" />
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 3004567890"
                        value={authForm.phoneNumber}
                        onChange={(e) => setAuthForm({ ...authForm, phoneNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221] font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1A1A18] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#2F2F2C] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {authMode === 'login' ? 'Entrar al Tablero' : 'Crear mi Cuenta de Socio'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Enlace para cambiar de modo */}
              <div className="mt-6 border-t border-[#F1F0EB] pt-6 text-center text-xs">
                <span className="text-[#8A887C]">
                  {authMode === 'login' ? '¿No tienes cuenta registrada?' : '¿Ya tienes una cuenta?'}
                </span>{' '}
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError(null);
                  }}
                  className="font-bold text-[#1A1A18] underline hover:text-[#525046] ml-1 cursor-pointer"
                >
                  {authMode === 'login' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      ) : (
        /* PORTAL DE SEGUIMIENTO FINANCIERO (Autenticado) */
        <div className="flex-1 flex flex-col w-full">
          
          {/* Cabecera Principal */}
          <header className="border-b border-[#EBEAE4] bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-3xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold font-display text-white text-md">
                🐜
              </div>
              <div>
                <h1 className="text-md sm:text-lg font-display font-bold text-[#1A1A18] tracking-tight flex items-center gap-1.5">
                  CentAnt <span className="font-sans text-xs font-normal text-[#8A887C] ml-1 sm:inline hidden">• SaaS Gastos Hormiga / Ant Tracker</span>
                </h1>
                <p className="text-[10px] text-[#8A887C] font-semibold sm:block hidden">
                  Monitoreo de ingresos, gastos fijos y control de fugas de dinero (Gastos Hormiga)
                </p>
              </div>
            </div>

            {/* Perfil del Usuario & Desconexión */}
            <div className="flex items-center gap-3">
              {/* PWA Mobile Preview Simulator Toggle */}
              <div className="hidden md:flex items-center">
                <button
                  onClick={() => {
                    setIsMobileSimulated(!isMobileSimulated);
                    triggerMessage(
                      !isMobileSimulated 
                        ? '📱 ¡Simulador PWA activado! Estás viendo la app optimizada para celulares.'
                        : '🖥️ ¡Modo escritorio activado! Estás viendo el panel completo side-by-side.',
                      'info'
                    );
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isMobileSimulated 
                      ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 shadow-3xs' 
                      : 'bg-[#FAF9F5] hover:bg-[#F3F2EC] text-[#615F55] border-[#EBEAE4]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {isMobileSimulated ? '📱 Vista Celular PWA' : '🖥️ Vista Escritorio'}
                </button>
              </div>

              <button
                onClick={handleOpenProfile}
                title="Editar perfil y moneda de preferencia"
                className="bg-[#FAF9F5] border border-[#EBEAE4] hover:bg-[#F3F2EC] hover:border-[#C0BEAE] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs transition-all cursor-pointer group text-left"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px] uppercase group-hover:bg-emerald-200">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#3E3C34] max-w-[120px] truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <Settings className="w-3 h-3 text-[#A3A193] group-hover:text-[#615F55] transition-colors" />
                  </div>
                  <span className="text-[9px] text-[#8A887C] font-mono leading-none mt-0.5">
                    {currentUser.phoneCountryCode} {currentUser.phoneNumber} ({getUserCurrency()})
                  </span>
                </div>
              </button>
              
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="p-2 border border-[#EBEAE4] hover:border-rose-200 text-[#615F55] hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Barra de Navegación Móvil (Estilo PWA Nativa) */}
          {isMobileView && !isMobileSimulated && (
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EBEAE4] py-2 px-6 flex justify-around items-center z-30 shadow-lg">
              <button
                onClick={() => setMobileTab('summary')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  mobileTab === 'summary' ? 'text-amber-600 font-bold' : 'text-[#8A887C] hover:text-[#1E1E1C]'
                }`}
              >
                <PiggyBank className="w-5 h-5" />
                <span className="text-[10px] tracking-wider uppercase">Resumen</span>
              </button>
              
              <button
                onClick={() => setMobileTab('register')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  mobileTab === 'register' ? 'text-emerald-600 font-bold' : 'text-[#8A887C] hover:text-[#1E1E1C]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center -mt-6 shadow-md border transition-all ${
                  mobileTab === 'register' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-[#FAF9F5] text-[#615F55] border-[#EBEAE4]'
                }`}>
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-wider uppercase">Registrar</span>
              </button>
              
              <button
                onClick={() => setMobileTab('history')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  mobileTab === 'history' ? 'text-amber-600 font-bold' : 'text-[#8A887C] hover:text-[#1E1E1C]'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="text-[10px] tracking-wider uppercase">Historial</span>
              </button>
            </div>
          )}

          {/* Declaración del Contenido del Tablero */}
          {(() => {
            const appContent = (
              <>
            
            {/* Fila de Tarjetas de Métricas Principales */}
            <section className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${mobileTab === 'summary' ? 'grid' : 'hidden md:grid'}`}>
              
              {/* Ingresos Totales */}
              <div className="bg-white border border-[#E9E8E1] rounded-2xl p-4 sm:p-5 shadow-3xs flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-[#8A887C] uppercase tracking-wider">Ingresos del Mes</span>
                  <div className="p-1.5 rounded-lg bg-[#EBF7F2] text-[#1D7A50] border border-[#C3ECD8]">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#1E1E1C] tracking-tight">
                    {formatMoney(totalIncome)}
                  </h3>
                  <p className="text-[10px] text-[#8A887C] font-semibold mt-1">
                    Sueldos y trabajos extras
                  </p>
                </div>
              </div>

              {/* Gastos Fijos */}
              <div className="bg-white border border-[#E9E8E1] rounded-2xl p-4 sm:p-5 shadow-3xs flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-[#8A887C] uppercase tracking-wider">Gastos Fijos</span>
                  <div className="p-1.5 rounded-lg bg-[#F5F4EE] text-[#615F55] border border-[#E5E3D8]">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#1E1E1C] tracking-tight">
                    {formatMoney(totalRegularExpenses)}
                  </h3>
                  <p className="text-[10px] text-[#8A887C] font-semibold mt-1">
                    Servicios, alquiler y responsabilidades
                  </p>
                </div>
              </div>

              {/* Gastos Hormiga */}
              <div className="bg-white border border-[#E9E8E1] rounded-2xl p-4 sm:p-5 shadow-3xs flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -bottom-2 -right-2 w-16 h-16 text-amber-500/10 pointer-events-none transform rotate-12 transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="50" cy="72" rx="14" ry="18" className="fill-amber-500/5" />
                    <ellipse cx="50" cy="46" rx="10" ry="12" className="fill-amber-500/10" />
                    <circle cx="50" cy="24" r="8" className="fill-amber-500/25" />
                    <path d="M40 50 Q25 58 15 70" />
                    <path d="M60 50 Q75 58 85 70" />
                    <path d="M40 46 H20" />
                    <path d="M60 46 H80" />
                    <path d="M40 42 Q25 34 15 22" />
                    <path d="M60 42 Q75 34 85 22" />
                    <path d="M46 17 Q40 5 30 8" />
                    <path d="M54 17 Q60 5 70 8" />
                  </svg>
                </div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-[10px] font-bold text-[#8A887C] uppercase tracking-wider text-amber-800">Gastos Hormiga</span>
                  <div className="p-1.5 rounded-lg bg-[#FDF6E2] text-[#B25E00] border border-[#FBE3B5] flex items-center justify-center w-7 h-7">
                    <span className="text-xs">🐜</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-amber-700 tracking-tight">
                    {formatMoney(totalMicroExpenses)}
                  </h3>
                  <p className="text-[10px] text-amber-800/80 font-bold mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Fugas pequeñas acumuladas
                  </p>
                </div>
              </div>

              {/* Balance Restante */}
              <div className={`border rounded-2xl p-4 sm:p-5 shadow-3xs flex flex-col justify-between transition-all ${
                netSavings >= 0 
                  ? 'bg-[#F2FDF8] border-emerald-200' 
                  : 'bg-rose-50/50 border-rose-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-[#8A887C] uppercase tracking-wider">Ahorro Neto Real</span>
                  <div className={`p-1.5 rounded-lg border ${
                    netSavings >= 0 
                      ? 'bg-[#E1F9ED] text-[#1D7A50] border-[#A8EFC9]' 
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}>
                    <PiggyBank className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl font-display font-bold tracking-tight ${
                    netSavings >= 0 ? 'text-[#117C43]' : 'text-rose-700'
                  }`}>
                    {formatMoney(netSavings)}
                  </h3>
                  <p className="text-[10px] text-[#8A887C] font-semibold mt-1">
                    {netSavings >= 0 ? '¡Felicidades, vas ganando!' : 'Estás al límite. ¡A ajustar fugas!'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsBalanceModalOpen(true);
                    setSelectedChallenge(null); // Reset choice
                  }}
                  className="mt-3.5 w-full py-2 bg-[#1E1E1C] hover:bg-[#3E3C38] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs group cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                  Ver Balance del Mes ✨
                </button>
              </div>

            </section>

            {/* MÓDULO INTEGRADO: Control de Gasto Diario, Retos y Diagnóstico Corto (SaaS Senior) */}
            <section className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${mobileTab === 'summary' ? 'grid' : 'hidden md:grid'}`}>
              
              {/* Tarjeta 1: Control de tu Día (Gasto Diario) */}
              <div className="md:col-span-7 bg-white border border-[#E9E8E1] rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3F2EC] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider">Control de tu Día</h4>
                        <p className="text-[9px] text-[#8A887C] font-semibold">Tus consumos de hoy desglosados en un solo lugar</p>
                      </div>
                    </div>
                    {/* Input de Meta de Gasto Diario en línea */}
                    <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#ECEBE4] rounded-xl px-2.5 py-1">
                      <span className="text-[9px] font-bold text-[#615F55] uppercase">Meta Diaria:</span>
                      <span className="text-xs font-bold text-[#8A887C] font-mono">{getUserCurrency()}</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={dailyExpenseBudget}
                        onChange={(e) => handleUpdateDailyBudget(parseFloat(e.target.value) || 0)}
                        className="w-18 text-xs font-mono font-extrabold text-[#1E1E1C] focus:outline-none bg-transparent text-right cursor-pointer"
                        title="Haz clic para cambiar tu meta de gasto diario"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-[#FAF9F5] border border-[#ECEBE4] p-3 rounded-xl">
                      <span className="text-[9px] font-bold text-[#8A887C] uppercase block">Gasto Hormiga Hoy</span>
                      <span className="text-sm font-display font-bold text-amber-700 block mt-0.5">
                        {formatMoney(todayMicroExpenses)}
                      </span>
                    </div>
                    <div className="bg-[#FAF9F5] border border-[#ECEBE4] p-3 rounded-xl">
                      <span className="text-[9px] font-bold text-[#8A887C] uppercase block">Gasto Fijo Hoy</span>
                      <span className="text-sm font-display font-bold text-[#3E3C34] block mt-0.5">
                        {formatMoney(todayRegularExpenses)}
                      </span>
                    </div>
                    <div className="bg-[#FAF9F5] border border-[#E9E8E1] p-3 rounded-xl">
                      <span className="text-[9px] font-bold text-[#8A887C] uppercase block">Total Gastado Hoy</span>
                      <span className="text-sm font-display font-extrabold text-[#1E1E1C] block mt-0.5">
                        {formatMoney(todayTotalExpenses)}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progreso de Hoy */}
                  <div className="space-y-1.5 mb-3.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-[#615F55]">Progreso de tu presupuesto diario</span>
                      <span className="font-mono font-bold text-[#1E1E1C]">
                        {dailyExpenseBudget > 0 ? Math.round((todayTotalExpenses / dailyExpenseBudget) * 100) : 0}% consumido
                      </span>
                    </div>
                    <div className="w-full bg-[#EFECE3] h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          todayTotalExpenses === 0 ? 'bg-emerald-500' :
                          (todayTotalExpenses / dailyExpenseBudget) <= 0.7 ? 'bg-emerald-500' :
                          (todayTotalExpenses / dailyExpenseBudget) <= 1.0 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(dailyExpenseBudget > 0 ? (todayTotalExpenses / dailyExpenseBudget) * 100 : 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mensaje de Ánimo Dinámico */}
                <div className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed ${
                  todayTotalExpenses === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : todayTotalExpenses <= dailyExpenseBudget
                    ? 'bg-green-50/50 border-green-200 text-green-800'
                    : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}>
                  {todayTotalExpenses === 0 ? (
                    <span>🛡️ ¡Vas de forma extraordinaria hoy! Gasto en cero absoluto. ¡Tu escudo financiero está al 100%!</span>
                  ) : todayTotalExpenses <= dailyExpenseBudget ? (
                    <span>🚀 ¡Excelente disciplina! Te quedan {formatMoney(Math.max(dailyExpenseBudget - todayTotalExpenses, 0))} libres para gastar hoy. ¡Sigue controlando tus antojos y vas por más!</span>
                  ) : (
                    <span>💡 ¡No pasa nada! Mañana es un nuevo día con un presupuesto fresco. Recuerda: cada pequeño antojo evitado suma a tu futuro. ¡Tú puedes lograrlo mañana!</span>
                  )}
                </div>
              </div>

              {/* Tarjeta 2: Diagnóstico AI Corto y Retos del Día */}
              <div className="md:col-span-5 bg-[#FAF9F5] border border-[#E9E8E1] rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="border-b border-[#EBEAE4] pb-3 mb-4">
                    <h4 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Diagnóstico de Fuga Corto
                    </h4>
                    <p className="text-[9px] text-[#8A887C] font-semibold">Tus hábitos de gasto analizados con optimismo</p>
                  </div>

                  <div className="space-y-3.5 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="text-2xl font-display font-extrabold text-[#1E1E1C]">
                        {leakRatio.toFixed(1)}%
                      </div>
                      <span className="text-[10px] text-[#615F55] font-medium leading-tight">
                        de tu dinero se va en compras hormiga silenciosas.
                      </span>
                    </div>

                    <div className="text-xs text-[#3E3C34] leading-relaxed">
                      {leakRatio < 15 ? (
                        <span>🏆 <strong>¡Eres un ahorrador brillante!</strong> Controlas las fugas de forma sobresaliente. Tu disciplina protege tu futuro y nos motiva a seguir por más.</span>
                      ) : leakRatio < 30 ? (
                        <span>🌱 <strong>¡Buen camino, pero hay más por ganar!</strong> El goteo hormiga es moderado. Con solo preparar café en casa y evitar un delivery semanal, liberarás mucho ahorro.</span>
                      ) : (
                        <span>🔥 <strong>¡Hora del gran cambio!</strong> Más del 30% se escapa en pequeños gastos de impulso. No te preocupes, comienza hoy fijando tu meta diaria y verás el cambio rápido.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sección de Retos Diarios */}
                <div className="bg-white border border-[#EBEAE4] p-3.5 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      Reto de Hoy 🐜
                    </span>
                    <span className="text-[10px] text-[#8A887C] font-semibold">Ant-Fugas</span>
                  </div>
                  <p className="text-xs text-[#1E1E1C] font-bold leading-normal">
                    ¿Aceptas el reto de completar el día sin compras hormiga hoy?
                  </p>

                  {!challengeAccepted ? (
                    <button
                      onClick={handleAcceptChallenge}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      ¡Aceptar Reto Diario!
                    </button>
                  ) : (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] rounded-xl font-bold flex flex-col items-center justify-center text-center gap-1">
                      <span className="flex items-center gap-1">🏆 ¡Reto del Día Activo!</span>
                      {todayMicroExpenses === 0 ? (
                        <span className="text-emerald-700 font-medium">🔥 ¡Vas ganando el reto con $0 de gasto hormiga! ¡Excelente!</span>
                      ) : (
                        <span className="text-[#8A887C] font-normal leading-normal">Registraste {formatMoney(todayMicroExpenses)} hoy de gasto hormiga. ¡Sigue practicando para mañana vencerlo!</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </section>

            {/* Escritorio Central del SaaS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Columna Izquierda: Formulario para añadir transacciones (cols-4) */}
              <div className={`lg:col-span-4 flex flex-col gap-6 ${mobileTab === 'register' ? 'flex' : 'hidden lg:flex'}`}>
                
                {/* Panel de Registro Rápido (SaaS Senior - PWA) */}
                <div className="bg-[#1E1E1C] text-white rounded-2xl p-4 border border-[#2D2D2A] shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">⚡</span>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ant-Log: Registro Un-Toque</h4>
                      <p className="text-[9px] text-[#A2A094] font-medium">Pulsa para registrar un gasto hormiga común al instante</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: 'Café al paso ☕', desc: 'Café en la calle', usd: 1.5, cat: 'Cafecito / Té en la calle' },
                      { label: 'Snack/Tienda 🍿', desc: 'Snack o antojo rápido', usd: 1.2, cat: 'Snacks, Antojos y Gaseosas' },
                      { label: 'Delivery/Antojo 🍔', desc: 'Comida a domicilio', usd: 8.0, cat: 'Comida a domicilio (UberEats, Rappi)' },
                      { label: 'Taxi Corto 🚖', desc: 'Uber o taxi corto', usd: 4.0, cat: 'Uber / Cabify cortos (por pereza)' },
                      { label: 'Cerveza/Trago 🍻', desc: 'Cervezas o alcohol', usd: 3.5, cat: 'Cervezas, Alcohol o Cigarros' },
                      { label: 'Antojo Dulce 🍭', desc: 'Golosinas o dulces', usd: 0.8, cat: 'Otros antojos del día' }
                    ].map((preset, index) => {
                      const finalAmount = getPresetAmount(preset.usd);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleQuickAdd({ description: preset.desc, baseUsd: preset.usd, category: preset.cat })}
                          className="p-2.5 bg-[#2E2C28] hover:bg-[#3E3C38] active:scale-95 border border-[#3E3C38] rounded-xl text-left transition-all duration-150 cursor-pointer flex flex-col justify-between h-18 group"
                        >
                          <span className="text-[10px] font-bold text-white leading-tight block truncate group-hover:text-amber-400">
                            {preset.label}
                          </span>
                          <div>
                            <span className="text-xs font-mono font-extrabold text-amber-400 block mt-1">
                              {formatMoney(finalAmount)}
                            </span>
                            <span className="text-[8px] text-[#8A887C] block truncate leading-none">
                              {preset.cat}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-white border border-[#E9E8E1] rounded-2xl p-5 shadow-3xs">
                  <div className="flex items-center justify-between border-b border-[#F3F2EC] pb-3 mb-4">
                    <h3 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-emerald-600" />
                      Registrar Transacción
                    </h3>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold font-mono">
                      Seguro
                    </span>
                  </div>

                  <form onSubmit={handleLogTransaction} className="space-y-4">
                    {/* Selector de Tipo de Operación */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#615F55]">Tipo de Operación</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFormType('micro')}
                          className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all text-center cursor-pointer ${
                            formType === 'micro'
                              ? 'bg-amber-500 border-amber-600 text-white shadow-xs font-bold'
                              : 'bg-[#FAF9F5] border-[#ECEBE4] text-[#615F55] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          ⚡ Hormiga
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormType('expense')}
                          className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all text-center cursor-pointer ${
                            formType === 'expense'
                              ? 'bg-[#1A1A18] border-[#1A1A18] text-white shadow-xs font-bold'
                              : 'bg-[#FAF9F5] border-[#ECEBE4] text-[#615F55] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          📦 Fijo
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormType('income')}
                          className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all text-center cursor-pointer ${
                            formType === 'income'
                              ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs font-bold'
                              : 'bg-[#FAF9F5] border-[#ECEBE4] text-[#615F55] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          💼 Ingreso
                        </button>
                      </div>
                      
                      {/* Nota aclaratoria rápida en español */}
                      <span className="text-[9px] text-[#8A887C] block mt-1 leading-normal italic">
                        {formType === 'micro' && "🎯 Pequeños caprichos: Cafés, refrescos de tiendita, delivery de comida, apps o taxis innecesarios."}
                        {formType === 'expense' && "🏠 Gastos necesarios y recurrentes: Alquiler de vivienda, servicios públicos, cursos o deudas fijos."}
                        {formType === 'income' && "💵 Entradas de dinero: Tu salario principal, bonos, cobros por consultorías o ventas extras."}
                      </span>
                    </div>

                    {/* Campo de Monto */}
                    <div className="space-y-1">
                      <label htmlFor="form-amount" className="text-xs font-bold text-[#615F55] block">Monto total ({getUserCurrency()})</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#A3A193]">
                          {getUserCurrency()}
                        </span>
                        <input
                          id="form-amount"
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          placeholder="0.00"
                          value={formAmount}
                          onChange={(e) => setFormAmount(e.target.value)}
                          className="w-full pl-14 pr-4 py-2 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221] font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* Nota o Detalle */}
                    <div className="space-y-1">
                      <label htmlFor="form-description" className="text-xs font-bold text-[#615F55] flex items-center justify-between">
                        <span>Memo / Nota sobre la compra</span>
                        <span className="text-[9px] text-[#A3A193] font-normal">Sugerirá categoría al escribir</span>
                      </label>
                      <input
                        id="form-description"
                        type="text"
                        placeholder={
                          formType === 'micro' ? 'Ej. Latte Starbucks mediano con galleta' :
                          formType === 'expense' ? 'Ej. Pago mensual de agua y alcantarillado' :
                          'Ej. Pago de proyecto freelance'
                        }
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221]"
                      />
                    </div>

                    {/* Categoría Dinámica */}
                    <div className="space-y-1">
                      <label htmlFor="form-category" className="text-xs font-bold text-[#615F55] block">Categoría de Clasificación</label>
                      <select
                        id="form-category"
                        value={formCategory}
                        onChange={(e) => {
                          setFormCategory(e.target.value);
                          setHasManuallySelected(true);
                          setIsAutoClassified(false);
                        }}
                        className={`w-full px-3 py-2 border rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none transition-all text-[#222221] font-medium cursor-pointer ${
                          isAutoClassified 
                            ? 'border-amber-400 bg-amber-50/10 focus:border-amber-500' 
                            : 'border-[#ECEBE4] focus:border-[#C0BEAE]'
                        }`}
                      >
                        {CATEGORIES[formType].map(cat => (
                          <option key={cat} value={cat}>
                            {CATEGORY_ICONS[cat] || '📦'} {cat}
                          </option>
                        ))}
                      </select>
                      {isAutoClassified && (
                        <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold w-fit mt-1.5 border ${
                          formType === 'micro'
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : formType === 'expense'
                            ? 'text-[#222221] bg-[#FAF9F6] border-[#ECEBE4]'
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        }`}>
                          <span>✨ Categoría autodetectada por nota</span>
                        </div>
                      )}
                    </div>

                    {/* Fecha */}
                    <div className="space-y-1">
                      <label htmlFor="form-date" className="text-xs font-bold text-[#615F55] block">Fecha de Registro</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A193]" />
                        <input
                          id="form-date"
                          type="date"
                          required
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221] font-mono"
                        />
                      </div>
                    </div>

                    {/* Botón de envío dinámico */}
                    <button
                      type="submit"
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        formType === 'micro'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs font-bold'
                          : formType === 'expense'
                          ? 'bg-[#1A1A18] hover:bg-[#2F2F2C] text-white shadow-xs font-bold'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-bold'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Registrar Transacción
                    </button>

                  </form>
                </div>

              </div>

              {/* Columna Derecha: Reporte detallado de fugas y Coach AI + Historial (cols-8) */}
              <div className={`lg:col-span-8 flex flex-col gap-6 ${mobileTab === 'history' ? 'flex' : 'hidden lg:flex'}`}>
                
                {/* Desglose de Gastos Hormiga por Categoría */}
                {microBreakdown.length > 0 && (
                  <div className="bg-white border border-[#E9E8E1] rounded-2xl p-5 shadow-3xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBEAE4] pb-4 mb-4">
                      <div>
                        <h3 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1.5">
                          <PieChart className="w-4 h-4 text-amber-500" />
                          Análisis de Dónde se Pierde tu Dinero (Gastos Hormiga)
                        </h3>
                        <p className="text-[10px] text-[#8A887C] font-semibold mt-0.5">
                          Desglose detallado de las fugas silenciosas de capital
                        </p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-left sm:text-right">
                        <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Fuga Total Registrada</span>
                        <span className="text-base font-display font-bold text-amber-700 block leading-tight">
                          {formatMoney(totalMicroExpenses)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {microBreakdown.map((item, idx) => {
                        const pct = (item.value / totalMicroExpenses) * 100;
                        return (
                          <div key={item.name} className="space-y-1.5">
                            <div className="flex justify-between items-end text-xs">
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#3E3C34] flex items-center gap-1.5">
                                  <span className="text-md leading-none">{CATEGORY_ICONS[item.name]}</span>
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-[#8A887C] ml-6 mt-0.5 font-medium">
                                  {item.count} {item.count === 1 ? 'gasto registrado' : 'gastos registrados'}
                                </span>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <span className="font-mono text-[#1E1E1C] font-extrabold text-sm">
                                  {formatMoney(item.value)}
                                </span>
                                <span className="text-[#8A887C] font-semibold text-[10px] leading-none mt-0.5">
                                  {pct.toFixed(1)}% del total
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-[#FAF9F5] border border-[#ECEBE4] h-2.5 rounded-full overflow-hidden">
                              <motion.div 
                                className="bg-amber-500 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tabla de Historial Ledger de Transacciones */}
                <div className="bg-white border border-[#E9E8E1] rounded-2xl p-5 shadow-3xs flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#F3F2EC] pb-3 mb-4 gap-2">
                      <h3 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#8A887C]" />
                        Historial de Transacciones
                      </h3>

                      {/* Filtros rápidos interactivos */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Filtro de Tiempo */}
                        <div className="flex rounded-lg bg-[#FAF9F5] border border-[#ECEBE4] p-0.5">
                          <button
                            onClick={() => setTimeFilter('all')}
                            className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                              timeFilter === 'all' ? 'bg-[#1E1E1C] text-white shadow-2xs' : 'text-[#615F55]'
                            }`}
                          >
                            Todo
                          </button>
                          <button
                            onClick={() => setTimeFilter('7days')}
                            className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                              timeFilter === '7days' ? 'bg-[#1E1E1C] text-white shadow-2xs' : 'text-[#615F55]'
                            }`}
                          >
                            7 Días
                          </button>
                          <button
                            onClick={() => setTimeFilter('30days')}
                            className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                              timeFilter === '30days' ? 'bg-[#1E1E1C] text-white shadow-2xs' : 'text-[#615F55]'
                            }`}
                          >
                            Mes
                          </button>
                        </div>

                        {/* Filtro de Categoría */}
                        <div className="relative">
                          <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-[#FAF9F5] border border-[#ECEBE4] rounded-lg px-2 py-1 text-[10px] font-semibold text-[#615F55] focus:outline-none cursor-pointer"
                          >
                            <option value="all">Ver Categorías</option>
                            {allUsedCategories.map(cat => (
                              <option key={`filter-${cat}`} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Tabla de registros */}
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-xs text-[#8A887C] italic">
                          No se encontraron transacciones registradas que coincidan con los filtros actuales.
                        </p>
                      </div>
                    ) : (() => {
                      const displayedTransactions = filteredTransactions.slice(0, visibleTransactionsCount);
                      return (
                        <div className="space-y-4">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#F3F2EC] text-[10px] font-bold text-[#8A887C] uppercase tracking-wider">
                                  <th className="py-2.5">Detalle / Memo</th>
                                  <th className="py-2.5">Clasificación</th>
                                  <th className="py-2.5">Fecha</th>
                                  <th className="py-2.5 text-right">Monto ({getUserCurrency()})</th>
                                  <th className="py-2.5 text-right">Acción</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F9F8F3] text-xs">
                                {displayedTransactions.map((tx) => (
                                  <tr 
                                    key={tx.id} 
                                    onClick={() => setSelectedTransactionForDetail(tx)}
                                    className="hover:bg-[#FAF9F6] active:bg-[#FAF9F6]/80 transition-all group cursor-pointer"
                                    title="Haz clic para ver detalles y consejos"
                                  >
                                    <td className="py-3 pr-2">
                                      <div className="font-semibold text-[#1E1E1C] flex items-center gap-1.5">
                                        <span className="text-sm">{CATEGORY_ICONS[tx.category] || '📦'}</span>
                                        <span>{tx.description}</span>
                                      </div>
                                    </td>
                                    <td className="py-3">
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                        tx.type === 'micro' 
                                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                          : tx.type === 'expense'
                                          ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      }`}>
                                        {tx.type === 'micro' ? 'Gastos Hormiga' : tx.type === 'expense' ? 'Gasto Fijo' : 'Ingreso'}
                                      </span>
                                    </td>
                                    <td className="py-3 text-[#615F55] font-mono text-[11px]">
                                      {tx.date}
                                    </td>
                                    <td className={`py-3 text-right font-mono font-bold ${
                                      tx.type === 'income' ? 'text-emerald-700' : tx.type === 'micro' ? 'text-amber-700' : 'text-[#1E1E1C]'
                                    }`}>
                                      {tx.type === 'income' ? '+' : '-'}{getUserCurrency()}{tx.amount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 text-right">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteTransaction(tx.id);
                                        }}
                                        title="Eliminar registro"
                                        className="p-1 text-[#A3A193] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer inline-flex items-center justify-center"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {filteredTransactions.length > 5 && (
                            <div className="flex justify-center pt-2.5 border-t border-[#F1F0EB]">
                              <button
                                type="button"
                                onClick={() => {
                                  if (visibleTransactionsCount === 5) {
                                    setVisibleTransactionsCount(filteredTransactions.length);
                                  } else {
                                    setVisibleTransactionsCount(5);
                                  }
                                }}
                                className="px-3.5 py-1.5 bg-[#FAF9F5] hover:bg-[#F3F2EC] active:scale-95 text-[#1E1E1C] border border-[#ECEBE4] text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-3xs"
                              >
                                {visibleTransactionsCount === 5 ? (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#8A887C]" />
                                    Mostrar todo el historial ({filteredTransactions.length})
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#8A887C] rotate-180" />
                                    Contraer historial (ver solo 5)
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Pie de página interactivo del Historial */}
                  <div className="mt-4 border-t border-[#F1F0EB] pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#8A887C] gap-2 font-mono">
                    <span>Mostrando {Math.min(filteredTransactions.length, visibleTransactionsCount)} de {filteredTransactions.length} transacciones</span>
                    <span>SaaS Lite en ejecución de Sandbox Local</span>
                  </div>
                </div>

              </div>

            </div>

              </>
            );

            return !isMobileViewport && isMobileSimulated ? (
              <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center min-h-[calc(100vh-80px)]">
                
                {/* Columna Izquierda: Panel Educativo e Instructivo PWA */}
                <div className="lg:col-span-5 space-y-5 text-left bg-white border border-[#EBEAE4] p-6 rounded-2xl shadow-3xs self-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider">Simulador Móvil PWA</h3>
                      <p className="text-[10px] text-[#8A887C] font-semibold">Testea el rediseño para celulares desde tu laptop</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs text-[#615F55] leading-relaxed">
                    <p>
                      ¡Esta es la <strong>vista del celular simulada en vivo</strong>! Hemos diseñado CentAnt como una Progressive Web App (PWA) de nivel premium, optimizada para facilitar el registro de microgastos cotidianos:
                    </p>
                    
                    <div className="bg-[#FAF9F5] border border-[#EBEAE4] p-4 rounded-xl space-y-3">
                      <h4 className="font-bold text-xs text-[#1E1E1C] flex items-center gap-1.5">
                        <span className="text-[#1D7A50]">✓</span> Ventajas del Enfoque PWA Móvil:
                      </h4>
                      <ul className="space-y-2 text-[11px] list-disc pl-4 text-[#525046]">
                        <li>
                          <strong>Ant-Log (Registro Un-Toque):</strong> Un teclado rápido con presets para registrar un café, golosina o taxi al instante, sin digitar montos y escalado a tu moneda local. (¡Pruébalo en la pestaña <strong>Registrar</strong>!)
                        </li>
                        <li>
                          <strong>Navegación Móvil Nativa:</strong> Barra de pestañas táctil inferior para navegar cómodamente con una sola mano.
                        </li>
                        <li>
                          <strong>Instalable:</strong> Puedes instalar esta app en tu pantalla de inicio como una app nativa para tenerla a un toque.
                        </li>
                      </ul>
                    </div>

                    <p className="text-[11px] italic text-[#8A887C]">
                      👇 <strong>Interactúa con el smartphone:</strong> Presiona las pestañas y experimenta la velocidad del registro un-toque.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setIsMobileSimulated(false)}
                        className="flex-1 py-2.5 bg-[#1E1E1C] hover:bg-[#3E3C38] active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs text-center"
                      >
                        Volver a Escritorio Completo 🖥️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: El Teléfono Físico Mockup */}
                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-[365px] h-[750px] bg-[#FAF9F5] rounded-[48px] border-[12px] border-[#1E1E1C] shadow-2xl relative flex flex-col overflow-hidden select-none">
                    
                    {/* Notch / Bocina de Smartphone */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5.5 bg-[#1E1E1C] rounded-b-2xl z-50 flex items-center justify-center gap-1">
                      <div className="w-8 h-1 bg-neutral-800 rounded-full" />
                      <div className="w-2 h-2 bg-neutral-900 rounded-full border border-neutral-800" />
                    </div>

                    {/* Pantalla Simulada con Scroll Propio */}
                    <div className="flex-1 overflow-y-auto pt-6 pb-16 relative flex flex-col bg-[#FAF9F5]">
                      
                      {/* Cabecera Móvil interna */}
                      <div className="bg-white border-b border-[#F3F2EC] py-2.5 px-4 flex items-center justify-between sticky top-0 z-20 shadow-3xs">
                        <div className="flex items-center gap-2">
                          <span className="text-md">🐜</span>
                          <span className="font-display font-black text-xs text-[#1A1A18] tracking-tight">CentAnt PWA</span>
                        </div>
                        <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {getUserCurrency()}
                        </div>
                      </div>

                      {/* Contenido Real de la App */}
                      <div className="p-3 space-y-4">
                        {appContent}
                      </div>

                      {/* Barra de pestañas simulada dentro del celular */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EBEAE4] py-2 px-4 flex justify-around items-center z-30 shadow-md">
                        <button
                          onClick={() => setMobileTab('summary')}
                          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
                            mobileTab === 'summary' ? 'text-amber-600 font-bold' : 'text-[#8A887C] hover:text-[#1E1E1C]'
                          }`}
                        >
                          <PiggyBank className="w-4.5 h-4.5" />
                          <span className="text-[9px] tracking-wider uppercase">Resumen</span>
                        </button>
                        
                        <button
                          onClick={() => setMobileTab('register')}
                          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
                            mobileTab === 'register' ? 'text-emerald-600 font-bold' : 'text-[#8A887C]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center -mt-5 shadow border transition-all ${
                            mobileTab === 'register' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-[#FAF9F5] text-[#615F55] border-[#EBEAE4]'
                          }`}>
                            <Plus className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[9px] tracking-wider uppercase">Registrar</span>
                        </button>
                        
                        <button
                          onClick={() => setMobileTab('history')}
                          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
                            mobileTab === 'history' ? 'text-amber-600 font-bold' : 'text-[#8A887C] hover:text-[#1E1E1C]'
                          }`}
                        >
                          <Clock className="w-4.5 h-4.5" />
                          <span className="text-[9px] tracking-wider uppercase">Historial</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Vista Móvil Directa o Escritorio Completo */
              <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
                {appContent}
              </main>
            );
          })()}
        </div>
      )}

      {/* Footer de marca para toda la aplicación */}
      <footer className="bg-white border-t border-[#EBEAE4] py-8 px-6 text-center mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8A887C]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E1E1C]">CentAnt</span>
            <span>•</span>
            <span>Tu Blindaje Contra las Microfugas</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Diseñado con Ingeniería de Software Profesional</span>
            <span>•</span>
            <span>Versión 1.1 (SaaS de Bajo Volumen)</span>
          </div>
        </div>
      </footer>

      {/* Modal de Configuración de Perfil y Moneda */}
      <AnimatePresence>
        {selectedTransactionForDetail && (() => {
          const tx = selectedTransactionForDetail;
          
          // Helper for behavioral tip
          const getBehavioralTip = (category: string, type: string) => {
            if (type === 'income') {
              return {
                title: '💰 Págate a ti primero',
                text: '¡Excelente ingreso! Antes de planear cualquier compra, separa un 10% de esta suma directo al "Cushion" o fondo de tranquilidad. Crear el hábito de ahorrar automáticamente protege tu futuro sin esfuerzo.',
                badge: 'Ingreso Estratégico',
                badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
              };
            }
            if (type === 'expense') {
              return {
                title: '🏠 Optimización de Línea Base',
                text: 'Los gastos fijos estructuran tu vida diaria. Considera revisar anualmente tus contratos de internet, planes móviles o suscripciones fijas para buscar mejores ofertas. ¡A veces una llamada te ahorra cientos al año!',
                badge: 'Línea de Vida Fija',
                badgeColor: 'text-zinc-700 bg-zinc-50 border-zinc-200'
              };
            }
            
            // For Gastos Hormiga ('micro')
            switch (category) {
              case 'Cafecito / Té en la calle':
                return {
                  title: '☕ El Termo con Orgullo',
                  text: 'Ese café casual se siente genial, pero sumado a la semana equivale a una cena premium o inversión. Al llevar tu propio café premium de casa, reduces el goteo un 90%. ¡Prueba nuestro "Reto Termo con Orgullo" esta semana!',
                  badge: 'Gasto Hormiga Líquido',
                  badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
                };
              case 'Snacks, Antojos y Gaseosas':
              case 'Otros antojos del día':
                return {
                  title: '🍬 El Antojo Planificado',
                  text: 'Los antojos rápidos se nutren de la fatiga o el aburrimiento. Intenta comprar snacks en paquete grande en el supermercado y llevarlos contigo en lugar de comprarlos individualmente en la tienda del barrio a un precio triple.',
                  badge: 'Fuga de Impulso',
                  badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
                };
              case 'Comida a domicilio (UberEats, Rappi)':
                return {
                  title: '🍕 El Silencio de Delivery',
                  text: 'El recargo de envío, propinas y margen de precio de las apps hacen de este uno de los mayores destructores de ahorros. Cocinar platos sencillos con lo que tienes en casa de lunes a jueves te regresará control instantáneo.',
                  badge: 'Fuga Silenciosa Crítica',
                  badgeColor: 'text-rose-800 bg-rose-50 border-rose-200 animate-pulse'
                };
              case 'Uber / Cabify cortos (por pereza)':
                return {
                  title: '🚕 El Reto del Tramo Corto',
                  text: 'Usar taxis por pereza de caminar 10-15 minutos gasta tu dinero y tu salud física. Camina ese tramo escuchando tu podcast preferido. ¡Tu billetera y tu salud te lo agradecerán!',
                  badge: 'Microfuga de Confort',
                  badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
                };
              case 'Suscripciones que no usas':
                return {
                  title: '🎞️ Cancelación Radical',
                  text: '¿La suscripción se cobra sola sin darte cuenta? Ponle fin de inmediato. Cancelarla te ahorra el 100% de su costo mensual. Si realmente la necesitas después de 15 días, vuelve a habilitarla con toda consciencia.',
                  badge: 'Vampiro de Capital',
                  badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
                };
              case 'Compras en apps / Monedas de juegos':
                return {
                  title: '🎮 Recreación Consciente',
                  text: 'Los micropagos en juegos móviles están diseñados psicológicamente para crear urgencia. Configura tu tienda para pedir contraseña en cada pago y dale a tu mente un obstáculo antes de comprar monedas virtuales.',
                  badge: 'Goteo de Gamificación',
                  badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
                };
              case 'Cervezas, Alcohol o Cigarros':
                return {
                  title: '🍻 Salud y Finanzas en Sintonía',
                  text: 'El consumo social es grandioso, pero el exceso diario drena tu energía física y tus ahorros. Propón reuniones en casa de amigos en lugar de bares para disfrutar con gastos un 70% menores.',
                  badge: 'Fuga de Recreación',
                  badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
                };
              case 'Lotería, Apuestas o Juegos de azar':
                return {
                  title: '🎲 Retorno de Inversión Real',
                  text: 'Las probabilidades del juego de azar están en tu contra por diseño. Intenta colocar ese mismo dinero semanal en una cuenta de ahorros de alto rendimiento o fondo de inversión; allí el crecimiento es 100% real y asegurado.',
                  badge: 'Goteo Especulativo',
                  badgeColor: 'text-rose-800 bg-rose-50 border-rose-200'
                };
              case 'Compras impulsivas baratas':
                return {
                  title: '💸 Regla de las 48 Horas',
                  text: '¿Sientes la urgencia de comprar un gadget barato? Agrégalo a tu lista de espera y diles "no" por 48 horas. En la mayoría de los casos, la emoción inicial pasará y te darás cuenta de que no lo necesitabas.',
                  badge: 'Hormiga de Impulso',
                  badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
                };
              default:
                return {
                  title: '🐜 Domina tu Efecto Hormiga',
                  text: 'No necesitas privarte de todos los pequeños placeres de la vida, solo necesitas ser consciente de ellos. Registrar esta compra ya te pone un paso adelante de la mayoría. ¡Sigue así!',
                  badge: 'Gasto Hormiga General',
                  badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
                };
            }
          };

          const tip = getBehavioralTip(tx.category, tx.type);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTransactionForDetail(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              />
              
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white border border-[#E9E8E1] rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-xl relative z-10 text-left overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F3F2EC] pb-3 mb-4">
                  <h3 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#8A887C]" />
                    Detalle del Registro
                  </h3>
                  <button
                    onClick={() => setSelectedTransactionForDetail(null)}
                    className="text-[#8A887C] hover:text-[#1E1E1C] text-xs font-bold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Tarjeta Principal con Categoría y Monto */}
                  <div className="bg-[#FAF9F5] border border-[#EBEAE4] rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2.5">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#ECEBE4] shadow-3xs flex items-center justify-center text-2xl">
                      {CATEGORY_ICONS[tx.category] || '📦'}
                    </div>
                    <div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${tip.badgeColor}`}>
                        {tip.badge}
                      </span>
                      <h4 className="font-semibold text-[#1E1E1C] text-sm mt-1.5 leading-snug">
                        {tx.description}
                      </h4>
                      <p className="text-[10px] text-[#8A887C] font-semibold mt-0.5">{tx.category}</p>
                    </div>
                    <div className="pt-1.5">
                      <span className={`text-2xl font-display font-extrabold ${
                        tx.type === 'income' ? 'text-emerald-700' : tx.type === 'micro' ? 'text-amber-700' : 'text-[#1E1E1C]'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}{getUserCurrency()}{tx.amount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Metadatos en Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#FAF9F5] border border-[#ECEBE4] rounded-xl p-2.5">
                      <span className="text-[9px] font-bold text-[#8A887C] uppercase block">Fecha de Compra</span>
                      <span className="font-mono text-[#1E1E1C] font-bold mt-0.5 block">{tx.date}</span>
                    </div>
                    <div className="bg-[#FAF9F5] border border-[#ECEBE4] rounded-xl p-2.5">
                      <span className="text-[9px] font-bold text-[#8A887C] uppercase block">Clasificación</span>
                      <span className="text-[#1E1E1C] font-bold mt-0.5 block">
                        {tx.type === 'micro' ? 'Gasto Hormiga' : tx.type === 'expense' ? 'Gasto Fijo' : 'Ingreso'}
                      </span>
                    </div>
                  </div>

                  {/* Mensaje de Coaching Conductual */}
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 space-y-1.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-md pointer-events-none" />
                    <h5 className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                      {tip.title}
                    </h5>
                    <p className="text-[11px] text-emerald-950/80 leading-relaxed font-medium">
                      {tip.text}
                    </p>
                  </div>
                </div>

                {/* Footer del Modal */}
                <div className="border-t border-[#F3F2EC] pt-4 mt-5 flex gap-2.5">
                  <button
                    onClick={() => {
                      setSelectedTransactionForDetail(null);
                      handleDeleteTransaction(tx.id);
                    }}
                    className="flex-1 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                  <button
                    onClick={() => setSelectedTransactionForDetail(null)}
                    className="flex-2 py-2 bg-[#1E1E1C] hover:bg-[#3E3C38] text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                  >
                    Cerrar Detalle
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}

        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-[#E9E8E1] rounded-2xl w-full max-w-md p-6 shadow-xl relative z-10 text-left overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#F3F2EC] pb-3 mb-5">
                <h3 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  Configuración del Perfil
                </h3>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-[#8A887C] hover:text-[#1E1E1C] text-xs font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Nombre */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#615F55] block">Nombre completo</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221]"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#615F55] block">Teléfono de Acceso</label>
                  <div className="flex gap-2">
                    {/* Código de País */}
                    <select
                      value={profileForm.phoneCountryCode}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneCountryCode: e.target.value })}
                      className="px-2 py-2 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221] font-medium max-w-[110px]"
                    >
                      {LATAM_COUNTRIES.map(c => (
                        <option key={`profile-cc-${c.code}`} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      required
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      className="flex-1 px-3 py-2.5 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221] font-mono"
                      placeholder="Número telefónico"
                    />
                  </div>
                </div>

                {/* Moneda de Preferencia */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#615F55] block">Moneda de Preferencia</label>
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      value={profileForm.currency}
                      onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                      className="w-full px-3 py-2.5 border border-[#ECEBE4] rounded-xl text-xs bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#C0BEAE] transition-all text-[#222221] font-medium"
                    >
                      <option value="S/.">PEN (S/.) — Perú</option>
                      <option value="$">USD ($) — Dólar / General</option>
                      <option value="COP$">COP (COP$) — Colombia</option>
                      <option value="MXN$">MXN (MXN$) — México</option>
                      <option value="CLP$">CLP (CLP$) — Chile</option>
                      <option value="ARS$">ARS (ARS$) — Argentina</option>
                      <option value="Bs">BOB (Bs) — Bolivia</option>
                      <option value="R$">BRL (R$) — Brasil</option>
                      <option value="₡">CRC (₡) — Costa Rica</option>
                      <option value="Q">GTQ (Q) — Guatemala</option>
                      <option value="L">HNL (L) — Honduras</option>
                      <option value="C$">NIO (C$) — Nicaragua</option>
                      <option value="₲">PYG (₲) — Paraguay</option>
                      <option value="RD$">DOP (RD$) — Rep. Dominicana</option>
                      <option value="UYU$">UYU (UYU$) — Uruguay</option>
                      <option value="Bs.D">VES (Bs.D) — Venezuela</option>
                      <option value="€">EUR (€) — Euro</option>
                    </select>
                  </div>
                  <span className="text-[9px] text-[#8A887C] block mt-1.5 italic">
                    💡 Toda la información del tablero se adaptará de inmediato a la moneda seleccionada.
                  </span>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 py-2.5 border border-[#ECEBE4] rounded-xl text-xs font-bold uppercase tracking-wider text-[#615F55] hover:bg-[#FAF9F5] transition-all cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Guardar Perfil
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal de Balance de Sabiduría Financiera */}
        {isBalanceModalOpen && (() => {
          const pctSavings = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
          const pctRegular = totalIncome > 0 ? (totalRegularExpenses / totalIncome) * 100 : 0;
          const pctMicro = totalIncome > 0 ? (totalMicroExpenses / totalIncome) * 100 : 0;
          
          const getBalanceStatus = () => {
            if (totalIncome === 0) {
              return {
                level: 'Comenzando el Camino 🌱',
                style: 'bg-[#FAF9F5] text-[#3E3C34] border-[#E9E8E1]',
                badgeStyle: 'bg-[#FAF9F5] text-[#3E3C34] border-[#E9E8E1]',
                icon: '🌱',
                message: 'Aún no registras ingresos. Agrega un sueldo o ganancia extra para comenzar el balance definitivo.',
                longDesc: 'Registrar tus ingresos es crucial para calcular tu capacidad de blindaje. Cuando tengas ingresos, calcularemos tu balance de ahorro real de inmediato.'
              };
            }
            if (pctSavings >= 30) {
              return {
                level: 'Fortaleza Imbatible 🏰',
                style: 'bg-[#F2FDF8] text-[#117C43] border-emerald-200',
                badgeStyle: 'bg-[#E1F9ED] text-[#117C43] border-[#A8EFC9]',
                icon: '🏰',
                message: '¡Excelente! Estás defendiendo más del 30% de tu dinero de manera admirable. ¡Eres un maestro de tu capital!',
                longDesc: 'Un ahorro por encima del 30% te permite acelerar metas como viajes, inversiones o el fondo de tranquilidad. Sigue defendiendo tu dinero.'
              };
            } else if (pctSavings >= 10) {
              return {
                level: 'Hormiguero Bajo Control 🐜🛡️',
                style: 'bg-amber-50/50 text-amber-900 border-amber-200',
                badgeStyle: 'bg-amber-100/70 text-amber-800 border-amber-200',
                icon: '🛡️',
                message: '¡Muy buen equilibrio! Mantienes un flujo de ahorro saludable, protegiendo tus fondos del día a día.',
                longDesc: 'Tienes un control maduro. Tu balance es positivo. Si optimizas solo un par de antojos más, estarás en el nivel de súper ahorro.'
              };
            } else if (pctSavings >= 0) {
              return {
                level: 'Ahorro al Límite ⚠️',
                style: 'bg-orange-50/40 text-orange-900 border-orange-200',
                badgeStyle: 'bg-orange-100 text-orange-800 border-orange-200',
                icon: '⚠️',
                message: 'Estás en zona neutral. Tu dinero alcanza justo para cubrirlo todo, pero el margen de imprevistos es bajo.',
                longDesc: 'No te sientas mal, ¡registrarlo ya es un éxito! Pequeños ajustes de $1-3 diarios (como preparar café o moderar envíos) pueden liberar cientos de pesos de inmediato.'
              };
            } else {
              return {
                level: 'Fuga Silenciosa Activa 🚨',
                style: 'bg-rose-50/40 text-rose-900 border-rose-200',
                badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200',
                icon: '🚨',
                message: '¡Ey, sin temores! Registrar tus transacciones es el 80% del éxito. Acabas de encender la luz sobre tus fugas.',
                longDesc: 'Cuando gastamos más de lo que ingresamos, usualmente es por goteo de antojos que pasan desapercibidos. No te restrinjas del todo, solo pon a prueba un reto pequeño.'
              };
            }
          };

          const statusInfo = getBalanceStatus();
          const savedMonthly = totalMicroExpenses * (savingsTargetPercent / 100);
          const savedYearly = savedMonthly * 12;
          const savedFiveYears = savedMonthly * ((Math.pow(1.08, 5) - 1) / 0.08) * 1.08;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBalanceModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              />
              
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white border border-[#E9E8E1] rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-xl relative z-10 text-left overflow-hidden my-8"
              >
                {/* Dibujo decorativo de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-[#F3F2EC] pb-3 mb-4">
                  <h3 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Balance de Sabiduría Financiera
                  </h3>
                  <button
                    onClick={() => setIsBalanceModalOpen(false)}
                    className="text-[#8A887C] hover:text-[#1E1E1C] text-xs font-bold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                  
                  {/* Tarjeta de Nivel y Ánimo */}
                  <div className={`p-4 border rounded-xl space-y-2 relative overflow-hidden transition-all duration-300 ${statusInfo.style}`}>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A887C]">Nivel de Blindaje actual</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusInfo.badgeStyle}`}>
                        {statusInfo.icon} {statusInfo.level}
                      </span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs font-bold leading-relaxed">{statusInfo.message}</p>
                      <p className="text-[11px] opacity-80 mt-1 leading-relaxed">{statusInfo.longDesc}</p>
                    </div>
                  </div>

                  {/* Consolidado Numérico Rápido */}
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="bg-[#F2FDF8] border border-emerald-100 p-2.5 rounded-xl">
                      <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Ingresado</span>
                      <span className="text-xs sm:text-sm font-display font-bold text-emerald-700 block mt-0.5">
                        {formatMoney(totalIncome)}
                      </span>
                    </div>
                    <div className="bg-[#FAF9F5] border border-[#ECEBE4] p-2.5 rounded-xl">
                      <span className="text-[9px] font-bold text-[#8A887C] uppercase tracking-wider block">Gastos Fijos</span>
                      <span className="text-xs sm:text-sm font-display font-bold text-[#3E3C34] block mt-0.5">
                        {formatMoney(totalRegularExpenses)}
                      </span>
                    </div>
                    <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                      <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Hormiga</span>
                      <span className="text-xs sm:text-sm font-display font-bold text-amber-700 block mt-0.5">
                        {formatMoney(totalMicroExpenses)}
                      </span>
                    </div>
                  </div>

                  {/* Barra Visual Proporcional de Consumo */}
                  <div className="space-y-1.5 bg-[#FAF9F5] border border-[#ECEBE4] p-3 rounded-xl">
                    <div className="flex justify-between text-[10px] text-[#8A887C] font-bold uppercase tracking-wider">
                      <span>Proporción de tus Ingresos</span>
                      <span>Total: 100%</span>
                    </div>
                    
                    {totalIncome > 0 ? (
                      <div>
                        {/* Barra compuesta */}
                        <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#ECEBE4] border border-[#ECEBE4]">
                          {/* Gastos Fijos */}
                          {pctRegular > 0 && (
                            <div 
                              className="bg-[#615F55] h-full transition-all duration-500" 
                              style={{ width: `${pctRegular}%` }} 
                              title={`Gastos Fijos: ${pctRegular.toFixed(1)}%`}
                            />
                          )}
                          {/* Gastos Hormiga */}
                          {pctMicro > 0 && (
                            <div 
                              className="bg-amber-500 h-full transition-all duration-500" 
                              style={{ width: `${pctMicro}%` }} 
                              title={`Gastos Hormiga: ${pctMicro.toFixed(1)}%`}
                            />
                          )}
                          {/* Ahorro Restante */}
                          {pctSavings > 0 && (
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-500" 
                              style={{ width: `${pctSavings}%` }} 
                              title={`Ahorro Disponible: ${pctSavings.toFixed(1)}%`}
                            />
                          )}
                        </div>
                        
                        {/* Etiquetas explicativas */}
                        <div className="flex justify-between items-center text-[9px] font-bold mt-2 flex-wrap gap-2 text-center">
                          <div className="flex items-center gap-1 text-[#615F55]">
                            <span className="w-2 h-2 rounded bg-[#615F55]" />
                            <span>G. Fijos ({pctRegular.toFixed(1)}%)</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-600">
                            <span className="w-2 h-2 rounded bg-amber-500" />
                            <span>G. Hormiga ({pctMicro.toFixed(1)}%)</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-700">
                            <span className="w-2 h-2 rounded bg-emerald-500" />
                            <span>Ahorro Neto ({Math.max(0, pctSavings).toFixed(1)}%)</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-[#A3A193] italic text-center py-2">
                        Registra ingresos y egresos para activar el gráfico proporcional.
                      </p>
                    )}
                  </div>

                  {/* El Tesoro Recuperable (Simulador Interactivo) */}
                  <div className="bg-[#FAF9F5] border border-[#EBEAE4] rounded-xl p-4 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-lg pointer-events-none" />
                    
                    <div>
                      <h4 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1 text-emerald-800">
                        <Sparkles className="w-3.5 h-3.5" />
                        Simulador: El Tesoro Recuperable
                      </h4>
                      <p className="text-[10px] text-[#8A887C] mt-0.5 leading-relaxed">
                        ¿Cuánto podrías acumular si decides blindar una porción de tus gastos hormiga hoy?
                      </p>
                    </div>

                    {/* Botones de Control para Simulación Rápida */}
                    <div className="flex gap-2">
                      {[25, 50, 75, 100].map(pct => (
                        <button
                          key={`sim-target-${pct}`}
                          type="button"
                          onClick={() => setSavingsTargetPercent(pct)}
                          className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            savingsTargetPercent === pct
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-3xs'
                              : 'bg-white text-[#615F55] border-[#E9E8E1] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          Recortar {pct}%
                        </button>
                      ))}
                    </div>

                    {/* Proyecciones de Crecimiento */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1.5 text-center">
                      <div className="bg-white border border-[#EBEAE4] p-2 rounded-xl">
                        <span className="text-[8px] font-bold text-[#8A887C] uppercase tracking-wider block">Ahorro Mensual</span>
                        <span className="text-xs font-display font-bold text-[#1E1E1C] block mt-0.5">
                          {formatMoney(savedMonthly)}
                        </span>
                      </div>
                      <div className="bg-white border border-[#EBEAE4] p-2 rounded-xl">
                        <span className="text-[8px] font-bold text-[#8A887C] uppercase tracking-wider block">Ahorro 1 Año</span>
                        <span className="text-xs font-display font-bold text-[#1E1E1C] block mt-0.5">
                          {formatMoney(savedYearly)}
                        </span>
                      </div>
                      <div className="bg-[#EBF7F2] border border-emerald-100 p-2 rounded-xl relative overflow-hidden group">
                        <span className="text-[8px] font-bold text-emerald-800 uppercase tracking-wider block relative z-10">En 5 Años (+8% C.I.)</span>
                        <span className="text-xs sm:text-sm font-display font-extrabold text-emerald-700 block mt-0.5 relative z-10">
                          {formatMoney(savedFiveYears)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[9px] text-[#A3A193] text-center italic">
                      *Cálculo de 5 años asume capitalización mensual con un interés compuesto promedio del 8% anual.
                    </p>
                  </div>

                  {/* Reto de la Semana para Motivarse */}
                  <div className="space-y-2 border-t border-[#F3F2EC] pt-4">
                    <h4 className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-500" />
                      Elige tu Reto de la Semana (Blindaje Lúdico)
                    </h4>
                    <p className="text-[10px] text-[#8A887C] leading-relaxed">
                      La mejor forma de ahorrar es hacerlo divertido. Elige un mini-reto y pon a prueba tu fuerza de voluntad:
                    </p>

                    <div className="space-y-2">
                      {[
                        {
                          id: 'termo',
                          title: '🍵 Reto Termo con Orgullo',
                          desc: 'Trae café, tinto o agua de casa 3 veces esta semana. Evita comprar en cafeterías.',
                          saving: totalIncome > 0 ? formatMoney(Math.min(totalMicroExpenses, 15) * 3) : 'Ahorro sustancial'
                        },
                        {
                          id: 'delivery',
                          title: '🍕 Reto Silencio de Delivery',
                          desc: 'Apaga las apps de comida por 4 días. Cocina algo simple con lo que tengas en la alacena.',
                          saving: totalIncome > 0 ? formatMoney(Math.min(totalMicroExpenses, 25) * 2) : 'Ahorro sustancial'
                        },
                        {
                          id: 'hours',
                          title: '🕒 Reto de las 48 Horas',
                          desc: 'Si te tienta un antojo, espérate 48 horas anotado aquí. Si aún lo quieres, cómpralo con paz mental.',
                          saving: 'Evita compras impulsivas'
                        }
                      ].map(challenge => (
                        <button
                          key={challenge.id}
                          type="button"
                          onClick={() => setSelectedChallenge(challenge.id)}
                          className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 items-center ${
                            selectedChallenge === challenge.id
                              ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
                              : 'bg-white border-[#E9E8E1] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            selectedChallenge === challenge.id
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-[#ECEBE4]'
                          }`}>
                            {selectedChallenge === challenge.id && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1">
                            <span className="text-[11px] font-bold text-[#1E1E1C] block">{challenge.title}</span>
                            <p className="text-[10px] text-[#8A887C] mt-0.5 leading-snug">{challenge.desc}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] font-bold uppercase tracking-wider text-[#8A887C] block">Est. Ahorrado</span>
                            <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">{challenge.saving}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedChallenge && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-1.5"
                      >
                        <span>🚀 ¡Reto Activado con éxito! Tienes el control total de tus monedas esta semana.</span>
                      </motion.div>
                    )}
                  </div>

                </div>

                <div className="border-t border-[#F3F2EC] pt-4 mt-5 flex gap-3">
                  <button
                    onClick={() => setIsBalanceModalOpen(false)}
                    className="w-full py-2.5 bg-[#1E1E1C] hover:bg-[#3E3C38] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                  >
                    Entendido, ¡A blindar mi dinero!
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
