import React from 'react';
//import Image from 'next/image'
import { VideoItem } from './types';

interface VideoCardProps {
  video: VideoItem;
  baseServerUrl: string;
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const VideoCard: React.FC<VideoCardProps> = ({ video, baseServerUrl }) => {
  const title = video.dataTitle || video.filename;
  const thumbnailTime = video.thumbnailsTime?.[0] || 0;
  const thumbnailUrl = `${baseServerUrl}/api/media/data/thumbs/${video.fileId}/${thumbnailTime}`;
  const vidUrl = `${baseServerUrl}/api/media/stream/${video.fileId}`;

  return (
    <div className="card-wrapper">
      <div className="card">
        <div className="relative">
          <a href={vidUrl} target='__blank'>
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '';
              }}
            />
          </a>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2" title={title}>
            {title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {formatDate(video.fileUpdateDate)}
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {Math.round(video.fileSize / (1024 * 1024))}MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;