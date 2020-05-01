import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import axios from 'axios'

export interface KintoneRecord {
  type: string
  value: string
}

export interface SimilarityRecord {
  line_user_id: KintoneRecord
  class_name: KintoneRecord
  score: KintoneRecord
  image_url: KintoneRecord
  created_at: KintoneRecord
  updated_at: KintoneRecord
}

@Module({
  name: 'kintone',
  stateFactory: true,
  namespaced: true
})
export default class KintoneStore extends VuexModule {
  records: SimilarityRecord[] = []

  @Mutation
  addRecord(record: SimilarityRecord) {
    this.records = [...this.records, record]
  }

  @Action
  async getRecords() {
    const response = await axios.get('.netlify/functions/similarity')
    const records: SimilarityRecord[] = response.data
    records.forEach((record) => this.addRecord(record))
  }
}
