import { ApiResponse } from '@/components/video/types';


export const searchMedia = async (serverUrl:string, id:string, query:string, currentPage:number ): Promise<ApiResponse> => {
    const url = new URL(serverUrl+'/api/media/search', window.location.origin);
    if (query) url.searchParams.append('q', query);
    url.searchParams.append('page', currentPage.toString());
    url.searchParams.append('limit', '20');
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch videos');
    
    const data: ApiResponse = await response.json();

    return data;
};