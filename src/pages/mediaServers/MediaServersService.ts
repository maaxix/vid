// MediaServersService.ts
import configService from "../../components/config/configService";

export interface ServerEntry {
  name: string;
  url: string;
  apiKey: string;
}

export type ServerStatus = "online" | "offline" | "unknown";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

class MediaServersService {
  public findServerByName(serverName: string) : ServerEntry | null{
    const serverList = configService.getConfig().serverList;
    for (let i = serverList.length - 1; i >= 0; i--) {
      if (serverList[i].name === serverName) {
        return serverList[i];
      }
    }
    return null
  }
  //async getServersMap(): Promise<Record<string, ServerEntry>> {
  getServersMap(): Record<string, ServerEntry> {
    const config = configService.getConfig();
    if (!config?.serverList) return {};

    const tempServers: Record<string, ServerEntry> = {};
    config.serverList.forEach((server) => {
      tempServers[server.name] = server;
    });
    return tempServers;
  }

  //async getServerList(): Promise<ServerEntry[]> {
  getServerList(): ServerEntry[] {
    const config = configService.getConfig();
    if (!config?.serverList) return [];

    return config.serverList;
  }

  async checkServerStatuses(
    servers: ServerEntry[]
  ): Promise<Record<string, ServerStatus>> {
    const newStatuses: Record<string, ServerStatus> = {};

    await Promise.all(
      servers.map(async (server) => {
        try {
          const res = await fetch(`${server.url}/api/ping`, { method: "GET" });
          newStatuses[server.name] = res.ok ? "online" : "offline";
        } catch {
          newStatuses[server.name] = "offline";
        }
      })
    );

    return newStatuses;
  }

  deleteServer(serverName: string): void {
    const serverList = configService.getConfig().serverList;
    for (let i = serverList.length - 1; i >= 0; i--) {
      if (serverList[i].name === serverName) {
        serverList.splice(i, 1);
        configService.save();
        break; // uncomment if you only want to remove the first match
      }
    }
  }

  //async saveServer(server: ServerEntry): Promise<void> {
  saveServer(server: ServerEntry):void {
    const serverList = configService.getConfig().serverList;
    let isNew = true;
    for (let i = serverList.length - 1; i >= 0; i--) {
      if (serverList[i].name === server.name) {
        isNew = false;
        serverList[i] = { ...server };
        break;
      }
    }
    if (isNew) {
      serverList.push(server);
    }
    configService.save();
  }

  validateForm(form: ServerEntry): Record<string, string> {
    const newErrors: Record<string, string> = {
      _error: "",
      name: "",
      url: "",
      apiKey: "",
    };
    let isValid = true;

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // URL validation
    if (!form.url.trim()) {
      newErrors.url = "URL is required";
      isValid = false;
    } else if (!isValidUrl(form.url)) {
      newErrors.url = "Please enter a valid URL";
      isValid = false;
    }

    // API Key validation
    //if (!form.apiKey.trim()) {
    //  newErrors.apiKey = "API Key is required";
    //  isValid = false;
    //}

    if (!isValid) newErrors._error = "ERROR";
    return newErrors;
  }
}

const mediaServersService = new MediaServersService();
export default mediaServersService;
