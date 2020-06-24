import Toast from '@/lib/Toast';
import { getLocations } from './serveice';

const model = {
  namespace: 'tree',

  state: {
    locations: []
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },

  effects: {
    *requestLocations(_, { put, call }) {
      const { status, entry, message } = yield call(getLocations)
      if (!status) {
        Toast.error(message)
        return
      }
      yield put({ type: 'updateState', payload: { locations: entry } })
    }
  }
}

export default model;
