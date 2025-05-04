// src/services/configService.ts
import { Config, defaultConfig } from './config';

const CONFIG_STORAGE_KEY = 'app_config';

class ConfigService {
  private config: Config;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    try {
      const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (storedConfig) {
        return this.validateConfig(JSON.parse(storedConfig));
      }
      return defaultConfig;
    } catch (error) {
      console.error('Failed to load config from localStorage, using defaults', error);
      return defaultConfig;
    }
  }

  private validateConfig(config: Config): Config {
    // Basic validation - you can expand this as needed
    if (!config || typeof config !== 'object') {
      return defaultConfig;
    }

    // Ensure required fields exist
    return {
      serverList: config.serverList || defaultConfig.serverList,
      apiBaseUrl: config.apiBaseUrl || defaultConfig.apiBaseUrl,
      theme: config.theme || defaultConfig.theme,
    };
  }

  public getConfig(): Config {
    return this.config;
  }
  public save(): void {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save config to localStorage', error);
    }
  }

  public saveConfig(newConfig: Partial<Config>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };

    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save config to localStorage', error);
    }
  }

  public resetToDefaults(): void {
    this.config = defaultConfig;
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset config', error);
    }
  }
}

// Singleton instance
const configService = new ConfigService();
export default configService;


/*
USAGE:
import configService from '@/services/configService';
  const [config, setConfig] = useState(configService.getConfig());

  configService.saveConfig(config);
  configService.save();

*/