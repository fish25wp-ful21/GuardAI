export const APP_NAME = 'GuardAI';

export const SECURITY_STATUS = {
  PROTECTED: 'protected',
  WARNING: 'warning',
  ALERT: 'alert',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'aegis_auth_token',
  USER_PIN: 'aegis_user_pin',
  NOTES: 'aegis_secure_notes',
  SECURITY_LOGS: 'aegis_security_logs',
  SWEEPER_SETTINGS: 'aegis_sweeper_settings',
};

export const SENSITIVITY_THRESHOLDS = {
  low: 25,
  medium: 18,
  high: 12,
};

export const NAV_TABS = [
  { id: 'dashboard', label: 'Status', icon: '🛡️' },
  { id: 'defence', label: 'Defence', icon: '🔬' },
  { id: 'theft', label: 'Theft', icon: '🔒' },
  { id: 'sweeper', label: 'Sweeper', icon: '🧹' },
  { id: 'education', label: 'Learn', icon: '📖' },
];

export const EDUCATION_CARDS = [
  {
    icon: '🗣️', title: 'Spot the Deepfake',
    description: 'AI voice bypass trust. Listen for unnatural pauses and metallic frequencies.',
    tip: 'Establish an offline emergency password with family members.',
  },
  {
    icon: '🎣', title: 'Phishing Red Flags',
    description: 'Modern phishing utilizes urgency and manipulation.',
    tip: 'Never click direct links in urgent emails.',
  },
  {
    icon: '📱', title: 'Stop Data Leaks',
    description: 'Background tracking happens via passive permissions.',
    tip: 'Audit app permissions regularly.',
  }
];

