'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Config, defaultConfig } from './config';

type ConfigContextType = {
  config: Config;
  setConfig: (newConfig: Config) => void;
  updateConfig: (updates: Partial<Config>) => void;
  resetConfig: () => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = 'appConfig';

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<Config>(() => {
    // Initialize from localStorage or use default
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
    }
    return defaultConfig;
  });

  // Persist to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const setConfig = (newConfig: Config) => {
    setConfigState(newConfig);
  };

  const updateConfig = (updates: Partial<Config>) => {
    setConfigState(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfigState(defaultConfig);
  };

  return (
    <ConfigContext.Provider value={{ config, setConfig, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}