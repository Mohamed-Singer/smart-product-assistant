import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search bar with placeholder text', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByPlaceholderText('Ask me anything about products you need...')).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText('Ask me anything about products you need...');
    fireEvent.change(input, { target: { value: 'laptop for students' } });
    expect(input.value).toBe('laptop for students');
  });

  test('calls onSearch when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText('Ask me anything about products you need...');
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(input, { target: { value: 'laptop for students' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('laptop for students');
  });

  test('calls onSearch when example query is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    const exampleButton = screen.getByText("What's a good laptop for college students?");
    
    fireEvent.click(exampleButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith("What's a good laptop for college students?");
  });

  test('disables input and buttons when loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);
    
    expect(screen.getByPlaceholderText('Ask me anything about products you need...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled();
    expect(screen.getAllByRole('button')).toSatisfy(buttons => 
      buttons.every(button => button.disabled)
    );
  });
}); 