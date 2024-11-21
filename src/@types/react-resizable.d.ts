declare module 'react-resizable' {
  import * as React from 'react';

  // Tipo que representa os dados de redimensionamento
  interface ResizeData {
    node: HTMLElement;
    size: { width: number; height: number };
    handle: string;
  }

  export interface ResizableBoxProps {
    width?: number;
    height?: number;
    minConstraints?: [number, number];
    maxConstraints?: [number, number];
    onResizeStop?: (event: React.SyntheticEvent, data: ResizeData) => void;
    onResizeStart?: (event: React.SyntheticEvent, data: ResizeData) => void;
    onResize?: (event: React.SyntheticEvent, data: ResizeData) => void;
    children?: React.ReactNode;
  }

  export class ResizableBox extends React.Component<ResizableBoxProps, object> {}
  export class Resizable extends React.Component<object, object> {}
}
