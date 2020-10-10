<template>
  <div>
    <div class="board-wrapper">
      <div class="board">
        <div class="board-header">
          <span class="board-title">{{ board.title }}</span>
        </div>
        <div class="list-section-wrapper">
          <div class="list-section">
            <div
              class="list-wrapper"
              v-for="list in board.lists"
              :key="list.pos"
            >
              <List :data="list" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations,  mapActions } from "vuex";
import List from "./List.vue";
import dragger from "../utils/dragger.js";

export default {
  components: {
    List,
  },
  data() {
    return {
      bid: 0,
      loading: true,
      cDragger: null,
    };
  },
  //자식컴포넌트가 전부 로딩된후에, 카드의 드래그앤 드롭이 활성화될수있도록 updated훅을 쓴다.
  updated() {
    //시작시 불필요한 드래귤라 카드 삭제.
    this.setCardDragabble();
  },
  computed: {
    ...mapState({
      board: "board",
    }),
  },

  //보드가 생성될때 불리는 hook -> created
  created() {
    //fetchData가 promise기반이라야만 then을 쓸수있다.
    this.fetchData().then(() => {
      this.SET_THEME(this.board.bgColor)
    })
  },
  methods: {
    ...mapActions(["FETCH_BOARD", "UPDATE_CARD"]),
    ...mapMutations(["SET_THEME"]),
    fetchData() {
      this.loading = true;
      return this.FETCH_BOARD({ id: this.$route.params.bid }).then(
        () => (this.loading = false)
      );

    },
    setCardDragabble() {
      if (this.cDragger) this.cDragger.destroy();
      this.cDragger = dragger.init(
        Array.from(this.$el.querySelectorAll(".card-list"))
      );

      this.cDragger.on("drop", (el, wrapper, target, siblings) => {
        console.log(el, wrapper, target, siblings);
        const targetCard = {
          //CardItem컴포넌트의 data-card-id로부터 cardId를 받는다.
          id: el.dataset.cardId * 1,
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
        if (!prev && next) targetCard.pos = next.pos / 2;
        //제일 뒤에 카드가 있을 경우.
        else if (!next && prev) targetCard.pos = prev.pos * 2;
        //
        else if (prev && next) targetCard.pos = (prev.pos + next.pos) / 2;
        console.log(targetCard);

        this.UPDATE_CARD(targetCard);
      });
            //API응답 받기를 흉내내기 위해 setTimeout을 사용해본다.
      // setTimeout(() => {
      //   //this.$route를 통해 라우팅 정보 획득가능.
      //   //console.log(this.$route.params.bid);
      //   this.bid = this.$route.params.bid;
      //   this.loading = false;
      // }, 500);
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
