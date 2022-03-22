import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from '../testData'
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?:number
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: true, name: 'ajj', columnId: 1 }
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'viking' }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    }
  },
  getters: {
    getColumnById: (state) => (id:number) => {
      return state.columns.find(c => c.id === id)
    },
    getPostByCid: (state) => (cid:number) => {
      return state.posts.filter(post => post.columnId === cid)
    }
  }
})

export default store
