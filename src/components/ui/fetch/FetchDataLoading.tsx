interface Props {
    title:string
    message: string
  }
//  Media directory list
const FetchDataLoading = ({
    title,
    message,
  }: Props) => {
    return (
      <div className="box">
        <div className="flex card-header">
          <span className="grow card-title title-primary">{title}</span>
        </div>
        <div className="card-body flex-col-center">
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div className="text-center p-8">
            <div className="spinner"></div>
            <p>{message}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default FetchDataLoading;