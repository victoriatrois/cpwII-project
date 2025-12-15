<script setup lang="ts">
import { ref } from 'vue';
import VtButton from './components/Button/VtButton.vue';
import VtDialog from './components/Dialog/VtDialog.vue';
import CommissionWizard from './pages/commissionPath/CommissionWizard.vue';

const currentPage = ref('home');
const showDialog = ref(true);

function handleConfirm() {
  showDialog.value = false;
}

function handleCancel() {
  showDialog.value = false;
}

function goToCommission() {
  currentPage.value = 'commission';
}

function goHome() {
  currentPage.value = 'home';
}

function onComplete() {
}
</script>

<template>
  <VtDialog />

  <header>
    <div v-if="currentPage !== 'home'">
      <VtButton label="Back to Home" @click="goHome" />
    </div>
  </header>

    <!-- Homepage -->
  <div v-if="currentPage === 'home'">
    <main>
      <h1>Welcome to corpoario</h1>
      <div>
        <VtButton label="Commission yours" @click="goToCommission" />
      </div>
    </main>
  </div>

  <!-- Commission Page -->
  <div v-if="currentPage === 'commission'">
    <main>
      <CommissionWizard />
    </main>
  </div>

  <footer></footer>
</template>

<style scoped></style>
