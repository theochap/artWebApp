<script setup lang="ts">
import { ref } from "vue"
import axios from "axios"

const email = ref()
const password = ref()
const loginRes = ref()
const allUsers = ref()

async function login() {
    try {
        const res = await axios.post("http://localhost:8080/users/login", { password: password.value, email: email.value })
        loginRes.value = res.data
    } catch (err) {
        console.log(err)
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
    <p>{{ loginRes }}</p>
    <form @submit.prevent="login">
        <label>Email:</label>
        <input type="text" v-model="email" />
        <br />

        <label>Mot de passe:</label>
        <input type="password" v-model="password" />
        <br />

        <button class="ring-offset-green-400 " type="submit">Se connecter !</button>
    </form>

    <button @click="getUsers">Get users</button>
    <p class="italic">{{ allUsers }}</p>
</template>