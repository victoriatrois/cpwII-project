<script setup lang="ts">
import { TaskAction } from '@/enums/todo.enums';
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({
  actions: {
    type: Array<string>,
    default: () => ['Edit', 'Delete'],
  },
});

const emit = defineEmits(['action-more', 'action-selected', 'menu-opened']);
const isOpen = ref(false); // Ref<boolean>
const menuRef = ref<HTMLElement | null>(null);

function toggleMenu(event: MouseEvent): void {
  event.stopPropagation();
  isOpen.value = !isOpen.value;
  emit('action-more', isOpen.value);
}

function close() {
  if (isOpen.value) {
    isOpen.value = false;
    emit('action-more', false);
  }
}

defineExpose({
  close,
});

function selectAction(action: string) {
  const payload = action === 'Edit' ? TaskAction.edit : TaskAction.delete;
  emit('action-selected', payload);
}

function handleClickOutside(event: MouseEvent): void {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div className="action-menu-root">
    <button @click="toggleMenu">More</button>
    <div v-if="isOpen" className="action-menu-panel">
      <div class="menu-options" v-for="action in actions" :key="action">
        <button @click="selectAction(action)">
          {{ action }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-menu-root {
  display: inline-block;
  position: relative;
}

.action-menu-panel {
  position: absolute;
  left: 100%;
  top: 50%;
  width: 50px;
  transform: translateY(-50%) translateX(8px);
  background-color: #181818;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}
</style>
