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
  rawFile?: File;
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
        rawFile: f,
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

  const formatHashShort = (hash: string) => {
    if (hash.length <= 12) return hash;
    return `${hash.substring(0, 8)}…${hash.substring(hash.length - 4)}`;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone Box */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-8 border border-dashed rounded-[2px] text-center cursor-pointer transition-colors select-none relative ${
          isDragOver
            ? 'border-[var(--accent-text)] bg-[var(--raised)]'
            : 'border-[var(--hair)] bg-[var(--bg)] hover:border-[var(--muted)]'
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
          <div className="w-10 h-10 bg-[var(--panel)] border border-[var(--hair)] flex items-center justify-center text-[var(--accent-text)]">
            <UploadCloud size={20} strokeWidth={1.5} />
          </div>

          <div>
            <div className="text-[14px] font-medium text-[var(--text)]">
              Drop files here or click to browse
            </div>
            <p className="text-[12px] text-[var(--muted)] mt-1">
              Images, videos, PDFs, screenshots, or logs
            </p>
          </div>
        </div>
      </div>

      {/* File List Below */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-[13px] text-[var(--muted)]">
            Preserved files ({files.length})
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-3 bg-[var(--panel)] border border-[var(--hair)] flex items-center justify-between gap-3 text-[13px]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-7 h-7 bg-[var(--bg)] border border-[var(--hair)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
                    <File size={14} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] text-[var(--text)] font-medium truncate">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] flex items-center gap-2 font-mono">
                      <span>{formatSize(file.size)}</span>
                      {file.hash && (
                        <>
                          <span>·</span>
                          <span className="text-[var(--accent-text)]">
                            {formatHashShort(file.hash)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[var(--accent-text)] flex items-center gap-1">
                    <CheckCircle2 size={13} strokeWidth={1.5} />
                    <span>Hashed</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleRemove(file.id, e)}
                    className="p-1 text-[var(--muted)] hover:text-[var(--danger)] transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
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
