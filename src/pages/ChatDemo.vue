<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Chat Component</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Contacts Sidebar -->
      <v-col cols="12" md="4" lg="3">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center pa-3">
            <span class="text-subtitle-1 font-weight-medium">Contacts</span>
            <v-spacer />
            <v-btn icon="mdi-account-plus" variant="text" size="small" />
          </v-card-title>
          <v-divider />
          
          <v-text-field
            v-model="searchQuery"
            placeholder="Search contacts..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            class="ma-3"
          />

          <v-list density="compact">
            <v-list-item
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="selectContact(contact)"
              :active="selectedContact?.id === contact.id"
              color="primary"
            >
              <template v-slot:prepend>
                <v-avatar size="40" class="mr-3">
                  <v-img :src="contact.avatar" :alt="contact.name" />
                  <v-badge
                    v-if="contact.online"
                    dot
                    color="success"
                    location="bottom right"
                  />
                </v-avatar>
              </template>
              
              <v-list-item-title>{{ contact.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ contact.lastMessage }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <span class="text-caption text-medium-emphasis">{{ contact.time }}</span>
                  <v-badge
                    v-if="contact.unread"
                    :content="contact.unread"
                    color="primary"
                    inline
                    class="mt-1"
                  />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Chat Area -->
      <v-col cols="12" md="8" lg="9">
        <div v-if="selectedContact">
          <Chat :contact="selectedContact" :user-avatar="userAvatar" />
        </div>
        <v-card v-else elevation="2" class="d-flex align-center justify-center" style="height: 600px;">
          <div class="text-center">
            <v-icon size="100" color="grey-lighten-2">mdi-message-text-outline</v-icon>
            <div class="text-h6 text-medium-emphasis mt-4">Select a contact to start chatting</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import Chat from '@/components/Chat.vue'

const userAvatar = ref('https://i.pravatar.cc/150?img=5')
const searchQuery = ref('')
const selectedContact = ref(null)

const contacts = ref([
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'Online',
    online: true,
    lastMessage: 'Hey! How are you?',
    time: '2m ago',
    unread: 3
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'Away',
    online: true,
    lastMessage: 'See you tomorrow!',
    time: '1h ago',
    unread: 0
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'Offline',
    online: false,
    lastMessage: 'Thanks for your help',
    time: '2h ago',
    unread: 1
  },
  {
    id: 4,
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'Online',
    online: true,
    lastMessage: 'The project looks great!',
    time: '3h ago',
    unread: 0
  },
  {
    id: 5,
    name: 'David Brown',
    avatar: 'https://i.pravatar.cc/150?img=6',
    status: 'Busy',
    online: true,
    lastMessage: 'In a meeting, talk later',
    time: '5h ago',
    unread: 0
  },
  {
    id: 6,
    name: 'Emily Davis',
    avatar: 'https://i.pravatar.cc/150?img=7',
    status: 'Online',
    online: true,
    lastMessage: 'Can you review my code?',
    time: '1d ago',
    unread: 5
  }
])

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value
  
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectContact = (contact) => {
  selectedContact.value = contact
  contact.unread = 0
}
</script>
