<template>
  <v-container>
    <v-row justify="center">
      <div class="text-center">{{ username }}さんの順位 {{ rank }}位</div>
    </v-row>
    <v-row justify="center">
      <v-card width="80%">
        <v-list two-line disabled>
          <v-list-item-group>
            <template v-for="(record, index) in similarityRecordsWithUserName">
              <v-list-item :key="`first-${record.id}`">
                <v-list-item-icon>
                  <v-icon>mdi-star</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="`${record.lineDisplayName} さん`"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="record.score"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar>
                  <v-img :src="record.imageUrl"></v-img>
                </v-list-item-avatar>
              </v-list-item>
              <v-divider
                v-if="index + 1 < similarityRecordsWithUserName.length"
                :key="`second-${record.id}`"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
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

      await kintoneStore.getSimilarityRecords();
    } catch (err) {
      console.error(`${err}`);
    }
  }
}
</script>
