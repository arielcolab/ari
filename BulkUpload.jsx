import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UploadCloud, FileText, X } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { useDropzone } from 'react-dropzone';
import { showToast } from '../components/common/ErrorBoundary';
// In a real scenario, you'd import an integration like this:
// import { UploadFile } from '@/api/integrations';
// import { dd_BulkUploadJob as BulkUploadJob } from '@/api/entities';

export default function BulkUpload() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        },
        multiple: false
    });

    const handleUpload = async () => {
        if (!file) {
            showToast(t('pleaseSelectFile', 'Please select a file first'), 'error');
            return;
        }
        setIsUploading(true);
        // This is a placeholder for the actual upload logic
        console.log("Uploading file:", file.name);
        // const { file_url } = await UploadFile({ file });
        // await BulkUploadJob.create({ seller_id: 'current_user_id', file_url });
        setTimeout(() => {
            showToast(t('uploadStarted', 'Upload started! You will be notified upon completion.'), 'success');
            setIsUploading(false);
            navigate(-1);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white p-4 flex items-center border-b">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5"/></Button>
                <h1 className="text-xl font-bold mx-auto">{t('batchUpload', 'Batch Upload')}</h1>
            </div>
            <div className="p-4">
                <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-red-400'}`}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    {isDragActive ? (
                        <p className="text-red-600">{t('dropFilesHere', 'Drop the files here ...')}</p>
                    ) : (
                        <p>{t('dragDropFile', 'Drag & drop a CSV or XLSX file here, or click to select')}</p>
                    )}
                </div>
                {file && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-gray-600"/>
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">{Math.round(file.size / 1024)} KB</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
                <div className="mt-6">
                    <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full h-12 bg-red-600 hover:bg-red-700">
                        {isUploading ? t('uploading', 'Uploading...') : t('startUpload', 'Start Upload')}
                    </Button>
                </div>
                <div className="mt-4 text-center">
                    <a href="/sample_template.csv" download className="text-sm text-red-600 hover:underline">{t('downloadTemplate', 'Download template')}</a>
                </div>
            </div>
        </div>
    );
}