
"use client";

import { useRef } from 'react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="relative aspect-[9/16] w-full group bg-black rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                loop
                playsInline
                controls
            />
        </div>
    );
}
