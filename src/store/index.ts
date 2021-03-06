import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { objToArr, arrToObj } from '../helper'

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
  _id?: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps | string
  createdAt?: string
  column: string
  author?: string | UserProps
  isHTML?: boolean
}
interface ListProps<P> {
  [id: string]: P
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
  columns: { data: ListProps<ColumnProps>; total: number }
  posts: ListProps<PostProps>
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
// 把POST和GET方法进行合并
const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'GET' },
  extraData?: unknown
) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, total: 1 },
    posts: {},
    user: JSON.parse(
      localStorage.getItem('user') || JSON.stringify({ isLogin: false })
    )
  },
  mutations: {
    createPost(state, newPost) {
      state.posts[newPost._id] = newPost
    },
    deletePost(state, { data }) {
      delete state.posts[data._id]
    },
    fetchColumns(state, rawData) {
      const { data } = state.columns
      const { list, count } = rawData.data
      state.columns = {
        data: {
          ...data,
          ...arrToObj(list)
        },
        total: count
      }
    },
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts(state, rawData) {
      state.posts = arrToObj(rawData.data.list)
    },
    fetchPost(state, rawData) {
      state.posts[rawData.data._id] = rawData.data
    },
    updatePost(state, { data }) {
      state.posts[data._id] = data
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser(state, rowData) {
      state.user = { isLogin: true, ...rowData.data }
    },
    login(state, rowData) {
      const { token } = rowData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout(state) {
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      state.token = ''

      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns({ commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      return getAndCommit(
        `/columns?currentPage=${currentPage}&pageSize=${pageSize}`,
        'fetchColumns',
        commit
      )
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost({ commit }, id) {
      return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
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
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById(state) {
      return (id: string) => {
        return state.columns.data[id]
      }
    },
    getPostsByCid(state) {
      return (cid: string) => {
        return objToArr(state.posts).filter(
          (post: PostProps) => post.column === cid
        )
      }
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts[id]
    }
  }
})

export default store
