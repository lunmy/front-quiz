<template>
  <div>
    <h1 class="text-3xl text-center font-bold text-secondary-admin-0 mb-6">Nouveau quiz</h1>
    <QuizForm v-if="quiz !== null" :quiz="quiz" :newQuiz="true" />
  </div>
</template>
<script setup>
import {QuizForm} from "#components";
import {ref} from "vue";
definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'admin'
})
const quiz = ref({
  name: '',
  minimumScore: 50,
  questions: [
    {
      text: '',
      explanation: '',
      position: 1,
      answers: [
        {
          text: '',
          isCorrect: false,
          position: 1
        }
      ]
    }
  ]
})

</script>
