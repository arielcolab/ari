import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Shield, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { createPageUrl } from "@/utils";
import { UploadFile } from "@/api/integrations";
import { showToast } from "../components/common/ErrorBoundary";

export default function CookVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    food_handler_cert: null,
    selfie_photo: null,
    business_name: '',
    business_description: ''
  });

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const user = await User.me();
      if (user.role !== 'cook') {
        navigate(createPageUrl("Home"));
      }
      if (user.is_verified_cook) {
        navigate(createPageUrl("Profile"));
      }
    } catch (error) {
      navigate(createPageUrl("Login"));
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: result.file_url }));
      showToast('File uploaded successfully!', 'success');
    } catch (error) {
      console.error("Upload error:", error);
      showToast('Upload failed. Please try again.', 'error');
    }
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    if (!formData.food_handler_cert || !formData.selfie_photo) {
      showToast('Please upload both required documents', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await User.updateMyUserData({
        is_verified_cook: true,
        food_handler_cert_url: formData.food_handler_cert,
        verification_selfie_url: formData.selfie_photo,
        business_name: formData.business_name,
        business_description: formData.business_description,
        verification_date: new Date().toISOString()
      });

      showToast('Verification submitted! You can now start posting dishes.', 'success');
      navigate(createPageUrl("Profile"));
    } catch (error) {
      console.error("Verification error:", error);
      showToast('Verification failed. Please try again.', 'error');
    }
    setIsSubmitting(false);
  };

  const FileUploadCard = ({ title, description, field, icon: Icon, uploaded }) => (
    <Card className={`border-2 border-dashed ${uploaded ? 'border-green-500 bg-green-50' : 'border-gray-300'} hover:border-red-400 transition-colors`}>
      <CardContent className="p-6 text-center">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileUpload(e, field)}
          className="hidden"
          id={field}
          disabled={isUploading}
        />
        <label htmlFor={field} className="cursor-pointer">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${uploaded ? 'bg-green-100' : 'bg-gray-100'}`}>
            {uploaded ? <CheckCircle2 className="w-8 h-8 text-green-600" /> : <Icon className="w-8 h-8 text-gray-400" />}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <Button variant="outline" disabled={isUploading}>
            {isUploading ? "Uploading..." : (uploaded ? "Replace File" : "Upload File")}
          </Button>
        </label>
      </CardContent>
    </Card>
  );

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Profile"))}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Cook Verification</h1>
          </div>
        </div>

        <div className="p-4 max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Verified</h2>
            <p className="text-gray-600">
              Complete verification to start selling on DishDash. This helps build trust with buyers.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                What you'll need:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Food Handler's Certificate (ANSI accredited)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Clear selfie photo for identity verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Basic business information
                </li>
              </ul>
            </CardContent>
          </Card>

          <Button
            onClick={() => setStep(2)}
            className="w-full bg-red-500 hover:bg-red-600 h-12"
          >
            Start Verification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white/90 backdrop-blur-sm px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Upload Documents</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid gap-4">
          <FileUploadCard
            title="Food Handler's Certificate"
            description="Upload your valid ANSI accredited food safety certificate"
            field="food_handler_cert"
            icon={Upload}
            uploaded={formData.food_handler_cert}
          />

          <FileUploadCard
            title="Identity Verification"
            description="Take a clear selfie for identity verification"
            field="selfie_photo"
            icon={Camera}
            uploaded={formData.selfie_photo}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name (Optional)</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="e.g., Maria's Kitchen"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="business_description">About Your Cooking (Optional)</Label>
              <Input
                id="business_description"
                value={formData.business_description}
                onChange={(e) => setFormData(prev => ({ ...prev, business_description: e.target.value }))}
                placeholder="Tell customers about your cooking style..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.food_handler_cert || !formData.selfie_photo}
          className="w-full bg-red-500 hover:bg-red-600 h-12"
        >
          {isSubmitting ? "Submitting..." : "Submit for Verification"}
        </Button>
      </div>
    </div>
  );
}