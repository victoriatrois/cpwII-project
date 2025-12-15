export type WizardStepStatus = 'complete' | 'active' | 'upcoming';

export interface WizardStepMeta {
  index: number;
  title: string;
  subtitle?: string;
  icon?: string;
  disabled?: boolean;
  optional?: boolean;
  valid?: boolean;
}

export interface WizardStepChangeEvent {
  from: number;
  to: number;
}

export interface WizardNavigationSlotProps {
  activeIndex: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  previous: () => void;
  next: () => void;
  goTo: (index: number) => void;
}

export interface WizardHeaderSlotProps {
  steps: WizardStepMeta[];
  activeIndex: number;
  goTo: (index: number) => void;
}

export interface WizardBadgesSlotProps {
  index: number;
  step: WizardStepMeta;
  status: WizardStepStatus;
}
