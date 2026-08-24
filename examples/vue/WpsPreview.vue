<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {
  FlyfishWpsViewerElement,
  registerFlyfishWpsViewer,
} from '@flyfish-dev/wps-viewer-integration';

const props = defineProps<{ viewerUrl: string; fileUrl: string; fileName: string }>();
const element = ref<FlyfishWpsViewerElement>();

registerFlyfishWpsViewer();
const open = () => element.value?.open({ url: props.fileUrl, name: props.fileName });
onMounted(open);
watch(() => [props.fileUrl, props.fileName], open);
</script>

<template>
  <flyfish-wps-viewer
    ref="element"
    :viewer-url="viewerUrl"
    :src="fileUrl"
    :name="fileName"
  />
</template>
