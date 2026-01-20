<template>
  <v-container class="py-6" fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-6 d-flex flex-column align-center">
          <v-avatar size="96" class="mb-4">
            <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="Profile" />
          </v-avatar>
          <div class="text-h6">John Doe</div>
          <div class="text-body-2 text-medium-emphasis mb-4">Product Manager</div>
          <v-btn color="primary" variant="flat">Edit Profile</v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <div class="text-subtitle-1 mb-4">Account Details</div>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field label="First name" model-value="John" readonly variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Last name" model-value="Doe" readonly variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Email" model-value="john.doe@example.com" readonly variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Phone" model-value="+1 555 123 456" readonly variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12">
              <v-text-field label="Address" model-value="123 Main St, City" readonly variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
