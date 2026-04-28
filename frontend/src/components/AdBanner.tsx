'use client';

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  client?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  slot, 
  format = 'auto', 
  className = '',
  client = '<meta name="google-adsense-account" content="ca-pub-5202519329050813">' 
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tryInitialize = () => {
      try {
        // TRIPLE FAILSAFE:
        // 1. Check if the ref still exists
        // 2. Scan the DOM for ANY 'ins' tag that hasn't been filled yet
        // 3. Only push if there is at least one unfilled slot available
        const availableSlots = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status])');
        
        if (adRef.current && availableSlots.length > 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        // Silently catch to prevent runtime crashes
      }
    };

    // Delay slightly to allow Next.js hydration to finish painting the DOM
    const timer = setTimeout(tryInitialize, 1000);

    return () => clearTimeout(timer);
  }, [slot]); 

  return (
    <div className={`ad-container overflow-hidden ${className}`} style={{ minHeight: '90px' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
