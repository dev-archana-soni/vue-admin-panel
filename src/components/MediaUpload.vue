<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h6">Upload Media</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <!-- Upload Area -->
        <div
          class="upload-area pa-8 text-center"
          :class="{ 'upload-dragging': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <v-icon size="64" color="primary">mdi-cloud-upload</v-icon>
          <div class="text-h6 mt-4">Drop files here or click to browse</div>
          <div class="text-caption text-medium-emphasis mt-2">
            Supported formats: Images, Videos, Audio, Documents
          </div>
          <div class="text-caption text-medium-emphasis">
            Maximum file size: 50 MB
          </div>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            style="display: none"
            @change="handleFileSelect"
          />
        </div>

        <!-- Selected Files -->
        <v-list v-if="files.length > 0" class="mt-4">
          <v-list-subheader>Selected Files ({{ files.length }})</v-list-subheader>
          <v-list-item v-for="(file, index) in files" :key="index">
            <template v-slot:prepend>
              <v-icon :color="getFileTypeColor(file.type)">
                {{ getFileTypeIcon(file.type) }}
              </v-icon>
            </template>
            <v-list-item-title>{{ file.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="removeFile(index)"
              />
            </template>
          </v-list-item>
        </v-list>

        <!-- Upload Progress -->
        <div v-if="uploading" class="mt-4">
          <v-progress-linear
            :model-value="uploadProgress"
            color="primary"
            height="8"
            rounded
          />
          <div class="text-center text-caption mt-2">
            Uploading... {{ uploadProgress }}%
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn
          color="primary"
          prepend-icon="mdi-upload"
          @click="upload"
          :disabled="files.length === 0 || uploading"
          :loading="uploading"
        >
          Upload {{ files.length > 0 ? `(${files.length})` : '' }}
        </v-btn>
        <v-btn variant="text" @click="close" :disabled="uploading">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'upload'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const files = ref([])
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files || [])
  addFiles(selectedFiles)
  event.target.value = ''
}

const handleDrop = (event) => {
  isDragging.value = false
  const droppedFiles = Array.from(event.dataTransfer.files || [])
  addFiles(droppedFiles)
}

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file => {
    // Check file size (50 MB limit)
    if (file.size > 50 * 1024 * 1024) {
      console.warn(`File ${file.name} is too large`)
      return false
    }
    return true
  })
  files.value.push(...validFiles)
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const upload = () => {
  if (files.value.length === 0) return

  uploading.value = true
  uploadProgress.value = 0

  // Simulate upload progress
  const interval = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        emit('upload', files.value)
        close()
      }, 500)
    }
  }, 200)
}

const close = () => {
  if (uploading.value) return
  files.value = []
  uploadProgress.value = 0
  dialog.value = false
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const getFileTypeIcon = (type) => {
  if (type.startsWith('image/')) return 'mdi-image'
  if (type.startsWith('video/')) return 'mdi-video'
  if (type.startsWith('audio/')) return 'mdi-music'
  if (type.includes('pdf')) return 'mdi-file-pdf-box'
  if (type.includes('word') || type.includes('document')) return 'mdi-file-word-box'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'mdi-file-excel-box'
  if (type.includes('powerpoint') || type.includes('presentation')) return 'mdi-file-powerpoint-box'
  if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return 'mdi-folder-zip'
  return 'mdi-file'
}

const getFileTypeColor = (type) => {
  if (type.startsWith('image/')) return 'purple'
  if (type.startsWith('video/')) return 'red'
  if (type.startsWith('audio/')) return 'green'
  if (type.includes('pdf')) return 'red'
  if (type.includes('word')) return 'blue'
  if (type.includes('excel')) return 'green'
  if (type.includes('powerpoint')) return 'orange'
  return 'grey'
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed rgb(var(--v-theme-primary));
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgb(var(--v-theme-surface-variant));
}

.upload-area:hover {
  background-color: rgb(var(--v-theme-surface-bright));
  border-color: rgb(var(--v-theme-primary-darken-1));
}

.upload-dragging {
  background-color: rgb(var(--v-theme-primary));
  opacity: 0.1;
  transform: scale(1.02);
}
</style>
