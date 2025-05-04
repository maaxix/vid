'use client';

import { useEffect, useState, useRef, useCallback} from 'react';
import { useParams } from 'react-router-dom';

import mediaServersService from '@/pages/mediaServers/MediaServersService';
import VideoCard from '@/components/video/VideoCard';
import SearchBar from '@/components/video/SearchBar';
import { VideoItem, ApiResponse } from '@/components/video/types';

export default function VideoSearchPage() {
//export default function VideoSearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = useParams<{ id: string }>();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [baseServerUrl, setBaseServerUrl] = useState<string >("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  //console.log(`id=${id}`)
 

  const fetchVideos = useCallback(async (currentPage: number, query: string = '', reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const server = mediaServersService.findServerByName(id||"");
      if(!server){
        throw new Error(`Endpoint with name "${id}" not found`);
      }
      const serverUrl =server.url;
      const url = new URL(serverUrl+'/api/media/search', window.location.origin);
      if (query) url.searchParams.append('q', query);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', '20');
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch videos');
      
      const data: ApiResponse = await response.json();
      
      if (reset) {
        setVideos(data.results);
      } else {
        setVideos(prev => [...prev, ...data.results]);
      }
      
      setTotalPages(data.totalPages);
      setPage(currentPage);
      setBaseServerUrl(serverUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      if (initialLoad) setInitialLoad(false);
    }
  }, [loading, initialLoad]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    fetchVideos(1, query, true);
  };

  // Infinite scroll setup
  useEffect(() => {
    if (initialLoad) {
      fetchVideos(1, searchQuery, true);
      return;
    }

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    observer.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && page < totalPages && !loading) {
        fetchVideos(page + 1, searchQuery);
      }
    }, options);

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [page, totalPages, loading, searchQuery, initialLoad, fetchVideos]);

  return (
    <div className="container">
      <div className="card-title p-3 title-primary">Video Search</div>
      
      <SearchBar onSearch={handleSearch} />
      
      {error && (
        <div className="card-body border-red-400 text-red-700 px-4">
          {error}
        </div>
      )}
      
      {!initialLoad && videos.length === 0 && !loading && (
        <div className="card-body text-center py-12">
          <p className="text-xl text-gray-600">No videos found</p>
        </div>
      )}
      
      { videos.length > 0 && (
        <div className="card-title p-3 title-primary">Video List</div>
      )}
      <div className="container-grid">
        {videos.map((video) => (
                    <VideoCard 
                    key={video.fileId} 
                    video={video} 
                    baseServerUrl={baseServerUrl} 
                  />
        ))}
      </div>
      
      <div ref={loadMoreRef} className="h-10"></div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}