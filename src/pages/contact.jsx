import React from 'react';

/**
 * Contact Component
 * Represents the contact page for the Mall App.
 * Includes contact information and a functional-ready feedback form.
 */
const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا يمكنك إضافة منطق إرسال البيانات (مثل API call)
    console.log("Form submitted!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Have a question? We'd love to hear from you.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          
          {/* Info Section: Details about the mall */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Information
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</p>
                <p className="text-gray-900 dark:text-gray-200 font-medium">123 Luxury Avenue, Cairo, Egypt</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-gray-900 dark:text-gray-200 font-medium hover:text-blue-600 cursor-pointer">
                  support@mallapp.com
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</p>
                <p className="text-gray-900 dark:text-gray-200 font-medium">+20 123 456 789</p>
              </div>
            </div>
          </div>

          {/* Form Section: User feedback form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea 
                rows="4" 
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="How can we help?"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition-transform active:scale-95"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;