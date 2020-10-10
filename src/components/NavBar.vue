<template>
  <nav class="header">
    <div class="header-logo">
      <router-link to="/">Trelno</router-link>
    </div>
    <div class="header-auth">
      <a v-if="isAuth" href="" @click.prevent="logout">Logout</a>
      <router-link v-else to="/login">Login</router-link>
    </div>
  </nav>
</template>

<script>
import {mapState,mapGetters, mapMutations} from 'vuex'

export default {
  computed: {
    ...mapState({
      navbarColor: 'navbarColor',
      bodyColor: 'bodyColor'
    }),
    ...mapGetters([
      'isAuth'
    ])
  },
  watch: {
    //updateTheme이 실질적으로 전체 보드배경 색상을 변화시키고 있기에, 여기에서  스테이트값과 연동되어있는 bavbarColor를 감시해서, 그 값이 변경되면 updateTheme을 호출해 보드배경 색상을 변경한다.
    navbarColor: 'updateTheme'
  },
  mounted() {
    this.updateTheme()
  },
  methods: {
    ...mapMutations([
      'LOGOUT'
    ]),
    logout() {
      this.LOGOUT()
      this.$router.push('/login')
    },
    updateTheme(){
      //$el로 현재컴포넌트의 navbar엘레멘트를 가지고 올수있다.
      this.$el.style.backgroundColor = this.navbarColor
      //현재 컴포넌트가 아닌 dom으로 부터 가져올때는, document 이방식을 쓴다.
      
      const body = document.querySelector('body')
      if (body) body.style.backgroundColor = this.bodyColor
      //TODO: 이부분 필요하나?
      // const container = document.querySelector('.container')
      // if (container) container.style.backgroundColor = this.bodyColor
    }
  }

};
</script>

<style>
.header {
  flex: none;
  background-color: rgba(0, 0, 0, 0.15);
  height: 32px;
  padding: 4px;
}
.header a {
  display: block;
  height: 30px;
  line-height: 30px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);
}
.header-logo {
  position: absolute;
  left: 50%;
  top: 7px;
  margin-left: -30px;
  text-align: center;
  font-weight: bolder;
  font-size: 24px;
}
.header-logo a:hover,
.header-logo a:focus {
  color: rgba(255, 255, 255, 0.9);
}
.header-auth {
  position: absolute;
  right: 15px;
  top: 5px;
}
.header-auth a {
  border-radius: 2px;
  padding: 0 10px;
  background-color: rgba(255, 255, 255, 0.5);
  color: white;
  transition: all 0.3s;
}
.header-auth a:hover,
.header-auth a:focus {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
