<template>
  <main>
    <div class="signup">
      <h1>Sign Up</h1>
      <div v-if="error" class="alert">{{ error }}</div>
      <form @submit.prevent="signUp">
        <div class="variable-block">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="variable-block">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="variable-block">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <div class="link">
        Already have an account? <router-link to="/signin">Sign in</router-link>
      </div>
    </div>
  </main>
</template>

<script>
import AuthService from '../services/AuthService.js'

export default {
  name: 'SignUp',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async signUp() {
      await AuthService.signUp({
        username: this.username,
        email: this.email,
        passwordEncrypted: this.password
      })
      .then(response => {
        if (response) {
          if (response.status === 200) {
            this.$router.push('/signin')
            return
          }
          if (response.status === 401) {
            this.error = response.data.message
            return
          }
        }
        this.error = 'An error occurred. Please try again later.'
      })
      .catch(error => {
        console.log(error)
        if (error.response.status === 400) {
          this.error = error.response.data
        }
        else {
          this.error = 'An error occurred. Please try again later.'
        }
      })
    }
  }
}
</script>

<style scoped>
.body {
  background-color: #1A1A1A;
}

h1 {
  color: #c0c0c0;
  font-size: 20px;
  margin-top: 8px;
  margin-left: 8px;
}

.signup{
  position: fixed;
  top: 20%;
  left: 30%;
  width: 40%;
  height: 60%;
  background-color: #1A1A1A;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #dddddd;
  font-size: 14px;
  overflow-x: auto;
  overflow-y: auto;
}


.variable-block {
  margin-top: 20px;
}

.variable-block label {
  color: #5e5e5e;
}

.variable-block input,
.variable-block select,
.variable-block p,
.variable-block textarea {
  width: 100%;
  height: 30px;
  background-color: #333333;
  border: 1px solid #4e4e4e;
  border-radius: 5px;
  padding: 5px;
  color: #dddddd;
  font-size: 14px;
}

.variable-block textarea {
  height: 120px;
}
.alert {
  color: red;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: .25rem;
}

button {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: .375rem .75rem;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: .25rem;
  margin-top: 1rem;
}

.link {
  margin-top: 1rem;
}
</style>