export type VtButtonSeverity = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'contrast';

export type VtButtonVariant = 'solid' | 'outlined' | 'text';

export type VtButtonSize = 'sm' | 'md' | 'lg';

export interface VtButtonProps {
  label: string;
  icon?: string;
  iconRight?: boolean;
  severity?: VtButtonSeverity;
  variant?: VtButtonVariant;
  size?: VtButtonSize;
  rounded?: boolean;
  disabled?: boolean;
  block?: boolean;
  as?: 'button' | 'a';
  href?: string;
}
