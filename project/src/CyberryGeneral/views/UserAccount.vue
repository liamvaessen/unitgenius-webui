<template>
  <main>
    <FileMenu ref="fileMenu"/>

    <div class="user-account">
      <h1>Account</h1>
      <div v-if="error" class="alert">{{ error }}</div>
      <div class="variable-block">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" readonly>
      </div>
      <div class="variable-block">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" readonly>
      </div>
      <hr />
      <button @click="deleteAccount">Delete Account</button>
    </div>
  </main>
</template>

<script>
import AuthService from '../services/AuthService.js'
import FileMenu from '@/components/FileMenu.vue'

export default {
  name: 'UserAccount',
  components: {
    FileMenu
  },
  data() {
    return {
      id: '',
      username: '',
      email: '',
      error: ''
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const currentUser = await AuthService.getCurrentUser();
      
      this.id = currentUser.id;
      this.username = currentUser.username;
      this.email = currentUser.email;

      if(currentUser == null) {
        this.$router.push('/signin');
      }
    },
    async deleteAccount() {
      await AuthService.deleteUser(this.id)
      .then(response => {
        if (response) {
          if (response.status === 200) {
            this.$router.push('/signin')
            return
          }
          else {
            if (response.data.message) {
              this.error = response.data.message
            }
            return
          }
        }
        this.error = 'An error occurred. Please try again later.'
      })
      this.$router.push('/signin');
    },
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


.user-account {
  position: fixed;
  top: 2%;
  left: 10%;
  width: 80%;
  height: 96%;
  background-color: #1A1A1A;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #dddddd;
  font-size: 10px;
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
  background-color: red;
  border-color: red;
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

hr {
  border: 0;
  height: 1px;
  background: #333;
  margin-top: 20px;
}
</style>