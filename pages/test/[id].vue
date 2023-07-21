<template>
  <div>
    <button @click="sendMessage">Send Message</button>
    <div>{{ msg }}</div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
const { $socket } = useNuxtApp()
const route = useRoute()
const msg = ref('')

const sendMessage = () => {
  $socket.emit('answer')
}

//init()
onMounted(() => {
  $socket.emit('connectedToQuiz', route.params.id)
  $socket.on('waintingPlayers', (data) => {
    msg.value = data
  })
})

</script>
