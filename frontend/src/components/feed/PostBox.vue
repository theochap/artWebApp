<script setup lang="ts">
import type {UserPostData} from "./common"
import {useUserStore} from "../../stores/user"
import { ref, reactive, computed } from "@vue/runtime-core"
import axios from "axios"

const props = defineProps<{
    title:string,
    body:string,
    authors:UserPostData[]
    stamp: Date
    _id: string
}>()

interface postData{
    title:string,
    body:string
}

const propsRef = reactive<postData>({
    title: props.title,
    body: props.body
})
    
const updatedPropertyRef = ref<null|keyof postData>(null)

const updatedRes = ref()

const user = useUserStore()

const isUserAnAuthor = computed(
    () => {
        return (props.authors.find( (el) => el._id === user.id ) != undefined)
    }
)

async function updatePost(updatedProperty: keyof postData | null) {
    

    try{
        if (updatedProperty === null){
            throw Error("Bad param")
        }

        const reqParam: any = { updatedFields: {}, postId: props._id}
        reqParam.updatedFields[updatedProperty] = propsRef[updatedProperty]

        console.log(reqParam)
    
        const res = await axios.put("http://localhost:8080/posts", reqParam, {headers: { Authorization: `Bearer ${user.token}` } } )
        console.log(res)

        if(res.status === 201){
            updatedRes.value = "Successfully updated!"
            updatedPropertyRef.value = null
        } else{
            throw Error("Error while updating the value")
        }

    } catch (err){
        console.log(err);
        updatedRes.value = "An error occurred while updating the value"
    }
}

</script>

<template>
    <div class="bg-rounded bg-whiteMute bg-opacity-70 border-2 p-3 mb-2 border-blackSoft rounded-md border-opacity-20">
        <h2 class="pl-3 underline text-lg"> {{propsRef.title}}</h2>
        <h3 class="pl-3  italic"> By <span v-for="author in authors" :key="author._id">{{author.pseudo}},</span> the {{stamp}}</h3>
        <p class="pl-5 pb-3"> {{propsRef.body}} </p>
        <div v-if="isUserAnAuthor">
            <div v-if="updatedPropertyRef === null">
                <button @click="updatedPropertyRef='title'" class="bg-candy pl-2 pr-2 pt-1 pb-1 mr-2 rounded-md">Update title</button>
                <button @click="updatedPropertyRef='body'" class="bg-candy pl-2 pr-2 pt-1 pb-1 mr-2 rounded-md">Update body</button>
            </div>
            <div v-else>
                <label>New {{updatedPropertyRef}}: </label>
                <input class="max-w-xs" type="text" v-model="propsRef[updatedPropertyRef]"/>
                <button @click="updatePost(updatedPropertyRef)" class="bg-candy pl-2 pr-2 pt-1 pb-1 mr-2 ml-2 rounded-md">Submit</button>
                <p v-if="updatedRes!==null">{{updatedRes}}</p>
            </div>
        </div>
        <div v-else>
            <button class="bg-candy pl-2 pr-2 pt-1 pb-1 mr-2 rounded-md">Like</button>
        </div>
    </div>
    
</template>