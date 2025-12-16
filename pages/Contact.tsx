
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useGlobal } from '../GlobalContext';

const Contact: React.FC = () => {
  const { companyProfile, addBooking } = useGlobal();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Enquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    addBooking({
      id: `ENQ-${Date.now()}`,
      userId: 'guest',
      itemId: 'contact-form',
      itemName: formData.subject,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: 'N/A', // Or add phone field if strictly needed
      type: 'General',
      date: new Date().toISOString(),
      status: 'Pending',
      totalAmount: 0,
      paid: false,
      travelers: 1,
      message: formData.message
    });

    setSubmitted(true);
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Enquiry',
        message: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about a package? Need a custom itinerary? Our travel experts are ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info Card */}
          <div className="bg-brand-blue rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            <h2 className="text-2xl font-bold mb-8 relative z-10">Contact Information</h2>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase mb-1">Call Us</p>
                  <p className="text-xl font-bold">{companyProfile.phone}</p>
                  <p className="text-sm text-blue-100 mt-1">Mon-Sat, 9am - 7pm IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase mb-1">Email Us</p>
                  <p className="text-xl font-bold break-all">{companyProfile.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase mb-1">Visit Us</p>
                  <p className="text-lg leading-relaxed">{companyProfile.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
               <p className="text-sm text-blue-100">Connect with us on social media for travel inspiration.</p>
               <div className="flex gap-4 mt-4">
                  <a href={companyProfile.facebook} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">Facebook</a>
                  <a href={companyProfile.twitter} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">Twitter</a>
                  <a href={companyProfile.instagram} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">Instagram</a>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">We've received your enquiry. One of our agents will contact you at {formData.email} shortly.</p>
                <button onClick={handleReset} className="mt-8 text-brand-blue font-bold hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all"/>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all"/>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all">
                    <option>General Enquiry</option>
                    <option>Booking Issue</option>
                    <option>Partnership</option>
                    <option>Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all resize-none"></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-brand-blue transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18} />} Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
