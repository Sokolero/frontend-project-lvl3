import i18next from 'i18next';
import uuid from 'uuid-v4'

import { changeModalData } from './handlers.js';

i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: {
        "fetchSuccess": "RSS успешно загружен",
        "fetchFailed": "Ссылка должна быть валидными URL",
        "oneFeedBlockTitle": "Посты",
        "feedsBlockTitle": "Фиды"
      }
    }
  }
})


const createPostsList = (posts) => {
  return posts
    .map(post => {
      return `
        <li class="list-group-item">
          <a href=${post.link}>${post.title}</a>
          <button type="button" class="btn btn-primary" data-feed-id=${post.feedId} data-id=${post.id} data-bs-toggle="modal" data-bs-target="#exampleModal">
            Просмотр
          </button>
        </li>
      `
    })
    .join('')
}

const createFeedsList = (feeds) => {
  return feeds
    .map(feed => {
      return `
        <li class="list-group-item">
          <h3>${feed.title}</h3>
          <p>${feed.description}</p>
        </li>
      `
    })
    .join('')
}


// отрендерить состояние в дом
export default (object, elements, path, value) => {
  console.log('in render', path)
  // ----
  if (path === 'form.input') {
    elements.input.value = value;
  }
  // ----
  if (path === 'form.errors') {
    if (!value) {
      elements.input.classList.remove('border-danger')
    } else {
      elements.input.classList.add('border-danger')
    }
  }
  // ----
  if (path === 'form.fetchingStatus' && value === 'success') {
    elements.fetchingStatus.textContent = i18next.t('fetchSuccess')
  }
  // ----
  if (path === 'form.fetchingStatus' && value === 'failure') {
    elements.fetchingStatus.textContent = i18next.t('fetchFailed')
  }
  // ---- feeds ----------------------------------------------------------------
  if (path === 'feeds') {
    const { feeds } = elements;
    const container = feeds.querySelector('ul')
    container.innerHTML = createFeedsList(value)
  }

  // --- posts -----------------------------------------------------------------
  if (path === 'posts') {
    console.log("this: ", object)
    const { feedBody } = elements;
    feedBody.innerHTML = createPostsList(value)
    feedBody
      .querySelectorAll('button')
      .forEach(btn => btn.addEventListener('click', changeModalData(object)))
  }

  // --- activeModal -----------------------------------------------------------
  if (path === 'modal') {
    const modalTitle = document.querySelector('.modal h5')
    const detailsLink = document.querySelector('a[type=button]')
    const modalBody = document.querySelector('.modal-body');

    const { itemId, feedId } = value;
    const { title, description, link } = object.posts
      .filter(post => post.feedId === feedId)
      .filter(post => post.id === itemId)[0]


    modalTitle.textContent = title
    detailsLink.setAttribute('href', link)
    modalBody.textContent = description
  }
}
