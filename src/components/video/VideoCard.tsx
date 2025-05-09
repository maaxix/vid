import React from 'react';
//import Image from 'next/image'
import { VideoItem } from './types';
import "./VideoCard.css";

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
  const thumbnailsTimes = video.thumbnailsTime || []
  const thumbnailUrl = `${baseServerUrl}/api/media/data/thumbs/${video.fileId}/`;
  const vidUrl = `${baseServerUrl}/api/media/stream/${video.fileId}`;

  return (
    <div className="card-wrapper">
      <div className="card">
        <div className="relative">
          <div className='flex'>
            {thumbnailsTimes.map(time => (
              <a href={vidUrl} target='__blank' className='full'>
              <img src={`${thumbnailUrl}${time}`} alt={title} className="w-full h-48 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '';}}  />
            </a>
            ))}            
            <a href={vidUrl} target='__blank'>
              <img src={`${thumbnailUrl}${thumbnailTime}`} alt={title} className="w-full h-48 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '';}}  />
            </a>
          </div>
          <div className="pill small vid-time">{formatDuration(video.duration)}</div>
        </div>
        
        <div className="p-4">
          <div className="card-title mb-2" title={title}>{title}</div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="pill small">{formatDate(video.fileUpdateDate)}</span>
            <span className="pill small">{Math.round(video.fileSize / (1024 * 1024))} MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;