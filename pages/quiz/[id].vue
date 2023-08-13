<template>
  <div>
    <Login
        v-if="!logged"
        :login="name"
        loginLabel="Nom complet"
        :loginRules="[textRule]"
        :password="email"
        passwordLabel="Email"
        :passwordRules="[textRule, emailRule]"
        @validated="submitLogin"/>
    <div v-else>
      <div class="w-full bg-primary-0 p-4 text-center h-16">
        <span class="text-2xl text-white">{{ quiz.name }}</span>
      </div>
      <div v-if="!showResult" class="quiz">
        <div class="flex flex-row justify-between w-1/3 lg:w-1/12 mx-auto pt-16">
          <div
              v-for="(question, index) in quiz.questions"
              :key="index"
              class="h-4 w-4 rounded-full border-2 border-primary-500"
              :class="{
            'bg-primary-500': currentQuestion === index,
            'bg-validation-success border-validation-success':
              (index < currentQuestion && question.isCorrectAnswer) ||
              (index === currentQuestion &&
                question.validated &&
                question.isCorrectAnswer &&
                isNexStepAvailable),
            'bg-validation-error border-validation-error':
              (index < currentQuestion && !question.isCorrectAnswer) ||
              (index === currentQuestion &&
                question.validated &&
                !question.isCorrectAnswer &&
                isNexStepAvailable),
          }"
          >
            &nbsp;
          </div>
        </div>
        <div class="text-center text-4xl font-bold my-16 mx-4">
          {{ quiz.questions[currentQuestion].text }}
        </div>
        <div class="answers w-5/6 lg:w-1/3 mx-auto">
          <button
              v-for="(answer, index) in quiz.questions[currentQuestion].answers"
              :key="index"
              :disabled="quiz.questions[currentQuestion].validated"
              type="button"
              class="w-full bg-primary-0 my-4 p-4 rounded-2xl text-xl"
              :class="{
            'bg-tertiary-0 text-black': answer.selected && !isNexStepAvailable,
            'bg-validation-success text-white':
              isNexStepAvailable && answer.isCorrect,
            'bg-validation-error text-white':
              isNexStepAvailable && !answer.isCorrect && answer.selected,
                'opacity-50':
              !answer.selected &&
              isNexStepAvailable !== null &&
              quiz.questions[currentQuestion].validated &&
              !answer.isCorrect,
          }"
              @click="selectAnswer(index)"
          >
            <span class="font-bold">{{ answer.text }}</span>
          </button>
        </div>
        <div
            v-if="isNexStepAvailable"
            class="text-center text-xl m-8 lg:w-1/2 mx-auto"
        >
          <div
              v-if="!quiz.questions[currentQuestion].isCorrectAnswer"
              class="text-validation-error mx-4"
          >
            <span class="text-2xl font-bold">Dommage !</span> <br/>
            {{ quiz.questions[currentQuestion].explanation }}
          </div>
          <div v-else class="text-validation-success mx-4">
            <span class="text-2xl font-bold">Bravo !</span> <br/>
            {{ quiz.questions[currentQuestion].explanation }}
          </div>
        </div>

        <div class="w-full my-16 flex flex-row justify-center">
          <button
              v-if="!quiz.questions[currentQuestion].validated"
              :disabled="!canValidate()"
              class="bg-secondary-0 text-white rounded-xl px-4 py-3 flex justify-center items-center mr-4"
              :class="{ 'bg-secondary-500 cursor-not-allowed': !canValidate() }"
              @click="validateAnswer()"
          >
            Valider ma réponse
          </button>

          <div v-else-if="quiz.questions[currentQuestion].validated && socketMessage.message !== ''"
               class="flex flex-col justify-center items-center">
            <span>{{ socketMessage.message }}</span>
            <v-progress-circular v-if="socketMessage.wait"
                                 class="mt-4"
                                 :color="$tailwindCSS.colors.primary[0]"
                                 indeterminate
                                 color="primary"
            ></v-progress-circular>
          </div>
          <button
              v-if="isNexStepAvailable && isLastQuestion()"
              class="bg-primary-0 text-white rounded-xl px-4 py-3 flex justify-center items-center mr-4"
              @click="showResults()"
          >
            Résultats
          </button>
        </div>
      </div>
      <div v-else class="result flex flex-col items-center justify-center p-6 lg:p-20">
        <CircleProgressBar :value="correctAnswersPercentage()" :max="100" :width="300" :colorFilled="color()" :colorUnfilled="color()" :rounded="true"
                           class="font-bold text-4xl text-primary-500">
          {{ correctAnswers() }} / {{ quiz.questions.length }}
        </CircleProgressBar>
        <div class="text-primary-0 w-full text-center text-2xl py-8">
          Vous avez eu <b>{{ correctAnswersPercentage() }}%</b> de réponses
          correctes.
          <span
              v-if="correctAnswersPercentage() > quiz.minimumScore"
              class="text-4xl"
          >
          <br/><br/>
          Bravo !
        </span>
          <span v-else class="text-3xl">
          <br/><br/>
          Entrainez vous davantage !
        </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import {setStorage, getStorage} from "@/composables/storage";
import {textRule, emailRule} from "@/composables/rules";
import {CircleProgressBar, Login} from '#components';
import {onMounted, ref} from "vue";

const route = useRoute()
const {$quizApi, $tailwindCSS, $socket} = useNuxtApp()
const name = ref('');
const email = ref('');
const logged = ref(null);
const quiz = ref(null);
const currentQuestion = ref(0)
const isNexStepAvailable = ref(false);
const showResult = ref(false);
const validationColors = ref(null);
const socketMessage = ref({message: '', wait: false});

validationColors.value = $tailwindCSS.colors.validation

// Check if user is logged



async function init() {
  logged.value = true
  if (getStorage('quiz-' + route.params.id) !== null) {
    const quizStorage = getStorage('quiz-' + route.params.id)
    if (null !== quizStorage) {
      quiz.value = quizStorage
      const firstQuestion = quizStorage.questions.find((q) => !q.validated)
      if (firstQuestion) {
        currentQuestion.value = quizStorage.questions.indexOf(firstQuestion)
      } else {
        currentQuestion.value = quizStorage.questions.length - 1
        showResult.value = true
      }
    }
  }
  if (quiz.value === null) {
    quiz.value = await $quizApi.getQuiz(route.params.id)
    if (quiz.value !== null && quiz.value.questions !== null) {

      quiz.value.questions.forEach((question) => {
        question.answered = false
        question.validated = false
        question.isCorrectAnswer = false
        question.answers.forEach((answer) => {
          answer.selected = false
        })
      })
    }
    setStorage('quiz-' + route.params.id, quiz.value)
  }

  $socket.emit('connectedToQuiz', {
    name: getStorage('name'),
    email: getStorage('email'),
    quizId: route.params.id,
    quiz: quiz.value,
    currentQuestion: currentQuestion.value,
  })
}

onMounted(async () => {
  if (getStorage('name') !== null && getStorage('email') !== null) {
    await init();
  }

  $socket.on('answered', (data) => {
    quiz.value = data.quiz
    setStorage('quiz-' + route.params.id, quiz.value)
  })
  $socket.on('waintingPlayers', (data) => {
    if (quiz.value.questions[currentQuestion.value].answered) {
      socketMessage.value = data
    }
  })
  $socket.on('allPlayersAnswered', (data) => {
    if (data.currentQuestion === currentQuestion.value) {
      isNexStepAvailable.value = true
    }
  })
  $socket.on('nextQuestion', (data) => {
    nextQuestion(data)
  })
  $socket.on('currentQuestion', (data) => {
    currentQuestion.value = data.currentQuestion
  })
})

/*
    ////// COMPUTED ///////
*/
function isLastQuestion() {
  return currentQuestion.value === quiz.value.questions.length - 1
}

function canValidate() {
  return quiz.value.questions[currentQuestion.value].answered
}

function correctAnswersPercentage() {
  return Math.round(
      (correctAnswers() / quiz.value.questions.length) * 100
  )
}

function correctAnswers() {
  return quiz.value.questions.filter((question) => question.isCorrectAnswer).length
}

function color() {
  return correctAnswersPercentage() >= quiz.value.minimumScore
      ? validationColors.value.success
      : validationColors.value.error
}

/*
    ////// METHOD ///////
*/
async function submitLogin(data) {
  setStorage('name', data.login);
  setStorage('email', data.password);
  await init();
}


function selectAnswer(answer) {
  if (quiz.value.questions[currentQuestion.value].validated) {
    return
  }
  quiz.value.questions[currentQuestion.value].answers.forEach((answer) => {
    answer.selected = false
  })
  quiz.value.questions[currentQuestion.value].answered = true
  quiz.value.questions[currentQuestion.value].answers[answer].selected = true
  quiz.value.questions[currentQuestion.value].isCorrectAnswer = quiz.value.questions[currentQuestion.value].answers[answer].isCorrect
}

function validateAnswer() {
  $socket.emit('answer', {
    quiz: quiz.value,
  })
}

function nextQuestion(data) {
  if (isNexStepAvailable.value) {
    currentQuestion.value = data.currentQuestion;
    isNexStepAvailable.value = false
  }
}

function showResults() {
  showResult.value = true
  quiz.value.questions.forEach(async (question) => {
    const quizAnswer = {
      name: getStorage('name'),
      email: getStorage('email'),
      quiz: quiz.value.name,
      quizId: route.params.id,
      question: question.text,
      answer: question.answers.find((answer) => answer.selected).text,
      isCorrect: question.isCorrectAnswer,
      createdAt: new Date(),
    }
    await $quizApi.createQuizAnswer(quizAnswer)
  })
}
</script>
<style lang="scss">
.quiz,
.result {
  height: calc(100vh - 64px);
}
</style>
