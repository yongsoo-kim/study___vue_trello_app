<template>
  <div>
    Home
    <div>
      Board List:
      <div v-if="loading">Loading...</div>
      <div v-else>
        Api result:
        <div v-for="b in boards" :key="b.id">{{ b }}</div>
      </div>
      <ul>
        <li>
          <router-link to="/b/1">Board 1</router-link>
        </li>
        <li>
          <router-link to="/b/2">Board 2</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { board } from "../api/api.js";
export default {
  data() {
    return {
      loading: false,
      boards: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      board.fetch()
        .then((data) => {
          this.boards = data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0px;
}
#app {
  display: flex;
  flex-direction: column;
}
.container {
  flex-grow: 1;
  position: relative;
}
.btn {
  border-radius: 3px;
  padding: 6px 8px;
  background-color: #e2e4e6;
  border: none;
  display: inline-block;
  color: #fff;
  font-size: 14px;
  line-height: 20px;  
  font-weight: 700;
  cursor: pointer;
}
.btn-success {
  background-color: #5aac44;
  box-shadow: 0 1px 0 #519839;
}
.form-control {
  width: 100%;
  box-sizing: border-box;
  background-color: #e2e4e6;
  border: 1px solid #cdd2d4;
  border-radius: 3px;
  display: block;
  margin-bottom: 12px;
  padding: 6px 8px;
  transition: background-color .3s;
}
input[type=text].form-control,
input[type=password].form-control,
textarea.form-control {
  font-size: 14px;
}
.form-control:focus {
  background-color: #fff;
}
</style>
