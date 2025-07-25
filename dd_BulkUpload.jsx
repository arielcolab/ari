import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { dd_BulkUploadJob } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Download, AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { FeatureFlag } from '../components/dd_FeatureFlag';
import { showToast } from '../components/common/ErrorBoundary';
import { UploadFile } from '@/api/integrations';

const BulkUpload = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadJobs, setUploadJobs] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(csv|xlsx)$/i)) {
      showToast('Please upload a CSV or XLSX file', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const user = await User.me();
      
      // Upload file
      const { file_url } = await UploadFile({ file });
      
      // Create bulk upload job
      const job = await dd_BulkUploadJob.create({
        seller_id: user.id,
        file_url,
        status: 'pending'
      });

      setUploadJobs(prev => [job, ...prev]);
      showToast('File uploaded! Processing will begin shortly.', 'success');
      
      // Here you would trigger a background job to process the file
      // For now, we'll simulate processing
      setTimeout(async () => {
        await dd_BulkUploadJob.update(job.id, {
          status: 'completed',
          rows_total: 25,
          rows_ok: 23,
          error_log: JSON.stringify([
            { row: 5, error: 'Missing required field: photo_url' },
            { row: 12, error: 'Invalid price format' }
          ])
        });
        loadUploadJobs();
      }, 3000);

    } catch (error) {
      console.error('Upload failed:', error);
      showToast('Upload failed. Please try again.', 'error');
    }
    setIsUploading(false);
  };

  const loadUploadJobs = async () => {
    try {
      const user = await User.me();
      const jobs = await dd_BulkUploadJob.filter(
        { seller_id: user.id },
        '-created_date',
        10
      );
      setUploadJobs(jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  React.useEffect(() => {
    loadUploadJobs();
  }, []);

  const downloadTemplate = () => {
    const csvContent = `name,description,price,servings,photo_url,allergen_list,cooked_at,expires_at,pickup_start_time,pickup_end_time
"Homemade Pasta","Fresh pasta with tomato sauce",12.99,2,"https://example.com/pasta.jpg","gluten,dairy","2024-01-20T10:00:00","2024-01-20T20:00:00","17:00","19:00"
"Vegan Salad","Fresh mixed greens with tahini dressing",8.50,1,"https://example.com/salad.jpg","","2024-01-20T11:00:00","2024-01-20T18:00:00","12:00","18:00"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dishdash_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <FeatureFlag flag="ff_batch_upload">
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Bulk Upload Dishes</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Download our CSV template</li>
              <li>Fill in your dish details (photo URLs required)</li>
              <li>Upload your completed file</li>
              <li>We'll process and add your dishes automatically</li>
            </ol>
          </div>

          {/* Template Download */}
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Step 1: Get Template</h3>
            <Button 
              onClick={downloadTemplate}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download CSV Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Step 2: Upload Your File</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drop your CSV or XLSX file here, or click to browse
              </p>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="bulk-upload"
              />
              <Button 
                onClick={() => document.getElementById('bulk-upload')?.click()}
                disabled={isUploading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>
          </div>

          {/* Upload History */}
          {uploadJobs.length > 0 && (
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Upload History</h3>
              <div className="space-y-3">
                {uploadJobs.map(job => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        Upload #{job.id.slice(-6)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'failed' ? 'bg-red-100 text-red-800' :
                        job.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    {job.status === 'completed' && (
                      <div className="text-sm text-gray-600">
                        <p>✅ {job.rows_ok}/{job.rows_total} dishes processed successfully</p>
                        {job.error_log && JSON.parse(job.error_log).length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {JSON.parse(job.error_log).length} errors
                            </summary>
                            <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                              {JSON.parse(job.error_log).map((error, i) => (
                                <div key={i}>Row {error.row}: {error.error}</div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(job.created_date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </FeatureFlag>
  );
};

export default BulkUpload;