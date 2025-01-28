<template>
  <div class = "app-container">

    <div class="auth-layout">
    <div class="register-form">
      <h2 class="form-title">Register</h2>
      <form @submit.prevent="registerUser">
        <input 
          v-model="user.name" 
          type="text" 
          placeholder="Name" 
          required
        />
        <input 
          v-model="user.email" 
          type="email" 
          placeholder="Email" 
          :class="{'error-input': !isValidEmail}"
          required
        />
        <span v-if="registerError" class="error-message">
            {{ registerError }}
        </span>
        <div v-if="!isValidEmail" class="error-message">
          Please enter a valid email address
        </div>
        <input 
          v-model="user.password" 
          type="password" 
          placeholder="Password" 
          required
        />
        <input 
          v-model="user.address" 
          type="text" 
          placeholder="Address" 
          required
        />
        <input 
          v-model="user.mobileNumber" 
          type="tel" 
          placeholder="Mobile Number"
          :class="{'error-input': !isValidMobileNumber}" 
          required
        />
        <div v-if="!isValidMobileNumber" class="error-message">
          Mobile number must contain exactly 10 digits
        </div>

        <button 
          type="submit" 
          :disabled="!isFormValid"
        >
          Register
        </button>
        <p class="form-switch">
          Already have an account? 
          <router-link to="/login">Login</router-link>
        </p>
      </form>
      
    </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    name: 'Register',
    data() {
      return {
        user: {
          name: '',
          email: '',
          password: '',
          address: '',
          mobileNumber: '',
          role: 'USER',
          type: 'CUSTOMER'
        },
        registerError:'',
      }
    },
    computed: {
      isValidEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.user.email);
      },
      isValidMobileNumber() {
        const mobileRegex = /^\d{10}$/; // Matches exactly 10 digits
        return mobileRegex.test(this.user.mobileNumber);
      },
      isFormValid() {
        return this.user.name &&
              this.isValidEmail &&
              this.isValidMobileNumber &&
              this.user.password;
      }
    }
    ,
    methods: {
      async registerUser() {
        try {
          const response = await fetch('http://localhost:8085/user/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.user)
          })
  
          if (!response.ok) {
          if (response.status === 404) {
            this.registerError = 'This Email Already Exist';
          } else {
            this.registerError = 'An error occurred. Please try again later.';
          }
          return;
        }
  
          this.$router.push('/')
        } catch (error) {
          console.error('Registration error:', error)
        }
      }
    }
  }
  </script>


<style scoped>
.app-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    
  }
.auth-layout {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.register-form {
  width: 100%;
}

.form-title {
  text-align: center;
  color: #2563eb;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-input {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.8rem;
}

button {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.form-switch {
  text-align: center;
  margin-top: 1rem;
}

.form-switch a {
  color: #2563eb;
  text-decoration: none;
}
</style>
