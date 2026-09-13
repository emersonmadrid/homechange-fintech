export type Language = 'es' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  es: {
    // General
    'app.title': 'HomeMoney',
    'app.subtitle': 'Plataforma Fintech de Cambio de Divisas',
    'btn.save': 'Guardar',
    'btn.cancel': 'Cancelar',
    'btn.delete': 'Eliminar',
    'btn.add': 'Agregar',
    'btn.continue': 'Continuar',
    'btn.back': 'Volver',
    'btn.logout': 'Cerrar Sesión',
    'status.pending': 'Pendiente',
    'status.completed': 'Completada',
    'status.processing': 'En Proceso',

    // Landing Page
    'landing.hero_title': 'Cambia dólares online al instante.',
    'landing.hero_subtitle': 'El mejor tipo de cambio en Perú. Rápido, seguro y con respaldo bancario.',
    'landing.buy': 'Compra',
    'landing.sell': 'Venta',
    'landing.you_send': 'Tú envías',
    'landing.you_receive': 'Tú recibes',
    'landing.calc_title': 'Calcula tu cambio',
    'landing.start_op': 'Iniciar Operación',
    'landing.rate_note': 'Tipo de cambio garantizado durante tu operación.',

    // Login
    'login.title': 'Home Money',
    'login.subtitle': 'Ingresa a tu portal de cambio de divisas',
    'login.user_placeholder': 'Usuario o Correo electrónico',
    'login.pass_placeholder': 'Contraseña',
    'login.btn_submit': 'Iniciar Sesión',
    'login.no_account': '¿No tienes una cuenta?',
    'login.register_here': 'Regístrate aquí',
    'login.error_msg': 'Usuario o contraseña incorrectos.',

    // Seleccion Perfil
    'profile.select_title': 'Selecciona tu Perfil',
    'profile.select_desc': 'Elige cómo deseas operar el día de hoy',
    'profile.personal': 'Perfil Personal',
    'profile.business': 'Perfil Empresarial',

    // Cambiar Ahora
    'exchange.title': 'Cambia Divisas',
    'exchange.subtitle': 'Transfiere de forma segura con cotización en tiempo real',
    'exchange.account_origin': 'Cuenta de origen',
    'exchange.account_dest': 'Cuenta de destino',
    'exchange.upload_voucher': 'Subir comprobante de transferencia',
    'exchange.confirm_btn': 'Confirmar y Registrar Orden',

    // Mis Cuentas Bancarias
    'accounts.title': 'Mis Cuentas Bancarias',
    'accounts.subtitle': 'Administra tus cuentas registradas para recibir fondos',
    'accounts.add_btn': 'Agregar Nueva Cuenta',
    'accounts.bank': 'Banco',
    'accounts.account_number': 'Número de Cuenta',
    'accounts.cci': 'Código Interbancario (CCI)',
    'accounts.own_account': 'Cuenta Propia',

    // Transacciones
    'tx.title': 'Panel de Transacciones',
    'tx.subtitle': 'Historial de cambios de divisas y estado en vivo',
    'tx.new_order': 'Nueva Transacción',
    'tx.order_num': 'N° de Orden',
    'tx.date': 'Fecha',
    'tx.amount_sent': 'Monto Enviado',
    'tx.amount_received': 'Monto Recibido',
  },
  en: {
    // General
    'app.title': 'HomeMoney',
    'app.subtitle': 'Fintech Currency Exchange Platform',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.delete': 'Delete',
    'btn.add': 'Add',
    'btn.continue': 'Continue',
    'btn.back': 'Back',
    'btn.logout': 'Sign Out',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.processing': 'Processing',

    // Landing Page
    'landing.hero_title': 'Exchange currency online instantly.',
    'landing.hero_subtitle': 'The best FX rates with bank-grade security and zero hidden fees.',
    'landing.buy': 'Buy',
    'landing.sell': 'Sell',
    'landing.you_send': 'You send',
    'landing.you_receive': 'You receive',
    'landing.calc_title': 'Calculate Exchange',
    'landing.start_op': 'Get Started',
    'landing.rate_note': 'Guaranteed exchange rate locked during your order.',

    // Login
    'login.title': 'Home Money',
    'login.subtitle': 'Sign in to your currency exchange portal',
    'login.user_placeholder': 'Username or Email address',
    'login.pass_placeholder': 'Password',
    'login.btn_submit': 'Sign In',
    'login.no_account': "Don't have an account?",
    'login.register_here': 'Register here',
    'login.error_msg': 'Invalid username or password.',

    // Seleccion Perfil
    'profile.select_title': 'Select Your Profile',
    'profile.select_desc': 'Choose the profile you wish to operate with today',
    'profile.personal': 'Personal Profile',
    'profile.business': 'Corporate Profile',

    // Cambiar Ahora
    'exchange.title': 'Currency Exchange',
    'exchange.subtitle': 'Transfer funds securely with real-time rate conversion',
    'exchange.account_origin': 'Source Account',
    'exchange.account_dest': 'Destination Account',
    'exchange.upload_voucher': 'Upload Transfer Receipt',
    'exchange.confirm_btn': 'Confirm & Place Order',

    // Mis Cuentas Bancarias
    'accounts.title': 'My Bank Accounts',
    'accounts.subtitle': 'Manage your verified bank accounts to receive payouts',
    'accounts.add_btn': 'Add New Account',
    'accounts.bank': 'Bank',
    'accounts.account_number': 'Account Number',
    'accounts.cci': 'Interbank Code (CCI)',
    'accounts.own_account': 'Own Account',

    // Transacciones
    'tx.title': 'Transaction Dashboard',
    'tx.subtitle': 'Real-time order history and exchange status',
    'tx.new_order': 'New Exchange',
    'tx.order_num': 'Order #',
    'tx.date': 'Date',
    'tx.amount_sent': 'Amount Sent',
    'tx.amount_received': 'Amount Received',
  }
};
