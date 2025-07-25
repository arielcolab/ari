import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send } from 'lucide-react';
import { SendEmail } from '@/api/integrations';
import { User } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';

export default function ContactSupport() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  React.useEffect(() => {
    // Pre-fill user data if logged in
    const loadUserData = async () => {
      try {
        const user = await User.me();
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.full_name || '',
            email: user.email || ''
          }));
        }
      } catch (error) {
        // User not logged in, form will be empty
      }
    };
    loadUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await SendEmail({
        to: 'support@dishdash.com',
        subject: `Support Request: ${formData.subject}`,
        body: `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
        `.trim()
      });
      
      showToast('Your message has been sent successfully!', 'success');
      navigate(-1);
    } catch (error) {
      console.error('Error sending support email:', error);
      showToast('Failed to send message. Please try again.', 'error');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Contact Support</h1>
        </div>
      </div>
      
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Get Help</h2>
            <p className="text-gray-600">
              Have a question or need assistance? Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your full name"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Brief description of your issue"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Please provide as much detail as possible about your question or issue..."
                className="mt-1 h-32 resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Other Ways to Reach Us</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📧 Email: support@dishdash.com</p>
              <p>📱 Phone: (555) 123-DISH</p>
              <p>⏰ Hours: Monday-Friday, 9AM-6PM EST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}