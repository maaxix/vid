"use client";
import { useState, useEffect } from "react";
import { onMessage, emitMessage } from '@/components/eventBus';

import { Modal } from './NavModal'

import { MediaServerDir, validateForm, createMediaDir, updateMediaDir, deleteMediaDir } from './MediaServerSettingsService';

/**
 * Represents the type of operation to perform on a modal.
 * 
 * @typedef {number} OpType
 * @property {0} NONE - No modal should be shown
 * @property {1} ADD - Show the "Add" modal
 * @property {2} EDIT - Show the "Edit" modal
 * @property {3} DELETE - Show the "Delete" modal
 */
type OpType = 0 | 1 | 2 | 3;

type Message = {
  data: MediaServerDir
  opType: OpType 

};

interface Props {
  onClose: () => void;
  onSuccess: (item: MediaServerDir, id:string, opType:number) => void; // callback with edited or 
  serverUrl:string;
}

export function CrudModal({
  onClose,
  onSuccess,
  serverUrl,
}: Props) {
  const [initData, setInitData] = useState<MediaServerDir>({ name: "", path:"" });
  const [opType, setOpType] = useState<OpType>(0); 

  const [errors, setErrors] = useState<Record<string, string>>({name: "", path: ""});


  useEffect(() => {
    console.log(`CrudModal: useEffect ${window.location.hash} opType=${opType}`);
    const handler = (msg:unknown) => {
      console.log(`CrudModal: handler START`);
      const vmsg = msg as Message;
      // Note: all set state will fire only one render
      setOpType(vmsg.opType);
      setInitData(vmsg.data);
      setErrors({})
      window.location.hash = window.location.hash + "#modal";
      console.log(`CrudModal: handler END`);
    };
    if(opType== 0 && window.location.hash.endsWith("#modal")){
      window.history.back();
    }
    const unsubscribe = onMessage("modal", handler  );
    return unsubscribe;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    //const { name, value } = e.target;
    //setInitData(prev => ({ ...prev, [name]: value }));
    
    // Clear error if exists when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("onSubmit START");
    e.preventDefault();
    handleSubmit(e);
    console.log("onSubmit END");
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(`CrudModal: handleSubmit ${window.location.hash}`);
    //e.preventDefault();
    
    const frm = e.currentTarget;
    const formData = new FormData(frm);
    const formValues = Object.fromEntries(formData) as unknown as MediaServerDir;

    try {
      const validateResult = validateForm(formValues);
      if(validateResult._error){
        setErrors(validateResult);
        return false;
      }
      if (opType === 1) {
        await createMediaDir(serverUrl, formValues);
        console.log("CrudModal: handleSubmit createMediaDir");
      } 
      else if (opType === 2) {
        await updateMediaDir(serverUrl, initData.name, formValues);
        console.log("CrudModal: handleSubmit updateMediaDir");
      }
      console.log("CrudModal: handleSubmit onSuccess before");
      handleClose(true);
      onSuccess(formValues, initData.name, opType);
      console.log("CrudModal: handleSubmit onSuccess after");

    } catch (e: unknown) {
      console.error("CrudModal: handleSubmit", e);
      emitMessage("alert", e);
    }
    return false;
  };

  const confirmDelete = async () =>{
    try{
      await deleteMediaDir(serverUrl, initData.name);
      handleClose(true);
      onSuccess(initData, initData.name, opType);
    }
    catch(e:unknown){
      console.error("CrudModal: confirmDelete", e);
      emitMessage("alert", e);      
    }
  }
  const handleClose = (canNavBack:unknown) =>{
    console.log(`CrudModal: handleClose ${window.location.hash} opType=${opType}` )
    console.log(canNavBack);
    setOpType(0);
    if(window.location.hash.endsWith("#modal")){
      if(canNavBack)
        window.history.back();
        //navigate(-1);
    }      
    onClose();
    //setTimeout(() => setOpType(0), 300); // Delay unmounting
  }
  
  console.log(`CrudModal: render **************************************  opType=${opType}`)
  //if(!isOpen) return null;
  if(!opType) return null;

  if( opType===3){
    return(
      <Modal onClose={handleClose} modalType="center">
        <div className="card-title mb-4">{"Edit Media directory"}</div>
        <p className="mb-8">{"Are you sure to delete"}</p>
        <div className="flex gap-3 min-w-500">
          <button onClick={handleClose} className="btn second">Cancel </button>
          <button onClick={confirmDelete} className="btn primary">Confirm</button>
        </div>
      </Modal>
    )
  }
  return (
    <Modal onClose={handleClose} modalType="bottom">
      <form onSubmit={onSubmit} className="w-full">
        <div className="card-title mb-4">{opType==2 ? "Edit Media directory" : "Add Media directory"}</div>
        <div className="w-full min-w-500">
          <div className="fld">
            <input
              type="text"
              name="name"
              className={`fld-input ${errors.name ? "border-red-500" : ""}`}
              placeholder="Name"
              defaultValue={initData.name || ""}
              onChange={handleChange}
              /*disabled={opType==2}*/
            />
            {errors.name && <div className="fld-error text-red-500 text-sm mb-2">{errors.name}</div>}
          </div>
          <div className="fld">
            <input
              type="text"
              name="path"
              className={`fld-input border p-2 rounded w-full mb-1 ${errors.path ? "border-red-500" : ""}`}
              placeholder="Directory Path"
              defaultValue={initData.path || ""}
              onChange={handleChange}
            />
            {errors.path && <div className="fld-error text-red-500 text-sm mb-2">{errors.path}</div>}
          </div>
          
        </div>

        <div>
          <div className="flex gap-3">
            <button type="button" onClick={handleClose} className="btn second">Cancel</button>
            <button type="submit" className="btn primary">Save</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
