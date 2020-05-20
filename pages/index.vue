<template>
  <v-container fluid>
    <v-row>
      <v-alert v-model="isAlert" type="info" dense dismissible>
        {{ alertMessage }}
      </v-alert>
    </v-row>
    <v-row
      v-for="(record, index) in similarityRecordsWithUserName"
      :key="`first-${record.id}`"
      justify="center"
      align="center"
    >
      <v-card
        :color="record.lineDisplayName == username ? 'accent' : 'secondary'"
        width="100%"
        max-width="500px"
        class="mt-4 px-3"
        @click="openDialog(record)"
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
          <v-col cols="5" align-self="center" class="pl-5">
            <v-row class="font-weight-bold subtitle-1">
              {{ record.lineDisplayName }}
            </v-row>
            <v-row class="font-weight-medium caption">
              {{ playerNameMap.get(record.className) }} 選手
            </v-row>
          </v-col>
          <v-col
            cols="3"
            align-self="center"
            class="text-center font-weight-bold title"
          >
            {{ createScoreStr(record.score) }}
          </v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-row justify="center" align="center" class="mt-5">
      <v-img src="wide-default.png" height="30px" contain @click="lineshare" />
    </v-row>
    <v-dialog v-model="dialog" max-width="290">
      <v-card color="secondary">
        <v-card-title></v-card-title>
        <v-card-text>
          <v-img :src="dialogLineUserImageUrl" height="250"></v-img>
          <v-img :src="dialogPlayerImageUrl" height="250"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" @click="dialog = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

  dialog = false;
  dialogLineUserImageUrl = '';
  dialogPlayerImageUrl = '';

  playerNameMap: Map<string, string> = new Map([
    ['abehiroyuki_11', '阿部浩之'],
    ['akiyamayosuke_14', '秋山陽介'],
    ['aokiryota_19', '青木亮太'],
    ['ariajasuru_9', '長谷川アーリアジャスール'],
    ['chibakazuhiko_5', '千葉和彦'],
    ['fujiiharuya_13', '藤井陽也'],
    ['inagakisyo_15', '稲垣祥'],
    ['ishidaryotaro_24', '石田凌太郎'],
    ['jo_7', 'ジョー'],
    ['langerak_1', 'ランゲラック'],
    ['maedanaoki_25', '前田直輝'],
    ['maruyamayuichi_3', '丸山祐市'],
    ['mateus_16', 'マテウス'],
    ['mitsuidaiki_22', '三井大輝'],
    ['miyaharakazuya_6', '宮原和也'],
    ['nakatanishinnosuke_4', '中谷進之介'],
    ['narazakiseigo', '楢崎正剛'],
    ['naruseshumpei_26', '成瀬竣平'],
    ['otakosuke_36', '太田宏介'],
    ['shibuyatsubasa_18', '渋谷飛翔'],
    ['simicchi_8', 'ジョアン シミッチ'],
    ['somayuki_27', '相馬勇紀'],
    ['syabieru_10', 'シャビエル'],
    ['takedayohei_21', '武田洋平'],
    ['takujiyonemoto_2', '米本拓司'],
    ['watanabeshuto_20', '渡邉柊斗'],
    ['yamasakiryogo_17', '山﨑凌吾'],
    ['yoshidaakira_28', '吉田晃'],
    ['yoshidayutaka_23', '吉田豊']
  ]);

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

  getPlayerImageUrl(className: string): string {
    return `https://grampus-player.s3.jp-tok.cloud-object-storage.appdomain.cloud/${className}.jpg`;
  }

  openDialog(record: SimilarityWithUserName) {
    this.dialogLineUserImageUrl = record.imageUrl;
    this.dialogPlayerImageUrl = this.getPlayerImageUrl(record.className);
    this.dialog = true;
  }

  async lineshare() {
    console.log(`lineshare`);
    if (liff.isApiAvailable('shareTargetPicker')) {
      if (this.loginUserInfo) {
        try {
          await liff.shareTargetPicker([
            this.createFlexMessage(
              this.loginUserInfo.imageUrl,
              this.getPlayerImageUrl(this.loginUserInfo.className),
              this.loginUserInfo.className,
              this.loginUserInfo.score
            )
          ]);
          console.log(`shareTargetPicker success!`);
        } catch (error) {
          console.log(`shareTargetPicker failed!`);
        }
      } else {
        this.alertMessage = 'ランキング入ってないで〜';
        this.isAlert = true;
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
    playerClassName: string,
    score: string
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
                      type: 'text',
                      text: `${this.playerNameMap.get(playerClassName)}選手`,
                      size: 'md',
                      wrap: true,
                      weight: 'bold'
                    },
                    {
                      type: 'text',
                      text: 'との、そっくり度が'
                    },
                    {
                      type: 'text',
                      text: this.createScoreStr(score),
                      align: 'center',
                      size: 'xl',
                      weight: 'bold'
                    },
                    {
                      type: 'text',
                      text: 'だぎゃあ'
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
