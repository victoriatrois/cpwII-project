<script setup lang="ts">
import { computed } from 'vue';
import type { VtButtonProps } from './VtButton.types';

const props = withDefaults(defineProps<VtButtonProps>(), {
  label: '',
  severity: 'neutral',
  variant: 'solid',
  size: 'md',
  rounded: false,
  disabled: false,
  block: false,
});

const isDisabled = computed(() => props.disabled);

const buttonClass = computed(() => {
  return [
    'vt-button',
    `is-${props.severity}`,
    `is-${props.variant}`,
    `is-${props.size}`,
    {
      'is-rounded': props.rounded,
      'is-block': props.block,
      'with-icon': !!props.icon,
      'icon-right': props.iconRight,
    },
  ];
});

const ariaDisabled = computed(() => (isDisabled.value ? 'true' : undefined));

function onClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
</script>

<template>
  <component
    :is="as === 'a' && href ? 'a' : 'button'"
    :href="as === 'a' ? href : undefined"
    :type="as === 'button' ? isDisabled : undefined"
    :class="buttonClass"
    :disabled="as === 'button' ? isDisabled : undefined"
    :ariaDisabled="ariaDisabled"
    @click="onClick"
  >
    <span class="vt-button-content">
      <span v-if="icon" class="vt-button-icon" :class="icon" aria-hidden="true">
        <slot name="icon"></slot>
      </span>

      <span class="vt-button-label">
        <slot>{{ label }}</slot>
      </span>
    </span>
  </component>
</template>

<style scoped>
.vt-button {
  -webkit-tap-highlight-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vt-gap);
  border: 1px solid transparent;
  border-radius: var(--vt-radius);
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
}

.vt-button.is-block {
  display: inline-flex;
  width: 100%;
}

.vt-button.is-rounded {
  border-radius: var(--vt-radius-round);
}

.vt-button.is-sm {
  padding: var(--vt-pad-y-sm) var(--vt-pad-x-sm);
  font-size: var(--vt-font-sm);
}

.vt-button.is-md {
  padding: var(--vt-pad-y-md) var(--vt-pad-x-md);
  font-size: var(--vt-font-md);
}

.vt-button.is-lg {
  padding: var(--vt-pad-y-lg) var(--vt-pad-x-lg);
  font-size: var(--vt-font-lg);
}

/* Variants */
.vt-button.is-solid {
  color: #fffdff;
}

.vt-button.is-outlined {
  background: transparent;
  border-color: transparent;
}

.vt-button.is-text {
  color: var(--vt-neutral);
  background: transparent;
}

a.vt-button {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.vt-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--vt-ring) var(--vt-ring-color);
}

/* States */
.vt-button[disabled],
.vt-button[aria-disabled='true'] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Severity mapping */
.vt-button.is-solid {
  background: var(--vt-neutral);
}
.vt-button.is-outlined {
  background: transparent;
  color: var(--vt-neutral);
  border-color: var(--vt-neutral);
}
.vt-button.is-solid.is-success {
  background: var(--vt-success);
}
.vt-button.is-solid.is-info {
  background: var(--vt-info);
}
.vt-button.is-solid.is-warning {
  background: var(--vt-warning);
}
.vt-button.is-solid.is-danger {
  background: var(--vt-danger);
}
.vt-button.is-solid.is-contrast {
  background: var(--vt-contrast);
}

.vt-button.is-outlined.is-solid {
  color: var(--vt-neutral);
  border-color: var(--vt-neutral);
}
.vt-button.is-outlined.is-neutral {
  color: var(--vt-neutral);
  border-color: var(--vt-neutral);
}
.vt-button.is-outlined.is-success {
  color: var(--vt-success);
  border-color: var(--vt-success);
}
.vt-button.is-outlined.is-info {
  color: var(--vt-info);
  border-color: var(--vt-info);
}
.vt-button.is-outlined.is-warning {
  color: var(--vt-warning);
  border-color: var(--vt-warning);
}
.vt-button.is-outlined.is-danger {
  color: var(--vt-danger);
  border-color: var(--vt-danger);
}
.vt-button.is-outlined.is-contrast {
  color: var(--vt-contrast);
  border-color: var(--vt-contrast);
}

.vt-button.is-text.is-solid {
  color: var(--vt-neutral);
}
.vt-button.is-text.is-outlined {
  color: var(--vt-neutral);
}
.vt-button.is-text.is-success {
  color: var(--vt-success);
}
.vt-button.is-text.is-info {
  color: var(--vt-info);
}
.vt-button.is-text.is-warning {
  color: var(--vt-warning);
}
.vt-button.is-text.is-danger {
  color: var(--vt-danger);
}
.vt-button.is-text.is-contrast {
  color: var(--vt-contrast);
}

/* Hovers */
.vt-button.is-solid:hover {
  filter: brightness(0.9);
}
.vt-button.is-outlined:hover {
  background: rgba(0, 0, 0, 0.05);
}
.vt-button.is-text:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Icon and content layout */
.vt-button-content {
  display: inline-flex;
  align-items: center;
  gap: var(--vt-gap);
}

.vt-button.with-icon.icon-right .vt-button-content {
  flex-direction: row-reverse;
}

.vt-button-icon {
  display: inline-flex;
}
</style>
