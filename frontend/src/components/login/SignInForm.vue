<script setup lang="ts">
import { reactive, ref } from "vue"
import axios from "axios"
import { useUserStore } from "../../stores/user"

const signinData = reactive({
    pseudo: "",
    email: "",
    password: ""
})

const user = useUserStore()

const signinRes = ref()

async function signin() {
    try {
        const res = await axios.post("http://localhost:8080/users/", signinData)
        if(res.status === 201){ // HTTP ressource created
            const userData = await user.registerUser(signinData.email, signinData.password)
            signinRes.value = "Successfully signed in! Welcome to artefact " + userData + "!"
        } 
    } catch (err) {
        console.log(err)
    }
}

</script>

<template>
    <div>
        <form @submit.prevent="signin">
            <label>Username:</label>
            <input type="text" v-model="signinData.pseudo" />
            <br />
    
            <label>Email:</label>
            <input type="text" v-model="signinData.email" />
            <br />
    
            <label>Password:</label>
            <input type="password" v-model="signinData.password" />
            <br />
    
            <button class="ring-offset-green-400 bg-pistacheLight border-spacing-1.5 rounded text-lg p-3 text-candy hover:bg-whiteSoft">Sign in</button>
        </form>
        <h3>{{ signinRes }}</h3>
    </div>

</template>
