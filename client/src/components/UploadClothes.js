import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UploadClothes = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const mappedFiles = acceptedFiles.map(file =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setFiles(curr => [...curr, ...mappedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop
  });

  // Remove a single file
  const removeFile = (file) => {
    // Revoke the preview URL to avoid memory leaks
    URL.revokeObjectURL(file.preview);
    setFiles(files.filter(f => f !== file));
  };

  // Upload files to backend
  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    files.forEach(file => {
      // Key 'clothes' must match backend
      formData.append('clothes', file);
    });

    try {
      const res = await axios.post('http://localhost:5007/api/upload-clothes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Success
      setMessage(res.data.message || 'Upload successful');

      // Clear files after upload and revoke object URLs
      files.forEach(file => URL.revokeObjectURL(file.preview));
      setFiles([]); // <-- this line clears files after upload

    } catch (error) {
      console.error(error);
      setMessage('Upload failed');
    }

    setUploading(false);
  };

  return (
    <div>
      <h2>Upload Clothes</h2>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{ border: '2px dashed #888', padding: 20, marginBottom: 20, cursor: 'pointer' }}
      >
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select files</p>
      </div>

      {/* Preview thumbnails */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {files.map(file => (
          <div key={file.name} style={{ position: 'relative' }}>
            <img
              src={file.preview}
              alt={file.name}
              width={100}
              height={100}
              style={{ objectFit: 'cover', borderRadius: 6 }}
            />
            <button
              onClick={() => removeFile(file)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                cursor: 'pointer',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 20,
                height: 20
              }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {/* Upload button */}
      <button
        onClick={uploadFiles}
        disabled={uploading || files.length === 0}
        style={{ marginTop: 20 }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Message */}
      <p>{message}</p>
    </div>
  );
};

export default UploadClothes;
