import { defineStore } from 'pinia'
import axios from "axios"

export const useUserStore = defineStore({
  id: 'userInfo',
  state: () => ({
    user: null as UserInfo | null,
  }),
  getters: {
    id: (state) => state.user?._id,
    username: (state) => state.user?.username,
    token: (state) => state.user?.token,
    isConnected: (state) => state.user != null
  },
  actions: {
    async registerUser(email:string, password:string) {
      try {
        const res_login = await axios.post("http://localhost:8080/users/login", { password: password, email: email })
        if(res_login.status === 202){ // Status accepted
          const res_get = await axios.get("http://localhost:8080/users/?_id="+res_login.data.id)
          if(res_get.data.length>0){
            this.user = { _id:res_login.data.id ,email: res_get.data[0].email, username: res_get.data[0].pseudo, token: res_login.data.token}
            return this.user.username
          }
        } else{
          throw Error("Wrong credentials!")
        }

    } catch (err) {
        console.log(err)
        this.user = null
        throw err
    }
    }
  }
})

interface UserInfo {
  _id: string,
  email: string,
  username: string,
  token: string
}

interface User {
  pseudo: string,
  email: string,
  password: string,
  timestamp: Date,
  _id: string,
  follows: string[]
}