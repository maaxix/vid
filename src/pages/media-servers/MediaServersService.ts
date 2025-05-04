// MediaServersService.ts
import configService from "@/components/config/configService";

export interface ServerEntry {
  name: string;
  url: string;
  apiKey: string;
}

export type ServerStatus = "online" | "offline" | "unknown";

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

class MediaServersService {
  public findServerByName(serverName: string): ServerEntry | null {
    const serverList = configService.getConfig().serverList;
    return serverList.find((server) => server.name === serverName) || null;
  }

  public getServersMap(): Record<string, ServerEntry> {
    const config = configService.getConfig();
    const serverList = config?.serverList ?? [];

    return serverList.reduce((map, server) => {
      map[server.name] = server;
      return map;
    }, {} as Record<string, ServerEntry>);
  }

  public getServerList(): ServerEntry[] {
    return configService.getConfig().serverList ?? [];
  }

  public async checkServerStatuses(
    servers: ServerEntry[]
  ): Promise<Record<string, ServerStatus>> {
    const statuses: Record<string, ServerStatus> = {};

    await Promise.all(
      servers.map(async (server) => {
        try {
          const res = await fetch(`${server.url}/api/ping`, { method: "GET" });
          statuses[server.name] = res.ok ? "online" : "offline";
        } catch {
          statuses[server.name] = "offline";
        }
      })
    );

    return statuses;
  }

  public saveServer(server: ServerEntry): void {
    const serverList = configService.getConfig().serverList;
    const index = serverList.findIndex((s) => s.name === server.name);

    if (index !== -1) {
      serverList[index] = { ...server };
    } else {
      serverList.push(server);
    }

    configService.save();
  }

  public deleteServer(serverName: string): void {
    const serverList = configService.getConfig().serverList;
    const index = serverList.findIndex((s) => s.name === serverName);

    if (index !== -1) {
      serverList.splice(index, 1);
      configService.save();
    }
  }

  public validateForm(form: ServerEntry): Record<string, string> {
    const errors: Record<string, string> = {
      _error: "",
      name: "",
      url: "",
      apiKey: "",
    };

    let isValid = true;

    if (!form.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!form.url.trim()) {
      errors.url = "URL is required";
      isValid = false;
    } else if (!isValidUrl(form.url)) {
      errors.url = "Please enter a valid URL";
      isValid = false;
    }

    // Optional API Key validation (commented out by design)
    // if (!form.apiKey.trim()) {
    //   errors.apiKey = "API Key is required";
    //   isValid = false;
    // }

    if (!isValid) {
      errors._error = "ERROR";
    }

    return errors;
  }
}

const mediaServersService = new MediaServersService();
export default mediaServersService;
