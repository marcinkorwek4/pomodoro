<script setup lang="ts">
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmDialog from 'primevue/confirmdialog';
import InputNumber from 'primevue/inputnumber';

import { useConfirm } from "primevue/useconfirm";
import { ref, watch } from 'vue';

const workTime = ref(25);
const breakTime = ref(5);
const timer = ref(0);
const isWorkPeriod = ref(true);
const intervalId = ref<number | null>(null);
const confirm = useConfirm();

const playSound = () => {
  const audio = new Audio('alarm.mp3');
  audio.play();
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 1500);
};

const updateTitle = () => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = (timer.value % 60).toString().padStart(2, '0');
  document.title = `${isWorkPeriod.value ? 'Work' : 'Break'} Time: ${minutes}:${seconds}`;
};

const startTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
  timer.value = isWorkPeriod.value ? workTime.value * 60 : breakTime.value * 60;
  updateTitle();
  intervalId.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
      updateTitle();
    } else {
      clearInterval(intervalId.value!);
      intervalId.value = null;
      playSound();
      const soundIntervalId = setInterval(playSound, 1500);
      const nextPeriod = isWorkPeriod.value ? 'break' : 'work';
      confirm.require({
        message: `Time's up! Do you want to start the ${nextPeriod} period?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          clearInterval(soundIntervalId);
          isWorkPeriod.value = !isWorkPeriod.value;
          startTimer();
        },
        reject: () => {
          clearInterval(soundIntervalId);
        }
      });
    }
  }, 1000);
};

const stopTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  document.title = 'Pomodoro Timer';
};

const resetTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
    isWorkPeriod.value = true;
  }
  document.title = 'Pomodoro Timer';
};

// Watch for changes in timer and update the title accordingly
watch(timer, updateTitle);
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="flex gap-4">
      <label for="work-time">Work Time (minutes):</label>
      <InputNumber id="work-time" type="number" v-model="workTime" />
    </div>
    <div class="flex gap-4">
      <label for="break-time">Break Time (minutes):</label>
      <InputNumber id="break-time" type="number" v-model="breakTime" />
    </div>
    <div class="flex gap-4">
      <Button label="Start" @click="startTimer" />
      <Button label="Stop" @click="stopTimer" />
      <Button label="Reset" @click="resetTimer" />
    </div>
    <div>
      <span class="font-semibold text-2xl">{{ isWorkPeriod ? 'Work' : 'Break' }} Time: {{ Math.floor(timer / 60) }}:{{ (timer % 60).toString().padStart(2, '0') }}</span>
    </div>
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>