declare module "*.md" {
  const content: string;
  export default content;
}
declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export { ReactComponent };
  const src: string;
  export default src;
}
