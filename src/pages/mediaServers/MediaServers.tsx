import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

import { useConfig } from '../../components/config/ConfigContext'
import { ConfirmModal } from './ConfirmDeleteModal'
import { AddOrEditServerModal } from './AddOrEditServerModal'
import { Link } from 'react-router-dom'

interface ServerEntry {
  name: string
  url: string
  apiKey: string
}


function MediaServers () {
  const location = useLocation();
  const pathname = location.pathname;

  const { config, updateConfig } = useConfig()
  const [servers, setServers] = useState<Record<string, ServerEntry>>({})
  const [statuses, setStatuses] = useState<Record<string, 'online' | 'offline' | 'unknown'>>({})

  const [addEditOpen, setAddEditOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const [currentServer, setCurrentServer] = useState<ServerEntry | null>(null)
  const [serverToDelete, setServerToDelete] = useState<string | null>(null)


  useEffect(() => {
    if (config?.servers) {
      const tempServers: Record<string, ServerEntry> = {}
      config.serverOrder.forEach((name) => {
        if (config.servers[name]) {
          tempServers[name] = { name, ...config.servers[name] }
        }
      })
      setServers(tempServers)
    }
  }, [config])

  useEffect(() => {
    const checkStatuses = async () => {
      const newStatuses: Record<string, 'online' | 'offline' | 'unknown'> = {}

      await Promise.all(
        Object.entries(servers).map(async ([name, server]) => {
          try {
            const res = await fetch(`${server.url}/api/ping`, { method: 'GET' })
            if (res.ok) {
              newStatuses[name] = 'online'
            } else {
              newStatuses[name] = 'offline'
            }
          } catch {
            newStatuses[name] = 'offline'
          }
        })
      )

      setStatuses(newStatuses)
    }

    if (Object.keys(servers).length > 0) {
      checkStatuses()
    }
  }, [servers])

  const saveServers = (updated: Record<string, ServerEntry>) => {
    const newServers: Record<string, { url: string; apiKey: string }> = {}
    const newOrder: string[] = []

    Object.entries(updated).forEach(([name, server]) => {
      newServers[name] = { url: server.url, apiKey: server.apiKey }
      newOrder.push(name)
    })

    const newConfig = { ...config, servers: newServers, serverOrder: newOrder }
    updateConfig(newConfig)
  }

  const handleAdd = () => {
    setCurrentServer(null)
    setAddEditOpen(true)
  }

  const handleEdit = (name: string) => {
    const server = servers[name]
    if (server) {
      setCurrentServer({ ...server })
      setAddEditOpen(true)
    }
  }

  const handleDelete = (name: string) => {
    setServerToDelete(name)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (serverToDelete) {
      const updated = { ...servers }
      delete updated[serverToDelete]
      saveServers(updated)
      setServerToDelete(null)
    }
    setDeleteConfirmOpen(false)
  }

  const handleSave = (server: ServerEntry) => {
    const updated = { ...servers, [server.name]: { name: server.name, url: server.url, apiKey: server.apiKey } }
    saveServers(updated)
    setAddEditOpen(false)
  }


  return (
    <div className="box">
      <div className="flex card-header">
        <span className="grow card-title">Server Manager</span>
        <nav className="">
          <button onClick={handleAdd} className="btn second tooltip">Add Server<span className="tooltip-top tooltiptext">Add Server</span></button>
        </nav>
      </div>

      <div className="card-body flex-col gap-4">
        {Object.entries(servers).map(([name, server]) => (
          <div key={name} className="card flex gap-2 box p-2">
            <Link  to={`${pathname}/${server.name}`} className='grow'>
              <h4 className="text-lg font-semibold">{name}</h4>
              <p className="text-sm text-gray-500">{server.url}</p>
              <p className={`text-sm mt-1 ${statuses[name] === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                Status: {statuses[name] || 'unknown'}
              </p>
            </Link>
            <div className="flex-start">
              <Link  to={`${pathname}/${server.name}/settings`} className="btn btn-icon"><i className="icon icon-gear"></i>Settings</Link>
              <button onClick={() => handleEdit(name)} className="btn btn-icon"><i className="icon icon-edit"></i></button>
              <button onClick={() => handleDelete(name)} className="btn btn-icon"><i className="icon icon-del"></i></button>
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
  )
}

export default MediaServers ;