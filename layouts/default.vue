<template>
  <v-app dark>
    <v-content>
      <v-app-bar fixed app color="primary">
        <v-toolbar-title class="font-weight-bold" v-text="title" />
      </v-app-bar>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class DefaultComponent extends Vue {
  title = '総合ランキング';
}
</script>
