'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileVideo, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  violations?: number;
  location?: string;
}

export default function VideoUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [location, setLocation] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (fileList: FileList) => {
    // Validate location is provided
    if (!location.trim()) {
      alert('Please enter the location where the video was recorded');
      return;
    }

    Array.from(fileList).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please upload video files only');
        return;
      }

      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        alert('File size must be less than 500MB');
        return;
      }

      // Create new file entry
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
        location: location,
      };

      setFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);

          // Update to processing
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id
                ? { ...f, progress: 100, status: 'processing' }
                : f
            )
          );

          // Simulate processing and completion
          setTimeout(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === newFile.id
                  ? {
                    ...f,
                    status: 'completed',
                    violations: Math.floor(Math.random() * 5),
                  }
                  : f
              )
            );
          }, 2000);
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, progress } : f
            )
          );
        }
      }, 500);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploading':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 gap-1">
            <Loader className="w-3 h-3 animate-spin" />
            Uploading
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 gap-1">
            <Loader className="w-3 h-3 animate-spin" />
            Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 gap-1">
            <AlertCircle className="w-3 h-3" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Video</h1>
        <p className="text-gray-600">Submit helmet violation videos for analysis</p>
      </div>

      {/* Location Input */}
      <Card className="border-0 shadow bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Video Location</CardTitle>
          <CardDescription>Manually enter the location where the violation was recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                Violation Location <span className="text-red-600">*</span>
              </label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., EDSA near BGC, Taguig | Commonwealth Avenue, QC | Mactan-Cebu International Airport"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Be specific (include street name, landmarks, city, or intersection)
              </p>
            </div>

            {/* Common Locations Suggestions */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Common Locations:</p>
              <div className="flex flex-wrap gap-2">
                {['EDSA, Makati', 'BGC, Taguig', 'Commonwealth Ave, QC', 'Mactan-Cebu', 'Davao City'].map(
                  (loc) => (
                    <Button
                      key={loc}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(loc)}
                      className="text-xs border-gray-300 hover:bg-orange-50 hover:border-orange-300"
                    >
                      {loc}
                    </Button>
                  )
                )}
              </div>
            </div>

            {location && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Selected Location:</span> {location}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="border-0 shadow">
        <CardContent className="pt-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-orange-600 bg-orange-50'
                : 'border-gray-300 hover:border-orange-600 hover:bg-orange-50'
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drag and drop your video here
            </h3>
            <p className="text-gray-600 mb-4">or</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Browse Files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="mt-6 text-xs text-gray-500 space-y-1">
              <p>Supported formats: MP4, MOV, AVI, MKV</p>
              <p>Maximum file size: 500 MB</p>
              <p>Video will be analyzed for helmet violations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Info */}
      {files.length > 0 && (
        <Card className="border-0 shadow bg-blue-50 border-l-4 border-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FileVideo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Video Processing Information</p>
                <p className="text-sm text-blue-800 mt-1">
                  Our AI model will analyze each video to detect riders without helmets. The system will extract plate numbers and generate bounding boxes for verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Queue */}
      {files.length > 0 && (
        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle>Upload Queue</CardTitle>
            <CardDescription>{files.length} file(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <FileVideo className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        {file.location && (
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Location:</span> {file.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">{getStatusBadge(file.status)}</div>
                  </div>

                  {/* Progress Bar */}
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}%</p>
                    </div>
                  )}

                  {/* Results */}
                  {file.status === 'completed' && file.violations !== undefined && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">{file.violations}</span>
                        <span className="text-gray-600"> violation(s) detected</span>
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {file.status === 'completed' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200"
                        >
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200"
                        >
                          Create Tickets
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-red-600 border-red-200 ml-auto"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
