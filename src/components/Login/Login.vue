<!-- Login.vue -->
<template>
   <div class = "app-container">
  <div class="auth-layout">
    <div class="login-form">
      <h2 class="form-title">Login</h2>
      <form @submit.prevent="loginUser">
        <input 
          v-model="credentials.email" 
          type="email" 
          placeholder="Email" 
          :class="{'error-input': !isValidEmail}"
          required
        />
        <div v-if="!isValidEmail" class="error-message">
          Please enter a valid email address
        </div>
        <input 
          v-model="credentials.password" 
          type="password" 
          placeholder="Password" 
          required
        />
        <button 
          type="submit" 
          :disabled="!isFormValid"
        >
          Login
        </button>
        <div v-if="loginError" class="error-message">
            {{ loginError }}
          </div>
        <p class="form-switch">
          Need an account? 
          <router-link to="/register">Register</router-link>
        </p>
      </form>
    </div>
    </div>
   </div>
  </template>
  
  <script>
  export default {
    name: 'Login',
    data() {
        return {
        credentials: {
          email: '',
          password: '',
        },
        loginError: '', 
      };
    },
    computed: {
      isValidEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(this.credentials.email)
      },
      isFormValid() {
        return this.isValidEmail && this.credentials.password
      }
    },
    methods: {
      async loginUser() {
        try {
          const authHeader = 'Basic ' + btoa(`${this.credentials.email}:${this.credentials.password}`)
          
          const response = await fetch('http://localhost:8085/user/login', {
            method: 'POST',
            headers: {
              'Authorization': authHeader
            }
          })
  
          if (!response.ok) {
          if (response.status === 401) {
            this.loginError = 'Invalid credentials. Please try again.';
          } else {
            this.loginError = 'An error occurred. Please try again later.';
          }
          return;
        }
  
          const data = await response.json()
          console.log(data);
          sessionStorage.setItem('userDetails', JSON.stringify(data))
          sessionStorage.setItem('isAuthenticated','true')
          this.$router.push('/home')
        } catch (error) {
          console.error('Login error:', error)
          this.loginError = 'An unexpected error occurred. Please try again.';
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
.login-form {
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
  margin-top:10px;
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