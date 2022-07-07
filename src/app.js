import onChange from 'on-change';
import { string } from 'yup';
import uuid from 'uuid-v4'

import render from './view.js';
import createState from './state.js';
import parser from './parsers.js'
import setHandlers from './handlers.js'

// инициализировать дом дерево
const getAppElements = (appContainer) => {
  const input = appContainer.querySelector('#rssUrl');
  const form = appContainer.querySelector('#mainForm');
  const fetchingStatus = appContainer.querySelector('#fetchingStatus')
  const submit = appContainer.querySelector('button[type=submit]')
  const feedBody = appContainer.querySelector('.feed-body')
  const feeds = appContainer.querySelector('.feeds')
  return {
    input,
    form,
    fetchingStatus,
    submit,
    feedBody,
    feeds
  }
}

// инициализировать приложение
export function main(appContainer) {
  const elements = getAppElements(appContainer);
  const state = createState();

  const watchedState = onChange(state, function (path, value, previousValue, applyData){
    render(this, elements, path, value);
  })

  setHandlers(elements, watchedState);
}
