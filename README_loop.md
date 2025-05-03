
### loop list
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


### loop keys
Object.entries(servers).map(async ([name, server]) => {
try {
    const res = await fetch(`${server.url}/api/ping`, { method: 'GET' });
    newStatuses[name] = res.ok ? 'online' : 'offline';
} catch {
    newStatuses[name] = 'offline';
}
})