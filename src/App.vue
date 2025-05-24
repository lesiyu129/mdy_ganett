<template>
  <div>
    <Gantt></Gantt>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { config, env, api } from "mdye";
import Gantt from "./components/Gantt.vue";
const { appId, worksheetId, viewId } = config;
</script>

<style></style>
