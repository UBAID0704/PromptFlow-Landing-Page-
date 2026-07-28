import React, { useState, useRef } from 'react';

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  // Validate File
  const validateAndSetFile = (selectedFile) => {
    setUploadError(null);
    setUploadedFile(null);

    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setUploadError('Invalid file format. Only JPG, PNG, PDF, and DOCX files are allowed.');
      return;
    }

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`File is too large. Maximum limit is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(selectedFile);

    // Image preview generator
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null); // Document icon fallback
    }
  };

  // Handlers
  const handleFileSelect = (e) => validateAndSetFile(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Upload Request using XMLHttpRequest (for smooth progress bar)
  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/upload', true);

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setUploadedFile(response.file);
        setFile(null);
        setPreviewUrl(null);
      } else {
        const response = JSON.parse(xhr.responseText);
        setUploadError(response.error || 'Upload failed.');
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setUploadError('Network error while uploading file.');
    };

    xhr.send(formData);
  };

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', padding: '2rem', background: 'rgba(17, 20, 24, 0.95)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}>
      
      <h3 style={{ marginTop: 0, fontSize: '1.25rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        📄 AI Document & Image Upload
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1.5rem' }}>
        Upload documents for AI summarization or images for code analysis.
      </p>

      {/* ERROR BANNER */}
      {uploadError && (
        <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
          ⚠️ {uploadError}
        </div>
      )}

      {/* DRAG AND DROP ZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: `2px dashed ${isDragOver ? '#6366f1' : 'rgba(255, 255, 255, 0.2)'}`,
          background: isDragOver ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0, 0, 0, 0.2)',
          padding: '2.5rem 1rem',
          borderRadius: '12px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☁️</div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>
          Drag & drop your file here, or <span style={{ color: '#818cf8', textDecoration: 'underline' }}>browse</span>
        </p>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '0.5rem', display: 'block' }}>
          Supported: PDF, DOCX, PNG, JPG (Max {MAX_SIZE_MB}MB)
        </span>
      </div>

      {/* FILE PREVIEW & PROGRESS CARD */}
      {file && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {file.name.split('.').pop().toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {file.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setPreviewUrl(null); }}
              disabled={isUploading}
              style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Remove
            </button>
          </div>

          {/* PROGRESS BAR */}
          {isUploading && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.25rem' }}>
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#6366f1', transition: 'width 0.1s linear' }}></div>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer' }}
          >
            {isUploading ? 'Uploading File...' : 'Upload & Process with AI'}
          </button>
        </div>
      )}

      {/* SUCCESS CARD (POST-UPLOAD DISPLAY) */}
      {uploadedFile && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4ade80' }}>
                  {uploadedFile.originalName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Successfully stored on server
                </div>
              </div>
            </div>
            <a
              href={uploadedFile.url}
              target="_blank"
              rel="noreferrer"
              style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', textDecoration: 'none', fontSize: '0.8rem' }}
            >
              View / Download 🔗
            </a>
          </div>
        </div>
      )}

    </div>
  );
}