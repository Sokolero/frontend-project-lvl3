import { fileURLToPath } from 'url';
import path, { dirname } from 'path'
import { readFileSync } from 'fs';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

import { main } from '../src/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let html = null;

beforeAll(() => {
  html = readFileSync(getFixturePath('example.html'), 'utf-8').trim();
})

afterAll(() => {
  html = null;
})

beforeEach(() => {
  const appContainer = document.createElement('div');
  appContainer.innerHTML = html;
  document.body.appendChild(appContainer);
  main(appContainer)
})

afterEach(() => {
  document.body.innerHTML = ''
})

// 1. Отображение вводимого текста в поле
test('correct text render on text field', async () => {
  // console.log(appContainer.querySelector("input").value)  //
  const rssField = screen.getByPlaceholderText("Ссылка RSS");
  //
  await fireEvent.change(rssField, { target: {value: 'abc'} })
  //
  expect(rssField).toHaveValue('abc');
});

// 2. Подсветка рамки красным при невалидном урл, сообщение о невалидном урл
test('validation input, red border when invalid url', async () => {

  const rssField = screen.getByPlaceholderText("Ссылка RSS");
  const btn = screen.getByText('Добавить')
  const statusBar = screen.getByTestId('fetching-status')

  await fireEvent.change(rssField, { target: { value: 'abc' } })
  await fireEvent.click(btn);
  waitFor(() => {
    expect(rssField).toHaveClass('form-control','border-danger')
  })
  waitFor(() => {
    expect(statusBar).toHaveTextContent('Ссылка должна быть валидным URL')
  })
})

// 3. Отсутствие красной рамки при валидном урл
test('validation input, haven`t red border when valid url', async () => {
  const rssField = screen.getByPlaceholderText("Ссылка RSS");
  const btn = screen.getByText('Добавить')

  await fireEvent.change(rssField, { target: { value: 'https://valid.com/' } })
  await fireEvent.click(btn);
  waitFor(() => {
    expect(rssField).toHaveClass('form-control')
  })
})

// 2. тесст что ввод невалидного урл вызывает:
    // - красную рамку
    // - сообщение об ошибке ссылка должна быть валидным url
// 3. тест что ввод валидного урл после:
    // - загружает данные в определенный элемент узел
    // - появляется сообщение об успешной загрузке
    // - рамка перестает быть красной
// 4. тест что ввод дублирующего урл
    // - вызываает сообщение о соответствующей ошибке
    // - делает рамку красной

//
