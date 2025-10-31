import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UploadClothes = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const mappedFiles = acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles(curr => [...curr, ...mappedFiles]);
    }
  });

  const removeFile = (file) => {
    setFiles(files.filter(f => f !== file));
  };

  const uploadFiles = async () => {
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    files.forEach(file => {
      formData.append('clothes', file);
    });
    try {
      const res = await axios.post('http://localhost:5007/api/upload-clothes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("hey");
      setMessage(res.data.message);
      console.log("hey");
      setFiles([]);
      console.log("hey");
    } catch (error) {
      setMessage('Upload failed');
    }
    setUploading(false);
  };

  return (
    <div>
      <h2>Upload Clothes</h2>
      <div
        {...getRootProps()}
        style={{ border: '2px dashed #888', padding: 20, marginBottom: 20, cursor: 'pointer' }}
      >
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select files</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {files.map(file => (
          <div key={file.name} style={{ position: 'relative' }}>
            <img src={file.preview} alt={file.name} width={100} height={100} style={{ objectFit: 'cover', borderRadius: 6 }} />
            <button
              onClick={() => removeFile(file)}
              style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20 }}
            >x</button>
          </div>
        ))}
      </div>
      <button onClick={uploadFiles} disabled={uploading || files.length === 0} style={{ marginTop: 20 }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      <p>{message}</p>
    </div>
  );
};

export default UploadClothes;
