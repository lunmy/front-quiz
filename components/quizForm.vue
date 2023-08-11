<template>
  <div>
    <v-form ref="editForm" class="bg-white">
      <div class="grid grid-cols-2 gap-6">
        <v-text-field
            v-model="_quiz.name"
            label="Nom du quiz"
            :rules="[textRule]"
            rounded=50
            variant="outlined"
            class="w-full mt-5 rounded-2xl"
            required
        />
        <div class="flex flex-col">
          <v-label class="mt-4">Score minimum {{ _quiz.minimumScore }}</v-label>
          <v-slider
              v-model="_quiz.minimumScore"
              min="0"
              max="100"
              step="1"
              thumb-label
          ></v-slider>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-6">
        <div v-for="(question, index) in _quiz.questions" :key="index">
          <h2 class="text-lg font-bold text-secondary-admin-0 mb-6">Question {{ index + 1 }}</h2>
          <v-text-field
              v-model="question.text"
              label="Question"
              :rules="[textRule]"
              rounded=50
              variant="outlined"
              class="w-full mt-5 rounded-2xl"
              required
          />
          <v-textarea v-model="question.explanation"
                      label="Explication"
                      :rules="[textRule]"
                      rounded=50
                      variant="outlined"
                      class="w-full mt-5 rounded-2xl"
                      required
          ></v-textarea>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="(answer, index) in question.answers" :key="index">
              <v-text-field
                  v-model="answer.text"
                  label="Réponse"
                  :rules="[textRule]"
                  rounded=50
                  variant="outlined"
                  class="w-full rounded-2xl"
                  required
              />
              <v-switch
                  label="Bonne réponse"
                  v-model="answer.isCorrect"
              ></v-switch>
            </div>
          </div>
          <button class="bg-secondary-admin-0 text-white rounded-xl px-4 py-3 flex justify-center items-center mr-4"
                  @click="addAnswer(question)">
            Ajouter une réponse
          </button>
          <hr class="my-5"/>
        </div>
      </div>
      <button class="bg-primary-admin-0 text-white rounded-xl px-4 py-3 w-auto mb-6"
              @click="addQuestion()">
        Ajouter une question
      </button>
    </v-form>
    <div class="fixed bottom-4 right-2 flex flex-row">
      <button class="bg-primary-admin-0 text-white rounded-xl px-4 py-3 flex justify-center items-center mr-4"
              @click="validateForm()">
        Valider
      </button>
      <button class="bg-secondary-admin-0 text-white rounded-xl px-4 py-3 flex justify-center items-center mr-4"
              @click="cancel()">
        Annuler
      </button>
    </div>
  </div>
</template>
<script setup>
import {textRule} from "@/composables/rules";
import {generateString} from "@/composables/utils";
import {ref} from "vue";
const _quiz = ref(null)
const {$quizApi} = useNuxtApp()
const route = useRoute()
const router = useRouter()
const editForm = ref(null);


const props = defineProps({
  quiz: {
    type: Object,
    required: true
  },
  newQuiz: {
    type: Boolean,
    required: false,
    default: false
  }
})
  _quiz.value = props.quiz



const addAnswer = (question) => {
  question.answers.push({
    text: '',
    isCorrect: false,
    position: question.answers.length + 1
  })
}
const addQuestion = () => {
  _quiz.value.questions.push({
    text: '',
    explanation: '',
    position: _quiz.value.questions.length + 1,
    answers: [
      {
        text: '',
        isCorrect: false,
        position: 1
      }
    ]
  })
}
const validateForm = () => {
  const promise = editForm.value.validate()
  promise.then((success) => {
    if (success.valid) {
      if(props.newQuiz) {
        _quiz.value.adminLogin = generateString(16)
        _quiz.value.adminPassword = generateString(16)
        $quizApi.createQuiz(_quiz.value)
      } else {
        $quizApi.updateQuiz(_quiz.value)
      }
      router.push('/admin')
    }
  })
}
const cancel = () => {
  router.push('/admin')
}
</script>
