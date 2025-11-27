import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, CreditCard, User, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import { Package, Driver } from '../types';
import { useCurrency } from '../CurrencyContext';
import { useGlobal } from '../GlobalContext';

const Booking: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { addBooking } = useGlobal(); // Access global addBooking function
  const location = useLocation();
  const state = location.state as { type: string, item: Package | Driver } | undefined;
  
  const [step, setStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Pending');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    insurance: false
  });

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">No Booking Item Selected</h2>
        <Link to="/" className="text-brand-blue underline">Go Home</Link>
      </div>
    );
  }

  const item = state.item;
  // Calculate price based on item type
  const basePrice = 'price' in item ? item.price : item.rates.baseFare; // Simplified logic
  const tax = basePrice * 0.05;
  const insuranceCost = formData.insurance ? 50 : 0;
  const total = (basePrice * formData.guests) + tax + insuranceCost;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const submitBooking = (status: 'Confirmed' | 'Pending', paid: boolean) => {
    addBooking({
      id: `BK-${Math.floor(Math.random() * 10000)}`,
      userId: 'guest',
      itemId: item.id,
      itemName: 'price' in item ? item.name : `${item.vehicle.model} Taxi`,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      type: state.type as 'Package' | 'Taxi',
      date: new Date().toISOString(),
      status: status,
      totalAmount: total,
      paid: paid,
      travelers: formData.guests
    });
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('Paid');
    submitBooking('Confirmed', true);
    setStep(3);
  };

  const handleEnquire = () => {
    setPaymentStatus('Pending');
    submitBooking('Pending', false);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-10 max-w-2xl mx-auto">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-brand-blue' : 'text-gray-300'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>1</div>
            <span className="text-xs font-semibold">Details</span>
          </div>
          <div className={`h-1 flex-1 mx-4 ${step >= 2 ? 'bg-brand-blue' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-brand-blue' : 'text-gray-300'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>2</div>
            <span className="text-xs font-semibold text-center">Payment /<br/>Enquiry</span>
          </div>
          <div className={`h-1 flex-1 mx-4 ${step >= 3 ? 'bg-brand-blue' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-brand-blue' : 'text-gray-300'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 3 ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>3</div>
            <span className="text-xs font-semibold">Done</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Form Area */}
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {step === 1 && (
              <form onSubmit={handleNext}>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Traveler Information</h2>
                <div className="space-y-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18}/>
                        <input 
                          required
                          type="text" 
                          className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none placeholder-gray-400"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none placeholder-gray-400"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none placeholder-gray-400"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none placeholder-gray-400"
                        value={formData.guests}
                        onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                      />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                   <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="ins" 
                        className="mt-1 accent-brand-blue"
                        checked={formData.insurance}
                        onChange={e => setFormData({...formData, insurance: e.target.checked})}
                      />
                      <label htmlFor="ins" className="cursor-pointer">
                         <div className="font-bold text-gray-800 flex items-center gap-2"><Shield size={16} className="text-green-600"/> Add Travel Insurance (+{formatPrice(50)})</div>
                         <p className="text-xs text-gray-500 mt-1">Protect your trip against cancellation and medical emergencies.</p>
                      </label>
                   </div>
                </div>

                <button type="submit" className="w-full bg-brand-blue hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200">
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Choose Action</h2>
                
                {/* Credit Card Section */}
                <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-bold flex items-center gap-2 text-gray-900"><CreditCard size={20}/> Secure Payment</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                     <input type="text" placeholder="Card Number" className="w-full p-2 border border-gray-300 rounded text-gray-900" disabled />
                     <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="w-full p-2 border border-gray-300 rounded text-gray-900" disabled />
                        <input type="text" placeholder="CVC" className="w-full p-2 border border-gray-300 rounded text-gray-900" disabled />
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Secure payment via Stripe.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handlePay}
                    className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                  >
                     <CheckCircle size={20} /> Pay Now {formatPrice(total)}
                  </button>
                  
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <button 
                    onClick={handleEnquire}
                    className="w-full bg-white border-2 border-brand-orange text-brand-orange hover:bg-orange-50 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                     <HelpCircle size={20} /> Enquire / Pay Later
                  </button>
                </div>
                
                 <button type="button" onClick={() => setStep(1)} className="w-full mt-4 text-gray-500 font-medium text-sm hover:underline">
                   Back to Details
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${paymentStatus === 'Paid' ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-500'}`}>
                  {paymentStatus === 'Paid' ? <CheckCircle size={40} /> : <HelpCircle size={40} />}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {paymentStatus === 'Paid' ? 'Booking Confirmed!' : 'Enquiry Sent!'}
                </h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {paymentStatus === 'Paid' 
                    ? `Thank you for your payment. We've sent a confirmation email to ${formData.email} with your ticket details.`
                    : `We've received your request. Our travel expert will call you at ${formData.phone} shortly to finalize details and payment.`
                  }
                </p>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left mb-8 max-w-sm mx-auto shadow-sm">
                   <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-500">Reference:</span>
                      <span className="font-mono font-bold text-gray-900">HP-NEW</span>
                   </div>
                   <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-bold ${paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        {paymentStatus === 'Paid' ? 'Paid & Confirmed' : 'Pending Payment'}
                      </span>
                   </div>
                   <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                      <span className="text-gray-900 font-bold">Total Amount:</span>
                      <span className="font-bold text-brand-blue">{formatPrice(total)}</span>
                   </div>
                </div>

                <div className="space-x-4">
                  <Link to="/" className="inline-block bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-lg">
                    Return Home
                  </Link>
                  <Link to="/packages" className="inline-block text-brand-blue font-bold px-4 py-3 hover:underline">
                    Browse More
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step < 3 && (
            <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
               <h3 className="font-bold text-lg mb-4 border-b pb-2 text-gray-900">Order Summary</h3>
               <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 leading-tight">{'price' in item ? item.name : `${item.vehicle.model} Taxi`}</h4>
                  <div className="text-xs text-gray-500 capitalize mt-1">{state.type} Booking</div>
               </div>
               
               <div className="space-y-3 text-sm text-gray-600 mb-4 border-b border-gray-100 pb-4">
                  <div className="flex justify-between">
                     <span>Base Price x {formData.guests}</span>
                     <span>{formatPrice(basePrice * formData.guests)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Taxes & Fees (5%)</span>
                     <span>{formatPrice(tax)}</span>
                  </div>
                  {formData.insurance && (
                     <div className="flex justify-between text-green-600 bg-green-50 px-2 py-1 rounded">
                        <span>Insurance</span>
                        <span>{formatPrice(50)}</span>
                     </div>
                  )}
               </div>

               <div className="flex justify-between items-center font-bold text-xl text-brand-dark">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
               </div>
               
               <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                  <Shield size={14} /> Best Price Guaranteed
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;