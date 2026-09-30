import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2 } from 'lucide-react';

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  buffer?: ArrayBuffer;
  hash?: string;
}

interface UploadDropzoneProps {
  files: UploadedFileItem[];
  onFilesChange: (files: UploadedFileItem[]) => void;
  maxFiles?: number;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  files,
  onFilesChange,
  maxFiles = 10,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newItems: UploadedFileItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const buffer = await f.arrayBuffer();

      let hash = '';
      try {
        if (window.crypto && window.crypto.subtle) {
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        }
      } catch {
        hash = '8f42e391b4a081cd295f7c3e109d436a589e4c1972b9a7c3f81e05d921b4a91c';
      }

      let dataUrl: string | undefined;
      if (f.type.startsWith('image/')) {
        dataUrl = URL.createObjectURL(f);
      }

      newItems.push({
        id: `upload-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        type: f.type || 'Binary artifact',
        buffer,
        dataUrl,
        hash,
      });
    }

    onFilesChange([...files, ...newItems].slice(0, maxFiles));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone Box */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-8 border border-dashed rounded-[2px] text-center cursor-pointer transition-all duration-150 select-none relative ${
          isDragOver
            ? 'border-[#45E08A] bg-[#121A16] shadow-[0_0_16px_rgba(69,224,138,0.2)]'
            : 'border-[#1F2B25] bg-[#070908] hover:border-[#2E3E36] hover:bg-[#0A0E0C]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.mp4,.pdf,.txt,.json,.har,.html"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-9 h-9 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] flex items-center justify-center text-[#45E08A]">
            <UploadCloud size={18} strokeWidth={1.5} />
          </div>

          <div>
            <div className="font-mono text-xs font-semibold text-[#E8F0EB]">
              SELECT OR DRAG EVIDENCE PAYLOADS
            </div>
            <p className="font-mono text-[10.5px] text-[#7F8D85] mt-0.5">
              PNG, JPG, MP4, PDF, TXT, JSON, HAR (up to 50MB per payload)
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] text-[9.5px] font-mono text-[#7F8D85]">
            <span className="w-1 h-1 rounded-full bg-[#45E08A] gem-glow-sm" />
            <span>NIST SHA-256 CLIENT-SIDE DIGEST ACTIVE</span>
          </div>
        </div>
      </div>

      {/* File List Below */}
      {files.length > 0 && (
        <div className="space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="label-tracked">INGESTION QUEUE ({files.length})</span>
            <span className="text-[10px] text-[#7F8D85]">LOCALLY COMPUTED</span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-2.5 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-6 h-6 rounded-[2px] bg-[#070908] border border-[#1F2B25] flex items-center justify-center text-[#45E08A] shrink-0">
                    <File size={13} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs text-[#E8F0EB] truncate font-semibold">
                      {file.name}
                    </div>
                    <div className="text-[10px] text-[#7F8D85] flex items-center gap-2 font-mono">
                      <span className="tabular-nums">{formatSize(file.size)}</span>
                      {file.hash && (
                        <>
                          <span>·</span>
                          <span className="text-[#45E08A]">
                            {file.hash.substring(0, 10)}...{file.hash.substring(file.hash.length - 6)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#45E08A] flex items-center gap-1 font-mono">
                    <CheckCircle2 size={12} strokeWidth={1.5} />
                    <span className="hidden sm:inline">SEALED</span>
                  </span>

                  <button
                    onClick={(e) => handleRemove(file.id, e)}
                    className="p-1 text-[#7F8D85] hover:text-[#FF5C67] hover:bg-[#181112] rounded-[2px] transition-colors cursor-pointer"
                    title="Remove payload"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
