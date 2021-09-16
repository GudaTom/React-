import {createStore, combineReducers} from 'redux'
import {CollApsedReducer} from'./reducers/CollapsedReducer'
import {LoadingReducer} from './reducers/LoadingReducer'

import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key:'Tom',
  storage,
  blacklist:['LoadingReducer']
}

const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer);
const persistor = persistStore(store)

export {
  store,
  persistor
} 

/**
 * 发布
 * store.dispatch()
 * 订阅
 * store.subscribe()
 */