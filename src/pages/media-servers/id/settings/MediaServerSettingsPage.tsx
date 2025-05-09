
import { useEffect, useState } from 'react';

import { emitMessage } from '@/components/eventBus';
import FetchError from '@/components/ui/fetch/FetchError';
import FetchDataLoading from '@/components/ui/fetch/FetchDataLoading';

import mediaServersService from '@/pages//media-servers/MediaServersService';

import { MediaServerDir, fetchMediaDir } from './MediaServerSettingsService';

import { CrudModal } from './CrudModal';

/*
  Note: rendering steps
  1- render the component in initail state
  2- execute the function inside the useEffect
  3- the render will fire for each change in useState 
*/
export default function MediaServerSettingsPage() {
  // note using import { useNavigate , useLocation} will fire rendering twice

  const id :string = window.location.hash.split("/")[2]; //;useParams<{ id: string }>();
  /* */
  const [list, setList] = useState<MediaServerDir[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);   
  
  const [serverBaseUrl] = useState<string>(mediaServersService.findServerUrlByName(id) || "");   

  useEffect(() => {
    console.log(`MediaServerSettingsPage: useEffect`);
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMediaDir(serverBaseUrl||"");
      console.log(`MediaServerSettingsPage: loadData 2`)
      setList(data);
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load media servers';
      setError(msg);
      emitMessage("alert", msg);
    } finally {
      console.log(`MediaServerSettingsPage: loadData 3`);
      setIsLoading(false);
    }
  };

  const handleClickCreate = () => {
    console.log("MediaServerSettingsPage: handleClickCreate");
    emitMessage("modal", {opType:1, data:{ name: "", path:"" }});

    
  }
  const handleClickEdit = (e: React.MouseEvent<HTMLElement>) => {
    const elm = (e.currentTarget as HTMLElement).closest('li');
    if(!elm) return;
    const id = elm.dataset.id; // for data-id attributes
    //const text = elm.textContent;
    const item = list.find(item => item.name === id);
    if(!item) return;
    emitMessage("modal", {opType:2, data:item});

    console.log("MediaServerSettingsPage: handleClickEdit")    
  }
  const handleClickDelete = (e: React.MouseEvent<HTMLElement>) => {
    const elm = (e.currentTarget as HTMLElement).closest('li');
    if(!elm) return;
    const id = elm.dataset.id; // for data-id attributes
    //const text = elm.textContent;
    const item = list.find(item => item.name === id);
    if(!item) return;
    emitMessage("modal", {opType:3, data:item});  
  }

  const handleSuccess = (item: MediaServerDir,id:string, opType:number) => {
    console.log(`MediaServerSettingsPage: handleSuccess ${window.location.hash} ${id}` );
    if(opType===1)
      setList(prev => [...prev, item]);
    else if(opType==2)
      setList(prev => prev.map(i => (i.name === id ? item : i)));
    else if(opType ==3){
      setList(prev => prev.filter(i => (i.name === id ? false : true)));
    }
  };
  
  console.log(`MediaServerSettingsPage: render ==id=${id} isLoading=${isLoading} list=${list.length} ${window.location.hash}` )
  if (isLoading) {
    return (
      <FetchDataLoading title="Media directory list" message="Loading media directories..." />
    );
  }

  if (error) {
    return (  
      <FetchError title="Media directory list" message={error} reloadFunc={loadData} />
    );
  }

  return (
    <div className="box">
      <div className="flex card-header">
        <span className="grow card-title title-primary">Media directory list</span>
        <nav className="">
          <button onClick={handleClickCreate} className="btn second tooltip">
          Add Directory<span className="tooltip-top tooltiptext">Add Directory</span>
          </button>
        </nav>
      </div>

      <div className="card-body flex-col gap-6">
        {list.map(row => (
          <li key={row.name} className="card1 flex gap-2 box p-2" data-id={row.name}>
            <div className='grow'>
              <h4 className="text-lg font-semibold">{row.name}</h4>
              <p className="text-sm text-gray-500">{row.path}</p>
            </div>
            <div className="flex-start">
              <button onClick={handleClickEdit} className="btn btn-icon">
                <i className="icon icon-edit"></i>
              </button>
              <button onClick={handleClickDelete} className="btn btn-icon">
                <i className="icon icon-del"></i>
              </button>
            </div>
          </li>
        ))}
      </div>

      <CrudModal
        onClose={() => {return}}
        onSuccess={handleSuccess}
        serverUrl={serverBaseUrl}
      />

    </div>
  );
}