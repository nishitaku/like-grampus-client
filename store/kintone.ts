import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import axios from 'axios';

export interface KintoneState {
  similarityRecords: SimilarityRecord[];
  userRecords: UserRecord[];
}

export interface KintoneRecord {
  type: string;
  value: string;
}

export interface SimilarityRecord {
  $id: KintoneRecord;
  line_user_id: KintoneRecord;
  class_name: KintoneRecord;
  score: KintoneRecord;
  image_url: KintoneRecord;
  created_at: KintoneRecord;
  updated_at: KintoneRecord;
}

export interface UserRecord {
  line_user_id: KintoneRecord;
  line_display_name: KintoneRecord;
  line_picture_url: KintoneRecord;
  line_user_language: KintoneRecord;
  created_at: KintoneRecord;
  updated_at: KintoneRecord;
}

@Module({
  name: 'kintone',
  stateFactory: true,
  namespaced: true
})
export default class KintoneStore extends VuexModule implements KintoneState {
  similarityRecords: SimilarityRecord[] = [];
  userRecords: UserRecord[] = [];

  @Mutation
  addSimilarityRecord(record: SimilarityRecord) {
    this.similarityRecords = [...this.similarityRecords, record];
  }

  @Mutation
  addUserRecord(record: UserRecord) {
    this.userRecords = [...this.userRecords, record];
  }

  @Action
  async getSimilarityRecords() {
    const response = await axios.get('.netlify/functions/similarity');
    const records: SimilarityRecord[] = response.data;
    records.forEach((record) => this.addSimilarityRecord(record));
  }

  @Action
  async getUserRecords() {
    const response = await axios.get('.netlify/functions/users');
    const records: UserRecord[] = response.data;
    records.forEach((record) => this.addUserRecord(record));
  }
}
