<template>
  <v-container>
    <v-row justify="center">
      <div class="text-center">{{ username }}さんの順位 {{ rank }}位</div>
    </v-row>
    <v-row
      v-for="(record, index) in similarityRecordsWithUserName"
      :key="`first-${record.id}`"
      justify="center"
    >
      <v-card color="teal darken-3" class="mt-4 px-2">
        <v-row>
          <v-col cols="2" align-self="center">
            <v-img :src="createRankingImagePath(index)" />
          </v-col>
          <v-col cols="2" align-self="center">
            <v-avatar color="white">
              <img v-if="record.linePictureUrl" :src="record.linePictureUrl" />
              <v-icon v-else color="blue" large>mdi-account-circle</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="6" align-self="center"
            >{{ record.lineDisplayName }}さん</v-col
          >
          <v-col cols="2" align-self="center">{{ record.score }}</v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { kintoneStore } from '~/store';

@Component
export default class IndexComponent extends Vue {
  username = 'テスト';
  rank = '5';

  get similarityRecordsWithUserName() {
    return kintoneStore.similarityRecords;
  }

  async mounted() {
    try {
      liff.init(
        { liffId: process.env.LIFF_ID || '' },
        async (data) => {
          if (liff.isLoggedIn()) {
            console.log(`LIFF logged in`, data);
            const profile = await liff.getProfile();
            this.username = profile.displayName;
          } else {
            console.log(`LIFF not logged in`);
          }
        },
        (err) => {
          console.log(`LIFF initialization failed`, err);
        }
      );

      await kintoneStore.getSimilarityRecords(10);
    } catch (err) {
      console.error(`${err}`);
    }
  }

  createRankingImagePath(index: number): string {
    const indexStr = ('00' + (index + 1)).slice(-2);
    return `icon-rank-tk02_b${indexStr}.png`;
  }
}
</script>
