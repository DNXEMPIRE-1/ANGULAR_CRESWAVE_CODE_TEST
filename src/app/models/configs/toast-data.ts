export interface ToastData {
  message: string;
  action?: string | null;
  positionX?: 'start' | 'center' | 'end' | 'left' | 'right';
  positionY?: 'top' | 'bottom';
  duration?: number;
}
