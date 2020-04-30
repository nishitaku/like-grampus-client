<template>
  <v-container>
    <v-row justify="center">
      <div class="text-center">{{ username }}さんの順位 {{ rank }}位</div>
    </v-row>
    <v-row justify="center">
      <div class="text-center">{{ rankingData }}</div>
    </v-row>
    <v-row justify="center">
      <v-card width="80%">
        <v-list two-line disabled>
          <v-list-item-group>
            <template v-for="(item, index) in items">
              <v-list-item :key="item.uploadImgUrl">
                <v-list-item-icon>
                  <v-icon>mdi-star</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="`${item.displayName} さん`"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="item.score"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar>
                  <v-img :src="item.uploadImgUrl"></v-img>
                </v-list-item-avatar>
              </v-list-item>
              <v-divider
                v-if="index + 1 < items.length"
                :key="item.uploadImgUrl"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import axios from 'axios'

@Component
export default class IndexComponent extends Vue {
  username = 'テスト'
  rank = '5'
  items = [
    {
      displayName: 'AAA',
      score: 0.9,
      uploadImgUrl:
        'https://upload-images.s3.jp-tok.cloud-object-storage.appdomain.cloud/f33e07cade6721fd86c7af1676d2a6.jpg'
    },
    {
      displayName: 'AAA',
      score: 0.9,
      uploadImgUrl:
        'https://upload-images.s3.jp-tok.cloud-object-storage.appdomain.cloud/f33e07cade6721fd86c7af1676d2a6.jpg'
    },
    {
      displayName: 'AAA',
      score: 0.9,
      uploadImgUrl:
        'https://upload-images.s3.jp-tok.cloud-object-storage.appdomain.cloud/f33e07cade6721fd86c7af1676d2a6.jpg'
    }
  ]

  rankingData: any = {}

  async mounted() {
    try {
      liff.init(
        { liffId: process.env.LIFF_ID || '' },
        async (data) => {
          if (liff.isLoggedIn()) {
            console.log(`LIFF logged in`, data)
            const profile = await liff.getProfile()
            this.username = profile.displayName
          } else {
            console.log(`LIFF not logged in`)
          }
        },
        (err) => {
          console.log(`LIFF initialization failed`, err)
        }
      )

      const response = await axios.get('.netlify/functions/hello')
      console.log(`reponse=${JSON.stringify(response)}`)
      this.rankingData = response
    } catch (err) {
      console.error(`${err}`)
    }
  }
}
</script>
