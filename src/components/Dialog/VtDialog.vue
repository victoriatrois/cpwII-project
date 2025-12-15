<script setup lang="ts">
import VtButton from '../Button/VtButton.vue';
import { useDialog } from '@/composables/useDialog';

const { dialogState, handlePrimary, handleSecondary } = useDialog();

const emit = defineEmits(['primary', 'secondary', 'close']);

function onOverlayClick() {
  handleSecondary();
}

function onPrimary() {
  handlePrimary();
}

function onSecondary() {
  handleSecondary();
}
</script>

<template>
  <div v-if="dialogState.visible" class="vt-dialog-overlay" @click="onOverlayClick">
    <div class="vt-dialog" @click.stop>
      <div class="vt-dialog-header">
        <h2>{{ dialogState.title }}</h2>
      </div>
      
      <div class="vt-dialog-content">
        <slot>{{ dialogState.message }}</slot>
      </div>
      
      <div class="vt-dialog-actions">
        <VtButton
          v-if="dialogState.showSecondary"
          :label="dialogState.secondaryLabel || 'Cancel'" 
          variant="outlined" 
          @click="onSecondary" 
        />
        <VtButton 
          :label="dialogState.primaryLabel || 'OK'" 
          severity="success" 
          @click="onPrimary" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.vt-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.vt-dialog {
  background: white;
  border-radius: var(--vt-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 500px;
  max-width: 800px;
}

.vt-dialog-header {
  padding: 1rem;
}

.vt-dialog-content {
  padding: 1rem;
}

.vt-dialog-actions {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
