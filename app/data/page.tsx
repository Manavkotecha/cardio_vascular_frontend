'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ScatterPlot } from '../../components/charts/ScatterPlot';
import { Upload, FileSpreadsheet, Database, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const { data } = useQuery({
    queryKey: ['data', 'samples'],
    queryFn: () => api.getDatasetSamples(100),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadDataset(file),
    onSuccess: (data) => {
      toast.success(`Successfully processed ${data.processed} records`, {
        style: { background: '#111827', color: '#f8fafc', border: '1px solid #334155' },
      });
      setFile(null);
    },
    onError: () => {
      toast.error('Upload failed', {
        style: { background: '#111827', color: '#f8fafc', border: '1px solid #334155' },
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-risk-medium/20 via-background-card to-risk-low/10 border border-slate-700/50 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-risk-medium/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-risk-medium to-risk-low rounded-xl">
            <Database className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Data Explorer</h1>
            <p className="text-text-muted mt-1">Upload and visualize datasets</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Upload className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Upload Dataset</CardTitle>
              <p className="text-sm text-text-muted mt-0.5">Upload a CSV file to train the model</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className={`
              relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
              ${isDragActive 
                ? 'border-accent bg-accent/10' 
                : file 
                  ? 'border-risk-low bg-risk-low/10' 
                  : 'border-slate-600 hover:border-slate-500 hover:bg-background-hover'
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {file ? (
              <div className="space-y-4">
                <div className="inline-flex p-4 bg-risk-low/20 rounded-2xl">
                  <CheckCircle className="h-10 w-10 text-risk-low" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-text-primary">{file.name}</p>
                  <p className="text-sm text-text-muted mt-1">
                    {(file.size / 1024).toFixed(1)} KB • Ready to upload
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="primary"
                    onClick={() => file && uploadMutation.mutate(file)}
                    loading={uploadMutation.isPending}
                    icon={<Upload className="h-5 w-5" />}
                  >
                    Upload Now
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setFile(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex p-4 bg-background-hover rounded-2xl">
                  <FileSpreadsheet className="h-10 w-10 text-text-muted" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-text-primary">
                    {isDragActive ? 'Drop your file here' : 'Drag and drop your CSV file'}
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    or click to browse from your computer
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="primary" as="span" icon={<Upload className="h-5 w-5" />}>
                    Choose CSV File
                  </Button>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visualization Section */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Dataset Visualization</CardTitle>
            <p className="text-sm text-text-muted mt-0.5">
              Scatter plot showing relationship between features
            </p>
          </CardHeader>
          <CardContent>
            <ScatterPlot
              data={data}
              xKey="cholesterol"
              yKey="age"
              xLabel="Cholesterol (mg/dL)"
              yLabel="Age (years)"
            />
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-accent">70,000+</div>
          <div className="text-sm text-text-muted mt-1">Training Samples</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-risk-low">11</div>
          <div className="text-sm text-text-muted mt-1">Input Features</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-light">2</div>
          <div className="text-sm text-text-muted mt-1">Output Classes</div>
        </Card>
      </div>
    </div>
  );
}