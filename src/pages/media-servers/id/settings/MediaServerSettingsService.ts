
// src/services/MediaServerSettingsService.ts

export interface MediaServerDir {
  name: string;
  path: string;
}
// baseUrl : example: 'http://your-api-endpoint.com/api'

export const fetchMediaDir = async (baseUrl:string): Promise<MediaServerDir[]> => {
  const response = await fetch(`${baseUrl}/api/dir`);
  if (!response.ok) throw new Error('Failed to fetch media directory');
  return await response.json();
};

export const createMediaDir = async (baseUrl:string, server: MediaServerDir): Promise<MediaServerDir> => {
  const response = await fetch(`${baseUrl}/api/dir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(server),
  });
  if (!response.ok) throw new Error('Failed to create media directory');
  return await response.json();
};

export const updateMediaDir = async (baseUrl:string, dirName: string, server: MediaServerDir): Promise<MediaServerDir> => {
  const response = await fetch(`${baseUrl}/api/dir/${dirName}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(server),
  });
  if (!response.ok) throw new Error('Failed to update media directory');
  return await response.json();
};

export const deleteMediaDir = async (baseUrl:string, dirName: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/dir/${dirName}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete media directory');
};


export const validateForm = (form: MediaServerDir): Record<string, string> =>{
    const errors: Record<string, string> = {
      _error: "",
      name: "",
      path: "",
    };

    let isValid = true;

    if (!form.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!form.path.trim()) {
      errors.path = "Path is required";
      isValid = false;
    }

    if (!isValid) {
      errors._error = "ERROR";
    }

    return errors;
  }