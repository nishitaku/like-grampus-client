import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import axios from 'axios';

export interface KintoneState {
  similarityRecords: SimilarityWithUserName[];
}

export interface SimilarityWithUserName {
  id: string;
  lineDisplayName: string;
  linePictureUrl: string;
  className: string;
  score: string;
  imageUrl: string;
}

@Module({
  name: 'kintone',
  stateFactory: true,
  namespaced: true
})
export default class KintoneStore extends VuexModule implements KintoneState {
  similarityRecords: SimilarityWithUserName[] = [];

  @Mutation
  addSimilarityRecord(record: SimilarityWithUserName) {
    this.similarityRecords = [...this.similarityRecords, record];
  }

  @Action
  async getSimilarityRecords() {
    const response = await axios.get('.netlify/functions/similarity');
    const records: SimilarityWithUserName[] = response.data;
    records.forEach((record) => this.addSimilarityRecord(record));
  }
}
