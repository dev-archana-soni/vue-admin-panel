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
          <v-icon size="large" class="mr-3" color="error">mdi-cash-minus</v-icon>
          <div class="text-h5">Expense Management</div>
        </div>
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
          <template v-slot:item.type="{ item }">
            <v-chip size="small" :color="item.type === 'group' ? 'primary' : 'success'" variant="flat">
              {{ item.type === 'group' ? 'Group' : 'Own' }}
            </v-chip>
          </template>
          <template v-slot:item.amount="{ item }">
            <div v-if="item.type === 'group'">
              <div class="font-weight-bold text-error">₹{{ item.amount.toFixed(2) }}</div>
              <div class="text-caption text-grey">Total: ₹{{ (item.totalAmount || item.amount).toFixed(2) }}</div>
            </div>
            <span v-else class="font-weight-bold text-error">₹{{ item.amount.toFixed(2) }}</span>
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

            <v-radio-group
              v-model="formData.type"
              label="Expense Type *"
              class="mb-3"
            >
              <v-radio value="own" label="Own Expense"></v-radio>
              <v-radio value="group" label="Group Expense"></v-radio>
            </v-radio-group>

            <v-select
              v-if="formData.type === 'group'"
              v-model="formData.userGroup"
              :items="userGroups"
              item-title="name"
              item-value="id"
              label="Select User Group *"
              variant="outlined"
              :rules="[v => !!v || 'User group is required']"
              class="mb-3"
              @update:modelValue="fetchGroupMembers"
            ></v-select>

            <div v-if="formData.type === 'group' && groupMembers.length > 0" class="mb-4">
              <label class="text-body2 font-weight-bold mb-2 d-block">Select Members *</label>
              <v-row>
                <v-col v-for="member in groupMembers" :key="member.id" cols="12" md="6">
                  <v-checkbox
                    v-model="formData.participants"
                    :value="member.id"
                    :label="`${member.name} (${member.email})`"
                    color="error"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <div v-if="formData.participants.length > 0" class="mt-3 pa-3 bg-error-light rounded">
                <div class="text-body2"><strong>Total Amount:</strong> ₹{{ parseFloat(formData.amount).toFixed(2) }}</div>
                <div class="text-body2"><strong>Split Among {{ splitCount }} Members:</strong> ₹{{ amountPerPerson }} each</div>
              </div>
            </div>

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
      userGroups: [],
      groupMembers: [],
      formData: {
        id: null,
        title: '',
        amount: '',
        description: '',
        category: null,
        date: new Date().toISOString().split('T')[0],
        type: 'own',
        userGroup: null,
        participants: []
      },
      headers: [
        { title: 'Title', key: 'title', sortable: true },
        { title: 'Type', key: 'type', sortable: true },
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
    },
    splitCount() {
      if (this.formData.type === 'group') {
        return (this.formData.participants?.length || 0) + 1; // include self
      }
      return 1;
    },
    amountPerPerson() {
      const total = parseFloat(this.formData.amount) || 0;
      if (this.formData.type === 'group') {
        const count = this.splitCount || 1;
        return (total / count).toFixed(2);
      }
      return total.toFixed(2);
    }
  },
  mounted() {
    this.fetchExpenses();
    this.fetchCategories();
    this.fetchUserGroups();
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

    async fetchUserGroups() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user-groups', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user groups');
        }

        const data = await response.json();
        this.userGroups = data.groups || [];
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    },

    async fetchGroupMembers(groupId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/user-groups/${groupId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch group members');
        }

        const data = await response.json();
        this.groupMembers = data.group?.members || [];
      } catch (error) {
        console.error('Error fetching group members:', error);
        this.errorMessage = 'Failed to load group members';
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
        date: new Date().toISOString().split('T')[0],
        type: 'own',
        userGroup: null,
        participants: []
      };
      this.groupMembers = [];
      this.dialog = true;
    },

    openEditDialog(expense) {
      this.isEditMode = true;
      this.formData = {
        id: expense.id,
        title: expense.title,
        amount: expense.totalAmount || expense.amount,
        description: expense.description || '',
        category: expense.category?.id || null,
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: expense.type || 'own',
        userGroup: expense.userGroup?.id || null,
        participants: expense.participants || []
      };
      this.groupMembers = expense.userGroup?.members || [];
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
        date: new Date().toISOString().split('T')[0],
        type: 'own',
        userGroup: null,
        participants: []
      };
      this.groupMembers = [];
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
            date: this.formData.date,
            type: this.formData.type,
            userGroup: this.formData.userGroup || null,
            participants: this.formData.participants || []
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
