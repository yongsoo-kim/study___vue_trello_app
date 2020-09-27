<template>
  <div>
    <div class="home-title">Personal Boards</div>
    <div class="board-list" ref="boardList">
      <div
        class="board-item"
        v-for="b in boards"
        :key="b.id"
        :data-bgcolor="b.bgColor"
        ref="boardItem"
      >
        <router-link :to="`/b/${b.id}`">
          <div class="board-item-title">{{ b.title }}</div>
        </router-link>
      </div>
      <div class="board-item board-item-new">
        <a class="new-board-btn" href="" @click.prevent="addBoard">
          Create new board...
        </a>
      </div>
    </div>
     <!-- 하위컴포넌트에서 'close'이벤트가 오면 데이터를 변경해 모달을 닫는다. -->
    <AddBoard v-if="isAddBoard" @close="isAddBoard=false" @submit="onAddBoard"/>
  </div>
</template>
<script>
import { board } from "../api/api.js";
import AddBoard from "./AddBoard.vue"

export default {
  components: {
    AddBoard
  },
  data() {
    return {
      loading: false,
      boards: [],
      isAddBoard: false
    };
  },
  created() {
    this.fetchData();
  },
  updated() {
     // 첫실행은 모든 화면이 렌더링된 후 실행합니다. 이후 'data'에 변화가 감지되면 이hook도 움직입니다.
    this.$refs.boardItem.forEach((el) => {
      el.style.backgroundColor = el.dataset.bgcolor;
    });
  },
  methods: {
    fetchData() {
      this.loading = true;
      board
        .fetch()
        .then((data) => {
          //console.log(data);
          this.boards = data.list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addBoard() {
      //console.log("addBoard()");
      this.isAddBoard = true
    },
    onAddBoard(title) {
      console.log(title);
      //API call for creating a new board.
      //If success, refresh board list by 'fetch()' methods.
      board.create(title)
      .then(() => this.fetchData()) 
    }
  },
};
</script>

<style>
html,
body,
#app {
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
  transition: background-color 0.3s;
}
input[type="text"].form-control,
input[type="password"].form-control,
textarea.form-control {
  font-size: 14px;
}
.form-control:focus {
  background-color: #fff;
}

.home-title {
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
}
.board-list {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}
.board-item {
  width: 23%;
  height: 100px;
  margin: 0 2% 20px 0;
  border-radius: 3px;
}
.board-item-new {
  background-color: #ddd;
}
.board-item a {
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
}
.board-item a:hover,
.board-item a:focus {
  background-color: rgba(0,0,0, .1);
  color: #666;
}
.board-item-title {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  padding: 10px;
}
.board-item a.new-board-btn {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  height: 100px;
  width: inherit;
  color: #888;
  font-weight: 700;
}
</style>
