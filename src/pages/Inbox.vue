<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <!-- Sidebar with folders -->
      <v-col cols="12" md="3" lg="2" class="inbox-sidebar">
        <v-card elevation="0" class="h-100">
          <v-card-text class="pa-4">
            <v-btn color="primary" block prepend-icon="mdi-pencil" @click="composeDialog = true" class="mb-4">
              Compose
            </v-btn>

            <v-list density="compact" nav>
              <v-list-subheader class="text-uppercase text-caption font-weight-bold">
                <v-icon size="x-small" class="mr-2">mdi-email</v-icon>
                Folders
              </v-list-subheader>
              <v-list-item
                v-for="folder in folders"
                :key="folder.value"
                :value="folder.value"
                :active="currentFolder === folder.value"
                @click="currentFolder = folder.value"
                color="primary"
              >
                <template v-slot:prepend>
                  <v-icon :icon="folder.icon" />
                </template>
                <v-list-item-title>{{ folder.title }}</v-list-item-title>
                <template v-slot:append v-if="folder.count">
                  <v-chip size="x-small" color="primary">{{ folder.count }}</v-chip>
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="my-3" />

            <v-list-subheader>LABELS</v-list-subheader>
            <v-list density="compact" nav>
              <v-list-item
                v-for="label in labels"
                :key="label.value"
                :value="label.value"
              >
                <template v-slot:prepend>
                  <v-icon :icon="label.icon" :color="label.color" />
                </template>
                <v-list-item-title>{{ label.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Email List -->
      <v-col cols="12" md="4" lg="3" v-if="!selectedEmail" class="inbox-list">
        <v-card elevation="2" class="h-100">
          <v-card-title class="d-flex align-center pa-3">
            <span class="text-h6">{{ getCurrentFolderTitle() }}</span>
            <v-spacer />
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" size="small" />
              </template>
              <v-list density="compact">
                <v-list-item @click="markAllRead">
                  <v-list-item-title>Mark all as read</v-list-item-title>
                </v-list-item>
                <v-list-item @click="refreshEmails">
                  <v-list-item-title>Refresh</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <v-divider />

          <!-- Search and Filters -->
          <div class="pa-3">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search emails..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </div>

          <v-divider />

          <!-- Email List Items -->
          <v-list class="email-list pa-0">
            <template v-for="email in filteredEmails" :key="email.id">
              <v-list-item
                :class="{ 'email-unread': !email.read }"
                @click="selectEmail(email)"
                three-line
              >
                <template v-slot:prepend>
                  <v-checkbox-btn
                    v-model="selectedEmails"
                    :value="email.id"
                    @click.stop
                    density="compact"
                    class="mr-2"
                  />
                  <v-avatar size="40">
                    <v-img :src="email.avatar" :alt="email.from" />
                  </v-avatar>
                </template>

                <v-list-item-title class="d-flex align-center">
                  <span :class="{ 'font-weight-bold': !email.read }">{{ email.from }}</span>
                  <v-spacer />
                  <span class="text-caption text-medium-emphasis">{{ formatDate(email.date) }}</span>
                </v-list-item-title>

                <v-list-item-subtitle :class="{ 'font-weight-medium': !email.read }">
                  {{ email.subject }}
                </v-list-item-subtitle>

                <v-list-item-subtitle class="text-caption">
                  {{ email.preview }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex flex-column align-end">
                    <v-btn
                      :icon="email.starred ? 'mdi-star' : 'mdi-star-outline'"
                      :color="email.starred ? 'amber' : ''"
                      variant="text"
                      size="x-small"
                      @click.stop="toggleStar(email)"
                    />
                    <v-icon v-if="email.hasAttachment" size="small" color="grey">
                      mdi-paperclip
                    </v-icon>
                  </div>
                </template>
              </v-list-item>
              <v-divider />
            </template>

            <div v-if="filteredEmails.length === 0" class="text-center pa-8">
              <v-icon size="64" color="grey-lighten-1">mdi-email-outline</v-icon>
              <div class="text-h6 text-medium-emphasis mt-2">No emails</div>
              <div class="text-caption text-medium-emphasis">{{ getEmptyMessage() }}</div>
            </div>
          </v-list>
        </v-card>
      </v-col>

      <!-- Email Detail View -->
      <v-col cols="12" :md="selectedEmail ? 9 : 5" :lg="selectedEmail ? 10 : 7" class="inbox-detail">
        <EmailViewer
          v-if="selectedEmail"
          :email="selectedEmail"
          @back="selectedEmail = null"
        />
        <v-card v-else elevation="2" class="h-100 d-flex align-center justify-center">
          <div class="text-center">
            <v-icon size="100" color="grey-lighten-2">mdi-email-open-outline</v-icon>
            <div class="text-h6 text-medium-emphasis mt-4">Select an email to read</div>
            <div class="text-caption text-medium-emphasis">Choose an email from the list to view its contents</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Compose Email Dialog -->
    <ComposeEmail v-model="composeDialog" @send="handleSendEmail" />

    <!-- Bulk Actions -->
    <v-fab
      v-if="selectedEmails.length > 0"
      icon="mdi-delete"
      color="error"
      location="bottom end"
      size="small"
      class="mb-10"
      @click="bulkDelete"
    />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import EmailViewer from '@/components/EmailViewer.vue'
import ComposeEmail from '@/components/ComposeEmail.vue'

const currentFolder = ref('inbox')
const searchQuery = ref('')
const selectedEmail = ref(null)
const selectedEmails = ref([])
const composeDialog = ref(false)

const folders = ref([
  { title: 'Inbox', value: 'inbox', icon: 'mdi-inbox', count: 5 },
  { title: 'Starred', value: 'starred', icon: 'mdi-star', count: 2 },
  { title: 'Sent', value: 'sent', icon: 'mdi-send' },
  { title: 'Drafts', value: 'drafts', icon: 'mdi-file-document-edit', count: 1 },
  { title: 'Spam', value: 'spam', icon: 'mdi-alert-octagon' },
  { title: 'Trash', value: 'trash', icon: 'mdi-delete' }
])

const labels = ref([
  { title: 'Work', value: 'work', icon: 'mdi-label', color: 'blue' },
  { title: 'Personal', value: 'personal', icon: 'mdi-label', color: 'green' },
  { title: 'Important', value: 'important', icon: 'mdi-label', color: 'red' },
  { title: 'Social', value: 'social', icon: 'mdi-label', color: 'purple' }
])

const emails = ref([
  {
    id: 1,
    from: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    subject: 'Q4 Project Proposal Review',
    preview: 'Hi team, I\'ve attached the updated project proposal for Q4. Please review and provide your feedback by Friday...',
    body: '<p>Hi team,</p><p>I\'ve attached the updated project proposal for Q4. Please review and provide your feedback by Friday. We need to finalize the budget allocation and timeline before presenting to the board next week.</p><p>Key points to review:</p><ul><li>Budget estimates</li><li>Resource allocation</li><li>Timeline and milestones</li><li>Risk assessment</li></ul><p>Looking forward to your input.</p><p>Best regards,<br>Sarah</p>',
    date: new Date(Date.now() - 3600000),
    read: false,
    starred: true,
    hasAttachment: true,
    folder: 'inbox',
    label: 'Work',
    to: 'me@company.com',
    cc: 'team@company.com',
    attachments: [
      { name: 'Q4_Proposal.pdf', size: '2.5 MB', type: 'pdf' },
      { name: 'Budget_Breakdown.xlsx', size: '1.2 MB', type: 'xlsx' }
    ]
  },
  {
    id: 2,
    from: 'LinkedIn',
    email: 'noreply@linkedin.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    subject: 'You have 3 new connection requests',
    preview: 'John Smith and 2 others want to connect with you on LinkedIn...',
    body: '<p>Hi there,</p><p>John Smith and 2 others want to connect with you on LinkedIn. View their profiles and accept their invitations.</p><p>Build your professional network to discover new opportunities.</p>',
    date: new Date(Date.now() - 7200000),
    read: false,
    starred: false,
    hasAttachment: false,
    folder: 'inbox',
    label: 'Social',
    to: 'me@company.com'
  },
  {
    id: 3,
    from: 'Michael Chen',
    email: 'michael.chen@company.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    subject: 'Meeting Notes - Design Review',
    preview: 'Here are the notes from today\'s design review meeting. Action items are highlighted...',
    body: '<p>Hi everyone,</p><p>Here are the notes from today\'s design review meeting. Action items are highlighted below.</p><p><strong>Decisions made:</strong></p><ul><li>Approved new color scheme</li><li>Revised navigation structure</li><li>Postponed mobile optimizations to Sprint 2</li></ul><p><strong>Action items:</strong></p><ul><li>Update design system - Sarah (Due: Wed)</li><li>Create mockups for dashboard - Mike (Due: Thu)</li><li>Schedule follow-up meeting - Everyone (Due: Fri)</li></ul>',
    date: new Date(Date.now() - 86400000),
    read: true,
    starred: true,
    hasAttachment: true,
    folder: 'inbox',
    label: 'Work',
    to: 'me@company.com',
    attachments: [
      { name: 'meeting_notes.docx', size: '856 KB', type: 'docx' }
    ]
  },
  {
    id: 4,
    from: 'Emily Rodriguez',
    email: 'emily.r@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    subject: 'Weekend Plans',
    preview: 'Hey! Are you free this Saturday? We\'re planning a hiking trip to the mountains...',
    body: '<p>Hey!</p><p>Are you free this Saturday? We\'re planning a hiking trip to the mountains. The weather forecast looks great, and a few friends are joining us.</p><p>We\'ll leave around 7 AM and should be back by 6 PM. Bring water, snacks, and comfortable shoes!</p><p>Let me know if you can make it.</p><p>Cheers,<br>Emily</p>',
    date: new Date(Date.now() - 172800000),
    read: true,
    starred: false,
    hasAttachment: false,
    folder: 'inbox',
    label: 'Personal',
    to: 'me@gmail.com'
  },
  {
    id: 5,
    from: 'Amazon',
    email: 'shipment@amazon.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    subject: 'Your package has been delivered',
    preview: 'Your package was delivered at 2:45 PM. Track your order: #123-4567890-1234567...',
    body: '<p>Hello,</p><p>Your package was delivered at 2:45 PM today. You can track your order using the tracking number: #123-4567890-1234567.</p><p>We hope you enjoy your purchase! If you have any issues, please contact customer service.</p><p>Thank you for shopping with Amazon.</p>',
    date: new Date(Date.now() - 259200000),
    read: false,
    starred: false,
    hasAttachment: false,
    folder: 'inbox',
    to: 'me@gmail.com'
  }
])

const filteredEmails = computed(() => {
  let filtered = emails.value.filter(email => email.folder === currentFolder.value)
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(email =>
      email.from.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.preview.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const getCurrentFolderTitle = () => {
  const folder = folders.value.find(f => f.value === currentFolder.value)
  return folder ? folder.title : 'Inbox'
}

const getEmptyMessage = () => {
  if (searchQuery.value) return 'No emails match your search'
  return `No emails in ${getCurrentFolderTitle()}`
}

const formatDate = (date) => {
  const now = new Date()
  const emailDate = new Date(date)
  const diffMs = now - emailDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return emailDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const selectEmail = (email) => {
  selectedEmail.value = email
  if (!email.read) {
    email.read = true
    updateFolderCount('inbox', -1)
  }
}

const toggleStar = (email) => {
  email.starred = !email.starred
}

const markAllRead = () => {
  filteredEmails.value.forEach(email => {
    email.read = true
  })
  updateFolderCount('inbox', 0, true)
}

const refreshEmails = () => {
  console.log('Refreshing emails...')
}

const updateFolderCount = (folder, delta, reset = false) => {
  const folderObj = folders.value.find(f => f.value === folder)
  if (folderObj) {
    if (reset) {
      folderObj.count = 0
    } else {
      folderObj.count = Math.max(0, (folderObj.count || 0) + delta)
    }
  }
}

const bulkDelete = () => {
  emails.value = emails.value.filter(email => !selectedEmails.value.includes(email.id))
  selectedEmails.value = []
}

const handleSendEmail = (emailData) => {
  console.log('Sending email:', emailData)
  // Add to sent folder
  const newEmail = {
    id: emails.value.length + 1,
    from: 'Me',
    email: 'me@company.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    subject: emailData.subject,
    preview: emailData.body.substring(0, 100) + '...',
    body: emailData.body,
    date: new Date(),
    read: true,
    starred: false,
    hasAttachment: emailData.attachments.length > 0,
    folder: 'sent',
    to: emailData.to,
    attachments: emailData.attachments
  }
  emails.value.push(newEmail)
}
</script>

<style scoped>
.inbox-sidebar,
.inbox-list,
.inbox-detail {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.email-list {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
}

.email-unread {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.email-unread:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

/* Scrollbar styling */
.inbox-sidebar::-webkit-scrollbar,
.inbox-list::-webkit-scrollbar,
.inbox-detail::-webkit-scrollbar,
.email-list::-webkit-scrollbar {
  width: 8px;
}

.inbox-sidebar::-webkit-scrollbar-track,
.inbox-list::-webkit-scrollbar-track,
.inbox-detail::-webkit-scrollbar-track,
.email-list::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-surface));
}

.inbox-sidebar::-webkit-scrollbar-thumb,
.inbox-list::-webkit-scrollbar-thumb,
.inbox-detail::-webkit-scrollbar-thumb,
.email-list::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-grey-lighten-1));
  border-radius: 4px;
}

@media (max-width: 960px) {
  .inbox-sidebar,
  .inbox-list,
  .inbox-detail {
    height: auto;
    min-height: 400px;
  }
}
</style>
