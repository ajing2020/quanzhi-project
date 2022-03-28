import { Commit, createStore } from 'vuex'
import axios from 'axios'

export interface ResponseType<P = Record<string, unknown>> {
  code: number
  msg: string
  data: P
}

// 用户类型
export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
  description?: string
}
// 图片类型
export interface ImageProps {
  _id?: string
  url?: string
  createdAt?: string
}
// 列表类型
export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}
// 文章类型
export interface PostProps {
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps | string
  column: string
  author?: string
}
// 全局错误类型
export interface GlobalErrorProps {
  status: boolean
  message?: string
}
// 全局数据类型
export interface GlobalDataProps {
  error: GlobalErrorProps
  token: string
  loading: boolean
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
}
// get方法
const getAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit
) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
// post方法
const postAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  payload: unknown
) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: JSON.parse(
      localStorage.getItem('user') || JSON.stringify({ isLogin: false })
    )
  },
  mutations: {
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser(state, rowData) {
      state.user = { isLogin: true, ...rowData.data }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    login(state, rowData) {
      const { token } = rowData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout(state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns({ commit }) {
      return getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, { ...payload })
    },
    createPost({ commit }, payload) {
      return postAndCommit('/posts', 'createPost', commit, { ...payload })
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  }
})

export default store
