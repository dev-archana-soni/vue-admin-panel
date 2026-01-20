<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <h1 class="text-h4">Media Library</h1>
          <v-spacer />
          <v-btn color="primary" prepend-icon="mdi-upload" @click="uploadDialog = true">
            Upload
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="Search media..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterType"
                  :items="mediaTypes"
                  label="Media Type"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="sortBy"
                  :items="sortOptions"
                  label="Sort By"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2" class="d-flex justify-end">
                <v-btn-toggle v-model="viewMode" mandatory color="primary" density="compact">
                  <v-btn icon="mdi-view-grid" value="grid" />
                  <v-btn icon="mdi-view-list" value="list" />
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Media Grid View -->
    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="media in filteredMedia"
        :key="media.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card elevation="2" hover @click="viewMedia(media)" class="media-card">
          <!-- Media Thumbnail -->
          <div class="media-thumbnail">
            <v-img
              v-if="media.type === 'image'"
              :src="media.thumbnail"
              :alt="media.name"
              cover
              height="200"
            />
            <div v-else class="media-placeholder" :style="{ background: getPlaceholderColor(media.type) }">
              <v-icon size="64" color="white">{{ getMediaIcon(media.type) }}</v-icon>
            </div>

            <!-- Overlay Actions -->
            <div class="media-overlay">
              <v-btn
                icon="mdi-eye"
                size="small"
                color="white"
                @click.stop="viewMedia(media)"
              />
              <v-btn
                icon="mdi-download"
                size="small"
                color="white"
                @click.stop="downloadMedia(media)"
              />
              <v-btn
                icon="mdi-delete"
                size="small"
                color="white"
                @click.stop="confirmDelete(media)"
              />
            </div>

            <!-- Media Type Badge -->
            <v-chip
              size="small"
              class="media-badge"
              :color="getTypeBadgeColor(media.type)"
            >
              {{ media.type }}
            </v-chip>
          </div>

          <v-card-text class="pa-3">
            <div class="text-subtitle-2 text-truncate" :title="media.name">
              {{ media.name }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ media.size }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ formatDate(media.uploadedAt) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Empty State -->
      <v-col v-if="filteredMedia.length === 0" cols="12">
        <v-card elevation="2" class="pa-12 text-center">
          <v-icon size="100" color="grey-lighten-2">mdi-image-off</v-icon>
          <div class="text-h6 text-medium-emphasis mt-4">No media found</div>
          <div class="text-caption text-medium-emphasis">
            {{ searchQuery ? 'Try adjusting your search or filters' : 'Upload your first media file' }}
          </div>
          <v-btn
            v-if="!searchQuery"
            color="primary"
            prepend-icon="mdi-upload"
            class="mt-4"
            @click="uploadDialog = true"
          >
            Upload Media
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Media List View -->
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2">
          <v-list>
            <v-list-item
              v-for="media in filteredMedia"
              :key="media.id"
              @click="viewMedia(media)"
            >
              <template v-slot:prepend>
                <v-avatar size="48" rounded>
                  <v-img v-if="media.type === 'image'" :src="media.thumbnail" />
                  <v-icon v-else :color="getPlaceholderColor(media.type)">
                    {{ getMediaIcon(media.type) }}
                  </v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ media.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ media.type.toUpperCase() }} • {{ media.size }} • {{ formatDate(media.uploadedAt) }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-btn
                  icon="mdi-eye"
                  variant="text"
                  size="small"
                  @click.stop="viewMedia(media)"
                />
                <v-btn
                  icon="mdi-download"
                  variant="text"
                  size="small"
                  @click.stop="downloadMedia(media)"
                />
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  size="small"
                  @click.stop="confirmDelete(media)"
                />
              </template>
            </v-list-item>
          </v-list>

          <!-- Empty State for List View -->
          <div v-if="filteredMedia.length === 0" class="pa-12 text-center">
            <v-icon size="100" color="grey-lighten-2">mdi-image-off</v-icon>
            <div class="text-h6 text-medium-emphasis mt-4">No media found</div>
            <div class="text-caption text-medium-emphasis">
              {{ searchQuery ? 'Try adjusting your search or filters' : 'Upload your first media file' }}
            </div>
            <v-btn
              v-if="!searchQuery"
              color="primary"
              prepend-icon="mdi-upload"
              class="mt-4"
              @click="uploadDialog = true"
            >
              Upload Media
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upload Dialog -->
    <MediaUpload v-model="uploadDialog" @upload="handleUpload" />

    <!-- Media Viewer -->
    <MediaViewer
      v-model="viewerDialog"
      :media="selectedMedia"
      @delete="handleDelete"
    />

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Media?</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ mediaToDelete?.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteMediaConfirmed">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import MediaUpload from '@/components/MediaUpload.vue'
import MediaViewer from '@/components/MediaViewer.vue'

const searchQuery = ref('')
const filterType = ref('all')
const sortBy = ref('newest')
const viewMode = ref('grid')
const uploadDialog = ref(false)
const viewerDialog = ref(false)
const deleteDialog = ref(false)
const selectedMedia = ref({})
const mediaToDelete = ref(null)

const mediaTypes = [
  { title: 'All Types', value: 'all' },
  { title: 'Images', value: 'image' },
  { title: 'Videos', value: 'video' },
  { title: 'Audio', value: 'audio' },
  { title: 'Documents', value: 'document' }
]

const sortOptions = [
  { title: 'Newest First', value: 'newest' },
  { title: 'Oldest First', value: 'oldest' },
  { title: 'Name (A-Z)', value: 'name-asc' },
  { title: 'Name (Z-A)', value: 'name-desc' },
  { title: 'Largest First', value: 'size-desc' },
  { title: 'Smallest First', value: 'size-asc' }
]

const mediaLibrary = ref([
  {
    id: 1,
    name: 'mountain-landscape.jpg',
    type: 'image',
    format: 'jpg',
    size: '2.4 MB',
    sizeBytes: 2516582,
    url: 'https://picsum.photos/800/600?random=1',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    dimensions: '1920 x 1080',
    mimeType: 'image/jpeg',
    uploadedAt: new Date(Date.now() - 86400000)
  },
  {
    id: 2,
    name: 'beach-sunset.jpg',
    type: 'image',
    format: 'jpg',
    size: '3.1 MB',
    sizeBytes: 3250176,
    url: 'https://picsum.photos/800/600?random=2',
    thumbnail: 'https://picsum.photos/400/300?random=2',
    dimensions: '2560 x 1440',
    mimeType: 'image/jpeg',
    uploadedAt: new Date(Date.now() - 172800000)
  },
  {
    id: 3,
    name: 'city-lights.jpg',
    type: 'image',
    format: 'jpg',
    size: '1.8 MB',
    sizeBytes: 1887436,
    url: 'https://picsum.photos/800/600?random=3',
    thumbnail: 'https://picsum.photos/400/300?random=3',
    dimensions: '1920 x 1080',
    mimeType: 'image/jpeg',
    uploadedAt: new Date(Date.now() - 259200000)
  },
  {
    id: 4,
    name: 'presentation.mp4',
    type: 'video',
    format: 'mp4',
    size: '45.2 MB',
    sizeBytes: 47401738,
    url: '#',
    thumbnail: '',
    dimensions: '1920 x 1080',
    mimeType: 'video/mp4',
    uploadedAt: new Date(Date.now() - 345600000)
  },
  {
    id: 5,
    name: 'podcast-episode.mp3',
    type: 'audio',
    format: 'mp3',
    size: '8.5 MB',
    sizeBytes: 8912896,
    url: '#',
    thumbnail: '',
    mimeType: 'audio/mpeg',
    uploadedAt: new Date(Date.now() - 432000000)
  },
  {
    id: 6,
    name: 'project-proposal.pdf',
    type: 'document',
    format: 'pdf',
    size: '1.2 MB',
    sizeBytes: 1258291,
    url: '#',
    thumbnail: '',
    mimeType: 'application/pdf',
    uploadedAt: new Date(Date.now() - 518400000)
  },
  {
    id: 7,
    name: 'forest-path.jpg',
    type: 'image',
    format: 'jpg',
    size: '2.9 MB',
    sizeBytes: 3041689,
    url: 'https://picsum.photos/800/600?random=4',
    thumbnail: 'https://picsum.photos/400/300?random=4',
    dimensions: '3840 x 2160',
    mimeType: 'image/jpeg',
    uploadedAt: new Date(Date.now() - 604800000)
  },
  {
    id: 8,
    name: 'annual-report.xlsx',
    type: 'document',
    format: 'xlsx',
    size: '3.4 MB',
    sizeBytes: 3565158,
    url: '#',
    thumbnail: '',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedAt: new Date(Date.now() - 691200000)
  },
  {
    id: 9,
    name: 'ocean-waves.jpg',
    type: 'image',
    format: 'jpg',
    size: '4.2 MB',
    sizeBytes: 4404019,
    url: 'https://picsum.photos/800/600?random=5',
    thumbnail: 'https://picsum.photos/400/300?random=5',
    dimensions: '4096 x 2160',
    mimeType: 'image/jpeg',
    uploadedAt: new Date(Date.now() - 777600000)
  },
  {
    id: 10,
    name: 'tutorial-video.mp4',
    type: 'video',
    format: 'mp4',
    size: '120.5 MB',
    sizeBytes: 126357913,
    url: '#',
    thumbnail: '',
    dimensions: '1920 x 1080',
    mimeType: 'video/mp4',
    uploadedAt: new Date(Date.now() - 864000000)
  },
  {
    id: 11,
    name: 'desert-dunes.jpg',
    type: 'image',
    format: 'jpg',
    size: '3.7 MB',
    sizeBytes: 3880550,
    url: 'https://picsum.photos/800/600?random=6',
    thumbnail: 'https://picsum.photos/400/300?random=6',
    dimensions: '3200 x 2400',
    mimeType: 'image/jpeg',
    uploadedAt: new Date(Date.now() - 950400000)
  },
  {
    id: 12,
    name: 'meeting-notes.docx',
    type: 'document',
    format: 'docx',
    size: '856 KB',
    sizeBytes: 876748,
    url: '#',
    thumbnail: '',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedAt: new Date(Date.now() - 1036800000)
  }
])

const filteredMedia = computed(() => {
  let filtered = [...mediaLibrary.value]

  // Filter by type
  if (filterType.value !== 'all') {
    filtered = filtered.filter(m => m.type === filterType.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(query)
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => b.uploadedAt - a.uploadedAt)
      break
    case 'oldest':
      filtered.sort((a, b) => a.uploadedAt - b.uploadedAt)
      break
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'size-desc':
      filtered.sort((a, b) => b.sizeBytes - a.sizeBytes)
      break
    case 'size-asc':
      filtered.sort((a, b) => a.sizeBytes - b.sizeBytes)
      break
  }

  return filtered
})

const viewMedia = (media) => {
  selectedMedia.value = media
  viewerDialog.value = true
}

const downloadMedia = (media) => {
  console.log('Downloading:', media.name)
}

const confirmDelete = (media) => {
  mediaToDelete.value = media
  deleteDialog.value = true
}

const deleteMediaConfirmed = () => {
  if (mediaToDelete.value) {
    handleDelete(mediaToDelete.value)
  }
  deleteDialog.value = false
  mediaToDelete.value = null
}

const handleDelete = (media) => {
  const index = mediaLibrary.value.findIndex(m => m.id === media.id)
  if (index !== -1) {
    mediaLibrary.value.splice(index, 1)
  }
  viewerDialog.value = false
}

const handleUpload = (files) => {
  console.log('Uploading files:', files)
  // Simulate adding uploaded files to library
  files.forEach((file, index) => {
    const newMedia = {
      id: mediaLibrary.value.length + index + 1,
      name: file.name,
      type: getFileType(file.type),
      format: file.name.split('.').pop(),
      size: formatFileSize(file.size),
      sizeBytes: file.size,
      url: URL.createObjectURL(file),
      thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      mimeType: file.type,
      uploadedAt: new Date()
    }
    mediaLibrary.value.unshift(newMedia)
  })
}

const getFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  return 'document'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (date) => {
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getMediaIcon = (type) => {
  const icons = {
    image: 'mdi-image',
    video: 'mdi-video',
    audio: 'mdi-music',
    document: 'mdi-file-document'
  }
  return icons[type] || 'mdi-file'
}

const getPlaceholderColor = (type) => {
  const colors = {
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    video: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    audio: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    document: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
  return colors[type] || 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
}

const getTypeBadgeColor = (type) => {
  const colors = {
    image: 'purple',
    video: 'red',
    audio: 'blue',
    document: 'green'
  }
  return colors[type] || 'grey'
}
</script>

<style scoped>
.media-card {
  transition: transform 0.2s ease;
}

.media-card:hover {
  transform: translateY(-4px);
}

.media-thumbnail {
  position: relative;
  overflow: hidden;
}

.media-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.media-card:hover .media-overlay {
  opacity: 1;
}

.media-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  text-transform: uppercase;
  font-weight: 600;
}
</style>
