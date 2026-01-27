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
        <div class="text-h5">Items Management</div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-btn color="primary" variant="flat" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>Add Item
        </v-btn>
      </v-col>
    </v-row>

    <!-- Items Table -->
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.price="{ item }">
            <span class="font-weight-bold text-success">₹{{ item.price.toFixed(2) }}</span>
          </template>
          <template v-slot:item.quantity="{ item }">
            <v-chip size="small" color="info" variant="flat">
              {{ item.quantity }} {{ getUnitLabel(item.unit) }}
            </v-chip>
          </template>
          <template v-slot:item.category="{ item }">
            <v-chip v-if="item.category" size="small" color="primary" variant="flat">
              {{ item.category?.name || 'N/A' }}
            </v-chip>
            <span v-else class="text-grey">No Category</span>
          </template>
          <template v-slot:item.total="{ item }">
            <span class="font-weight-bold">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn size="small" icon variant="text" color="primary" @click="openEditDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn size="small" icon variant="text" color="error" @click="deleteItem(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="bg-primary text-white">
          <span class="text-h6">{{ isEditMode ? 'Edit Item' : 'Add Item' }}</span>
        </v-card-title>

        <v-card-text class="pt-6">
          <v-form ref="form">
            <v-text-field
              v-model="formData.name"
              label="Name *"
              variant="outlined"
              :rules="[v => !!v || 'Name is required']"
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="formData.description"
              label="Description"
              variant="outlined"
              rows="3"
              class="mb-3"
            ></v-textarea>

            <v-select
              v-model="formData.unit"
              :items="unitOptions"
              item-title="label"
              item-value="value"
              label="Unit *"
              variant="outlined"
              class="mb-3"
            ></v-select>

            <v-text-field
              v-model="formData.quantity"
              :label="`Quantity (${getUnitLabel(formData.unit)}) *`"
              type="number"
              variant="outlined"
              :rules="[
                v => v !== '' || 'Quantity is required',
                v => v >= 0 || 'Quantity must be greater than or equal to 0'
              ]"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="formData.price"
              label="Price *"
              type="number"
              variant="outlined"
              prefix="₹"
              :rules="[
                v => v !== '' || 'Price is required',
                v => v >= 0 || 'Price must be greater than or equal to 0'
              ]"
              class="mb-3"
            ></v-text-field>

            <v-select
              v-model="formData.category"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Category (Optional)"
              variant="outlined"
              clearable
              class="mb-3"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-label</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveItem">
            {{ isEditMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Items',
  data() {
    return {
      loading: false,
      dialog: false,
      isEditMode: false,
      successMessage: '',
      errorMessage: '',
      items: [],
      categories: [],
      unitOptions: [
        { value: 'pcs', label: 'Pieces (pcs)' },
        { value: 'grams', label: 'Grams (g)' },
        { value: 'kilos', label: 'Kilograms (kg)' }
      ],
      formData: {
        id: null,
        name: '',
        description: '',
        quantity: 0,
        unit: 'pcs',
        price: 0,
        category: null
      },
      headers: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Description', key: 'description', sortable: false },
        { title: 'Quantity', key: 'quantity', sortable: true },
        { title: 'Price', key: 'price', sortable: true },
        { title: 'Total', key: 'total', sortable: false },
        { title: 'Category', key: 'category', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
      ]
    };
  },
  mounted() {
    this.fetchItems();
    this.fetchCategories();
  },
  methods: {
    async fetchItems() {
      this.loading = true;
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
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        this.categories = data.categories || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.errorMessage = 'Failed to load categories';
      }
    },

    openCreateDialog() {
      this.isEditMode = false;
      this.formData = {
        id: null,
        name: '',
        description: '',
        quantity: 0,
        unit: 'pcs',
        price: 0,
        category: null
      };
      this.dialog = true;
    },

    openEditDialog(item) {
      this.isEditMode = true;
      this.formData = {
        id: item.id,
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        unit: item.unit || 'pcs',
        price: item.price,
        category: item.category?.id || null
      };
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.formData = {
        id: null,
        name: '',
        description: '',
        quantity: 0,
        unit: 'pcs',
        price: 0,
        category: null
      };
    },

    async saveItem() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const url = this.isEditMode 
          ? `http://localhost:5000/api/items/${this.formData.id}`
          : 'http://localhost:5000/api/items';
        
        const method = this.isEditMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.formData.name,
            description: this.formData.description,
            quantity: parseInt(this.formData.quantity),
            unit: this.formData.unit,
            price: parseFloat(this.formData.price),
            category: this.formData.category || null
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save item');
        }

        this.successMessage = this.isEditMode ? 'Item updated successfully' : 'Item created successfully';
        this.closeDialog();
        await this.fetchItems();
      } catch (error) {
        console.error('Error saving item:', error);
        this.errorMessage = error.message || 'Failed to save item';
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(id) {
      if (!confirm('Are you sure you want to delete this item?')) return;

      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/items/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete item');
        }

        this.successMessage = 'Item deleted successfully';
        await this.fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        this.errorMessage = 'Failed to delete item';
      } finally {
        this.loading = false;
      }
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
.bg-light {
  background-color: #f5f5f5;
}
</style>
