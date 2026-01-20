<template>
  <v-dialog v-model="dialog" max-width="1200" transition="dialog-bottom-transition">
    <v-card>
      <v-card-title class="d-flex align-center pa-3">
        <span class="text-h6">{{ media.name }}</span>
        <v-spacer />
        <v-btn icon="mdi-download" variant="text" size="small" @click="download" class="mr-1" />
        <v-btn icon="mdi-share-variant" variant="text" size="small" @click="share" class="mr-1" />
        <v-btn icon="mdi-delete" variant="text" size="small" @click="deleteMedia" class="mr-1" />
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <!-- Image Preview -->
        <div v-if="media.type === 'image'" class="media-preview-container">
          <v-img :src="media.url" :alt="media.name" contain max-height="600" />
        </div>

        <!-- Video Preview -->
        <div v-else-if="media.type === 'video'" class="media-preview-container">
          <video controls class="w-100" style="max-height: 600px;">
            <source :src="media.url" :type="media.mimeType">
            Your browser does not support the video tag.
          </video>
        </div>

        <!-- Audio Preview -->
        <div v-else-if="media.type === 'audio'" class="media-preview-container pa-8 text-center">
          <v-icon size="120" color="primary">mdi-music-circle</v-icon>
          <div class="mt-4">
            <audio controls class="w-100">
              <source :src="media.url" :type="media.mimeType">
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>

        <!-- Document Preview -->
        <div v-else class="media-preview-container pa-8 text-center">
          <v-icon size="120" :color="getFileColor(media.format)">
            {{ getFileIcon(media.format) }}
          </v-icon>
          <div class="text-h6 mt-4">{{ media.name }}</div>
          <v-btn color="primary" prepend-icon="mdi-download" class="mt-4" @click="download">
            Download File
          </v-btn>
        </div>
      </v-card-text>

      <v-divider />

      <!-- Media Details -->
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis mb-1">File Name</div>
            <div class="text-body-1">{{ media.name }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis mb-1">File Size</div>
            <div class="text-body-1">{{ media.size }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis mb-1">File Type</div>
            <div class="text-body-1">{{ media.format.toUpperCase() }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis mb-1">Uploaded</div>
            <div class="text-body-1">{{ formatDate(media.uploadedAt) }}</div>
          </v-col>
          <v-col cols="12" v-if="media.dimensions">
            <div class="text-caption text-medium-emphasis mb-1">Dimensions</div>
            <div class="text-body-1">{{ media.dimensions }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  media: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'delete'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const close = () => {
  dialog.value = false
}

const download = () => {
  console.log('Downloading:', props.media.name)
  // Implement download logic
}

const share = () => {
  console.log('Sharing:', props.media.name)
  // Implement share logic
}

const deleteMedia = () => {
  emit('delete', props.media)
  close()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getFileIcon = (format) => {
  const icons = {
    'pdf': 'mdi-file-pdf-box',
    'doc': 'mdi-file-word-box',
    'docx': 'mdi-file-word-box',
    'xls': 'mdi-file-excel-box',
    'xlsx': 'mdi-file-excel-box',
    'ppt': 'mdi-file-powerpoint-box',
    'pptx': 'mdi-file-powerpoint-box',
    'txt': 'mdi-file-document',
    'zip': 'mdi-folder-zip',
    'rar': 'mdi-folder-zip'
  }
  return icons[format] || 'mdi-file'
}

const getFileColor = (format) => {
  const colors = {
    'pdf': 'red',
    'doc': 'blue',
    'docx': 'blue',
    'xls': 'green',
    'xlsx': 'green',
    'ppt': 'orange',
    'pptx': 'orange',
    'txt': 'grey',
    'zip': 'purple',
    'rar': 'purple'
  }
  return colors[format] || 'grey'
}
</script>

<style scoped>
.media-preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>
