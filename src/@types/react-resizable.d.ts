declare module 'react-resizable' {
    import * as React from 'react';
  
    export interface ResizableBoxProps {
      width?: number;
      height?: number;
      minConstraints?: [number, number];
      maxConstraints?: [number, number];
      onResizeStop?: (event: React.SyntheticEvent, data: any) => void;
      onResizeStart?: (event: React.SyntheticEvent, data: any) => void;
      onResize?: (event: React.SyntheticEvent, data: any) => void;
      children?: React.ReactNode;  // Adiciona a propriedade `children`
    }
  
    export class ResizableBox extends React.Component<ResizableBoxProps, any> {}
    export class Resizable extends React.Component<any, any> {}
  }
  