<template>
  <v-container fluid>
    <v-row>
      <v-alert v-model="isAlert" type="info" dense dismissible>
        {{ alertMessage }}
      </v-alert>
    </v-row>
    <v-row justify="center">
      <v-card color="accent" class="text-center" width="100%">
        {{ username }}さんの順位 {{ rank }}位
        <v-card-actions>
          <v-img
            src="wide-default.png"
            height="30px"
            contain
            @click="lineshare"
          />
        </v-card-actions>
      </v-card>
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
import { FlexMessage } from '@line/bot-sdk';
import { kintoneStore } from '~/store';
import { SimilarityWithUserName } from '~/store/kintone';

@Component
export default class IndexComponent extends Vue {
  username = 'テスト';
  rank = '0';
  profile: any;
  isAlert = false;
  alertMessage = '';
  loginUserInfo?: SimilarityWithUserName;

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
            this.loginUserInfo = this.getLoginUserInfo(
              this.profile.displayName
            );
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

  getRankByLineDisplayName(lineDisplayName: string): string {
    const rank =
      kintoneStore.similarityRecords.findIndex(
        (record) => record.lineDisplayName === lineDisplayName
      ) + 1;
    return rank.toString();
  }

  getLoginUserInfo(
    lineDisplayName: string
  ): SimilarityWithUserName | undefined {
    return kintoneStore.similarityRecords.find(
      (record) => record.lineDisplayName === lineDisplayName
    );
  }

  async lineshare() {
    console.log(`lineshare`);
    if (liff.isApiAvailable('shareTargetPicker')) {
      try {
        await liff.shareTargetPicker([
          this.createFlexMessage(
            this.loginUserInfo?.imageUrl || '',
            this.loginUserInfo?.imageUrl || '',
            this.loginUserInfo?.linePictureUrl || ''
          )
        ]);
        console.log(`shareTargetPicker success!`);
      } catch (error) {
        console.log(`shareTargetPicker failed!`);
      }
    } else {
      console.log(`shareTargetPicker not available`);
      this.alertMessage = 'すまん、端末が対応してへんみたいやわ';
      this.isAlert = true;
    }
  }

  createFlexMessage(
    uploadImageUrl: string,
    playerImageUrl: string,
    linePictureUrl: string
  ): FlexMessage {
    return {
      type: 'flex',
      altText: 'This is a Flex Message',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'image',
                  url: uploadImageUrl,
                  size: '5xl',
                  aspectMode: 'cover',
                  aspectRatio: '1:1',
                  gravity: 'center',
                  flex: 1
                },
                {
                  type: 'image',
                  url: playerImageUrl,
                  flex: 1,
                  gravity: 'center',
                  size: '5xl',
                  aspectRatio: '1:1',
                  aspectMode: 'cover'
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'image',
                      url: linePictureUrl,
                      aspectMode: 'cover',
                      size: 'full'
                    }
                  ],
                  cornerRadius: '100px',
                  width: '72px',
                  height: '72px'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: '私と鈴木選手は',
                      size: 'md',
                      wrap: true
                    },
                    {
                      type: 'text',
                      text: 'そっくり度'
                    },
                    {
                      type: 'text',
                      text: '90 点',
                      align: 'end',
                      size: 'xl'
                    }
                  ]
                }
              ],
              spacing: 'xl',
              paddingAll: '20px'
            }
          ],
          paddingAll: '0px'
        }
      }
    };
  }
}
</script>
