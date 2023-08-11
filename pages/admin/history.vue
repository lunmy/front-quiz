<template>
  <h1>History</h1>
</template>
<script setup>
definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'admin'
})
</script>
