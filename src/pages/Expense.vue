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
        <div class="text-h5">Expense Management</div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-btn color="error" variant="flat" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>Add Expense
        </v-btn>
      </v-col>
    </v-row>

    <!-- Expense Table -->
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="expenses"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.amount="{ item }">
            <span class="font-weight-bold text-error">₹{{ item.amount.toFixed(2) }}</span>
          </template>
          <template v-slot:item.category="{ item }">
            <v-chip size="small" color="error" variant="flat">
              {{ item.category?.name || 'N/A' }}
            </v-chip>
          </template>
          <template v-slot:item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn size="small" icon variant="text" color="primary" @click="openEditDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn size="small" icon variant="text" color="error" @click="deleteExpense(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="bg-error text-white">
          <span class="text-h6">{{ isEditMode ? 'Edit Expense' : 'Add Expense' }}</span>
        </v-card-title>

        <v-card-text class="pt-6">
          <v-form ref="form">
            <v-text-field
              v-model="formData.title"
              label="Title *"
              variant="outlined"
              :rules="[v => !!v || 'Title is required']"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="formData.amount"
              label="Amount *"
              type="number"
              variant="outlined"
              prefix="₹"
              :rules="[
                v => !!v || 'Amount is required',
                v => v > 0 || 'Amount must be greater than 0'
              ]"
              class="mb-3"
            ></v-text-field>

            <v-select
              v-model="formData.category"
              :items="expenseCategories"
              item-title="name"
              item-value="id"
              label="Category *"
              variant="outlined"
              :rules="[v => !!v || 'Category is required']"
              class="mb-3"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-label</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-text-field
              v-model="formData.date"
              label="Date *"
              type="date"
              variant="outlined"
              :rules="[v => !!v || 'Date is required']"
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="formData.description"
              label="Description"
              variant="outlined"
              rows="3"
              class="mb-3"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="saveExpense">
            {{ isEditMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Expense',
  data() {
    return {
      loading: false,
      dialog: false,
      isEditMode: false,
      successMessage: '',
      errorMessage: '',
      expenses: [],
      categories: [],
      formData: {
        id: null,
        title: '',
        amount: '',
        description: '',
        category: null,
        date: new Date().toISOString().split('T')[0]
      },
      headers: [
        { title: 'Title', key: 'title', sortable: true },
        { title: 'Amount', key: 'amount', sortable: true },
        { title: 'Category', key: 'category', sortable: false },
        { title: 'Date', key: 'date', sortable: true },
        { title: 'Description', key: 'description', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
      ]
    };
  },
  computed: {
    expenseCategories() {
      return this.categories.filter(cat => cat.type === 'expense');
    }
  },
  mounted() {
    this.fetchExpenses();
    this.fetchCategories();
  },
  methods: {
    async fetchExpenses() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/expense', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const data = await response.json();
        this.expenses = data.expenses || [];
      } catch (error) {
        console.error('Error fetching expenses:', error);
        this.errorMessage = 'Failed to load expenses';
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
        title: '',
        amount: '',
        description: '',
        category: null,
        date: new Date().toISOString().split('T')[0]
      };
      this.dialog = true;
    },

    openEditDialog(expense) {
      this.isEditMode = true;
      this.formData = {
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
        description: expense.description || '',
        category: expense.category?.id || null,
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.formData = {
        id: null,
        title: '',
        amount: '',
        description: '',
        category: null,
        date: new Date().toISOString().split('T')[0]
      };
    },

    async saveExpense() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const url = this.isEditMode 
          ? `http://localhost:5000/api/expense/${this.formData.id}`
          : 'http://localhost:5000/api/expense';
        
        const method = this.isEditMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: this.formData.title,
            amount: parseFloat(this.formData.amount),
            description: this.formData.description,
            category: this.formData.category,
            date: this.formData.date
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save expense');
        }

        this.successMessage = this.isEditMode ? 'Expense updated successfully' : 'Expense created successfully';
        this.closeDialog();
        await this.fetchExpenses();
      } catch (error) {
        console.error('Error saving expense:', error);
        this.errorMessage = error.message || 'Failed to save expense';
      } finally {
        this.loading = false;
      }
    },

    async deleteExpense(id) {
      if (!confirm('Are you sure you want to delete this expense?')) return;

      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/expense/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete expense');
        }

        this.successMessage = 'Expense deleted successfully';
        await this.fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        this.errorMessage = 'Failed to delete expense';
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }
};
</script>

<style scoped>
.bg-light {
  background-color: #f5f5f5;
}
</style>
