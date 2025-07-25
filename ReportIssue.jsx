import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Clock, CreditCard, HelpCircle, MessageCircle, Mail } from "lucide-react";
import { createPageUrl } from "@/utils";

const IssueOption = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-start gap-4 p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors text-left"
  >
    <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">
      <Icon className="w-6 h-6 text-gray-600" />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </button>
);

const ContactOption = ({ icon: Icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors"
  >
    <div className="bg-gray-100 p-3 rounded-full">
      <Icon className="w-6 h-6 text-gray-600" />
    </div>
    <span className="font-semibold text-gray-900">{title}</span>
  </button>
);

export default function ReportIssue() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);

  const issues = [
    {
      id: 'incorrect-order',
      icon: Package,
      title: 'Incorrect order',
      description: 'The order was incorrect or missing items'
    },
    {
      id: 'late-delivery',
      icon: Clock,
      title: 'Late delivery',
      description: 'The order arrived later than expected'
    },
    {
      id: 'payment-issue',
      icon: CreditCard,
      title: 'Payment issue',
      description: 'There was a problem with the payment'
    },
    {
      id: 'other',
      icon: HelpCircle,
      title: 'Other',
      description: 'Something else went wrong'
    }
  ];

  const handleIssueSelect = (issueId) => {
    setSelectedIssue(issueId);
    // In a real app, you'd navigate to a detailed form or submit the issue
    alert(`Issue reported: ${issues.find(i => i.id === issueId)?.title}`);
  };

  const handleChatSupport = () => {
    navigate(createPageUrl("Chat"));
  };

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@dishdash.com";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Report issue</h1>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* What's the issue? */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's the issue?</h2>
          
          <div className="space-y-4">
            {issues.map((issue) => (
              <IssueOption
                key={issue.id}
                icon={issue.icon}
                title={issue.title}
                description={issue.description}
                onClick={() => handleIssueSelect(issue.id)}
              />
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact support</h2>
          
          <div className="space-y-4">
            <ContactOption
              icon={MessageCircle}
              title="Chat with us"
              onClick={handleChatSupport}
            />
            <ContactOption
              icon={Mail}
              title="Email us"
              onClick={handleEmailSupport}
            />
          </div>
        </div>
      </div>
    </div>
  );
}