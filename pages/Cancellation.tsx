
import React from 'react';

const Cancellation: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Cancellation & Refund Policy</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-6">We understand plans change. Our cancellation policy is designed to be fair to both travelers and our local partners.</p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Package Tours</h3>
             <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-gray-200 pb-2">
                   <span>30+ days before travel</span>
                   <span className="font-bold text-green-600">90% Refund</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                   <span>15-29 days before travel</span>
                   <span className="font-bold text-yellow-600">50% Refund</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                   <span>7-14 days before travel</span>
                   <span className="font-bold text-orange-600">25% Refund</span>
                </li>
                <li className="flex justify-between">
                   <span>Less than 7 days</span>
                   <span className="font-bold text-red-600">No Refund</span>
                </li>
             </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Taxi Services</h3>
             <p className="text-sm mb-2">Free cancellation up to 6 hours before the scheduled pickup time. Cancellations made within 6 hours will incur a flat fee of ₹500.</p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Refund Process</h3>
          <p>
            Approved refunds are processed within 7-10 business days and credited back to the original method of payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cancellation;
