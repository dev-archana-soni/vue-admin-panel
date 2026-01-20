<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h6">New Message</span>
        <v-spacer />
        <v-btn icon="mdi-minus" variant="text" size="small" @click="minimize" class="mr-1" />
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-text-field
          v-model="email.to"
          label="To"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-3"
        />

        <v-text-field
          v-model="email.cc"
          label="Cc"
          prepend-inner-icon="mdi-email-multiple-outline"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-3"
          v-if="showCc"
        />

        <v-text-field
          v-model="email.subject"
          label="Subject"
          prepend-inner-icon="mdi-text-subject"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-3"
        />

        <v-textarea
          v-model="email.body"
          label="Message"
          variant="outlined"
          rows="10"
          hide-details
        />

        <div v-if="attachments.length" class="mt-3">
          <v-chip
            v-for="(file, index) in attachments"
            :key="index"
            closable
            @click:close="removeAttachment(index)"
            class="mr-2 mb-2"
          >
            <v-icon start>mdi-paperclip</v-icon>
            {{ file.name }}
          </v-chip>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn color="primary" prepend-icon="mdi-send" @click="send" :disabled="!canSend">
          Send
        </v-btn>
        <v-btn variant="text" @click="close">
          Discard
        </v-btn>
        <v-spacer />
        <v-btn icon="mdi-attachment" variant="text" size="small" @click="attachFile" />
        <v-btn icon="mdi-emoticon-outline" variant="text" size="small" />
        <v-btn icon="mdi-format-bold" variant="text" size="small" />
        <v-btn icon="mdi-format-italic" variant="text" size="small" />
        <v-btn icon="mdi-format-underline" variant="text" size="small" />
        <v-btn
          :icon="showCc ? 'mdi-card-minus-outline' : 'mdi-card-plus-outline'"
          variant="text"
          size="small"
          @click="showCc = !showCc"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'send'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const email = ref({
  to: '',
  cc: '',
  subject: '',
  body: ''
})

const attachments = ref([])
const showCc = ref(false)

const canSend = computed(() => {
  return email.value.to && email.value.subject && email.value.body
})

const send = () => {
  if (!canSend.value) return
  
  emit('send', {
    ...email.value,
    attachments: attachments.value
  })
  
  close()
}

const close = () => {
  email.value = {
    to: '',
    cc: '',
    subject: '',
    body: ''
  }
  attachments.value = []
  showCc.value = false
  dialog.value = false
}

const minimize = () => {
  // Implement minimize functionality
  console.log('Minimize compose window')
}

const attachFile = () => {
  // Simulate file attachment
  const mockFile = {
    name: `document_${attachments.value.length + 1}.pdf`,
    size: '2.5 MB'
  }
  attachments.value.push(mockFile)
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}
</script>
