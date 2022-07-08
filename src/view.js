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
        "postsHeader": "Посты",
        "feedsHeader": "Фиды"
      }
    }
  }
})


const createPostsList = (posts) => {
  return posts
    .map(post => {
      return `
        <li class="list-group-item d-flex justify-content-between">
          <a href=${post.link}>${post.title}</a>
          <button type="button" class="btn btn-outline-primary" data-feed-id=${post.feedId} data-id=${post.id} data-bs-toggle="modal" data-bs-target="#exampleModal">
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


// render-функция
export default (object, elements, path, value) => {

  // ----
  if (path === 'form.input') {
    elements.input.value = value;
  }
  // ----
  if (path === 'form.errors') {
    if (!value) {
      elements.input.classList.remove('border-danger')
      elements.fetchingStatus.classList.remove('text-danger')
      elements.fetchingStatus.classList.add('text-success')
    } else {
      elements.input.classList.add('border-danger')
      elements.fetchingStatus.classList.remove('text-success')
      elements.fetchingStatus.classList.add('text-danger')
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
    const { feeds, feedsHeader } = elements;
    feedsHeader.textContent = i18next.t('feedsHeader')
    const container = feeds.querySelector('ul')
    container.innerHTML = createFeedsList(value)
  }

  // --- posts -----------------------------------------------------------------
  if (path === 'posts') {
    const { feedBody, postsHeader } = elements;
    // console.log(elements)
    postsHeader.textContent = i18next.t('postsHeader')
    const container = feedBody.querySelector('ul')
    container.innerHTML = createPostsList(value)
    container
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
