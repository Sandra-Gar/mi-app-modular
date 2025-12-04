import React from 'react';
import { render } from '@testing-library/react';
import IconSun from './IconSun.js';

test('El icono del sol se muestra correctamente', () => {
  render(<IconSun />);
});
