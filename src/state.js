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
    feeds: [], // {url, body}
    posts: [],
    modal: {
      itemId: null,
      feedId: null
    }
  }
};

// feeds: [
//   {
//     id: uuid(),
//     title: '',
//     description: '',
//     url: ''
//   }
// ]
//
// posts: [
//   {
//     feedId,
//     id: uuid(),
//     title: '',
//     description: '',
//     link: ''
//   }
// ]
