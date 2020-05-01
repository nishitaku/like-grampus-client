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
              <v-list-item :key="record.id">
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
                v-if="index + 1 < items.length"
                :key="record.id"
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
import { kintoneStore } from '~/store'

interface SimilarityWithUserName {
  id: string
  lineDisplayName: string
  linePictureUrl: string
  className: string
  score: string
  imageUrl: string
}

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

  get similarityRecordsWithUserName() {
    const similarityRecords = kintoneStore.similarityRecords
    const userRecords = kintoneStore.userRecords
    const result: SimilarityWithUserName[] = similarityRecords.map(
      (similarityRecord) => {
        const matchedUser = userRecords.find(
          (userRecord) =>
            userRecord.line_user_id.value ===
            similarityRecord.line_user_id.value
        )
        const record: SimilarityWithUserName = {
          id: similarityRecord.$id.value,
          lineDisplayName: matchedUser
            ? matchedUser.line_display_name.value
            : '',
          linePictureUrl: matchedUser ? matchedUser.line_picture_url.value : '',
          className: similarityRecord.class_name.value,
          score: similarityRecord.score.value,
          imageUrl: similarityRecord.image_url.value
        }
        return record
      }
    )
    return result
  }

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

      await kintoneStore.getSimilarityRecords()
      await kintoneStore.getUserRecords()
    } catch (err) {
      console.error(`${err}`)
    }
  }
}
</script>
