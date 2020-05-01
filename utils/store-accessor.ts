import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import KintoneStore from '~/store/kintone'

// eslint-disable-next-line import/no-mutable-exports
let kintoneStore: KintoneStore

function initialiseStores(store: Store<any>): void {
  kintoneStore = getModule(KintoneStore, store)
}

export { initialiseStores, kintoneStore }
