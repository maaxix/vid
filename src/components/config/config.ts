// types/config.ts
export type ServerConfig = {
    url: string;
    apiKey: string;
  };
  
  export type Config = {
    servers: Record<string, ServerConfig>;
    serverOrder: string[];
    theme: string;
  };
  
  export const defaultConfig: Config = {
    servers: { 
      localhost: { 
        url: 'https://localhost:4141',
        apiKey: '' 
      } 
    },
    serverOrder: ['localhost'],
    theme: 'light',
  };