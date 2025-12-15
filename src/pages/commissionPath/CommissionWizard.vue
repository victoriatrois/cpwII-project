<script setup lang="ts">
import { ref, computed } from 'vue';
import VtWizard from '../../components/Wizard/VtWizard.vue';
import VtWizardStep from '../../components/Wizard/VtWizardStep.vue';
import { useDialog } from '@/composables/useDialog';
import VtButton from '@/components/Button/VtButton.vue';

const { alert } = useDialog(); 

const activeStep = ref(0);

const storyText = ref('');
const storyOnArtist = ref(false);

const backgroundColor = ref('#000000');
const colorOnArtist = ref(false);
const colorChanged = ref(false);

const uploadedFile = ref<File | null>(null);
const imageOnArtist = ref(false);


function onColorChange() {
  colorChanged.value = true;
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  uploadedFile.value = target.files?.[0] || null;
}

const nextLabel = computed(() => {
  return activeStep.value === 0 ? "Let's start!" : "Next";
});

const emit = defineEmits<{ complete: [] }>();

async function handleComplete() {
  try {
    const submissionData: any = {
      story: storyText.value || null,
      backgroundColor: backgroundColor.value,
      uploadedFile: uploadedFile.value?.name || null,
      submittedAt: new Date().toISOString()
    };

    if (storyOnArtist.value) {
      submissionData.storyOnArtist = true;
    }

    if (colorOnArtist.value) {
      submissionData.colorOnArtist = true;
    }

    if (imageOnArtist.value) {
      submissionData.imageOnArtist = true;
    }

    const response = await fetch('http://localhost:3000/commissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    if (response.ok) {
      console.log('Commission submitted successfully');
      emit('complete');
    } else {
      console.error('Failed to submit commission');
    }
  } catch (error) {
    console.error('Error submitting commission:', error);
  }
}


async function handleNext() {
  if (activeStep.value === 1) {
    if (!storyText.value.trim() && !storyOnArtist.value) {
      const result = await alert('Allow Taina to create a story',
      'Not telling a story means you allow Taina to create it for you.',
      'Allow',
      'Cancel');

      if (result) {
        storyOnArtist.value = true;
      }
      return;
    }
  }

  if (activeStep.value === 2) {
    if (!colorChanged.value && !colorOnArtist.value) {
      const result = await alert(
        'Allow Taina to choose a background colour',
        'Not picking a background colour means you allow Taina to choose it for you.',
        'Allow',
        'Cancel');

      if (result) {
        colorOnArtist.value = true;
      }
      return;
    }
  }

  if (activeStep.value === 3) {
    if ((!uploadedFile.value && !imageOnArtist.value)) {
      const result = await alert(
        'Allow Taina to choose an image',
        'Not picking an image means you allow Taina to choose it for you.',
        'Allow',
        'Cancel');

      if (result) {
        imageOnArtist.value = true;
      }
      return;
    }
  }

  activeStep.value++;
}
</script>

<template>
  <div>
      <VtWizard v-model:activeIndex="activeStep" :linear="false" :nextLabel="nextLabel">
        <VtWizardStep title="Step 1">
          <p>You are one step closer from commissioning a unique artwork!</p>
          <p>Each following steps will requested important information needed to craft such piece of art.</p>
          <p>So, take you time, enjoy the process, and let's build something awesome.</p>
        </VtWizardStep>

        <VtWizardStep title="Step 2" :optional="true">
          <h3>Story</h3>
          <p>What is the story behind your commission? Why do you want it? What do you want to convey with it?</p>
          <textarea v-model="storyText" rows="10" cols="90"></textarea>
          <label for="no-story">
            <input v-model="storyOnArtist" type="checkbox" id="story-on-the-artist"></input>
            There's no story I want to tell. I acknowledge Taina can use the other elements I provide to tell the story for me.
          </label>
        </VtWizardStep>
        
        <VtWizardStep title="Step 3" :optional="true">
          <h3>Background Colour</h3>
          <input v-model="backgroundColor" type="color" @change="onColorChange"></input>
          <label for="no-colour">
            <input v-model="colorOnArtist" type="checkbox" id="colour-on-the-artist"></input>
            I acknowledge Taina can choose the background colour that best suits the other elements I will provide.
          </label>
        </VtWizardStep>
        
        <VtWizardStep title="Step 4" :optional="true">
          <h3>Picture</h3>
          <input type="file" accept="image/*" @change="onFileChange">
          <label for="no-image">
            <input v-model="imageOnArtist" type="checkbox" id="image-on-the-artist"></input>
            I acknowledge Taina can choose an image to support the other elements I provide.
          </label>
        </VtWizardStep>

        <VtWizardStep title="Step 5">
          <h3>Submit your Commission</h3>
          <p>Finish your submition and soon we'll reach out.</p>
        </VtWizardStep>
        
        <!-- <VtWizardStep title="Step 5">
          <h3>Phrase</h3>
          <textarea rows="3" cols="90"></textarea>
          <label for="no-phrase">
            <input type="checkbox" id="phrase-on-the-artist"></input>
            I acknowledge Taina can choose an image to support the other elements I provide.
          </label>
          <label>
            <input type="checkbox" id="no-phrase"></input>
            I do not want any phrase on my commission.
          </label>
        </VtWizardStep>

        <VtWizardStep title="Step 6">
          <h3>Payment</h3>
          <p>Scan the QR code and </p>
        </VtWizardStep> -->
        <template #footer="{ activeIndex, isFirst, isLast, total, previous }">
    <div class="vt-wizard-footer">
      <VtButton
        v-if="!isFirst"
        class="vt-wizard-prev"
        label="Back"
        variant="outlined"
        severity="neutral"
        @click="previous"
      />
      <div class="vt-wizard-footer-actions">
        <VtButton
          v-if="!isLast"
          :label="nextLabel"
          severity="neutral"
          @click="() => handleNext()"
        />
        <VtButton
          v-if="isLast"
          label="Submit Commission"
          severity="success"
          @click="() => handleComplete()"
        />
      </div>
    </div>
  </template>
      </VtWizard>
    </div>
</template>

<style scoped>
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

