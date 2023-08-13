<template>
<Login
    :login="name"
    loginLabel="Nom complet"
    :loginRules="[textRule]"
    :password="email"
    passwordLabel="Email"
    :passwordRules="[textRule, emailRule]"
    @validated="submitLogin"/>
</template>
<script setup lang="js">

import {ref} from "vue";
import {setStorage, getStorage} from "@/composables/storage";
import {textRule, emailRule} from "@/composables/rules";

const name = ref('');
const email = ref('');
async function submitLogin(data) {
  setStorage('name', data.login);
  setStorage('email', data.password);
  await init();
}

</script>
