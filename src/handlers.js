import { string } from 'yup';
import uuid from 'uuid-v4'

import parser from './parsers.js'


// ------------
export const handleInputChange = (state) => (e) => {
  state.form.input = e.target.value
}

// -----------------------------
export const changeModalData = (state) => (e) => {
  console.log('change modal data!')
  const { feedId, id } = e.target.dataset;
  state.modal = { feedId, itemId: id }
  console.log(state.modal)
}


// -----------
export const handleFormSubmit = (state) => (e) => {
  e.preventDefault();
  const inputedUrl = e.target.elements.url.value
  const disallowedUrls = state.feeds.map(feed => feed.url)

  const url = string().required().url().notOneOf(disallowedUrls)
  url
    .validate(inputedUrl)
    .then((url) => {
      state.form.errors = ''
      return url;
    })
    .then((url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`))
    // .then((url) => fetch(url))
    .then((res) => res.json())
    .then((data) => {
      const rssDocument = parser(data.contents)
      console.log(rssDocument)
      // ----- change state -----
      const feedId = uuid()

      state.feeds.push({
        id: feedId,
        title: rssDocument.querySelector('title').textContent,
        description: rssDocument.querySelector('description').textContent,
        url: data.status.url
      })

      const items = Array.from(rssDocument.querySelectorAll('item'))

      state.posts = [
        ...state.posts,
        ...items.map((item) => ({
          feedId,
          id: uuid(),
          title: item.querySelector('title').textContent,
          description: item.querySelector('description').textContent,
          link: item.querySelector('link').textContent
        }))
      ]
      state.form.input = ''
      state.form.fetchingStatus = 'success';
    })
    .catch((error) => {
      console.log(error.message)
      state.form.errors = error.message
      state.form.fetchingStatus = 'failure'
    })
}

// инициализировать наблюдение за дом деревом
export default (elements, watchedState) => {

  const { input, form, submit, feedBody } = elements;
  input.addEventListener('change', handleInputChange(watchedState));
  form.addEventListener('submit', handleFormSubmit(watchedState));
};
