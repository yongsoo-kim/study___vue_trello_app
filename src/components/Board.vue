<template>
  <div>
    Board

    <div v-if="loading">loading board...</div>
    <div v-else>
      <div>bid: {{ bid }}</div>
      <router-link :to="`/b/${bid}/c/1`">Card 1</router-link>
      <router-link :to="`/b/${bid}/c/2`">Card 2</router-link>
    </div>
    <!-- 중첩라우팅(보드/카드)의 경우에는 하위 컴포넌트가 출력될 부분을 지정해주어야한다. -->
    <hr />
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bid: 0,
      loading: true,
    };
  },
  //보드가 생성될때 불리는 hook -> created
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      //API응답 받기를 흉내내기 위해 setTimeout을 사용해본다.
      setTimeout(() => {
        //this.$route를 통해 라우팅 정보 획득가능.
        //console.log(this.$route.params.bid);
        this.bid = this.$route.params.bid;
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style></style>
