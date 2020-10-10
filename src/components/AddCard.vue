<template>
  <div class="add-card">
    <form @submit.prevent="onSubmit">
      <!-- DOM에 접근을 용이하게 할수 있게 'ref'를 사용하자.(inputText) -->
      <input
        class="form-control"
        type="text"
        v-model="inputTitle"
        ref="inputText"
      />
      <button class="btn btn-success" type="submit" :disabled="invalidInput">
        Add Card
      </button>
      <a class="cancel-add-btn" href="" @click.prevent="$emit('close')"
        >&times;</a
      >
    </form>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  props: ['listId'],
  data() {
    return {
      inputTitle: "",
    };
  },
  // 이 컴포넌트가 화면에 나타날때마다 실행되는 hook.
  mounted() {
    //ref를 이용한 DOM접근.
    this.$refs.inputText.focus();
    //this.$el를 이용해서 넘기면 'AddCard'컴포넌트가 넘어간다.
    //TODO: 제대로 작동 안함....
    //this.setupClickOutside(this.$el);
  },
  computed: {
    invalidInput() {
      return !this.inputTitle.trim();
    },
  },
  methods: {
    ...mapActions([
      'ADD_CARD'
    ]),
    newCardPos(){

      //현재 리스트 정보 획득 -> 카드 리스트 획득.
      const curList = this.$store.state.board.lists.filter(l => l.id === this.listId)[0]
      if(!curList) return 65535
      const {cards} = curList
      if(!cards.length) return 65535
      //맨 마지막에 있는 카드 정보를 가져온후, 그 카드의 2배 값을 설정해 리턴한다.
      return cards[cards.length - 1].pos * 2


    },
    onSubmit() {
      console.log("submit@");
      if(this.invalidInput) return
      const {inputTitle, listId} = this
      const pos = this.newCardPos()


      this.ADD_CARD({title: inputTitle, listId, pos})
        .finally(()=> this.inputTitle="")
    },
    setupClickOutside(el) {
      //   'AddCard'컴포넌트 이외가 클릭되면 'AddCard'창을 닫는다.
      document.querySelector("body").addEventListener("click", (e) => {
        if (el.contains(e.target)) return;
        this.$emit("close");
      });
    },
  },
};
</script>

<style>
.add-card {
  padding: 10px;
  display: block;
  position: relative;
}
.add-card .cancel-add-btn {
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  text-decoration: none;
  color: #888;
  font-size: 24px;
}
.add-card .cancel-add-btn:hover,
.add-card .cancel-add-btn:focus {
  color: #666;
}
</style>
