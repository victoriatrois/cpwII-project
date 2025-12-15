export interface VtDialogProps {
  title: string;
  visible: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export interface DialogConfig {
  title: string
  message: string
  primaryLabel?: string
  secondaryLabel?: string
  showSecondary?: boolean
}

export interface DialogState extends DialogConfig {
  visible: boolean
  resolve?: (result: boolean) => void
}