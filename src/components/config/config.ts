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
        url: 'http://localhost:4000', 
        apiKey: '' 
      } 
    },
    serverOrder: ['localhost'],
    theme: 'light',
  };