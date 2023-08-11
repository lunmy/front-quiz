<template>
  <div>
    <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="quizzes"
        class="elevation-1"
    >
      <template #[`item.admin`]="{ item }">
        <nuxt-link target="_blank" :to="`/admin/${item.selectable['@id'].split('/').pop()}`">
          <v-icon
              class="text-primary-admin-0"
              icon="mdi-link"
          ></v-icon>
        </nuxt-link>

        <span class="cursor-pointer ml-4"
              @click="copy(`/admin/quiz/${item.selectable['@id'].split('/').pop()}`)">
              <v-icon
                  class="text-secondary-admin-0"
                  icon="mdi-content-copy"
              ></v-icon>
        </span>
      </template>
      <template #[`item.url`]="{ item }">
        <nuxt-link target="_blank" :to="`/quiz/${item.selectable['@id'].split('/').pop()}`">
          <v-icon
              class="text-primary-admin-0"
              icon="mdi-link"
          ></v-icon>
        </nuxt-link>

        <span class="cursor-pointer ml-4"
              @click="copy(`/quiz/${item.selectable['@id'].split('/').pop()}`)">
              <v-icon
                  class="text-secondary-admin-0"
                  icon="mdi-content-copy"
              ></v-icon>
        </span>
      </template>
      <template #[`item.questions`]="{ item }">
        {{ item.selectable.questions.length }}
      </template>

      <template #[`item.actions`]="{ item }">
        <nuxt-link :to="`/admin/quiz/${item.selectable['@id'].split('/').pop()}/edit`">
          <v-icon
              class="text-primary-admin-0"
              icon="mdi-pencil"
          ></v-icon>
        </nuxt-link>
        <span class="cursor-pointer ml-4"
              @click="deleteQuiz(item.selectable['@id'])">
              <v-icon
                  class="text-secondary-admin-0"
                  icon="mdi-delete"
              ></v-icon>
        </span>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
import {VDataTable} from 'vuetify/labs/VDataTable'

const {$quizApi} = useNuxtApp()

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'admin'
})
const itemsPerPage = ref(20)
const headers = ref([
  {title: 'Nom', key: 'name'},
  {title: 'Score mini', key: 'minimumScore'},
  {title: 'Url', key: 'url'},
  {title: 'Admin', key: 'admin'},
  {title: 'Questions', key: 'questions'},
  {title: 'Login admin', key: 'adminLogin'},
  {title: 'Mot de passe', key: 'adminPassword'},
  {title: 'Actions', key: 'actions'},
])

const page = ref(1)
const quizzes = ref([]);

const q = await $quizApi.getQuizzes({page: page.value})
quizzes.value = q['hydra:member']

function copy(text) {
  const config = useRuntimeConfig()
  navigator.clipboard.writeText(`${config.public.appUrl}${text}`);
}

async function deleteQuiz(id) {
  await $quizApi.deleteQuiz(id)
  quizzes.value = quizzes.value.filter((quiz) => quiz['@id'] !== id)
}

</script>
