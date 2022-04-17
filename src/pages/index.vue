<script setup>
import useGame from '../store/modules/game'
import HelloWorld from '../components/HelloWorld.vue'

const Game = useGame()
</script>

<template>
  <div className="view-home">
    <HelloWorld msg="Hello Vue 3 + Vite" />
    CP Balance: {{ Game.cp }}
  </div>
</template>
