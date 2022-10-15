<script setup lang="ts">
import type {UserPostData} from "./common"

defineProps<{
    title:string,
    body:string,
    authors:UserPostData[]
    stamp: Date
}>()

</script>

<template>
    <div>
        <h2> {{title}}</h2>
        <h3> By <span v-for="author in authors" :key="author._id">{{author.pseudo}},</span> the {{stamp}}</h3>
        <p> {{body}} </p>

    </div>
    
</template>