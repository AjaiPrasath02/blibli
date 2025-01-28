<template>
  <div v-if="userDetails" class="profile-container">
    <div class="profile-card">

      <div class="profile-header">
        <h2>Profile Details</h2>
        <div class="user-badge" :class="{ premium: userDetails.type === 'premium' }">
          {{ userDetails.type.toUpperCase() }}
        </div>
      </div>

      <div class="profile-content">
        <div class="profile-field">
          <label>Name</label>
          <div class="field-value">{{ userDetails.name }}</div>
        </div>

        <div class="profile-field">
          <label>Email</label>
          <div class="field-value">{{ userDetails.email }}</div>
        </div>

        <div class="profile-field">
          <label>Mobile Number</label>
          <div class="field-value">{{ userDetails.mobileNumber }}</div>
        </div>

        <div class="profile-field">
          <label>Address</label>
          <div class="field-value">{{ userDetails.address }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading profile...</div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      userDetails: null
    }
  },
  mounted() {
    const userData = sessionStorage.getItem('userDetails')
    if (userData) {
      this.userDetails = JSON.parse(userData)
    }
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 80vh;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.profile-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.user-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: #e9ecef;
  color: #495057;
}

.user-badge.premium {
  background-color: #ffd700;
  color: #000;
}

.profile-content {
  padding: 20px;
}

.profile-field {
  margin-bottom: 20px;
}

.profile-field:last-child {
  margin-bottom: 0;
}

.profile-field label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.field-value {
  color: #333;
  font-size: 16px;
  padding: 8px 0;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

@media (max-width: 640px) {
  .profile-container {
    padding: 10px;
  }

  .profile-card {
    border-radius: 8px;
  }

  .profile-header h2 {
    font-size: 20px;
  }

  .field-value {
    font-size: 15px;
  }
}
</style>