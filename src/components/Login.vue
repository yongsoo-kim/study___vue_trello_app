<template>
  <div class="login">
    <h2>Log in to Trello</h2>
    <!-- Form송신을 막는 preventDefault을 실행하고, 대신"onSubmit"를 실행하라 -->
    <form @submit.prevent="onSubmit">
      <div>
        <label for="email">Email</label>
        <input class="form-control" type="text" name="email" v-model="email" autofocus placeholder="e.g., test@test.com" />
      </div>
      <div>
        <label for="password">Passwrod</label>
        <input class="form-control" type="password" v-model="password" placeholder="123123" />
      </div>
      <button  class="btn" :class="{'btn-success': !invalidForm}" type="submit" :disabled="invalidForm">Log In</button>
    </form>
    <p class="error" v-if="error">{{error}}</p>
  </div>
</template>
<script>
import {mapActions} from 'vuex'

export default {
    data() {
        return{
            email: '',
            password: '',
            error: '',
            rPath: ''
        }
    },
    created() {
        this.rPath = this.$route.query.rPath || '/'
    },
    computed: {
        invalidForm() {
            return !this.email || !this.password
        }
    },
    methods: {
      ...mapActions([
        'LOGIN'
      ]),
        onSubmit() {
          console.log(this.email, this.password)
          this.LOGIN({email: this.email, password: this.password}).then(() => {
               //프로미스 기반이기에, 성공시 then함수로 받는다.
                //console.log(data);
                this.$router.push(this.rPath)
            })
            .catch(err => {
                this.error = err.data.error
            })
        }
    }
}
</script>

<style>
.login {
  width: 400px;
  margin: 0 auto; 
}
.error {
  color: #f00;
}
</style>