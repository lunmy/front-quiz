<template>
  <Login
      v-if="!logged"
      :login="name"
      loginLabel="Login"
      :loginRules="[textRule]"
      :password="email"
      passwordLabel="Mot de passe"
      :passwordRules="[textRule]"
      :errorMessage="errorMessage"
      @validated="submitLogin"/>
  <div v-else>
    <div class="w-full bg-primary-0 p-4 text-center h-16">
      <span class="text-2xl text-white">{{ quiz.name }}</span>
    </div>

    <div class="flex flex-row justify-between w-1/3 lg:w-1/12 mx-auto pt-16">
      <div
          v-for="(question, index) in quiz.questions"
          :key="index"
          class="h-4 w-4 rounded-full border-2 border-primary-500"
          :class="{
            'bg-primary-500': currentQuestion === index,
            'bg-validation-success border-validation-success ':
              (index < currentQuestion)
          }"
      >
        &nbsp;
      </div>
    </div>
    <div class="text-center text-4xl font-bold my-16 mx-4">
      {{ question.text }}
    </div>
    <div class="px-20 grid grid-cols-4 gap-12">
      <div v-for="(player, index) in players" :key="index"
           class="max-w-sm rounded overflow-hidden shadow-lg p-6 text-center bg-primary-900 rounded-xl"
           :class="{
          'bg-validation-success border-validation-success text-white': isCorrectAnswer(player.quiz),
          'bg-validation-error border-validation-error text-white': !isCorrectAnswer(player.quiz) && null !== isCorrectAnswer(player.quiz),
        }">
        <div class="text-2xl font-bold">{{ player.name }}</div>
        <div class="text-xl mt-6"
        >
          {{ selectedAnswer(player.quiz) }}
        </div>
      </div>
    </div>
    <div class="w-full my-16 flex flex-row justify-center">
      <button
          v-if="isNextStepAvailable"
          class="bg-secondary-0 text-white rounded-xl px-4 py-3 flex justify-center items-center mr-4"
          @click="nextQuestion()"
      >
        Question suivante
      </button>
    </div>
  </div>
</template>
<script setup>
import {Login} from '#components';
import {ref} from "vue";
import {textRule} from "@/composables/rules";

const {$quizApi, $socket} = useNuxtApp()
const route = useRoute()
const name = ref('admin');
const email = ref('admin');
const errorMessage = ref('');
const logged = ref(false);
const quiz = ref(null);
const question = ref(null);
const currentQuestion = ref(0)
const players = ref([])
const isNextStepAvailable = ref(false)

if (getStorage('admin-quiz-' + route.params.id) !== null) {
  logged.value=true;
}

onMounted(async () => {

  $socket.emit('adminConnectedTo', {
    quizId: route.params.id,
    currentQuestion: currentQuestion.value
  })

  $socket.on('playersData', (data) => {
    players.value = data
  })
  $socket.on('allPlayersAnswered', (data) => {
      isNextStepAvailable.value = true
  })

})

quiz.value = await $quizApi.getQuiz(route.params.id)
logged.value = true;
if (getStorage('quiz-' + route.params.id) !== null) {
  const quizStorage = getStorage('quiz-' + quiz.value['@id'].split('/').pop())
}
question.value = quiz.value.questions[currentQuestion.value]


function submitLogin(data) {
  errorMessage.value = '';
  if (data.login !== quiz.value.adminLogin || data.email !== quiz.value.adminPassword) {
    console.log('error')
    errorMessage.value = 'Login ou mot de passe incorrect';
  } else {
    setStorage('admin-quiz-' + route.params.id, true)
    logged.value = true;
  }
}

function selectedAnswer(q) {
  // Get selected Answer
  if (q.questions[currentQuestion.value].validated) {
    return q.questions[currentQuestion.value].answers.find((a) => a.selected).text
  }
  return 'En attente de réponse'
}

function isCorrectAnswer(q) {
  if (q.questions[currentQuestion.value].validated) {
    return q.questions[currentQuestion.value].answers.find((a) => a.selected).isCorrect
  }
  return null;
}
function nextQuestion(){
  currentQuestion.value++
  question.value = quiz.value.questions[currentQuestion.value]
  isNextStepAvailable.value = false
  $socket.emit('nextQuestion', {
    currentQuestion: currentQuestion.value
  })
}



</script>
