'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, CheckCircle2, FileImage, FileVideo, FileType2, Presentation, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { detectFileType, formatFileSize, type FileType } from '@/lib/professor-ai';

const fileIconMap: Record<FileType, React.ElementType> = {
  pdf: FileText,
  pptx: Presentation,
  docx: FileType2,
  image: FileImage,
  video: FileVideo,
  notes: File,
};

const fileColorMap: Record<FileType, string> = {
  pdf: 'text-red-400 bg-red-500/10',
  pptx: 'text-orange-400 bg-orange-500/10',
  docx: 'text-blue-400 bg-blue-500/10',
  image: 'text-emerald-400 bg-emerald-500/10',
  video: 'text-violet-400 bg-violet-500/10',
  notes: 'text-amber-400 bg-amber-500/10',
};

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: FileType;
  progress: number;
  status: 'uploading' | 'done';
};

const acceptedTypes = '.pdf,.pptx,.ppt,.docx,.doc,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov,.webm,.txt,.md';

export function UploadZone({
  onFilesComplete,
}: {
  onFilesComplete: (files: UploadedFile[]) => void;
}) {
  const [dragging, setDragging] = React.useState(false);
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((f) => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      type: detectFileType(f.name),
      progress: 0,
      status: 'uploading',
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((nf) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === nf.id) {
              const next = Math.min(100, f.progress + Math.random() * 20 + 10);
              if (next >= 100) {
                clearInterval(interval);
                return { ...f, progress: 100, status: 'done' };
              }
              return { ...f, progress: next };
            }
            return f;
          }),
        );
      }, 200);
    });
  };

  const allDone = files.length > 0 && files.every((f) => f.status === 'done');

  React.useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => onFilesComplete(files), 600);
      return () => clearTimeout(timer);
    }
  }, [allDone, files, onFilesComplete]);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length > 0) {
            addFiles(Array.from(e.dataTransfer.files));
          }
        }}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.005 }}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all',
          dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/30',
        )}
      >
        <motion.span
          animate={dragging ? { y: -6 } : { y: 0 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary"
        >
          <UploadCloud className="h-8 w-8" />
        </motion.span>
        <p className="mt-4 font-display text-base font-semibold">
          {dragging ? 'Drop your files here' : 'Drag & drop lecture files'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or <span className="font-medium text-primary">browse</span> to upload
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['PDF', 'PPTX', 'DOCX', 'Images', 'Video', 'Notes'].map((t) => (
            <span key={t} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(Array.from(e.target.files));
            e.target.value = '';
          }}
        />
      </motion.div>

      {/* File list */}
      <AnimatePresence>
        {files.map((file) => {
          const Icon = fileIconMap[file.type];
          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', fileColorMap[file.type])}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                {file.status === 'uploading' && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>
              {file.status === 'done' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <span className="shrink-0 text-xs font-medium text-muted-foreground">{Math.round(file.progress)}%</span>
              )}
              <button onClick={() => removeFile(file.id)} aria-label="Remove file" className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
