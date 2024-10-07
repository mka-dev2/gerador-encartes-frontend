"use client";

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFilesUploaded: (uploadedFiles: File[]) => void;
}

export default function FileUploader({ onFilesUploaded }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesUploaded(acceptedFiles); // Apenas envia os arquivos como File[]
  }, [onFilesUploaded]);

  // Adiciona o accept para apenas imagens
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [] // Aceita apenas arquivos de imagem
    }
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 border-gray-400 p-6 rounded-lg text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Solte os arquivos aqui...</p>
      ) : (
        <p>Arraste e solte arquivos de imagem aqui, ou clique para selecionar.</p>
      )}
    </div>
  );
}