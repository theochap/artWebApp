<script setup lang="ts">
import Vue, { onMounted, ref, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import AccountInfo from "./AccountInfo.vue"
import axios from "axios"
import PostBox from "../feed/PostBox.vue"

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
            <h1 class="mt-1 text-xl">Account information</h1>
            <AccountInfo info-field-name="email" info-name="Email" :info-value="user.email" user-field-name="email" />
            <AccountInfo info-field-name="pseudo" info-name="Username" :info-value="user.username" user-field-name="username" />

            <button @click="deleteUserAccount" class="bg-red-400 pl-2 pr-2 pt-1 pb-1 rounded-md">Delete account</button>
            
            <h1 class="mt-5 text-xl"> Latest posts: </h1>
            <div v-if="latestPostsSize">
                <ul>
                    <li v-for="post in latestPosts" :key="post._id"> 
                        <PostBox :authors="post.authors" :title="post.title" :body="post.body" :stamp="post.timestamp" :_id="post._id"/>
                        <button @click="deletePostFromUser(post._id)" class="bg-candy pl-2 pr-2 pt-1 pb-1 rounded-md">Delete post</button>
                        <br/>
                        
                    </li>
                </ul>
            </div>
            <div v-else> <p>No posts!</p></div>

            
        </div>
        <div v-else>
            <h1>You are not connected!</h1>    
        </div>
    </div>
</template>