"use client";

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useToast } from './use-toast';

interface FileToZip {
    name: string;
    url: string;
}

export function useDownload() {
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    const downloadAllAsZip = async (files: FileToZip[], zipName: string = 'download.zip') => {
        if (!files.length) return;

        setIsDownloading(true);
        toast({ title: 'Preparing Download', description: 'Zipping files, please wait...' });

        const zip = new JSZip();

        try {
            const filePromises = files.map(async (file) => {
                try {
                    const response = await fetch(file.url);
                    if (!response.ok) throw new Error(`Failed to fetch ${file.url}`);
                    const blob = await response.blob();
                    zip.file(file.name, blob);
                } catch (e) {
                    console.error(`Failed to download ${file.name}`, e);
                    toast({
                        title: 'Download Error',
                        description: `Could not fetch ${file.name}. It will be skipped.`,
                        variant: 'destructive'
                    });
                }
            });

            await Promise.all(filePromises);

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, zipName);
            toast({ title: 'Download Complete!', description: 'Your files have been downloaded.' });
        } catch (error) {
            console.error('Error creating zip file:', error);
            toast({
                title: 'Zip Creation Failed',
                description: 'Could not create the zip file. Please try downloading files individually.',
                variant: 'destructive'
            });
        } finally {
            setIsDownloading(false);
        }
    };
    
    return { isDownloading, downloadAllAsZip };
}
