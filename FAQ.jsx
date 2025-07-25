import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full py-4 px-6 text-left flex items-center justify-between hover:bg-gray-50"
    >
      <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
      {isOpen ? (
        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
      )}
    </button>
    {isOpen && (
      <div className="px-6 pb-4">
        <p className="text-gray-700">{answer}</p>
      </div>
    )}
  </div>
);

export default function FAQ() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (openItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      question: "What is DishDash?",
      answer: "DishDash is a community marketplace that connects home cooks with local food lovers. You can discover and order homemade meals from talented cooks in your neighborhood, or share your own culinary creations with others."
    },
    {
      question: "How do I place an order?",
      answer: "Browse dishes in your area, select what you want, choose pickup or delivery, add payment information, and confirm your order. You'll receive updates on your order status and can message the cook if needed."
    },
    {
      question: "Is the food safe to eat?",
      answer: "While we provide a platform for cooks to share their food, each cook is responsible for following proper food safety guidelines. We encourage all cooks to follow local health regulations and best practices for food preparation and storage."
    },
    {
      question: "How do payments work?",
      answer: "Payments are processed securely through our platform. You can pay with credit/debit cards or digital wallets. Cooks receive payment after successful order completion, minus our small service fee."
    },
    {
      question: "Can I become a cook on DishDash?",
      answer: "Yes! Anyone can become a cook on DishDash. Simply create your profile, post your first dish with photos and description, set your prices and pickup times, and start connecting with hungry neighbors."
    },
    {
      question: "What if I need to cancel my order?",
      answer: "You can cancel your order before the cook starts preparing it. After preparation begins, cancellations may not be possible or may incur fees. Contact the cook directly through our messaging feature to discuss any changes."
    },
    {
      question: "How do I contact a cook?",
      answer: "Each dish and order page has a 'Message Cook' button that opens a direct chat. You can ask questions about ingredients, pickup times, or special requests."
    },
    {
      question: "What are the fees?",
      answer: "DishDash charges a small service fee on each transaction to maintain the platform. Delivery fees may apply depending on distance and cook preferences. All fees are clearly displayed before you complete your order."
    },
    {
      question: "How do I report a problem?",
      answer: "You can report issues through the 'Contact Support' feature in your profile, or email us directly at support@dishdash.app. We investigate all reports promptly and fairly."
    },
    {
      question: "Can I leave reviews?",
      answer: "Yes! After completing an order, you can rate and review both the dish and the cook. Reviews help maintain quality and help other users make informed decisions."
    },
    {
      question: "Is DishDash available in my area?",
      answer: "DishDash connects you with local cooks, so availability depends on active cooks in your neighborhood. The more people join, the better the experience becomes for everyone!"
    },
    {
      question: "How do I get refunds?",
      answer: "Refunds are available for legitimate issues like food safety problems, no-shows, or orders significantly different from descriptions. See our Refund Policy for complete details on eligibility and process."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h1>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How can we help you?</h2>
            <p className="text-gray-600">
              Find answers to common questions about using DishDash. If you can't find what you're looking for, 
              don't hesitate to contact our support team.
            </p>
          </div>
          
          <div>
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you with any questions not covered in this FAQ.
          </p>
          <Button 
            onClick={() => navigate(-1)} 
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}