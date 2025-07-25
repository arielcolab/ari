
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  User, 
  ChefHat, 
  Shield, 
  ChevronRight, 
  MessageCircle 
} from "lucide-react";

// Placeholder for createPageUrl - replace with your actual routing utility
const createPageUrl = (pageName) => {
  switch (pageName) {
    case 'ContactSupport':
      return '/contact-support';
    // Add other cases as needed for your application's routing
    default:
      return `/${pageName.toLowerCase()}`;
  }
};

export default function Help() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const helpTopics = [
    {
      id: 'ordering',
      title: 'How to Order',
      icon: ShoppingCart,
      content: `
**Placing Your First Order**

- Browse dishes by category or use the search bar
- View details by tapping any dish card
- Add to cart using the + button or "Add to Cart" 
- Review your order in the cart page
- Proceed to checkout and enter delivery details
- Complete payment to place your order

**Tips for Better Results**
- Use dietary filters to find dishes that match your preferences
- Check pickup times and delivery availability
- Read reviews and ratings before ordering
- Contact the cook directly if you have questions
      `
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: CreditCard,
      content: `
**Accepted Payment Methods**

- We currently accept:
  - Credit cards (Visa, Mastercard, American Express)
  - Debit cards
  - Digital wallets (Apple Pay, Google Pay)

**Payment Security**
- All payments are processed securely through Stripe
- Your card information is never stored on our servers
- You'll receive email confirmations for all transactions

**Billing Questions**
- Charges appear as "DishDash" on your statement
- For refunds, contact the cook directly or our support team
- Tips are processed separately and go directly to cooks
      `
    },
    {
      id: 'delivery',
      title: 'Delivery Information',
      icon: Truck,
      content: `
**Delivery Options**

**Pickup**
- Most cooks offer pickup at their location
- Pickup windows are shown on each dish
- You'll receive notification when your order is ready

**Delivery**
- Available from participating cooks
- Delivery fees calculated by distance
- Estimated delivery times shown at checkout

**Order Tracking**
- You'll receive updates via push notifications
- Track your order status in the app
- Contact your cook directly for special requests
      `
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: User,
      content: `
**Managing Your Account**

**Profile Settings**
- Update your personal information in Profile > Edit Profile
- Add delivery addresses for faster checkout
- Set dietary preferences to filter relevant dishes

**Favorites & History**
- Save dishes you love using the heart button
- View order history in your profile
- Reorder favorite dishes quickly

**Privacy & Security**
- We protect your personal information
- You can update or delete your account anytime
- Review our privacy policy for full details
      `
    },
    {
      id: 'cooks',
      title: 'For Cooks',
      icon: ChefHat,
      content: `
**Become a Cook on DishDash**

**Getting Started**
- Sign up and complete cook verification
- Upload required food safety certificates
- Create your first dish listing

**Best Practices**
- Take high-quality photos of your dishes
- Write detailed descriptions and include ingredients
- Set realistic pickup windows and quantities
- Respond promptly to customer messages

**Earnings & Payouts**
- Set your own prices
- Receive payments directly through the platform
- Track earnings in your cook dashboard
- Weekly payouts to your bank account
      `
    },
    {
      id: 'safety',
      title: 'Food Safety',
      icon: Shield,
      content: `
**Our Commitment to Food Safety**

**Cook Requirements**
- All cooks must provide food handler certifications
- Regular verification of safety credentials
- Kitchen inspections for high-volume cooks

**Customer Guidelines**
- Check allergen information before ordering
- Consume fresh items within recommended timeframes
- Report any food safety concerns immediately

**What We Do**
- Review all cook applications thoroughly
- Monitor feedback and ratings
- Remove cooks who don't meet safety standards
- Provide food safety resources and training
      `
    }
  ];

  const filteredTopics = helpTopics.filter(topic =>
    searchTerm === "" || 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to render content with basic Markdown-like formatting
  const renderContent = (content) => {
    const elements = [];
    const lines = content.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<h3 key={`h3-${i}`} className="font-bold text-gray-900 mt-4 mb-2">{line.slice(2, -2)}</h3>);
        i++;
      } else if (line === '') {
        elements.push(<br key={`br-${i}`} />);
        i++;
      } else if (line.startsWith('- ')) {
        const listItems = [];
        let j = i;
        while (j < lines.length && lines[j].trim().startsWith('- ')) {
          listItems.push(<li key={`li-${j}`} className="text-gray-700">{lines[j].trim().slice(2)}</li>);
          j++;
        }
        elements.push(<ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 mb-2">{listItems}</ul>);
        i = j;
      } else {
        elements.push(<p key={`p-${i}`} className="text-gray-700 mb-2">{line}</p>);
        i++;
      }
    }
    return elements;
  };

  if (selectedTopic) {
    const topic = helpTopics.find(t => t.id === selectedTopic);
    if (!topic) {
      // Fallback if topic not found (shouldn't happen with correct IDs)
      setSelectedTopic(null); 
      return null;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedTopic(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">{topic.title}</h1>
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="prose prose-sm max-w-none">
              {renderContent(topic.content)}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-2">Still need help?</h3>
            <p className="text-blue-700 text-sm mb-3">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button 
              onClick={() => navigate(createPageUrl('ContactSupport'))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('helpCenter', 'Help Center')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-white border-gray-200 rounded-xl"
          />
        </div>

        {/* Help Topics List */}
        <div className="bg-white rounded-xl shadow-sm">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic, index) => (
              <div key={topic.id}>
                <button
                  onClick={() => setSelectedTopic(topic.id)}
                  className="w-full flex items-center gap-4 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <topic.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                    <p className="text-sm text-gray-600">Get help with {topic.title.toLowerCase()}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
                {index < filteredTopics.length - 1 && <div className="border-b border-gray-100 mx-4" />}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No help topics found for "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Can't find what you're looking for? Contact our support team.
          </p>
          <Button 
            onClick={() => navigate(createPageUrl('ContactSupport'))}
            variant="outline" 
            className="w-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
