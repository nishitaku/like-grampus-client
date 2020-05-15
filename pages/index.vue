<template>
  <v-container fluid>
    <v-row justify="center">
      <v-card color="accent" class="text-center" width="100%"
        >{{ username }}さんの順位 {{ rank }}位</v-card
      >
    </v-row>
    <v-row
      v-for="(record, index) in similarityRecordsWithUserName"
      :key="`first-${record.id}`"
      justify="center"
      align="center"
    >
      <v-card
        color="secondary"
        width="100%"
        max-width="500px"
        class="mt-4 px-3"
      >
        <v-row dense>
          <v-col cols="2" align-self="center">
            <v-img :src="createRankingImagePath(index)" />
          </v-col>
          <v-col cols="2" align-self="center">
            <v-avatar color="white">
              <img v-if="record.linePictureUrl" :src="record.linePictureUrl" />
              <v-icon v-else color="blue" large>mdi-account-circle</v-icon>
            </v-avatar>
          </v-col>
          <v-col
            cols="6"
            align-self="center"
            class="font-weight-medium subtitle-1"
          >
            {{ record.lineDisplayName }}
          </v-col>
          <v-col
            cols="2"
            align-self="center"
            class="text-center font-weight-bold title"
          >
            {{ createScoreStr(record.score) }}
          </v-col>
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
  rank = '0';
  profile: any;

  get similarityRecordsWithUserName() {
    return kintoneStore.similarityRecords;
  }

  async mounted() {
    try {
      await kintoneStore.getSimilarityRecords(10);

      liff.init(
        { liffId: process.env.LIFF_ID || '' },
        async (data) => {
          if (liff.isLoggedIn()) {
            console.log(`LIFF logged in`, data);
            this.profile = await liff.getProfile();
            this.username = this.profile.displayName;
            this.rank = this.getRankByLineDisplayName(this.profile.displayName);
          } else {
            console.log(`LIFF not logged in`);
          }
        },
        (err) => {
          console.log(`LIFF initialization failed`, err);
        }
      );
    } catch (err) {
      console.error(`${err}`);
    }
  }

  createRankingImagePath(index: number): string {
    const indexStr = ('00' + (index + 1)).slice(-2);
    return `icon-rank-tk02_b${indexStr}.png`;
  }

  createScoreStr(score: string): string {
    return `${(Number(score) * 100).toFixed(0)} 点`;
  }

  getRankByLineDisplayName(lineDisplayName: string) {
    const rank =
      kintoneStore.similarityRecords.findIndex(
        (record) => record.lineDisplayName === lineDisplayName
      ) + 1;
    console.log(`rank=${rank}`);
    return rank.toString();
  }
}
</script>
