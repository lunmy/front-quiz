<template>
  <Login
      :login="login"
      loginLabel="Email"
      :loginRules="[emailRule]"
      :password="password"
      passwordLabel="Mot de passe"
      :passwordRules="[textRule]"
      :isPasswordField="true"
      @validated="submitLogin"/>
</template>
<script setup>
import {textRule, emailRule} from "@/composables/rules";
import {setStorage, getStorage} from "@/composables/storage";
import jwt_decode from "jwt-decode";

const {$quizApi} = useNuxtApp()
const router = useRouter();

const login = ref('anthony@lunamy.com'); // email
const password = ref('super_admin');


async function submitLogin(data) {
  const res = await $quizApi.login({username: data.login, password: data.password})
  if (res) {
    setStorage('user', jwt_decode(res.token));
    router.push('/admin');
  }
}

</script>
