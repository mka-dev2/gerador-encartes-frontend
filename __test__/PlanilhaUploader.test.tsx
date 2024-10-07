// __tests__/PlanilhaUploader.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import PlanilhaUploader from '../components/PlanilhaUploader';
import React from 'react';

describe('PlanilhaUploader', () => {
  it('renders the file input', () => {
    render(<PlanilhaUploader onProductsUploaded={jest.fn()} />);

    // Verifica se o input de arquivo está presente na tela
    const fileInput = screen.getByRole('textbox'); // Ajuste o seletor conforme o tipo de input
    expect(fileInput).toBeInTheDocument();
  });

  it('should call onProductsUploaded when a valid file is uploaded', () => {
    const mockOnProductsUploaded = jest.fn();
    render(<PlanilhaUploader onProductsUploaded={mockOnProductsUploaded} />);

    // Simula o evento de upload de arquivo
    const file = new File(['dummy content'], 'example.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileInput = screen.getByRole('textbox');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verifica se a função foi chamada após o upload
    expect(mockOnProductsUploaded).toHaveBeenCalled();
  });
});