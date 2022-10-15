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
    <div class="bg-rounded bg-whiteMute bg-opacity-70 border-2 border-blackSoft rounded-md border-opacity-20">
        <h2 class="pl-3 pt-2 underline text-lg"> {{title}}</h2>
        <h3 class="pl-3  italic"> By <span v-for="author in authors" :key="author._id">{{author.pseudo}},</span> the {{stamp}}</h3>
        <p class="pl-5 pb-3"> {{body}} </p>

    </div>
    
</template>