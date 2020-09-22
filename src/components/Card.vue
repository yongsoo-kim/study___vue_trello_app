<template>
  <div>
    Card
    <div v-if="loading">Loading card...</div>
    <div v-else>cid: {{ cid }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cid: 0,
      loading: false,
    };
  },
  watch: {
    //객체를 설정할수도 있다.
    '$route': {
      handler: 'fetchData',
      //이걸 사용하면  created() {this.fetchData(); } 가 필요가 없다.
      immediate: true
    }

    //객체가 아닌 방법
    // $route() {
    //   this.fetchData();
    // },
  },
  methods: {
    fetchData() {
      this.loading = true;
      setTimeout(() => {
        //console.log(this.$route);
        this.cid = this.$route.params.cid;
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style></style>
