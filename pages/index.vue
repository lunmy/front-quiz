<template>
  <!-- component -->
  <div class="h-screen md:flex">
    <div
        class="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr bg-primary-0  i justify-around items-center hidden">
      <div>
        <h1 class="text-white font-bold text-4xl font-sans">Papillons Blancs de Dunkerque</h1>
        <p class="text-white mt-1">Quiz en ligne </p>

      </div>
      <div class="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      <div class="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      <div class="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      <div class="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
    </div>
    <div class="flex md:w-1/2 justify-center py-10 items-center bg-white">
      <v-form ref="contactForm" class="bg-white w-1/2">
        <div class="flex justify-center mb-5">
          <img src="/img/logo.png" alt="logo" class="w-20 h-20 mr-2 inline-block"/>
        </div>
        <v-text-field
            v-model="name"
            label="Nom complet"
            :rules="[textRule]"
            rounded=50
            prepend-inner-icon="mdi-account"
            variant="outlined"
            class="w-full mt-5 rounded-2xl"
            required
        />
        <v-text-field
            v-model="email"
            label="Email"
            rounded-full
            prepend-inner-icon="mdi-email"
            variant="outlined"
            class="w-full mt-5 rounded-2xl"
            required
            :rules=[emailRule]
        />
        <button
            @click.prevent="submit()"
            class="block w-full bg-secondary-0 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
          Accéder au quiz
        </button>
      </v-form>
    </div>
  </div>
</template>
<script setup>
import {textRule, emailRule} from "@/composables/rules";
import { setStorage , getStorage } from "@/composables/storage";
const router = useRouter();
const name = ref('Jean DUPOND');
const email = ref('a@a.fr');
const contactForm = ref(null);
const sessionDuration = (60 * 24)
function submit() {
  const promise = contactForm.value.validate()
  promise.then((success) => {
    if (success.valid) {
      setStorage('name',this.name);
      setStorage('email', this.email);
      router.push('/quiz');
    }
  })
}
</script>
