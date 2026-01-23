<template>
  <v-container class="py-6" fluid>
    <!-- Loading State -->
    <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

    <!-- Success Message -->
    <v-alert v-if="successMessage" type="success" closable class="mb-4" @click:close="successMessage = ''">
      {{ successMessage }}
    </v-alert>

    <!-- Error Message -->
    <v-alert v-if="errorMessage" type="error" closable class="mb-4" @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <div class="text-h5">User Groups Management</div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-btn color="primary" variant="flat" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>Create Group
        </v-btn>
      </v-col>
    </v-row>

    <!-- Groups Grid -->
    <v-row>
      <v-col v-for="group in userGroups" :key="group.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="h-100 d-flex flex-column">
          <!-- Group Logo -->
          <div class="pa-4 text-center bg-light">
            <v-img
              v-if="group.logo"
              :src="`http://localhost:5000${group.logo}`"
              :alt="group.name"
              max-height="150"
              contain
              class="mx-auto"
            ></v-img>
            <v-icon v-else size="80" color="grey">mdi-account-group</v-icon>
          </div>

          <!-- Group Info -->
          <v-card-text class="flex-grow-1">
            <h3 class="text-h6 mb-2">{{ group.name }}</h3>
            <p v-if="group.description" class="text-body2 text-grey mb-3">
              {{ group.description }}
            </p>
            <v-divider class="my-3"></v-divider>
            <p class="text-caption mb-2">
              <v-icon small>mdi-account-multiple</v-icon>
              {{ group.members?.length || 0 }} members
            </p>
            <p class="text-caption">
              <v-icon small>mdi-calendar</v-icon>
              {{ formatDate(group.createdAt) }}
            </p>
          </v-card-text>

          <!-- Actions -->
          <v-card-actions>
            <v-btn size="small" color="primary" variant="text" @click="openEditDialog(group)">
              Edit
            </v-btn>
            <v-btn size="small" color="primary" variant="text" @click="viewGroupMembers(group)">
              Members
            </v-btn>
            <v-btn size="small" color="error" variant="text" @click="deleteGroup(group.id)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="700">
      <v-card>
        <v-card-title>{{ isEditMode ? 'Edit Group' : 'Create New Group' }}</v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <!-- Group Name -->
          <v-text-field
            v-model="form.name"
            label="Group Name"
            placeholder="Enter group name"
            variant="outlined"
            class="mb-3"
            @keyup.enter="saveGroup"
          ></v-text-field>

          <!-- Group Description -->
          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Enter group description"
            variant="outlined"
            rows="3"
            class="mb-4"
          ></v-textarea>

          <!-- Logo Upload Section -->
          <div class="mb-4">
            <label class="text-body2 font-weight-medium mb-2 d-block">Group Logo</label>
            <v-row>
              <v-col cols="12" sm="5" class="d-flex align-center justify-center">
                <div v-if="logoPreview" class="text-center" style="width: 100%; max-height: 200px;">
                  <v-img 
                    :src="logoPreview.startsWith('data:') ? logoPreview : `http://localhost:5000${logoPreview}`" 
                    max-height="200" 
                    contain
                    style="border: 2px solid #e0e0e0; border-radius: 8px; padding: 8px;"
                  ></v-img>
                </div>
                <div v-else class="text-center pa-6" style="border: 2px dashed #ccc; border-radius: 8px; width: 100%;">
                  <v-icon size="48" color="grey">mdi-image-plus</v-icon>
                  <p class="text-body2 text-grey mt-2">No logo selected</p>
                </div>
              </v-col>
              <v-col cols="12" sm="7">
                <v-file-input
                  v-model="logoFile"
                  label="Upload Logo"
                  accept="image/*"
                  variant="outlined"
                  prepend-icon="mdi-camera"
                  @update:model-value="onLogoChange"
                  class="mb-2"
                ></v-file-input>
                <p class="text-caption text-grey">
                  <v-icon small>mdi-information</v-icon>
                  Recommended size: 200x200px, Max size: 5MB
                </p>
              </v-col>
            </v-row>
          </div>

          <v-divider class="mb-4"></v-divider>

          <!-- Select Members -->
          <label class="text-body2 font-weight-medium mb-2 d-block">Select Members</label>
          <v-autocomplete
            v-model="form.members"
            :items="availableUsers"
            item-title="name"
            item-value="id"
            label="Select users to add to group"
            multiple
            chips
            closable-chips
            variant="outlined"
            clearable
            return-object
          >
            <template #chip="{ item, props }">
              <v-chip v-bind="props" :text="`${item.raw.name} (${item.raw.email})`"></v-chip>
            </template>
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-avatar size="32">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.email }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>

          <!-- Selected Members Preview -->
          <div v-if="form.members.length > 0" class="mt-4">
            <p class="text-body2 font-weight-medium mb-2">Selected Members ({{ form.members.length }}):</p>
            <v-list lines="two" class="border rounded">
              <v-list-item v-for="(member, idx) in form.members" :key="idx">
                <template #prepend>
                  <v-avatar size="40">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ typeof member === 'string' ? getUserNameById(member) : member.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ typeof member === 'string' ? getUserEmailById(member) : member.email }}</v-list-item-subtitle>
                <template #append>
                  <v-btn
                    size="small"
                    color="error"
                    variant="text"
                    @click="removeMemberFromForm(idx)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveGroup"
            :loading="saving"
          >
            {{ isEditMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Members Dialog -->
    <v-dialog v-model="showMembersDialog" max-width="600">
      <v-card>
        <v-card-title>{{ selectedGroup?.name }} - Members</v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <!-- Add Member Section -->
          <div class="mb-4">
            <v-autocomplete
              v-model="newMemberId"
              :items="availableUsers"
              item-title="name"
              item-value="id"
              label="Add new member"
              variant="outlined"
              @update:model-value="addMember"
            ></v-autocomplete>
          </div>

          <!-- Members List -->
          <div v-if="selectedGroup?.members?.length > 0">
            <v-list>
              <v-list-item v-for="member in selectedGroup.members" :key="member.id">
                <template #prepend>
                  <v-avatar size="40">
                    <v-img v-if="member.image" :src="member.image" cover></v-img>
                    <v-icon v-else>mdi-account-circle</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ member.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ member.email }}</v-list-item-subtitle>
                <template #append>
                  <v-btn
                    size="small"
                    color="error"
                    variant="text"
                    @click="removeMember(member.id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </div>
          <div v-else class="text-center py-6 text-grey">
            <p>No members in this group</p>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showMembersDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'UserGroups',
  data() {
    return {
      userGroups: [],
      availableUsers: [],
      loading: false,
      saving: false,
      successMessage: '',
      errorMessage: '',
      showDialog: false,
      showMembersDialog: false,
      isEditMode: false,
      selectedGroup: null,
      newMemberId: null,
      logoFile: null,
      logoPreview: '',
      form: {
        name: '',
        description: '',
        members: []
      }
    }
  },
  computed: {
    apiBaseUrl() {
      return 'http://localhost:5000/api'
    }
  },
  mounted() {
    this.fetchUserGroups()
    this.fetchAvailableUsers()
  },
  methods: {
    async fetchUserGroups() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${this.apiBaseUrl}/user-groups`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch groups')

        const data = await response.json()
        this.userGroups = data.groups || []
      } catch (error) {
        console.error('Error fetching groups:', error)
        this.errorMessage = 'Failed to load user groups'
      } finally {
        this.loading = false
      }
    },

    async fetchAvailableUsers() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${this.apiBaseUrl}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch users')

        const data = await response.json()
        this.availableUsers = data.users || []
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },

    openCreateDialog() {
      this.isEditMode = false
      this.form = { name: '', description: '', members: [] }
      this.logoFile = null
      this.logoPreview = ''
      this.showDialog = true
    },

    openEditDialog(group) {
      this.isEditMode = true
      this.selectedGroup = group
      this.form = {
        name: group.name,
        description: group.description,
        members: group.members.map(m => m.id)
      }
      this.logoFile = null
      this.logoPreview = group.logo || ''
      this.showDialog = true
    },

    onLogoChange() {
      console.log('Logo selected:', this.logoFile)

      // v-file-input can provide a single File or an array; normalize to the first file
      const files = Array.isArray(this.logoFile)
        ? this.logoFile
        : this.logoFile
          ? [this.logoFile]
          : []

      if (!files.length) {
        this.logoPreview = null
        return
      }

      const file = files[0]
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      })
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.logoPreview = e.target.result
        console.log('Logo preview set')
      }
      reader.readAsDataURL(file)
    },

    removeMemberFromForm(index) {
      this.form.members.splice(index, 1)
    },

    getUserNameById(userId) {
      const user = this.availableUsers.find(u => u.id === userId)
      return user ? user.name : 'Unknown User'
    },

    getUserEmailById(userId) {
      const user = this.availableUsers.find(u => u.id === userId)
      return user ? user.email : ''
    },

    async saveGroup() {
      if (!this.form.name.trim()) {
        this.errorMessage = 'Group name is required'
        return
      }

      this.saving = true
      try {
        const token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('description', this.form.description)
        
        // Extract member IDs whether they're strings or objects
        const memberIds = this.form.members.map(m => typeof m === 'string' ? m : m.id)
        formData.append('members', JSON.stringify(memberIds))
        
        // Add logo if one was selected
        console.log('Selected logo for upload:', this.logoFile)
        
        if (this.logoFile) {
          // Normalize to array format to handle both single file and array cases
          const files = Array.isArray(this.logoFile) 
            ? this.logoFile 
            : [this.logoFile]
          
          if (files.length > 0 && files[0] instanceof File) {
            console.log('Adding logo to payload:', files[0])
            formData.append('logo', files[0])
          } else {
            console.log('No valid file object found')
          }
        } else {
          console.log('No logo selected')
        }

        const url = this.isEditMode 
          ? `${this.apiBaseUrl}/user-groups/${this.selectedGroup.id}`
          : `${this.apiBaseUrl}/user-groups`
        
        const method = this.isEditMode ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (!response.ok) throw new Error('Failed to save group')

        const data = await response.json()
        
        // Update the logo preview with the response data (including the logo URL from backend)
        if (data.group && data.group.logo) {
          this.logoPreview = data.group.logo
        }

        this.successMessage = this.isEditMode ? 'Group updated successfully' : 'Group created successfully'
        this.showDialog = false
        await this.fetchUserGroups()
      } catch (error) {
        console.error('Error saving group:', error)
        this.errorMessage = 'Failed to save group'
      } finally {
        this.saving = false
      }
    },

    viewGroupMembers(group) {
      this.selectedGroup = group
      this.newMemberId = null
      this.showMembersDialog = true
    },

    async addMember() {
      if (!this.newMemberId || !this.selectedGroup) return

      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `${this.apiBaseUrl}/user-groups/${this.selectedGroup.id}/members`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: this.newMemberId })
          }
        )

        if (!response.ok) throw new Error('Failed to add member')

        const data = await response.json()
        this.selectedGroup = data.group
        this.newMemberId = null
        this.successMessage = 'Member added successfully'
        await this.fetchUserGroups()
      } catch (error) {
        console.error('Error adding member:', error)
        this.errorMessage = 'Failed to add member'
      } finally {
        this.loading = false
      }
    },

    async removeMember(userId) {
      if (!confirm('Remove this member from the group?')) return

      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `${this.apiBaseUrl}/user-groups/${this.selectedGroup.id}/members/${userId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (!response.ok) throw new Error('Failed to remove member')

        const data = await response.json()
        this.selectedGroup = data.group
        this.successMessage = 'Member removed successfully'
        await this.fetchUserGroups()
      } catch (error) {
        console.error('Error removing member:', error)
        this.errorMessage = 'Failed to remove member'
      } finally {
        this.loading = false
      }
    },

    async deleteGroup(groupId) {
      if (!confirm('Are you sure you want to delete this group?')) return

      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${this.apiBaseUrl}/user-groups/${groupId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to delete group')

        this.successMessage = 'Group deleted successfully'
        await this.fetchUserGroups()
      } catch (error) {
        console.error('Error deleting group:', error)
        this.errorMessage = 'Failed to delete group'
      } finally {
        this.loading = false
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.bg-light {
  background-color: #f5f5f5;
}

.h-100 {
  height: 100%;
}

.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>
