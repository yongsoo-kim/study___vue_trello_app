<template>
  <div class="add-list">
    <!-- v-model은 양방향 바인딩이다! -->
    <input
      v-if="isAddList"
      type="text"
      class="form-control"
      v-model="inputTitle"
      ref="inputTitle"
      @blur="restore"
      @keyup.enter="onSubmitTitle"
    />
    <a v-else href="" @click.prevent="onAddList">&plus; Add another list</a>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      board: "board",
    }),
  },
  data() {
    return {
      isAddList: false,
      inputTitle: "",
    };
  },
  methods: {
    ...mapActions(["ADD_LIST"]),
    onAddList() {
      this.isAddList = true;
      this.$nextTick(() => this.$refs.inputTitle.focus());
    },
    restore() {
      this.isAddList = false;
      this.inputTitle = "";
    },
    onSubmitTitle() {
      this.inputTitle = this.inputTitle.trim();
      //빈값이 만약에 들어온다면  API작업을 시작하지 않고, inputTitle을 빈칸으로 되돌린다.
      if (!this.inputTitle) return this.restore();

      const title = this.inputTitle;
      const boardId = this.board.id;
      
      //추가될 리스트의 포지션은 현재 존재하는 마지막 리스트 포지션값의 2배를 설정한다.
      const lastList = this.board.lists[this.board.lists.length -1]
      const pos = lastList ? lastList.pos * 2 : 65535

      //API콜로 리스트를 추가.
      this.ADD_LIST({title, boardId, pos})
        .then(() => this.restore())


    },
  },
};
</script>

<style>
.add-list {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 12px;

  transition: all 0.3s;
}

.add-list a {
  color: #ddd;
}

.add-list:hover,
.add-list:focus {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
