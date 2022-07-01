// создать объект состояния
export default (initialState) => {
  if (initialState) {
    return {...initialState}
  }
  return {
    form: {
      input: '',
      errors: '',
      fetchingStatus: null
    },
    feeds: [] // {url, body}
  }
};
