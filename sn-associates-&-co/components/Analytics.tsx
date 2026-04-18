import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        fbq: (...args: any[]) => void;
    }
}

// Analytics IDs
export const GTM_ID = ''; // Replace with your GTM ID (e.g., GTM-XXXXXX)
export const GA4_ID = 'G-DM6K805EKR'; // Updated Tag ID provided by user
export const ADS_ID = 'AW-17851081020'; // Updated Ads ID from snippet
export const META_PIXEL_ID = ''; // Example: 1234567890

const Analytics: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // This hook runs on every route change
        // You can add page view tracking here if needed for single page apps
        // e.g. ReactGA.send({ hitType: "pageview", page: location.pathname });

        console.log('Route changed to:', location.pathname);
    }, [location]);

    useEffect(() => {
        // Helper to load external scripts
        const loadScript = (id: string, src: string, innerHTML?: string) => {
            if (document.getElementById(id)) return;
            const script = document.createElement('script');
            script.id = id;
            script.async = true;
            if (src) script.src = src;
            if (innerHTML) script.innerHTML = innerHTML;
            document.head.appendChild(script);
        };

        // 1. Google Tag (gtag.js) Initialization for GA4 and Google Ads
        if (GA4_ID || ADS_ID) {
            // Initialize dataLayer and gtag function
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());

            // Load gtag.js
            const mainId = GA4_ID || ADS_ID;
            loadScript('google-tag', `https://www.googletagmanager.com/gtag/js?id=${mainId}`);

            // Configure GA4
            if (GA4_ID) {
                window.gtag('config', GA4_ID, {
                    page_path: location.pathname,
                });
            }

            // Configure Google Ads
            if (ADS_ID) {
                window.gtag('config', ADS_ID);
            }
        }

        // 2. Google Tag Manager (GTM)
        if (GTM_ID) {
            loadScript('gtm-script', '', `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');`);

            // GTM NoScript (Body)
            if (!document.getElementById('gtm-noscript')) {
                const noscript = document.createElement('noscript');
                noscript.id = 'gtm-noscript';
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
                iframe.height = "0";
                iframe.width = "0";
                iframe.style.display = "none";
                iframe.style.visibility = "hidden";
                noscript.appendChild(iframe);
                document.body.prepend(noscript);
            }
        }

        // 3. Meta (Facebook) Pixel
        if (META_PIXEL_ID) {
            loadScript('meta-pixel', '', `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${META_PIXEL_ID}');
      fbq('track', 'PageView');`);
        }
    }, [ADS_ID, GA4_ID, GTM_ID, META_PIXEL_ID]);

    useEffect(() => {
        // Track page view on route change
        if (window.gtag && GA4_ID) {
            window.gtag('config', GA4_ID, {
                page_path: location.pathname,
            });
        }
    }, [location, GA4_ID]);

    return null; // This component doesn't render anything UI-wise
};

export default Analytics;
