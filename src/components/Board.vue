<template>
  <div>
    <div class="board-wrapper">
      <div class="board">
        <div class="board-header">
          <!-- 입력화면에서 커서를 떼었을때, 혹은 엔터를 쳤을때등에는 API를 이용해 타이틀을 갱신한다. -->
          <input
            class="form-control"
            v-if="isEditTitle"
            type="text"
            v-model="inputTitle"
            @blur="onSubmitTitle"
            @keyup.enter="onSubmitTitle"
            ref="inputTitle"
          />
          <span v-else class="board-title" @click="onClickTitle">{{
            board.title
          }}</span>
          <a
            class="board-header-btn show-menu"
            href=""
            @click.prevent="onShowSettings"
            >...Show Menu</a
          >
        </div>
        <div class="list-section-wrapper">
          <div class="list-section">
            <div
              class="list-wrapper"
              v-for="list in board.lists"
              :key="list.pos" 
              :data-list-id="list.id"
            >
              <List :data="list" />
            </div>
            <div class="list-wrapper">
              <AddList />
            </div>
          </div>
        </div>
      </div>
    </div>
    <BoardSettings v-if="isShowBoardSettings" />
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import List from "./List.vue";
import AddList from "./AddList.vue";
import BoardSettings from "./BoardSettings.vue";
import dragger from "../utils/dragger.js";

export default {
  components: {
    List,
    AddList,
    BoardSettings,
  },
  data() {
    return {
      bid: 0,
      loading: true,
      cDragger: null,
      lDragger: null,
      isEditTitle: false,
      inputTitle: "",
    };
  },
  //자식컴포넌트가 전부 로딩된후에, 카드의 드래그앤 드롭이 활성화될수있도록 updated훅을 쓴다.
  updated() {
    this.setCardDragabble();
    this.setListDragabble();
  },
  computed: {
    ...mapState({
      board: "board",
      isShowBoardSettings: "isShowBoardSettings",
    }),
  },

  //보드가 생성될때 불리는 hook -> created
  created() {
    //fetchData가 promise기반이라야만 then을 쓸수있다.
    this.fetchData().then(() => {
      this.inputTitle = this.board.title;
      this.SET_THEME(this.board.bgColor);
    });
    this.SET_IS_SHOW_BOARD_SETTINGS(false);
  },
  methods: {
    ...mapActions(["FETCH_BOARD", "UPDATE_CARD", "UPDATE_BOARD","UPDATE_LIST"]),
    ...mapMutations(["SET_THEME", "SET_IS_SHOW_BOARD_SETTINGS"]),
    fetchData() {
      this.loading = true;
      return this.FETCH_BOARD({ id: this.$route.params.bid }).then(
        () => (this.loading = false)
      );
    },
    setCardDragabble() {
      //시작시 불필요한 드래귤라 인스턴스 삭제.
      if (this.cDragger) this.cDragger.destroy();

      this.cDragger = dragger.init(
        Array.from(this.$el.querySelectorAll(".card-list"))
      );

      this.cDragger.on("drop", (el, wrapper, target, siblings) => {
        console.log(el, wrapper, target, siblings);
        const targetList = {
          //CardItem컴포넌트의 data-card-id로부터 cardId를 받는다.
          id: el.dataset.cardId * 1,
          listId: el.dataset.listId * 1,
          pos: 65535,
        };

        const { prev, next } = dragger.sibling({
          el,
          wrapper,
          candidates: Array.from(wrapper.querySelectorAll(".card-item")),
          type: "card",
        });

        //prev카드와 next카드를 찾았다.

        //맨앞에 카드가 있을경우.
        if (!prev && next) targetList.pos = next.pos / 2;
        //제일 뒤에 카드가 있을 경우.
        else if (!next && prev) targetList.pos = prev.pos * 2;
        //
        else if (prev && next) targetList.pos = (prev.pos + next.pos) / 2;
        console.log(targetList);

        this.UPDATE_CARD(targetList);
      });
      //API응답 받기를 흉내내기 위해 setTimeout을 사용해본다.
      // setTimeout(() => {
      //   //this.$route를 통해 라우팅 정보 획득가능.
      //   //console.log(this.$route.params.bid);
      //   this.bid = this.$route.params.bid;
      //   this.loading = false;
      // }, 500);
    },

    setListDragabble() {
      //시작시 불필요한 드래귤라 인스턴스 삭제.
      if (this.lDragger) this.lDragger.destroy();

      //AddList컴포넌트도 drag & drop이 되어버리는 상황이 발생하므로, 콜백함수로 옵션을 주어 'list'로 시작하지 않는 경우에만 invalid를 적용함.
      //이번 경우에는, add-list가 해당됨.
      const options = {
        invalid: (el, handle) => !/^list/.test(handle.className)
      }

      this.lDragger = dragger.init(
        //v-for로 순회하는 리스트는 list-wrapper, 그것을 감싸는 wrapper는 list-section!
        Array.from(this.$el.querySelectorAll(".list-section")), options
      );
      this.lDragger.on("drop", (el, wrapper, target, siblings) => {
        console.log(el, wrapper, target, siblings);
        const targetList = {
          id: el.dataset.listId * 1,
          pos: 65535,
        };

        const { prev, next } = dragger.sibling({
          el,
          wrapper,
          candidates: Array.from(wrapper.querySelectorAll(".list")),
          type: "list",
        });

        //prev카드와 next카드를 찾았다.

        //맨앞에 카드가 있을경우.
        if (!prev && next) targetList.pos = next.pos / 2;
        //제일 뒤에 카드가 있을 경우.
        else if (!next && prev) targetList.pos = prev.pos * 2;
        //
        else if (prev && next) targetList.pos = (prev.pos + next.pos) / 2;
        console.log(targetList);

        this.UPDATE_LIST(targetList);
      });
    },
    onShowSettings() {
      this.SET_IS_SHOW_BOARD_SETTINGS(true);
    },
    onClickTitle() {
      this.isEditTitle = true;
      //상태변경이 너무빨라 DOM이 검색이 안되는 경우가 있다.
      //이럴경우에는 Vue.js에서 데이터갱신 후 UI까지 완료한 뒤에 nextTick에 있는 함수를 최종적으로 수행하도록 하면 된다.(일부러 실행을 조금 늦춤.)
      this.$nextTick(() => this.$refs.inputTitle.focus());
    },
    onSubmitTitle() {
      this.isEditTitle = false;
      this.inputTitle = this.inputTitle.trim();
      if (!this.inputTitle) return;

      const id = this.board.id;
      const title = this.inputTitle;

      //기존 타이틀과 새로 입력된 타이틀이 똑같은 값을 가지면, API콜을 하지 않는다.
      if (title === this.board.title) return;

      this.UPDATE_BOARD({ id, title });
    },
  },
};
</script>

<style>
.board-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.board {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.board-header {
  flex: none;
  padding: 8px 4px 8px 8px;
  margin: 0;
  height: 32px;
  line-height: 32px;
}
.board-header input[type="text"] {
  width: 200px;
}
.board-header-btn {
  border-radius: 4px;
  padding: 2px 10px;
  height: 30px;
  margin-bottom: 15px;
  display: inline-block;
  color: #fff;
}
.board-header-btn:hover,
.board-header-btn:focus {
  background-color: rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.board-title {
  font-weight: 700;
  font-size: 18px;
}
.show-menu {
  font-size: 14px;
  position: absolute;
  right: 15px;
}
.list-section-wrapper {
  flex-grow: 1;
  position: relative;
}
.list-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0 10px;
}
.list-wrapper {
  display: inline-block;
  height: 100%;
  width: 272px;
  vertical-align: top;
  margin-right: 5px;
}
.card-item.gu-transit {
  background-color: #555 !important;
}
.card-item.gu-mirror {
  opacity: 1 !important;
  background-color: #fff !important;
  transform: rotate(3deg) !important;
}
</style>
