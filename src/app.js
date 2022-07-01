import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import { string } from 'yup';

import render from './view.js';
import createState from './state.js';

// инициализировать дом дерево
const getAppElements = (appContainer) => {
  const input = appContainer.querySelector('#rssUrl');
  const form = appContainer.querySelector('#mainForm');
  const fetchingStatus = appContainer.querySelector('#fetchingStatus')
  const feeds = appContainer.querySelector('#feeds');
  const submit = appContainer.querySelector('button[type=submit]')
  return {
    input,
    form,
    fetchingStatus,
    feeds,
    submit
  }
}

// инициализировать наблюдение за дом деревом
const setHandlers = (elements, state) => {
  const { input, form, submit } = elements;

  const handleInputChange = (e) => {
    state.form.input = e.target.value
  }

  const handleFormSubmit = (e) => {
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
      .then((url) => fetch(url))
      .then((res) => res.text())
      .then((text) => {
        state.feeds.push(
          {
            url: inputedUrl,
            body: text
          }
        )
        state.form.input = ''
        state.form.fetchingStatus = 'success';
      })
      .catch((error) => {
        state.form.errors = error.message
        state.form.fetchingStatus = 'failure'
      })
  }

  input.addEventListener('change', handleInputChange);
  form.addEventListener('submit', handleFormSubmit);
};




// ========================
export function main(appContainer) {
  const elements = getAppElements(appContainer);
  const state = createState();
  const watchedState = onChange(state, (path, value, previousValue, applyData) => {
    render(elements, path, value);
  })

  setHandlers(elements, watchedState);
}
