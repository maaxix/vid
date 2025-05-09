// MediaServers.tsx
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ConfirmModal } from '@/components/ui/model/ConfirmDeleteModal';

import mediaServersService, {ServerEntry, ServerStatus } from './MediaServersService';
import { AddOrEditServerModal } from './AddOrEditServerModal';

function MediaServersPage() {
  const location = useLocation();
  const pathname = location.pathname;

  const [configDate, setConfigDate] = useState<string>("");
  const [servers, setServers] = useState< ServerEntry[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ServerStatus>>({});

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [currentServer, setCurrentServer] = useState<ServerEntry | null>(null);
  const [serverToDelete, setServerToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      const servers =  mediaServersService.getServerList();
      setServers(servers);
    };
    fetchServers();
  }, [configDate]);

  useEffect(() => {
    const checkStatuses = async () => {
      if (servers.length > 0) {
        const newStatuses = await mediaServersService.checkServerStatuses(servers);
        setStatuses(newStatuses);
      }
    };
    checkStatuses();
  }, [servers]);

  const handleAdd = () => {
    setCurrentServer(null);
    setAddEditOpen(true);
  };

  const handleEdit = (name: string) => {
    const server = mediaServersService.findServerByName(name);
    if (server) {
      setCurrentServer({ ...server });
      setAddEditOpen(true);
    }
  };

  const handleDelete = (name: string) => {
    setServerToDelete(name);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete =  () => {
    if (serverToDelete) {
      mediaServersService.deleteServer(serverToDelete);
      setServerToDelete(null);
      setConfigDate((new Date()).toLocaleDateString());
    }
    setDeleteConfirmOpen(false);
  };

  const handleSave = () => {
    //mediaServersService.saveServer(server);
    setAddEditOpen(false);
    setConfigDate((new Date()).toLocaleDateString());
    return true;
  };

  console.log(`rendere server list= ${servers.length}`);
  
  return (
    <div className="box">
      <div className="flex card-header">
        <span className="grow card-title title-primary">Server Manager</span>
        <nav className="">
          <button onClick={handleAdd} className="btn second tooltip">
            Add Server<span className="tooltip-top tooltiptext">Add Server</span>
          </button>
        </nav>
      </div>

      <div className="card-body flex-col gap-6">
        {servers.map(server => (
          <div key={server.name} className="card flex gap-2 box p-2">
            <Link to={`${pathname}/${server.name}`} className='grow'>
              <h4 className="text-lg font-semibold">{server.name}</h4>
              <p className="text-sm text-gray-500">{server.url}</p>
              <p className={`text-sm mt-1 ${statuses[server.name] === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                Status: {statuses[server.name] || 'unknown'}
              </p>
            </Link>
            <div className="flex-start">
              {statuses[server.name] === 'online' && (
                <Link to={`${pathname}/${server.name}/settings`} className="btn btn-icon">
                  <i className="icon icon-gear"></i>Settings
                </Link>
              )}
              <button onClick={() => handleEdit(server.name)} className="btn btn-icon">
                <i className="icon icon-edit"></i>
              </button>
              <button onClick={() => handleDelete(server.name)} className="btn btn-icon">
                <i className="icon icon-del"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddOrEditServerModal
        open={addEditOpen}
        onClose={() => setAddEditOpen(false)}
        onSave={handleSave}
        initial={currentServer || undefined}
      />

      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Server"
        message={`Are you sure you want to delete server "${serverToDelete}"?`}
      />
    </div>
  );
}

export default MediaServersPage;