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
        <div class="d-flex align-center">
          <v-icon size="large" class="mr-3">mdi-calendar-multiple</v-icon>
          <div class="text-h5">Monthly Items Management</div>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-select
          v-model="selectedItemId"
          :items="availableItems"
          item-title="itemLabel"
          item-value="id"
          label="Add Item"
          variant="outlined"
          clearable
          @update:modelValue="addMonthlyItem"
          class="mb-0"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon color="primary">mdi-package-variant</v-icon>
              </template>
              <v-list-item-title>{{ item.raw.name }} ({{ item.raw.quantity }} {{ item.raw.unit }})</v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <!-- Monthly Items Table -->
    <v-card v-if="monthlyItems.length > 0">
      <v-table class="elevation-1">
        <thead>
          <tr class="bg-primary text-white">
            <th class="text-left font-weight-bold" style="width: 250px;">Item Details</th>
            <th class="text-center font-weight-bold" v-for="month in months" :key="month" style="width: 70px;">
              {{ getMonthLabel(month) }}
            </th>
            <th class="text-center font-weight-bold" style="width: 60px;">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="monthlyItem in monthlyItems" :key="monthlyItem.id">
            <td class="pa-3">
              <div class="font-weight-bold text-h6">{{ monthlyItem.item?.name }}</div>
              <div class="text-caption text-grey mt-1" v-if="monthlyItem.item?.description">
                {{ monthlyItem.item?.description }}
              </div>
              <div class="text-caption mt-2">
                <v-chip size="small" color="primary" variant="flat" class="mr-2">
                  {{ monthlyItem.item?.quantity }} {{ getUnitLabel(monthlyItem.item?.unit) }}
                </v-chip>
                <v-chip size="small" color="success" variant="flat" class="mr-2">
                  ₹{{ monthlyItem.item?.price.toFixed(2) }}
                </v-chip>
                <v-chip v-if="monthlyItem.item?.category" size="small" color="info" variant="flat">
                  {{ monthlyItem.item?.category?.name }}
                </v-chip>
              </div>
            </td>
            <td class="text-center" v-for="month in months" :key="month">
              <v-checkbox
                v-model="monthlyItem.months[month]"
                :key="`${monthlyItem.id}-${month}`"
                color="primary"
                density="compact"
                @change="updateMonthlyItem(monthlyItem)"
                class="d-flex justify-center ma-0 pa-0"
              ></v-checkbox>
            </td>
            <td class="text-center">
              <v-btn icon size="small" variant="text" color="error" @click="deleteMonthlyItem(monthlyItem.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Empty State -->
    <v-card v-else>
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey">mdi-inbox-outline</v-icon>
        <p class="text-grey mt-4">No monthly items added yet. Select an item from the dropdown above to add.</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'MonthlyItems',
  data() {
    return {
      loading: false,
      successMessage: '',
      errorMessage: '',
      monthlyItems: [],
      items: [],
      selectedItemId: null,
      months: [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ]
    };
  },
  computed: {
    availableItems() {
      const selectedIds = this.monthlyItems.map(mi => mi.item.id);
      return this.items
        .filter(item => !selectedIds.includes(item.id))
        .map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          itemLabel: `${item.name} (${item.quantity} ${this.getUnitLabel(item.unit)})`
        }));
    }
  },
  mounted() {
    this.fetchMonthlyItems();
    this.fetchItems();
  },
  methods: {
    async fetchMonthlyItems() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/monthly-items', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch monthly items');
        }

        const data = await response.json();
        this.monthlyItems = data.monthlyItems || [];
      } catch (error) {
        console.error('Error fetching monthly items:', error);
        this.errorMessage = 'Failed to load monthly items';
      } finally {
        this.loading = false;
      }
    },

    async fetchItems() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/items', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        this.items = data.items || [];
      } catch (error) {
        console.error('Error fetching items:', error);
        this.errorMessage = 'Failed to load items';
      }
    },

    async addMonthlyItem(itemId) {
      if (!itemId) return;

      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const monthlyData = {};
        this.months.forEach(month => {
          monthlyData[month] = false;
        });

        const response = await fetch('http://localhost:5000/api/monthly-items', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemId: itemId,
            monthlyData: monthlyData
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add monthly item');
        }

        this.successMessage = 'Item added successfully';
        this.selectedItemId = null;
        await this.fetchMonthlyItems();
      } catch (error) {
        console.error('Error adding monthly item:', error);
        this.errorMessage = error.message || 'Failed to add monthly item';
      } finally {
        this.loading = false;
      }
    },

    async updateMonthlyItem(monthlyItem) {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/monthly-items/${monthlyItem.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            monthlyData: monthlyItem.months
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update monthly item');
        }

        this.successMessage = 'Updated successfully';
      } catch (error) {
        console.error('Error updating monthly item:', error);
        this.errorMessage = 'Failed to update monthly item';
        await this.fetchMonthlyItems();
      } finally {
        this.loading = false;
      }
    },

    async deleteMonthlyItem(id) {
      if (!confirm('Are you sure you want to delete this monthly item?')) return;

      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/monthly-items/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete monthly item');
        }

        this.successMessage = 'Item deleted successfully';
        await this.fetchMonthlyItems();
      } catch (error) {
        console.error('Error deleting monthly item:', error);
        this.errorMessage = 'Failed to delete monthly item';
      } finally {
        this.loading = false;
      }
    },

    getMonthLabel(month) {
      const labels = {
        january: 'Jan',
        february: 'Feb',
        march: 'Mar',
        april: 'Apr',
        may: 'May',
        june: 'Jun',
        july: 'Jul',
        august: 'Aug',
        september: 'Sep',
        october: 'Oct',
        november: 'Nov',
        december: 'Dec'
      };
      return labels[month] || month;
    },

    getUnitLabel(unit) {
      const labels = {
        'pcs': 'pcs',
        'grams': 'g',
        'kilos': 'kg'
      };
      return labels[unit] || unit;
    }
  }
};
</script>

<style scoped>
.bg-primary {
  background-color: #1976d2;
}

.text-white {
  color: white;
}

:deep(.v-table__wrapper) {
  border-radius: 4px;
}

:deep(.v-table thead tr) {
  background-color: #1976d2;
  color: white;
}

:deep(.v-table th) {
  color: white !important;
  font-weight: bold;
}

:deep(.v-table td) {
  padding: 8px 4px !important;
}
</style>
