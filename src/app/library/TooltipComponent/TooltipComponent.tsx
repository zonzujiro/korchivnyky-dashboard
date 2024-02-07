'use client';

import { useState } from 'react';
import Tooltip from './Tooltip/Tooltip';

export const TooltipComponent = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleCopyToClipboard = () => {
    setTimeout(() => {
      setIsTooltipVisible(true);
    }, 300);

    setTimeout(() => {
      setIsTooltipVisible(false);
    }, 1500);
  };

  return (
    <div>
      <div>
        <a onClick={handleCopyToClipboard}>{isTooltipVisible ? '💾' : '🔗'}</a>
        {isTooltipVisible && (
          <Tooltip message='Посилання на банку скопійовано!' />
        )}
      </div>
    </div>
  );
};
