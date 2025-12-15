<script setup lang="ts">
import { computed, ref, useSlots, watch, type Component, type VNode } from 'vue';
import type {
  WizardHeaderSlotProps,
  WizardNavigationSlotProps,
  WizardStepChangeEvent,
  WizardStepMeta,
  WizardStepStatus,
} from './VtWizard.types';
import VtButton from '../Button/VtButton.vue';

interface VtWizardProps {
  activeIndex: number;
  linear?: boolean;
  clickable?: boolean;
  showNumbers?: boolean;
  keepAlive?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  finishLabel?: string;
  finishOnLastNext?: boolean;
}

const props = withDefaults(defineProps<VtWizardProps>(), {
  activeIndex: 0,
  linear: true,
  clickable: true,
  showNumbers: true,
  keepAlive: false,
  nextLabel: 'Next',
  previousLabel: 'Back',
  finishLabel: 'Finish',
  finishOnLastNext: false,
});

const emit = defineEmits<{
  'update:activeIndex': [index: number];
  next: [event: WizardStepChangeEvent];
  previous: [event: WizardStepChangeEvent];
  complete: [];
  'step-click': [index: number];
}>();

const slots = useSlots();
const internalIndex = ref(props.activeIndex);

function isWizardStep(vnode: VNode): boolean {
  const type = vnode.type as Component;
  return type && typeof type === 'object' && type.name === 'VtWizardStep';
}

const steps = computed<WizardStepMeta[]>(() => {
  const children = slots.default?.() || [];
  return children
    .filter((vnode) => isWizardStep(vnode))
    .map((vnode, index) => {
      const stepProps = vnode.props || {};
      return {
        index,
        title: stepProps.title || `Step ${index + 1}`,
        subtitle: stepProps.subtitle,
        icon: stepProps.icon,
        disabled: stepProps.disabled === true || stepProps.disabled === '',
        optional: stepProps.optional === true || stepProps.optional === '',
        valid: stepProps.valid !== undefined ? !!stepProps.valid : true,
      };
    });
});

const total = computed(() => steps.value.length);
const isFirst = computed(() => internalIndex.value === 0);
const isLast = computed(() => internalIndex.value === total.value - 1);

const currentStep = computed(() => steps.value[internalIndex.value]);

const canGoPrevious = computed(() => !isFirst.value);
const canGoNext = computed(() => {
  if (isLast.value) return props.finishOnLastNext;
  const nextStep = steps.value[internalIndex.value + 1];
  
  if (!nextStep || nextStep.disabled) return false;
  return currentStep.value?.valid !== false;
});

const canFinish = computed(() => isLast.value && !props.finishOnLastNext);

function getStepStatus(index: number): WizardStepStatus {
  if (index < internalIndex.value) return 'complete';
  if (index === internalIndex.value) return 'active';
  return 'upcoming';
}

function goTo(targetIndex: number) {
  if (targetIndex < 0 || targetIndex >= total.value) return;
  const targetStep = steps.value[targetIndex];
  if (targetStep?.disabled) return;

  if (props.linear && targetIndex > internalIndex.value + 1) return;

  const from = internalIndex.value;
  internalIndex.value = targetIndex;
  emit('update:activeIndex', targetIndex);
  emit('step-click', targetIndex);

  if (targetIndex > from) {
    emit('next', { from, to: targetIndex });
  } else if (targetIndex < from) {
    emit('previous', { from, to: targetIndex });
  }
}

function next() {
  if (!canGoNext.value) return;
  if (isLast.value && props.finishOnLastNext) {
    emit('complete');
    return;
  }
  const from = internalIndex.value;
  const to = from + 1;
  internalIndex.value = to;
  emit('update:activeIndex', to);
  emit('next', { from, to });
}

function previous() {
  if (!canGoPrevious.value) return;
  const from = internalIndex.value;
  const to = from - 1;
  internalIndex.value = to;
  emit('update:activeIndex', to);
  emit('previous', { from, to });
}

function finish() {
  if (!canFinish.value) return;
  emit('complete');
}

const navigationSlotProps = computed<WizardNavigationSlotProps>(() => ({
  activeIndex: internalIndex.value,
  total: total.value,
  isFirst: isFirst.value,
  isLast: isLast.value,
  canGoPrevious: canGoPrevious.value,
  canGoNext: canGoNext.value,
  previous,
  next,
  goTo,
}));

const headerSlotProps = computed<WizardHeaderSlotProps>(() => ({
  steps: steps.value,
  activeIndex: internalIndex.value,
  goTo,
}));

watch(
  () => props.activeIndex,
  (newIndex) => {
    if (newIndex !== internalIndex.value) {
      internalIndex.value = newIndex;
    }
  },
);

watch(internalIndex, (idx) => {
  if (idx !== props.activeIndex) {
    emit('update:activeIndex', idx);
  }
});
</script>

<template>
  <div class="vt-wizard-container">
    <div v-if="!slots.header" class="vt-wizard-header" role="navigation" aria-label="Wizard steps">
      <ol class="vt-wizard-stepper">
        <li
          v-for="(step, idx) in steps"
          :key="idx"
          class="vt-wizard-step-item"
          :class="{
            'is-active': idx === internalIndex,
            'is-complete': idx < internalIndex,
            'is-upcoming': idx > internalIndex,
            'is-disabled': step.disabled,
            'is-invalid': step.valid === false,
          }"
        >
          <VtButton
            class="vt-wizard-step-badge"
            :label="showNumbers ? String(idx + 1) : ''"
            :icon="!showNumbers && step.icon ? step.icon : undefined"
            size="sm"
            rounded
            :variant="idx > internalIndex ? 'outlined' : undefined"
            :disabled="step.disabled || (!clickable && idx !== internalIndex)"
            :aria-current="idx === internalIndex ? 'step' : undefined"
            @click="goTo(idx)"
          />
          <span class="vt-wizard-step-label">
            {{ step.title }}
            <span v-if="step.optional" class="vt-wizard-step-optional">(optional)</span>
          </span>
        </li>
      </ol>
    </div>

    <slot v-else name="header" v-bind="headerSlotProps" />

    <div class="vt-wizard-content">
      <template v-for="(vnode, idx) in slots.default?.()" :key="idx">
        <component
          :is="keepAlive ? 'KeepAlive' : 'div'"
          v-show="idx === internalIndex"
          class="vt-wizard-panel"
        >
          <component :is="vnode" />
        </component>
      </template>
    </div>

    <div v-if="!slots.footer" class="vt-wizard-footer">
      <VtButton
        v-if="!isFirst"
        class="vt-wizard-prev"
        :label="previousLabel"
        variant="outlined"
        severity="neutral"
        @click="previous"
      />
      <div class="vt-wizard-footer-actions">
        <VtButton
          v-if="!isLast || finishOnLastNext"
          :label="nextLabel"
          :disabled="!canGoNext"
          severity="neutral"
          @click="next"
        />
        <VtButton v-if="canFinish" :label="finishLabel" severity="success" @click="finish" />
      </div>
    </div>

    <slot v-else name="footer" v-bind="navigationSlotProps" />
  </div>
</template>

<style scoped>
.vt-wizard-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
}

.vt-wizard-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vt-wizard-stepper {
  list-style: none;
  display: flex;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
}

.vt-wizard-step-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.vt-wizard-step-badge {
  border: 1px solid var(--vt-border);
  background: #fff;
  color: #333;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.vt-wizard-step-item.is-active .vt-wizard-step-badge {
  background: var(--vt-neutral);
  color: var(--vt-white);
}

.vt-wizard-step-item.is-complete .vt-wizard-step-badge {
  background: var(--vt-success);
  color: var(--vt-white);
}

.vt-wizard-step-item.is-disabled .vt-wizard-step-badge {
  opacity: 0.4;
  cursor: not-allowed;
}

.vt-wizard-step-item.is-invalid .vt-wizard-step-badge {
  background: var(--vt-danger);
  color: var(--vt-white);
}

.vt-wizard-step-label {
  font-size: 0.75rem;
}

.vt-wizard-panel {
  padding: 0.5rem 0;
}

.vt-wizard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.vt-wizard-prev {
  margin-right: auto;
}

.vt-wizard-footer-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}
</style>
