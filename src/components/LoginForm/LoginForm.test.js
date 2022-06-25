import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import LoginForm from '.';

beforeEach(() => {
  render(<LoginForm />);
});

afterEach(() => {
  cleanup;
});

// Sign in render test
test('renders sign in page', () => {
  const signInText = screen.getByText('Sign in');
  expect(signInText).toBeInTheDocument();
});

// Click simulation function
const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
const simulateClick = (element) => {
  mouseClickEvents.forEach(mouseEventType =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1
      })
    )
  );
}

// email validation tests
test('broken email is recognised as incorrect', () => {
  fireEvent.change(document.getElementById('email'), {target: {value: 'email@email.typo,'}})
  // do not know how to achieve correct click simulation with fireEvent,
  // therefore used custom function
  simulateClick(document.querySelector('button'));
  const helperText = screen.getByText('Incorrect entry')
  expect(helperText).toBeInTheDocument();
})

test('empty email produces error', () => {
  fireEvent.change(document.getElementById('email'), {target: {value: ''}})
  simulateClick(document.querySelector('button'));
  const helperText = screen.getByText('Incorrect entry')
  expect(helperText).toBeInTheDocument();
})

test('correct email do not produce error', () => {
  fireEvent.change(document.getElementById('email'), {target: {value: 'email@email.com'}})
  simulateClick(document.querySelector('button'));
  const helperText = screen.queryByText('Incorrect entry')
  expect(helperText).not.toBeInTheDocument();
})

// password validation tests
const passwordHelperText = 'The password must be at least 8 characters long, and have among them at least 1 digit, 1 uppercase and 1 lowercase letters, and 1 special caracter'

test('invalid password produces error', () => {
  fireEvent.change(document.getElementById('password'), {target: {value: 'password'}})
  simulateClick(document.querySelector('button'));
  const helperText = screen.getByText(passwordHelperText)
  expect(helperText).toBeInTheDocument();
})

test('empty password produces error', () => {
  fireEvent.change(document.getElementById('password'), {target: {value: ''}})
  simulateClick(document.querySelector('button'));
  const helperText = screen.getByText(passwordHelperText)
  expect(helperText).toBeInTheDocument();
})

test('suitable password do not produce error', () => {
  fireEvent.change(document.getElementById('password'), {target: {value: '!asdASD54'}})
  simulateClick(document.querySelector('button'));
  const helperText = screen.queryByText(passwordHelperText)
  expect(helperText).not.toBeInTheDocument();
})