
interface Props {
    title:string
    message: string
    reloadFunc: () => void
  }
//  Media directory list
const FetchError = ({
    title,
    message,
    reloadFunc
  }: Props) => {
    return (
        <div className="box">
        <div className="flex card-header">
          <span className="grow card-title title-primary">{title}</span>
        </div>
        <div className="card-body flex-col gap-6">
          <div className="alert alert-error">
            {message}
            <button onClick={() => {
              reloadFunc();
            }} className="btn second ml-4">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default FetchError;