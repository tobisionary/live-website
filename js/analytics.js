/* Vercel Web Analytics initialization
   Initializes Web Analytics tracking for this static HTML site.
   
   SETUP INSTRUCTIONS:
   1. Enable Web Analytics in your Vercel dashboard (Analytics > Enable)
   2. Deploy this site to Vercel
   3. Analytics will automatically begin tracking page views
   
   The @vercel/analytics package is installed and configured to track:
   - Page views and navigation
   - Visitor location, browser, and OS
   - Referrers and session data
   - All data is anonymized and cookie-free (GDPR compliant)
*/

(function() {
  'use strict';
  
  // Initialize Web Analytics queue
  // This allows analytics events to be queued before the script loads
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  
  // Optional: Configure beforeSend hook to filter or modify events
  // Uncomment and customize as needed:
  /*
  window.va('beforeSend', function(event) {
    // Example: Exclude internal/admin pages from analytics
    if (event.url && event.url.includes('/internal')) {
      return null;  // Returning null prevents the event from being sent
    }
    
    // Example: Redact sensitive query parameters
    if (event.url) {
      event.url = event.url.replace(/([?&])(token|key|secret)=[^&]*/gi, '$1$2=REDACTED');
    }
    
    return event;
  });
  */
})();
