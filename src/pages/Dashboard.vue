<template>
  <v-row dense>
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <div class="text-subtitle-1 text-medium-emphasis">Users</div>
        <div class="text-h4 font-weight-medium">1,248</div>
        <div class="text-caption text-medium-emphasis">+4.2% vs last week</div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <div class="text-subtitle-1 text-medium-emphasis">Revenue</div>
        <div class="text-h4 font-weight-medium">$23,450</div>
        <v-progress-linear model-value="64" color="primary" rounded height="6" class="mt-3" />
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <div class="text-subtitle-1 text-medium-emphasis">Open Tickets</div>
        <div class="text-h4 font-weight-medium">54</div>
        <div class="text-caption text-medium-emphasis">Avg. 2h 13m</div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4">
        <div class="text-subtitle-1 text-medium-emphasis">Bounce Rate</div>
        <div class="text-h4 font-weight-medium">32%</div>
        <v-progress-linear model-value="32" color="error" rounded height="6" class="mt-3" />
      </v-card>
    </v-col>
  </v-row>

  <v-row dense class="mt-4">
    <v-col cols="12" md="8">
      <v-card class="pa-4">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-subtitle-1 text-medium-emphasis">Site Traffic</div>
          <v-btn icon="mdi-refresh" variant="text" size="small" />
        </div>
        <Bar :data="chartData" :options="chartOptions" />
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="pa-4">
        <div class="text-subtitle-1 text-medium-emphasis mb-4">Top Location</div>
        <div style="max-width: 300px; margin: 0 auto;">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
        <div class="mt-4">
          <div v-for="loc in locations" :key="loc.name" class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center">
              <div :style="{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: loc.color }" class="mr-2"></div>
              <span class="text-body-2">{{ loc.name }}</span>
            </div>
            <span class="text-body-2 text-medium-emphasis">{{ loc.value }}%</span>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-row dense class="mt-4">
    <v-col cols="12" md="8">
      <v-card class="pa-4">
        <div class="text-subtitle-1 text-medium-emphasis mb-4">Timeline (sample)</div>
        <div class="timeline timeline-point-sm">
          <div class="timeline-block" v-for="item in timeline" :key="item.id">
            <div class="timeline-point">
              <v-icon size="20">mdi-checkbox-blank-circle</v-icon>
            </div>
            <div class="timeline-content">
              <div class="text-subtitle-2">{{ item.title }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="pa-4">
        <div class="text-subtitle-1 text-medium-emphasis mb-3">Messages</div>
        <v-list nav class="chat-history--list">
          <v-list-item v-for="msg in messages" :key="msg.id" :title="msg.title" :subtitle="msg.snippet" />
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Unique Visit',
      data: [700, 750, 500, 900, 200, 850, 1050, 800, 750, 450, 900, 1150],
      backgroundColor: '#42A5F5',
      borderRadius: 4
    },
    {
      label: 'Page View',
      data: [650, 1100, 450, 1100, 400, 600, 850, 800, 650, 750, 1200, 750],
      backgroundColor: '#66BB6A',
      borderRadius: 4
    }
  ]
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: isDark.value ? '#e0e0e0' : '#666'
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#f5f5f5'
      },
      ticks: {
        color: isDark.value ? '#b0b0b0' : '#666'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: isDark.value ? '#b0b0b0' : '#666'
      }
    }
  }
}))

const doughnutData = {
  labels: ['China', 'USA', 'EU', 'Russia', 'Other'],
  datasets: [
    {
      data: [40, 20, 15, 15, 10],
      backgroundColor: ['#42A5F5', '#5C6BC0', '#EC407A', '#66BB6A', '#26C6DA'],
      borderWidth: 0
    }
  ]
}

const doughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: isDark.value ? '#2c2c2c' : '#ffffff',
      titleColor: isDark.value ? '#e0e0e0' : '#333',
      bodyColor: isDark.value ? '#e0e0e0' : '#333',
      borderColor: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1
    }
  },
  cutout: '70%'
}))

const locations = [
  { name: 'China', value: 40, color: '#42A5F5' },
  { name: 'USA', value: 20, color: '#5C6BC0' },
  { name: 'EU', value: 15, color: '#EC407A' },
  { name: 'Russia', value: 15, color: '#66BB6A' },
  { name: 'Other', value: 10, color: '#26C6DA' }
]
const timeline = [
  { id: 1, title: 'Order approved', text: 'Order #12345 has been approved' },
  { id: 2, title: 'Payment received', text: 'Payment confirmed via Stripe' },
  { id: 3, title: 'Shipped', text: 'Package sent with tracking ABC123' }
]

const messages = [
  { id: 1, title: 'Alice', snippet: 'Let’s sync on the dashboard redesign.' },
  { id: 2, title: 'Bob', snippet: 'The report has been updated.' },
  { id: 3, title: 'Carol', snippet: 'New tickets assigned to you.' }
]
</script>
