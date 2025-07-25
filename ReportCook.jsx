import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useTranslation } from "../components/utils/translations";
import { Report } from "@/api/entities";
import { showToast } from "../components/common/ErrorBoundary";

const REPORT_REASONS = [
  { id: 'inappropriate_content', label: 'Inappropriate content' },
  { id: 'suspicious_activity', label: 'Suspicious activity' },
  { id: 'violation_guidelines', label: 'Violation of community guidelines' },
  { id: 'other', label: 'Other' }
];

export default function ReportCook() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      showToast('Please select a reason for reporting', 'error');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const cookId = urlParams.get('cookId');

    if (!cookId) {
      showToast('Invalid cook ID', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await Report.create({
        reporter_id: 'current_user', // This would be the current user's ID
        reported_cook_id: cookId,
        reason: selectedReason,
        details: details
      });

      showToast('Report submitted successfully. Thank you for helping keep our community safe.', 'success');
      navigate(-1);
    } catch (error) {
      console.error('Error submitting report:', error);
      showToast('Error submitting report. Please try again.', 'error');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('report')}</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">{t('reportThisCook')}</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            {t('reportDescription')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-medium text-gray-900 mb-4 block">
                {t('reasonForReporting')}
              </Label>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                {REPORT_REASONS.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id} className="text-gray-700">
                      {t(reason.id) || reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="details" className="text-base font-medium text-gray-900 mb-2 block">
                {t('provideMoreDetails')} {selectedReason === 'other' ? '*' : '(Optional)'}
              </Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please provide additional context..."
                className="h-24 resize-none"
                required={selectedReason === 'other'}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !selectedReason}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl"
            >
              {isSubmitting ? 'Submitting...' : t('submitReport')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}