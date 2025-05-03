export type ServerConfig = {
  name:string;
  url: string;
  apiKey: string;
};

export type Config = {
  serverList: ServerConfig[];
  apiBaseUrl: string;
  theme: string;
};

export const defaultConfig: Config = {
  serverList: [{name:"localhost", url: "https://localhost:4141", apiKey: ""}],
  apiBaseUrl: "",
  theme: 'light',
};