<script setup lang="ts">
import Vue, { onMounted, ref, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import axios from "axios"

const user = useUserStore()
const latestPosts = ref()
const loaded = ref()
const latestPostsSize = computed(() => {
    return (loaded.value)? latestPosts.value.length : 0
})

async function getPostsFromUser() {
    try {
        const res = await axios.get("http://localhost:8080/posts", {params: {"authors.pseudo": user.username} })
        console.log(res)
        latestPosts.value = res.data
        loaded.value = true
    } catch (err) {
        console.log(err)
        loaded.value = false
    }
}

async function deletePostFromUser(postId: string){
    try {
        const res = await axios.delete("http://localhost:8080/posts", {data: {_id : postId}, headers:{Authorization: `Bearer ${user.token}`}})
        console.log(res)
        if (res.status === 200){
            latestPosts.value = latestPosts.value.filter(item => !(item._id === postId))
        } else{
            throw Error("Failed to delete the post.")
        }
    } catch (err) {
        console.log(err)
    }
}

async function deleteUserAccount(){
    try {
        const res = await axios.delete("http://localhost:8080/users", {data: {deleteData : 1}, headers:{Authorization: `Bearer ${user.token}`}})
        console.log(res)
        if (res.status === 202){
            user.destructor()
        } else{
            throw Error("Failed to delete the user.")
        }
    } catch (err) {
        console.log(err)
    }
}

onMounted(getPostsFromUser)

</script>

<template>
    <div>
        <div v-if="user.isConnected">
            <h1 class="mb-1">Account information</h1>
            <p> Username: {{user.username}} - <button class="bg-candy pl-2 pr-2 pt-1 pb-1 rounded-md">Update</button></p>
            <p> Email address: {{user.email}} - <button class="bg-candy pl-2 pr-2 pt-1 pb-1 rounded-md">Update</button></p>
            <button @click="deleteUserAccount" class="bg-red-400 pl-2 pr-2 pt-1 pb-1 rounded-md">Delete account</button>
            <h1 class="mt-5 mb-1"> Latest posts: </h1>
            <div v-if="latestPostsSize">
                <ul>
                    <li v-for="post in latestPosts" :key="post._id">{{post.title}}, posted on the {{post.timestamp}}. <br/> 
                        Body: {{post.body}} <button @click="deletePostFromUser(post._id)" class="bg-candy pl-2 pr-2 pt-1 pb-1 rounded-md">Delete!</button></li>
                </ul>
            </div>
            <div v-else> <p>No posts!</p></div>
            
        </div>
        <div v-else>
            <h1>You are not connected!</h1>    
        </div>
    </div>
</template>