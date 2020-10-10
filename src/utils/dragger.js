import dragula from 'dragula'
import 'dragula/dist/dragula.css'

// 드래그 앤 드롭의 모듈(Wrapping)화
const dragger = {
    init(container){

        //유사배열을 ...Array.from을 이용해 배열로 바꾼다.
        //ex) ...Array.from(this.$el.querySelectorAll('.card-list'))
        return dragula([...container])
    },
    sibling({el, wrapper, candidates, type}){
        console.log(el, wrapper);

        //타입에 따라 dataset에 저장되는 정보가 바뀐다 (ex:cardId, listId...)
        const curId = el.dataset[type + 'Id'] * 1

              
        let prev = null
        let next = null

          candidates.forEach((el, idx, arr)=> {
            console.log(idx);
            const id = el.dataset[type + 'Id'] * 1
            if (id == curId) {
    
              //idx가 0보다 크다. -> 2번쨰 이후 카드 혹은 리스트
              //idx가 0이다. -> 맨 앞에 있는 카드 혹은 리스트
              prev = idx > 0 ? {
                id: arr[idx-1].dataset[type + 'Id'] * 1,
                pos: arr[idx-1].dataset[type + 'Pos'] * 1
              } : null
    
              //배열의 크기보다 인덱스가 작다 -> 다음카드 혹은 리스트가 있다.
              next = idx < arr.length -1 ? {
                id: arr[idx+1].dataset[type + 'Id'] * 1,
                pos: arr[idx+1].dataset[type + 'Pos'] * 1
              } : null
            }
          })

        return {prev, next}
    }
}

export default dragger