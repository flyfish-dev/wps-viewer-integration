import { useEffect, useRef } from 'react';
import {
  FlyfishWpsViewerElement,
  registerFlyfishWpsViewer,
} from '@flyfish-dev/wps-viewer-integration';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'flyfish-wps-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'viewer-url': string;
        src: string;
        name: string;
      };
    }
  }
}

registerFlyfishWpsViewer();

export function WpsPreview({ viewerUrl, fileUrl, fileName }: {
  viewerUrl: string;
  fileUrl: string;
  fileName: string;
}) {
  const ref = useRef<FlyfishWpsViewerElement>(null);
  useEffect(() => {
    ref.current?.open({ url: fileUrl, name: fileName });
  }, [fileName, fileUrl]);
  return <flyfish-wps-viewer ref={ref} viewer-url={viewerUrl} src={fileUrl} name={fileName} />;
}
