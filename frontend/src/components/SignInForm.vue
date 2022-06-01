<script setup lang="ts">
import { reactive, ref } from "vue"
import axios from "axios"

const signinData = reactive({
    pseudo: "",
    email: "",
    password: ""
})

const signinRes = ref()

async function signin() {
    try {
        const res = await axios.post("http://localhost:8080/users/", signinData)
        signinRes.value = res.data
    } catch (err) {
        console.log(err)
    }
}

</script>

<template>
    <p class="underline">{{ signinRes }}</p>
    <form @submit.prevent="signin">
        <label>Pseudo:</label>
        <input type="text" v-model="signinData.pseudo" />
        <br />

        <label>Email:</label>
        <input type="text" v-model="signinData.email" />
        <br />

        <label>Mot de passe:</label>
        <input type="password" v-model="signinData.password" />
        <br />

        <button type="submit">Inscription</button>
    </form>
</template>