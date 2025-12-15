<script setup lang="ts">
import { TaskAction } from '@/enums/todo.enums';
import type { Task, TaskFromFetch } from '@/types/todo.types';
import { ref, onBeforeMount } from 'vue';
import ActionMenu from './ActionMenu.vue';

const {
  listName,
  informationalText,
  showHistory = false,
  taskHistory = [],
} = defineProps<{
  listName?: string;
  informationalText?: string;
  showHistory?: boolean;
  taskHistory?: string[] | Task[];
}>();

const emit = defineEmits([
  'task-created',
  'task-deleted',
  'task-completed',
  'task-edited',
  'close-menu',
]);

const tasks = ref<Task[]>([]);
const newTask = ref('');
const actionMenuRefs = ref<Record<number, InstanceType<typeof ActionMenu> | null>>({});

function getTodaysDate(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

function createNewTask(): void {
  if (newTask.value.trim() !== '') {
    emit('task-created', {
      id: Date.now(),
      text: newTask.value,
      editing: false,
    });
    newTask.value = '';
  }
}

function completeTask(task: Task) {
  emit('task-completed', task);
}

function onEditFocus(task: Task): void {
  actionMenuRefs.value[task.id]?.close?.();
}

function editTask(task: Task) {
  emit('task-edited', { ...task, editing: true });
}

function finishEdit(task: Task): void {
  if (task.editing) {
    emit('task-edited', { ...task, editing: false });
  }
}

function deleteTask(task: Task) {
  emit('task-deleted', task);
}

function handleAction(action: TaskAction, task: Task) {
  if (action === TaskAction.edit) {
    editTask(task);
  } else if (action === TaskAction.delete) {
    deleteTask(task);
  }
}

function closeAllMenus() {
  Object.values(actionMenuRefs.value).forEach((menu) => {
    menu?.close?.();
  });
}

function handleMenuOpen(taskId: number) {
  // Close all menus except the one being opened
  Object.entries(actionMenuRefs.value).forEach(([id, menu]) => {
    if (parseInt(id) !== taskId) {
      menu?.close?.();
    }
  });
}

onBeforeMount(async () => {
  try {
    const result = await fetch(
      'https://gist.githubusercontent.com/rodrigoprestesmachado/15cb1d294f92554b1968ccc15a079293/raw/079ee6d0ec7b6f0ae946f7cb5ca7e143337f1cc8/tasks.json',
    );
    const data = await result.json();

    tasks.value = data.map((task: TaskFromFetch) => ({
      id: task.id,
      text: `${task.name}: ${task.description}`,
      editing: false,
    }));
  } catch (error) {
    console.error('Error on fetching tasks:', error);
  }
});
</script>

<template>
  <div>
    <h2>{{ listName }} ({{ getTodaysDate() }})</h2>
    <p class="info-text" v-if="informationalText">{{ informationalText }}</p>

    <input type="text" v-model="newTask" @change="createNewTask" id="newTask" />

    <div class="info-text">
      Check a task to complete it, or use the buttons to edit or delete it.
    </div>

    <div class="tasks" v-for="task in tasks" :key="task.id">
      <input type="checkbox" @click="completeTask(task)" />
      <div class="task-text" v-if="!task.editing">
        {{ task.text }}
      </div>
      <div v-else>
        <input
          class="task-text"
          type="text"
          v-model="task.text"
          id="editTask"
          @focus="onEditFocus(task)"
          @keyup.enter.prevent="finishEdit(task)"
          @blur="finishEdit(task)"
        />
      </div>
      <ActionMenu
        :ref="(el) => (actionMenuRefs[task.id] = el as InstanceType<typeof ActionMenu> | null)"
        :actions="['Edit', 'Delete']"
        @action-selected="handleAction($event, task)"
        @menu-opened="handleMenuOpen(task.id)"
      />
    </div>

    <div class="task-history" v-if="showHistory && (taskHistory ?? []).length > 0">
      <h2>Completed tasks</h2>
      <ul>
        <li v-for="(taskText, index) in taskHistory ?? []" :key="index">{{ taskText }}</li>
      </ul>
    </div>
  </div>
</template>

<style>
button:hover {
  color: hsla(160, 100%, 37%, 1);
  background-color: hsla(160, 100%, 37%, 0.2);
}

button {
  color: var(--vt-c-white);
  border: none;
  background: transparent;
}

.tasks {
  display: flex;
  gap: 20px;
}

.task-text {
  width: 50%;
}

input.task-text {
  width: 90%;
  box-sizing: border-box;
}

.task-history ul {
  text-decoration: line-through;
}

.info-text {
  font-size: 12px;
}
</style>
