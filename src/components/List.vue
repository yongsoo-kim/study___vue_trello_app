<template>
  <div class="list" :data-list-id="data.id" :data-list-pos="data.pos">
    <div class="list-header">
      <input
        v-if="isEditTitle"
        class="form-control input-title"
        type="text"
        ref="inputTitle"
        v-model="inputTitle" 
        @blur="onBlurTitle"
        @keyup.enter="onSubmitTitle"
      />
      <div v-else class="list-header-title" @click.prevent="onClickTitle">
        {{ data.title }}
      </div>
      <a class="delete-list-btn" href="" @click.prevent="onDeleteList">&times;</a>
    </div>
    <div class="card-list" :data-list-id="data.id">
      <CardItem v-for="card in data.cards" :key="card.id" :data="card" />
    </div>

    <div v-if="isAddCard">
      <AddCard :list-id="data.id" @close="isAddCard = false" />
    </div>
    <div v-else>
      <a class="add-card-btn" href="" @click.prevent="isAddCard = true">
        &plus; Add a card...
      </a>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import AddCard from "./AddCard.vue";
import CardItem from "./CardItem.vue";

export default {
  components: { AddCard, CardItem },
  props: ["data"],
  created() {
    this.inputTitle = this.data.title;
  },
  data() {
    return {
      isAddCard: false,
      isEditTitle: false,
      inputTitle: "",
    };
  },
  methods: {
    ...mapActions([
      'UPDATE_LIST',
      'DELETE_LIST'
    ]),
    onClickTitle() {
      this.isEditTitle = true;
      //nextTick을 쓰면 다음 렌더링사이클때 실행된다.
      this.$nextTick(() => this.$refs.inputTitle.focus());
    },
    onBlurTitle(){
      this.isEditTitle = false
      this.inputTitle = this.data.title
    },
    onSubmitTitle(){
      this.inputTitle = this.inputTitle.trim()
      if(!this.inputTitle) return

      //API를 콜하기위한 파라메터를 얻어온다.
      const id = this.data.id
      const title = this.inputTitle

      if (title == this.data.title) return
      this.UPDATE_LIST({id, title})
      .then(() => this.isEditTitle = false)
    },
    onDeleteList(){
      if (!window.confirm(`Delete ${this.data.title} list?`)) return
      this.DELETE_LIST({id: this.data.id})
    }

  },
};
</script>

<style>
.list {
  background-color: #e2e4e6;
  border-radius: 3px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  vertical-align: top;
  width: 100%;
  max-height: 100%;
}
.list-header {
  flex: 0 0 auto;
  height: 30px;
  padding: 10px 8px 8px;
  position: relative;
}
.list-header-title {
  font-size: 16px;
  font-weight: 700;
  padding-left: 8px;
  line-height: 30px;
  
  border-radius: 5px;
  transition: all 0.3s;
}


.list-header-title:hover,
.list-header-title:focus {
  background-color: rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.input-title {
  width: 90%;
}
.delete-list-btn {
  position: absolute;
  right: 10px;
  top: 8px;
  text-decoration: none;
  color: #aaa;
  font-size: 24px;
}
.card-list {
  flex: 1 1 auto;
  overflow-y: scroll;
}
.empty-card-item {
  height: 10px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
}
.add-card-btn {
  flex: 0 0 auto;
  display: block;
  padding: 8px 10px;
  color: #8c8c8c;
  text-decoration: none;
}
.add-card-btn:focus,
.add-card-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
