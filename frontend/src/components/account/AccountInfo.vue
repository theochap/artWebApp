<script setup lang="ts">
import { useUserStore } from "../../stores/user"
import {ref} from "vue"
import axios from "axios"


const props = defineProps<{
    infoName: string,
    infoFieldName: string,
    infoValue: string,
    userFieldName: string,
}>()

const user = useUserStore()
const update = ref(false)
const updateRes = ref<string | null>(null)

const infoValueRef = ref(props.infoValue)

async function updateInfo() {

    try{
        const reqParam: any = {}
        reqParam[props.infoFieldName] = infoValueRef.value
        console.log(reqParam)
    
        const res = await axios.put("http://localhost:8080/users", reqParam, {headers: { Authorization: `Bearer ${user.token}` } } )
        console.log(res)
        if(res.status === 201){
            update.value = false
            user[props.userFieldName] = infoValueRef.value
            updateRes.value = "Successfully updated!"
        } else{
            throw Error("Error while updating the value")
        }
    } catch (err){
        console.log(err);
        update.value = true
        updateRes.value = "An error occurred while updating the value"
    }
}

</script>

<template>
    <div class="mb-2">
        <table>
        <tr>
            <td class="w-1/6">
                <label class="mr-3">{{infoName}}:</label> 
            </td>
            <td class="w-1/6"> <input type="text" class="inline max-w-xs" :disabled="!update" v-model="infoValueRef"/> </td>
            <td class="w-1/6 ml-5"> 
             <button v-if="!update" @click="update = true" class="bg-candy pl-2 pr-2 pt-1 pb-1 rounded-md">Update</button>
             <button v-else @click="updateInfo" class="bg-candy pl-2 pr-2 pt-1 pb-1 rounded-md">Save</button>
            </td>
            <td>
                <span v-if="updateRes != null">{{updateRes}}</span>
            </td>
        </tr> 
        </table>
    </div>
    
</template>