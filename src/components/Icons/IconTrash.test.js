import React from 'react';
import { render } from '@testing-library/react';
import IconTrash from './IconTrash.js';

test('El icono de la papelera se muestra correctamente', () => {
  render(<IconTrash />);
});
