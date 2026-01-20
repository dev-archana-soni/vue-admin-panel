<template>
  <v-card elevation="2" class="email-viewer">
    <v-card-title class="d-flex align-center pa-4">
      <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" size="small" class="mr-2" />
      <div class="flex-grow-1">
        <div class="text-h6">{{ email.subject }}</div>
      </div>
      <v-btn icon="mdi-star-outline" variant="text" size="small" class="mr-1" />
      <v-btn icon="mdi-archive-outline" variant="text" size="small" class="mr-1" />
      <v-btn icon="mdi-delete-outline" variant="text" size="small" />
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-4">
      <!-- Email Header -->
      <div class="email-header mb-4">
        <div class="d-flex align-center mb-3">
          <v-avatar size="48" class="mr-3">
            <v-img :src="email.avatar" :alt="email.from" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="d-flex align-center">
              <span class="text-subtitle-1 font-weight-medium">{{ email.from }}</span>
              <v-chip size="x-small" class="ml-2" :color="getLabelColor(email.label)" v-if="email.label">
                {{ email.label }}
              </v-chip>
            </div>
            <div class="text-caption text-medium-emphasis">{{ email.email }}</div>
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ formatFullDate(email.date) }}
          </div>
        </div>

        <div class="d-flex align-center text-caption text-medium-emphasis mb-2">
          <span class="mr-4">
            <strong>To:</strong> {{ email.to }}
          </span>
          <span v-if="email.cc">
            <strong>Cc:</strong> {{ email.cc }}
          </span>
        </div>
      </div>

      <!-- Email Body -->
      <div class="email-body" v-html="email.body"></div>

      <!-- Attachments -->
      <div v-if="email.attachments && email.attachments.length" class="email-attachments mt-4">
        <v-divider class="my-3" />
        <div class="text-subtitle-2 mb-2">
          <v-icon size="small" class="mr-1">mdi-paperclip</v-icon>
          {{ email.attachments.length }} Attachment{{ email.attachments.length > 1 ? 's' : '' }}
        </div>
        <v-row>
          <v-col v-for="attachment in email.attachments" :key="attachment.name" cols="12" sm="6" md="4">
            <v-card variant="outlined" class="pa-3">
              <div class="d-flex align-center">
                <v-icon :color="getFileIconColor(attachment.type)" class="mr-2">
                  {{ getFileIcon(attachment.type) }}
                </v-icon>
                <div class="flex-grow-1 text-truncate">
                  <div class="text-body-2">{{ attachment.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ attachment.size }}</div>
                </div>
                <v-btn icon="mdi-download" variant="text" size="small" />
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <v-divider />

    <!-- Reply Section -->
    <v-card-actions class="pa-4 flex-column align-start">
      <div class="d-flex gap-2 mb-3">
        <v-btn color="primary" prepend-icon="mdi-reply" @click="showReply = !showReply">
          Reply
        </v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-reply-all">
          Reply All
        </v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-forward">
          Forward
        </v-btn>
      </div>

      <v-expand-transition>
        <v-card v-if="showReply" variant="outlined" class="w-100">
          <v-card-text>
            <v-textarea
              v-model="replyText"
              placeholder="Type your reply..."
              variant="outlined"
              rows="4"
              hide-details
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" prepend-icon="mdi-send" @click="sendReply">
              Send
            </v-btn>
            <v-btn variant="text" @click="showReply = false">
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn icon="mdi-attachment" variant="text" size="small" />
            <v-btn icon="mdi-emoticon-outline" variant="text" size="small" />
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  email: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back'])

const showReply = ref(false)
const replyText = ref('')

const sendReply = () => {
  console.log('Sending reply:', replyText.value)
  replyText.value = ''
  showReply.value = false
}

const formatFullDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const getLabelColor = (label) => {
  const colors = {
    'Work': 'blue',
    'Personal': 'green',
    'Important': 'red',
    'Social': 'purple'
  }
  return colors[label] || 'grey'
}

const getFileIcon = (type) => {
  const icons = {
    'pdf': 'mdi-file-pdf-box',
    'doc': 'mdi-file-word-box',
    'docx': 'mdi-file-word-box',
    'xls': 'mdi-file-excel-box',
    'xlsx': 'mdi-file-excel-box',
    'jpg': 'mdi-file-image',
    'jpeg': 'mdi-file-image',
    'png': 'mdi-file-image',
    'zip': 'mdi-folder-zip'
  }
  return icons[type] || 'mdi-file-document'
}

const getFileIconColor = (type) => {
  const colors = {
    'pdf': 'red',
    'doc': 'blue',
    'docx': 'blue',
    'xls': 'green',
    'xlsx': 'green',
    'jpg': 'purple',
    'jpeg': 'purple',
    'png': 'purple',
    'zip': 'orange'
  }
  return colors[type] || 'grey'
}
</script>

<style scoped>
.email-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.email-body {
  line-height: 1.6;
  color: rgb(var(--v-theme-on-surface));
}

.email-body :deep(p) {
  margin-bottom: 1em;
}

.email-attachments {
  background-color: rgb(var(--v-theme-surface-variant));
  padding: 16px;
  border-radius: 8px;
}
</style>
