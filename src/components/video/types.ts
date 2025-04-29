export interface VideoItem {
    fileId: string;
    metadataKey: string;
    filename: string;
    dir: string;
    fileExt: string;
    fileSize: number;
    fileUpdateDate: string;
    duration: number;
    creation_time: string | null;
    dataTitle: string | null;
    dataCover: string | null;
    dataImage: string | null;
    dataTags: string[] | null;
    dataPeople: string[] | null;
    thumbnailsTime: number[];
    metadataError: string | null;
    thumbnailsError: string | null;
  }
  
  export interface ApiResponse {
    filter: {
      q: string;
    };
    sort: {
      sortBy: string;
      sortOrder: string;
    };
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    results: VideoItem[];
  }