<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-icon size="large" class="mr-3">mdi-email-send</v-icon>
          <h1 class="text-h4">Send Mail</h1>
          <v-spacer />
          <v-btn color="primary" prepend-icon="mdi-email-send" @click="openEmailDialog">
            Send an Email
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-history</v-icon>
            <span class="text-h6">Email History</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-alert v-if="emailError" type="error" variant="tonal" class="mb-4">
              {{ emailError }}
            </v-alert>
            <v-alert v-if="emailSuccess" type="success" variant="tonal" class="mb-4">
              {{ emailSuccess }}
            </v-alert>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">To</th>
                  <th class="text-left">Subject</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Sent</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in emailHistory" :key="item.id">
                  <td>{{ item.to }}</td>
                  <td class="text-truncate" style="max-width: 320px;">{{ item.subject }}</td>
                  <td>
                    <v-chip size="x-small" :color="item.status === 'sent' ? 'green' : 'red'">
                      {{ item.status }}
                    </v-chip>
                  </td>
                  <td>{{ formatDate(item.sentAt) }}</td>
                </tr>
                <tr v-if="emailHistory.length === 0">
                  <td colspan="4" class="text-center text-medium-emphasis py-6">
                    No email history yet
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="emailDialog" max-width="700">
      <v-card>
        <v-card-title>Send an Email</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="emailForm.from"
              label="From"
              placeholder="sender@example.com"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />
            <v-text-field
              v-model="emailForm.to"
              label="To"
              placeholder="recipient@example.com"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />
            <v-text-field
              v-model="emailForm.subject"
              label="Subject"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />
            <v-textarea
              v-model="emailForm.body"
              label="Body"
              rows="6"
              auto-grow
              variant="outlined"
              density="comfortable"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="emailDialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="emailSending" :disabled="!canSendEmail" @click="sendEmail">
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { mediaAPI } from '@/services/authService'

const { token } = useAuth()

const emailDialog = ref(false)
const emailHistory = ref([])
const emailError = ref('')
const emailSuccess = ref('')
const emailSending = ref(false)
const emailForm = ref({
  from: '',
  to: '',
  subject: '',
  body: ''
})

const canSendEmail = computed(() => {
  return Boolean(emailForm.value.from && emailForm.value.to && emailForm.value.subject && emailForm.value.body)
})

const fetchEmailHistory = async () => {
  if (!token.value) return
  try {
    const response = await mediaAPI.getEmailHistory(token.value)
    emailHistory.value = response.history || []
  } catch (error) {
    console.error('Fetch email history error:', error)
    emailError.value = error.message || 'Failed to fetch email history'
  }
}

const resetEmailForm = () => {
  emailForm.value = { from: '', to: '', subject: '', body: '' }
}

const openEmailDialog = () => {
  emailError.value = ''
  emailSuccess.value = ''
  resetEmailForm()
  emailDialog.value = true
}

const sendEmail = async () => {
  if (!canSendEmail.value || !token.value) return
  emailSending.value = true
  emailError.value = ''
  emailSuccess.value = ''

  try {
    await mediaAPI.sendEmail(token.value, emailForm.value)
    emailSuccess.value = 'Email sent successfully'
    emailDialog.value = false
    await fetchEmailHistory()
  } catch (error) {
    console.error('Send email error:', error)
    emailError.value = error.message || 'Failed to send email'
  } finally {
    emailSending.value = false
  }
}

const formatDate = (date) => {
  const parsedDate = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return ''

  const now = new Date()
  const diffMs = now - parsedDate
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

  return parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  fetchEmailHistory()
})
</script>
