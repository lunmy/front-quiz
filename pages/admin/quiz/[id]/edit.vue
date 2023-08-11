<template>
  <div>
  <h1 class="text-3xl text-center font-bold text-secondary-admin-0 mb-6">Modifier le quiz</h1>
  <QuizForm :quiz="quiz" />
  </div>
</template>
<script setup>
import {QuizForm} from "#components";
import {ref} from "vue";
definePageMeta({
  middleware: 'auth' ,
  layout: 'admin'
})
const quiz = ref(null)
const {$quizApi} = useNuxtApp()
const route = useRoute()
const router = useRouter()

quiz.value = await $quizApi.getQuiz(route.params.id)

</script>
