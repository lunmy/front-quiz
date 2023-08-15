<template>
  <div v-if="null !== quiz">
    <div class="w-full bg-primary-0 p-4 text-center h-16 mb-16">
      <span class="text-2xl text-white">{{ quiz.name }}</span>
    </div>
    <div v-if="!showResults">
      <div class="flex flex-row justify-between w-1/3 lg:w-1/12 mx-auto">
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
      <div class="lg:px-20 grid grid-cols lg:grid-cols-4 gap-12">
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
            v-if="isNextStepAvailable && !isLastQuestion()"
            class="bg-secondary-0 text-white rounded-xl px-4 py-3 flex justify-center items-center mr-4"
            @click="nextQuestion()"
        >
          Question suivante
        </button>
        <button
            v-if="isLastQuestion()"
            class="bg-secondary-0 text-white rounded-xl px-4 py-3 flex justify-center items-center mr-4"
            @click="summary()"
        >
          Résultats
        </button>
      </div>
    </div>
    <div v-else class="mb-12">
      <div ref="pdfSection">
        <h2 class="text-center text-2xl mb-8">Résultats</h2>
        <div class="flex w-full lg:w-1/4 border border-primary-0 rounded-xl mx-auto overflow-hidden ">
        <span class="text-primary-0 p-2 text-center w-1/2 cursor-pointer"
              :class="{'bg-primary-0 text-white ' : table=== 'answers'}"
              @click="table = 'answers'"
        >
          Par question</span>
          <span class="text-primary-0 p-2 text-center w-1/2 cursor-pointer"
                :class="{'bg-primary-0 text-white ' : table=== 'player'}"
                @click="table = 'player'"
          > Par joueur</span>
        </div>

        <div v-if="table==='answers'" v-for="(question, index) in quiz.questions" :key="index" class="py-8 lg:px-8">
          <div class="border">
            <div class="rounded-xl text-xl font-bold text-center bg-primary-0 text-white p-4 mb-4">{{
                question.text
              }}
            </div>
            <table class="w-full">
              <tbody>
              <tr v-for="player in playersResults" :key="`resultat${index}`" class="border-b">
                <td class="w-3/12 p-2">{{ player.name }}</td>
                <td class="w-9/12 p-2"><span :class="{
              'text-validation-success': getSelectedAnswerIsCorrect(player.quiz.questions[index]),
              'text-validation-error': !getSelectedAnswerIsCorrect(player.quiz.questions[index]),
            }">{{ getSelectedAnswer(player.quiz.questions[index]) }}</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="table==='player'" v-for="(player, index) in playersResults" :key="index" class="py-8 lg:px-8">
          <div class="border">
            <div class="rounded-xl text-xl font-bold text-center bg-primary-0 text-white p-4 mb-4">{{
                player.name
              }}
            </div>
            <table class="w-full">
              <tbody>
              <tr v-for="(question, qindex) in quiz.questions" :key="`question-${qindex}`" class="border-b">
                <td class="w-1/2 p-2">{{ question.text }}</td>
                <td class="w-1/2 p-2"><span :class="{
              'text-validation-success': getSelectedAnswerIsCorrect(player.quiz.questions[qindex]),
              'text-validation-error': !getSelectedAnswerIsCorrect(player.quiz.questions[qindex]),
            }">{{ getSelectedAnswer(player.quiz.questions[qindex]) }}</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="fixed bottom-0 right-0 px-8 py-4">
        <button
            class="bg-primary-0 text-white rounded-xl px-4 py-3 flex justify-center items-center"
            @click="print(table)"
        >
          Imprimer les résultats
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from "vue";
import {exportToPDF} from '#imports'

const {$quizApi, $socket} = useNuxtApp()
const route = useRoute()
const name = ref('admin');
const email = ref('admin');
const errorMessage = ref('');
const quiz = ref(null);
const question = ref(null);
const currentQuestion = ref(0)
const players = ref([])
const isNextStepAvailable = ref(false)
const showResults = ref(false)
const playersResults = ref(null)
const table = ref('answers')
const pdfSection = ref(null);

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

try {
  quiz.value = await $quizApi.getQuiz(route.params.id)
} catch (e) {
  console.log(e)
  errorMessage.value = e.message
}

if (getStorage('quiz-' + route.params.id) !== null) {
  const quizStorage = getStorage('quiz-' + quiz.value['@id'].split('/').pop())
  if (quizStorage !== null) {
    quiz.value = quizStorage
  }
}
question.value = quiz.value.questions[currentQuestion.value]

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
  $socket.on('quizSummaryResults', (data) => {
    playersResults.value = data.players
    showResults.value = true
  })

  $socket.on('currentQuestion', (data) => {
    currentQuestion.value = data.currentQuestion
    question.value = quiz.value.questions[currentQuestion.value]
  })

})


function selectedAnswer(q) {
  // Get selected Answer
  if (q.questions[currentQuestion.value].validated) {
    return q.questions[currentQuestion.value].answers.find((a) => a.selected).text
  }
  return 'En attente de réponse'
}

function isCorrectAnswer(q) {
  if (q.questions !== null && q.questions[currentQuestion.value].validated) {
    return q.questions[currentQuestion.value].answers.find((a) => a.selected).isCorrect
  }
  return null;
}

function nextQuestion() {
  currentQuestion.value++
  question.value = quiz.value.questions[currentQuestion.value]
  isNextStepAvailable.value = false
  $socket.emit('nextQuestion', {
    currentQuestion: currentQuestion.value,
    quizId: route.params.id
  })
}

function isLastQuestion() {
  return currentQuestion.value >= quiz.value.questions.length - 1
}

function summary() {
  $socket.emit('quizSummary', {
    quizId: route.params.id
  })
  isNextStepAvailable.value = false
  showResults.value = true
}

function getSelectedAnswer(q) {
  return q.answers.find((a) => a.selected).text
}

function getSelectedAnswerIsCorrect(q) {
  return q.answers.find((a) => a.selected).isCorrect
}

function print(table) {
  exportToPDF(`${quiz.value.name}-${table}.pdf`, pdfSection.value, {
        unit: 'mm',
        format: 'A4',
        orientation: 'portrait',
      },
      {
        margin: [15, 15],
        image: {type: 'png', quality: 1},
        html2canvas: {
          scale: 0.15,
          letterRendering: true,
        },
      })
}

</script>
