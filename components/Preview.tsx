

import React from 'react';

interface PreviewProps {
  srcDoc: string;
}

export const Preview: React.FC<PreviewProps> = ({ srcDoc }) => {
  return (
    <iframe
      srcDoc={srcDoc}
      title="Project Preview"
      sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
      className="w-full h-full border-0"
      loading="lazy"
    />
  );
};