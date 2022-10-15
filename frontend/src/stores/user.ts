import { defineStore } from 'pinia'
import axios from "axios"
import * as core from '@vueuse/core'

export const useUserStore = defineStore({
  id: 'userInfo',
  state: () => ({
    id: core.useLocalStorage("id", ""),
    username: core.useLocalStorage("username", ""),
    token: core.useLocalStorage("token", ""),
    email: core.useLocalStorage("email", "")
  }),
  getters: {
    isConnected: (state) => state.id.length>0 
  },
  actions: {
    destructor(){
      localStorage.setItem("id", "")
      localStorage.setItem("username", "")
      localStorage.setItem("token", "")
      localStorage.setItem("email", "")

      this.id= ""
      this.username= ""
      this.token= ""
      this.email= ""
    },

    async registerUser(email:string, password:string) {
      try {
        const res_login = await axios.post("http://localhost:8080/users/login", { password: password, email: email })
        if(res_login.status === 202){ // Status accepted
          const res_get = await axios.get("http://localhost:8080/users/?_id="+res_login.data.id)
          if(res_get.data.length>0){
            this.id = res_login.data.id
            this.email = res_get.data[0].email
            this.username = res_get.data[0].pseudo
            this.token = res_login.data.token
            return this.username
          }
        } else{
          throw Error("Wrong credentials!")
        }

    } catch (err) {
        console.log(err)
        this.destructor()
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