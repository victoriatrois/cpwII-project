<script setup lang="ts">
defineOptions({ name: 'VtWizardStep' });

interface VtWizardStepProps {
  title: string;
  subtitle?: string;
  icon?: string;
  disabled?: boolean;
  optional?: boolean;
  valid?: boolean;
}

const props = defineProps<VtWizardStepProps>();
</script>

<template>
  <div class="vt-wizard-step">
    <slot></slot>
  </div>
</template>

<style scoped>
</style>
