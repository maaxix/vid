import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import mediaServersService from '@/pages//media-servers/MediaServersService';

import { MediaServerDir, fetchMediaDir, createMediaDir, updateMediaDir, deleteMediaDir } from './MediaServerSettingsService';

export default function MediaServerSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<MediaServerDir[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServer, setCurrentServer] = useState<MediaServerDir>({ name: '', path: '' });

  useEffect(() => {
    if (!id) {
      setError('Server ID is missing');
      return;
    }
    const serverConfig = mediaServersService.findServerByName(id);
    if (!serverConfig) {
      setError(`Not Found server ${id}`);
      return;
    }
    if (serverConfig) {
      loadServers(serverConfig.url);
    }
  }, [id]);

  const loadServers = async (url: string) => {
    setIsLoading(true);
    try {
      const data = await fetchMediaDir(url);
      setList(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media servers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentServer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentServer.name || !currentServer.path) return;

    setIsLoading(true);
    try {
      const serverConfig = mediaServersService.findServerByName(id||"");
      if (!serverConfig) throw new Error('Server configuration not found');

      if (isEditing) {
        const updatedServer = await updateMediaDir(serverConfig.url, currentServer.name, currentServer);
        setList(list.map(server => server.name === updatedServer.name ? updatedServer : server));
      } else {
        const newServer = await createMediaDir(serverConfig.url, currentServer);
        setList([...list, newServer]);
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save media server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (server: MediaServerDir) => {
    setCurrentServer(server);
    setIsEditing(true);
  };

  const handleDelete = async (dirName: string) => {
    if (!window.confirm('Are you sure you want to delete this directory?')) return;

    setIsLoading(true);
    try {
      const serverConfig = mediaServersService.findServerByName(id||"");
      if (!serverConfig) throw new Error('Server configuration not found');

      await deleteMediaDir(serverConfig.url, dirName);
      setList(list.filter(server => server.name !== dirName));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media server');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentServer({ name: '', path: '' });
    setIsEditing(false);
  };

  const handleAdd = () => {

  }

  return (
    <div className="box">
      <div className="flex card-header">
        <span className="grow card-title title-primary">Media Directories</span>
        <nav className="">
          <button onClick={handleAdd} className="btn second tooltip">Add Directory<span className="tooltip-top tooltiptext">Add Server</span></button>
        </nav>
      </div>

      
      <div className="card-body flex-col gap-6">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="box p-2">
          <form onSubmit={handleSubmit}>
            <div className="fld">
              <label htmlFor="name" className="fld-label">Name</label>
              <input
                type="text"
                className="fld-input"
                id="name"
                name="name"
                value={currentServer.name}
                onChange={handleInputChange}
                required
                disabled={isEditing}
              />
            </div>
            <div className="fld">
              <label htmlFor="path" className="fld-label">Path</label>
              <input
                type="text"
                className="fld-input"
                id="path"
                name="path"
                value={currentServer.path}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn primary" disabled={isLoading}>
                {isEditing ? 'Update' : 'Create'}
              </button>
              {isEditing && (
                <button type="button" className="btn second" onClick={resetForm} disabled={isLoading}>
                  Cancel
                </button>
              )}
            </div>

          </form>
        </div>
        
        <div className="card-body">
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Path</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(server => (
                  <tr key={server.name}>
                    <td>{server.name}</td>
                    <td>{server.path}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(server)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(server.name)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}