<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "../../stores/user"
import axios from "axios"

const email = ref()
const password = ref()
const loginRes = ref()
const allUsers = ref()
const user = useUserStore()

async function login() {
    try {
        const userName = await user.registerUser(email.value, password.value)
        loginRes.value = "You are successfully connected, welcome to Artefact " + userName + "!";
    } catch (err) {
        console.log(err)
        loginRes.value = "Wrong credentials!"
    }
}

async function getUsers() {
    try {
        const res = await axios.get("http://localhost:8080/users")
        allUsers.value = res.data
    } catch (err) {
        console.log(err)
    }
}

</script>

<template>
    <form @submit.prevent="login">
        <label>Email:</label>
        <input type="text" v-model="email" />
        <br />

        <label>Password:</label>
        <input type="password" v-model="password" />
        <br />

        <button class="ring-offset-green-400 " type="submit">Sign in</button>
    </form>

    <button @click="getUsers">Get users</button>
    <p class="italic">{{ allUsers }}</p>

    <h3>{{ loginRes }}</h3>

</template>