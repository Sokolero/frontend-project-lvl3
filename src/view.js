import i18next from 'i18next';

i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: {
        "fetchSuccess": "RSS успешно загружен",
        "fetchFailed": "Ссылка должна быть валидными URL"
      }
    }
  }
})

// отрендерить состояние в дом
export default (elements, path, value) => {

  if (path === 'form.input') {
    elements.input.value = value;
  }
  if (path === 'form.errors') {
    if (!value) {
      elements.input.classList.remove('border-danger')
    } else {
      elements.input.classList.add('border-danger')
    }
  }
  if (path === 'form.fetchingStatus' && value === 'success') {
    elements.fetchingStatus.textContent = i18next.t('fetchSuccess')
  }
  if (path === 'form.fetchingStatus' && value === 'failure') {
    elements.fetchingStatus.textContent = i18next.t('fetchFailed')
  }
  if (path === 'feeds') {
    elemenst.feeds.textContent = value;
  }
}
