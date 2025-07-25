import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Refund Policy</h1>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-4">Last updated: January 2025</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">General Refund Policy</h2>
            <p className="text-gray-700 mb-4">
              At DishDash, we want you to be satisfied with every order. Our refund policy is designed to be fair 
              to both buyers and cooks while maintaining the quality of our community marketplace.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">When You Can Request a Refund</h2>
            <div className="space-y-2 mb-4">
              <p className="text-gray-700">• Order was cancelled by the cook before preparation</p>
              <p className="text-gray-700">• Food quality issues (spoiled, unsafe, or significantly different from description)</p>
              <p className="text-gray-700">• Order was not ready at the agreed pickup/delivery time (no-show)</p>
              <p className="text-gray-700">• Technical issues that prevented order completion</p>
              <p className="text-gray-700">• Order was not as described (missing items, wrong quantities)</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">When Refunds Are Not Available</h2>
            <div className="space-y-2 mb-4">
              <p className="text-gray-700">• Change of mind after order confirmation</p>
              <p className="text-gray-700">• Minor taste preferences or subjective quality issues</p>
              <p className="text-gray-700">• Orders that were delivered and accepted without complaint</p>
              <p className="text-gray-700">• Requests made more than 24 hours after order completion</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Request a Refund</h2>
            <div className="space-y-2 mb-4">
              <p className="text-gray-700">1. Contact the cook first through our messaging system</p>
              <p className="text-gray-700">2. If unresolved, contact our support team within 24 hours</p>
              <p className="text-gray-700">3. Provide photos and details of the issue</p>
              <p className="text-gray-700">4. Our team will review and respond within 48 hours</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Processing</h2>
            <p className="text-gray-700 mb-4">
              Approved refunds will be processed back to the original payment method within 3-7 business days. 
              DishDash platform fees are non-refundable unless the issue was caused by a technical error on our part.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Partial Refunds</h2>
            <p className="text-gray-700 mb-4">
              In some cases, we may offer partial refunds or DishDash credits as an alternative to full refunds, 
              especially when the issue affects only part of an order.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cook Protections</h2>
            <p className="text-gray-700 mb-4">
              Cooks are protected against fraudulent refund requests. We investigate all claims thoroughly 
              and may decline refunds that appear to be abuse of our policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              If you disagree with our refund decision, you can appeal by providing additional information 
              or evidence. All disputes are reviewed by our senior support team.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              For refund requests or questions about this policy, please contact us at support@dishdash.app 
              or use the "Contact Support" feature in the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}