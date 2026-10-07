import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner({ text }) {
  return (
    <div className="disclaimer-banner">
      <ShieldAlert size={18} style={{ flexShrink: 0 }} />
      <span>
        {text || "Nutritional estimates and guidelines are educational wellness metrics. They do not replace formal clinical consultation, diagnosis, or prescription from a medical doctor."}
      </span>
    </div>
  );
}
