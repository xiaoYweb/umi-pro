const model = {
  namespace: 'antdform',

  state: {
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

  },
}

export default model;
