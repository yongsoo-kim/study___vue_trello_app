
import * as api from "../api/api.js";
// import state from "./state.js";

  //비동기적은 로직은 action으로!
const actions =  {
    ADD_BOARD(_, { title }) {
      return api.board.create(title).then(data => data.item);
    },
    FETCH_BOARDS({commit}){
      return api.board.fetch().then(data => {
        commit('SET_BOARDS', data.list)
      })
    },
    UPDATE_BOARD({dispatch, state}, {id, title, bgColor}){
      return api.board.update(id, {title, bgColor})
      .then(() => dispatch('FETCH_BOARD',{id: state.board.id}))
    },
    LOGIN ({commit}, {email, password}){
      return api.auth.login(email, password)
      .then(({accessToken}) => commit('LOGIN', accessToken))
    },
    FETCH_BOARD ({commit}, {id}) {
        return api.board.fetch(id).then(data => {
            commit('SET_BOARD', data.item)
        })
    },
    DELETE_BOARD(_,{id}) {
      return api.board.delete(id)
    }
    ,
    ADD_CARD({dispatch, state}, {title,listId,pos}){
      return api.card.create(title,listId,pos)
      .then(() => dispatch('FETCH_BOARD',{id: state.board.id}))
    },
    FETCH_CARD({commit}, {id}){
      return api.card.fetch(id).then(data => {
        commit('SET_CARD', data.item)
      })
    },
    UPDATE_CARD({dispatch, state}, {id, title, description, pos, listId}){
      //카드 정보 갱신후 카드화면을 새로고침해준다.
      return api.card.update(id, {title, description, pos, listId})
      .then(() => dispatch('FETCH_BOARD',{id: state.board.id}))

    },
    DELETE_CARD({dispatch, state}, {id}){
      
      return api.card.delete(id)
      .then(() => dispatch('FETCH_BOARD',{id: state.board.id}))
    },
    ADD_LIST({dispatch, state}, {title, boardId, pos}){
      return api.list.create({title, boardId, pos})
      .then(() => dispatch('FETCH_BOARD',{id: state.board.id}))
    },
    UPDATE_LIST({dispatch, state},{id, pos, title}) {
      return api.list.update(id, {pos, title})
      .then(() => dispatch('FETCH_BOARD',{id: state.board.id}))
    },
    DELETE_LIST({dispatch, state}, {id}){
      return api.list.delete(id)
      .then(() => dispatch('FETCH_BOARD',{id: state.board.id}))
    }

  }


  export default actions