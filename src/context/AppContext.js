import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { SECURITY_STATUS, STORAGE_KEYS } from '../utils/constants';

const AppContext = createContext();

const initialState = {
  isAuthenticated: false,
  hasPIN: false,
  isLocked: false,
  securityStatus: SECURITY_STATUS.PROTECTED,
  activeTab: 'dashboard',
  theftSensitivity: 'medium',
  sweeperConfig: {
    maxAgeDays: 30,
    autoCleanEnabled: false,
    autoCleanOnLaunch: false,
  },
  errorMessage: null,
  isScanning: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_PIN':
      return { ...state, hasPIN: action.payload };
    case 'SET_LOCKED':
      return { ...state, isLocked: action.payload };
    case 'SET_SECURITY_STATUS':
      return { ...state, securityStatus: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_THEFT_SENSITIVITY':
      return { ...state, theftSensitivity: action.payload };
    case 'SET_SWEEPER_CONFIG':
      return { ...state, sweeperConfig: { ...state.sweeperConfig, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, errorMessage: null };
    case 'SET_SCANNING':
      return { ...state, isScanning: action.payload };
    case 'RESET_STATE':
      return { ...initialState, isAuthenticated: state.isAuthenticated, hasPIN: state.hasPIN };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setAuth = useCallback((val) => dispatch({ type: 'SET_AUTH', payload: val }), []);
  const setPIN = useCallback((val) => dispatch({ type: 'SET_PIN', payload: val }), []);
  const setLocked = useCallback((val) => dispatch({ type: 'SET_LOCKED', payload: val }), []);
  const setSecurityStatus = useCallback((val) => dispatch({ type: 'SET_SECURITY_STATUS', payload: val }), []);
  const setActiveTab = useCallback((val) => dispatch({ type: 'SET_ACTIVE_TAB', payload: val }), []);
  const setTheftSensitivity = useCallback((val) => dispatch({ type: 'SET_THEFT_SENSITIVITY', payload: val }), []);
  const setSweeperConfig = useCallback((val) => dispatch({ type: 'SET_SWEEPER_CONFIG', payload: val }), []);
  const setError = useCallback((val) => dispatch({ type: 'SET_ERROR', payload: val }), []);
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);
  const setScanning = useCallback((val) => dispatch({ type: 'SET_SCANNING', payload: val }), []);
  const resetState = useCallback(() => dispatch({ type: 'RESET_STATE' }), []);

  const value = {
    state,
    setAuth,
    setPIN,
    setLocked,
    setSecurityStatus,
    setActiveTab,
    setTheftSensitivity,
    setSweeperConfig,
    setError,
    clearError,
    setScanning,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

