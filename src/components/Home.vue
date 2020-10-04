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
        <a
          class="new-board-btn"
          href=""
          @click.prevent="SET_IS_ADD_BOARD(true)"
        >
          Create new board...
        </a>
      </div>
    </div>
    <AddBoard v-if="isAddBoard"/>
    <!-- (VueX를 사용하기 전...)하위컴포넌트에서 'close'이벤트가 오면 데이터를 변경해 모달을 닫는다. -->
    <!-- <AddBoard v-if="isAddBoard" @close="isAddBoard = false" @submit="SET_IS_ADD_BOARD(true)" /> -->
  </div>
</template>
<script>
import AddBoard from "./AddBoard.vue";
import { mapMutations, mapState, mapActions } from "vuex";

export default {
  components: {
    AddBoard,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    //key value스타일이 아닌 그냥 배열로 해도 된다.   ...mapState(['isAddBoard', 'boards'])
    ...mapState({
      isAddBoard: 'isAddBoard',
      boards: 'boards'
    }),
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
    ...mapMutations(["SET_IS_ADD_BOARD"]),
    ...mapActions(["FETCH_BOARDS"]),
    fetchData() {
      this.loading = true;
      this.FETCH_BOARDS().finally(() => {
        this.loading = false;
      });
    },
    // onAddBoard() {
    //   this.fetchData();
      //console.log(title);
      //API call for creating a new board.
      //If success, refresh board list by 'fetch()' methods.
      // board.create(title)
      //   .then(() => this.fetchData());
      //console.log('hihi');
      //this.fetchData()
    // },
    //     addBoard() {
    //   //console.log("addBoard()");
    //   //VueX사용하기 전.
    //   //this.isAddBoard = true;

    //   //VueX. 이것도 장황해질수 있으니 헬퍼함수인 'mapMutations'를 쓰자.
    //   this.$store.commit('SET_IS_ADD_BOARD', true)
    // },

    // mapState를 쓰기 이전. 이렇게 하면 코드가 장황해지니 헬퍼함수인 'mapstate'를 쓰자.
    // computed: {

    //
    //   // isAddBoard() {
    //   //   return this.$store.state.isAddBoard
    //   // }

    // },
  },
};
</script>

<style>
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
  background-color: rgba(0, 0, 0, 0.1);
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
