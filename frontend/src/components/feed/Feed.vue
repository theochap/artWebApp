<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import type {Ref} from "vue"
import axios from "axios"
import PostBox from "./PostBox.vue"
import {useUserStore} from "../../stores/user"
import type {UserPostData, Post} from "./common"

interface PostData{
    title:string,
    body:string,
    authors: (string| undefined)[] 
}

const postData:PostData = reactive({
    title: "",
    body: "",
    authors: []
})

const allPosts: Ref<Post[] | undefined> = ref()
const loaded = ref()
const user = useUserStore()

const submitRes = ref()

async function getPosts() {
    try {
        const res = await axios.get("http://localhost:8080/posts")
        allPosts.value = res.data
        loaded.value = true
    } catch (err) {
        console.log(err)
        loaded.value = false
    }
}

async function submitPost(){
    try {
        postData.authors = [user.id]
        const res = await axios.post("http://localhost:8080/posts/", postData, {headers: { Authorization: `Bearer ${user.token}` } })
        if(res.status === 201){ // HTTP ressource created
            submitRes.value = "The post have been successfully created!"
        } 
    } catch (err) {
        console.log(err)
        submitRes.value = "Error while creating the post!"
    }
}

onMounted(getPosts)

</script>

<template>
    <div v-if="user.isConnected">
        <p> Post as {{user.username}}</p>
        <form @submit.prevent="submitPost">
            <label>Title:</label>
            <input type="text" v-model="postData.title" />
            <br />
    
            <label>Body:</label>
            <input type="text" v-model="postData.body" />
            <br />
    
            <button class="ring-offset-green-400 " type="submit">Create post!</button>
        </form>

        <p>{{submitRes}}</p>
    </div>

    <div v-if="loaded">
        <li v-for="post in allPosts" :key="post._id">
            <PostBox :authors="post.authors" :title="post.title" :body="post.body" :stamp="post.timestamp"/>
        </li>
    </div>

    <div v-else><p>Loading posts...</p></div>
</template>