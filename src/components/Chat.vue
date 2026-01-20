<template>
  <v-card class="chat-container" elevation="2">
    <!-- Chat Header -->
    <v-card-title class="chat-header d-flex align-center pa-3">
      <v-avatar size="40" class="mr-3">
        <v-img :src="currentContact.avatar" :alt="currentContact.name" />
      </v-avatar>
      <div class="flex-grow-1">
        <div class="text-subtitle-1 font-weight-medium">{{ currentContact.name }}</div>
        <div class="text-caption text-medium-emphasis">
          {{ currentContact.status }}
        </div>
      </div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" size="small" />
        </template>
        <v-list density="compact">
          <v-list-item @click="clearChat">
            <v-list-item-title>
              <v-icon size="small" class="mr-2">mdi-delete-sweep</v-icon>
              Clear Chat
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="muteNotifications = !muteNotifications">
            <v-list-item-title>
              <v-icon size="small" class="mr-2">{{ muteNotifications ? 'mdi-bell' : 'mdi-bell-off' }}</v-icon>
              {{ muteNotifications ? 'Unmute' : 'Mute' }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-divider />

    <!-- Messages Container -->
    <v-card-text class="chat-messages pa-4" ref="messagesContainer">
      <div v-if="messages.length === 0" class="text-center text-medium-emphasis py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-message-text-outline</v-icon>
        <div class="mt-2">No messages yet</div>
        <div class="text-caption">Start a conversation</div>
      </div>

      <div v-for="(message, index) in messages" :key="message.id" class="message-wrapper">
        <!-- Date Divider -->
        <div v-if="shouldShowDateDivider(index)" class="date-divider my-4">
          <v-divider />
          <v-chip size="small" color="grey-lighten-2" class="date-chip">
            {{ formatDate(message.timestamp) }}
          </v-chip>
          <v-divider />
        </div>

        <!-- Message Bubble -->
        <div :class="['message', message.isSent ? 'message-sent' : 'message-received']">
          <v-avatar
            v-if="!message.isSent"
            size="32"
            class="message-avatar"
          >
            <v-img :src="currentContact.avatar" :alt="currentContact.name" />
          </v-avatar>

          <div class="message-content">
            <v-card
              :class="['message-bubble', message.isSent ? 'sent' : 'received']"
              :color="message.isSent ? 'primary' : 'surface'"
              elevation="1"
            >
              <v-card-text class="pa-3">
                <div :class="message.isSent ? 'text-white' : ''">
                  {{ message.text }}
                </div>
              </v-card-text>
            </v-card>
            
            <div class="message-meta d-flex align-center mt-1">
              <span class="text-caption text-medium-emphasis">
                {{ formatTime(message.timestamp) }}
              </span>
              <v-icon
                v-if="message.isSent"
                size="16"
                :color="message.read ? 'primary' : 'grey'"
                class="ml-1"
              >
                {{ message.read ? 'mdi-check-all' : 'mdi-check' }}
              </v-icon>
            </div>
          </div>

          <v-avatar
            v-if="message.isSent"
            size="32"
            class="message-avatar"
          >
            <v-img :src="userAvatar" alt="You" />
          </v-avatar>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="message message-received">
        <v-avatar size="32" class="message-avatar">
          <v-img :src="currentContact.avatar" :alt="currentContact.name" />
        </v-avatar>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </v-card-text>

    <v-divider />

    <!-- Message Input -->
    <v-card-actions class="chat-input pa-3">
      <v-menu location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-emoticon-outline" variant="text" v-bind="props" size="small" />
        </template>
        <v-card class="pa-2">
          <div class="emoji-picker">
            <v-btn
              v-for="emoji in emojis"
              :key="emoji"
              @click="addEmoji(emoji)"
              variant="text"
              size="small"
              class="ma-1"
            >
              {{ emoji }}
            </v-btn>
          </div>
        </v-card>
      </v-menu>

      <v-btn icon="mdi-attachment" variant="text" size="small" @click="handleAttachment" />

      <v-text-field
        v-model="newMessage"
        placeholder="Type a message..."
        variant="outlined"
        density="comfortable"
        hide-details
        class="mx-2"
        @keyup.enter="sendMessage"
        @input="handleTyping"
      />

      <v-btn
        icon
        :color="newMessage.trim() ? 'primary' : 'grey'"
        :disabled="!newMessage.trim()"
        @click="sendMessage"
        size="small"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

// Props
const props = defineProps({
  contact: {
    type: Object,
    default: () => ({
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'Online'
    })
  },
  userAvatar: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=5'
  }
})

// State
const currentContact = ref(props.contact)
const messages = ref([
  {
    id: 1,
    text: 'Hey! How are you doing?',
    isSent: false,
    timestamp: new Date(Date.now() - 3600000),
    read: true
  },
  {
    id: 2,
    text: 'I\'m doing great! Thanks for asking. How about you?',
    isSent: true,
    timestamp: new Date(Date.now() - 3300000),
    read: true
  },
  {
    id: 3,
    text: 'I\'m good too! Working on this new Vue project.',
    isSent: false,
    timestamp: new Date(Date.now() - 3000000),
    read: true
  },
  {
    id: 4,
    text: 'That sounds exciting! What are you building?',
    isSent: true,
    timestamp: new Date(Date.now() - 2700000),
    read: true
  },
  {
    id: 5,
    text: 'An admin dashboard with Vue 3 and Vuetify. It\'s coming along nicely!',
    isSent: false,
    timestamp: new Date(Date.now() - 2400000),
    read: true
  }
])

const newMessage = ref('')
const isTyping = ref(false)
const muteNotifications = ref(false)
const messagesContainer = ref(null)

const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙌', '👏', '😍', '🤔']

// Methods
const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const message = {
    id: messages.value.length + 1,
    text: newMessage.value,
    isSent: true,
    timestamp: new Date(),
    read: false
  }

  messages.value.push(message)
  newMessage.value = ''
  scrollToBottom()

  // Simulate response
  setTimeout(() => {
    simulateTyping()
  }, 1000)
}

const simulateTyping = () => {
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    
    const responses = [
      'That sounds great!',
      'Interesting, tell me more.',
      'I see what you mean.',
      'Thanks for sharing!',
      'Cool! 😊'
    ]
    
    const response = {
      id: messages.value.length + 1,
      text: responses[Math.floor(Math.random() * responses.length)],
      isSent: false,
      timestamp: new Date(),
      read: true
    }
    
    messages.value.push(response)
    scrollToBottom()
  }, 2000)
}

const handleTyping = () => {
  // Handle typing indicator logic here if needed
}

const addEmoji = (emoji) => {
  newMessage.value += emoji
}

const handleAttachment = () => {
  // Handle file attachment logic
  console.log('Attachment clicked')
}

const clearChat = () => {
  messages.value = []
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const shouldShowDateDivider = (index) => {
  if (index === 0) return true
  
  const currentMsg = messages.value[index]
  const previousMsg = messages.value[index - 1]
  
  const currentDate = new Date(currentMsg.timestamp).toDateString()
  const previousDate = new Date(previousMsg.timestamp).toDateString()
  
  return currentDate !== previousDate
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

// Lifecycle
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-height: 80vh;
}

.chat-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-primary-darken-1)) 100%);
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: rgb(var(--v-theme-surface));
}

.message-wrapper {
  margin-bottom: 16px;
}

.message {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.message-received {
  justify-content: flex-start;
}

.message-sent {
  justify-content: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-sent .message-content {
  align-items: flex-end;
}

.message-received .message-content {
  align-items: flex-start;
}

.message-bubble {
  border-radius: 12px;
  word-wrap: break-word;
}

.message-bubble.sent {
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  border-bottom-left-radius: 4px;
}

.message-avatar {
  flex-shrink: 0;
}

.message-meta {
  padding: 0 8px;
}

.date-divider {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-chip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: white;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 12px;
  border-bottom-left-radius: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input {
  background-color: rgb(var(--v-theme-surface));
}

.emoji-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  max-width: 300px;
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-surface));
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-grey-lighten-1));
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--v-theme-grey));
}

/* Responsive */
@media (max-width: 600px) {
  .chat-container {
    height: 500px;
  }
  
  .message-content {
    max-width: 85%;
  }
}
</style>
