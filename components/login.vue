<template>
  <!-- component -->
  <div class="h-screen md:flex">
    <div
        class="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr bg-primary-0 justify-around items-center hidden">
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
            v-model="_login"
            :label="_loginLabel"
            :rules=_loginRules
            rounded=50
            :prepend-inner-icon="_loginIcon"
            variant="outlined"
            class="w-full mt-5 rounded-2xl"
            required
        />
        <v-text-field
            v-model="_password"
            :label="_passwordLabel"
            :rules=_passwordRules
            rounded-full
            :prepend-inner-icon="_passwordIcon"
            variant="outlined"
            class="w-full mt-5 rounded-2xl"
            :type="_isPasswordField ? 'password' : 'text'"
            required
        />
        <button
            @click.prevent="submit()"
            class="block w-full bg-secondary-0 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
          Accéder au quiz
        </button>
        <div v-if="_errorMessage !== ''"
        class="text-center text-validation-error mx-4">
          <span class="text-lg">{{ _errorMessage }}</span> <br/>
        </div>
      </v-form>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import {textRule, emailRule} from "@/composables/rules";
const contactForm = ref(null);
const emit = defineEmits(['validated'])

const _login= ref("");
const _password= ref("");
const _loginLabel= ref("Nom complet");
const _passwordLabel= ref("Email");
const _loginRules= ref([]);
const _passwordRules= ref([]);
const _loginIcon= ref("mdi-email");
const _passwordIcon= ref("mdi-lock");
const _errorMessage= ref("");
const _isPasswordField= ref(false);

const props = defineProps({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
    required: false,
    default: '',
  },
  loginLabel: {
    type: String,
    required: true,
  },
  passwordLabel: {
    type: String,
    required: true,
  },
  loginRules: {
    type: Array,
    required: false,
    default: () => textRule(),
  },
  passwordRules: {
    type: Array,
    required: false,
    default: () => emailRule(),
  },
  loginIcon: {
    type: String,
    required: false,
    default: 'mdi-email',
  },
  passwordIcon: {
    type: String,
    required: false,
    default: 'mdi-lock',
  },
  isPasswordField: {
    type: Boolean,
    required: false,
    default: false,
  },
});

onMounted(() => {
_login.value = props.login;
_password.value = props.password;
_loginLabel.value = props.loginLabel;
_passwordLabel.value = props.passwordLabel;
_loginRules.value = props.loginRules;
_passwordRules.value = props.passwordRules;
_errorMessage.value = props.errorMessage;
_loginIcon.value = props.loginIcon;
_passwordIcon.value = props.passwordIcon;
_isPasswordField.value = props.isPasswordField;
});

function submit() {
  const promise = contactForm.value.validate()
  promise.then((success) => {
    if (success.valid) {
      emit('validated', {
        login: _login.value,
        password: _password.value,
      });
    }
  })
}
</script>
