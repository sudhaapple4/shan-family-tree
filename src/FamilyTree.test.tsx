import React from 'react';
import { render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FamilyTree from './FamilyTree';

test('FamilyTree Test Cases', () => {
    const { getByText,getByRole  } = render(<FamilyTree />);
    const name = 'King Shan';
    //check text
    const getText = getByText(/The Shan Family Tree/);
    expect(getText).toBeInTheDocument();
    const kingText = getByText(/King Shan/)
    expect(kingText).toBeInTheDocument();
    const queenText = getByText(/Queen Anga/)
    expect(queenText).toBeInTheDocument();
    //check combobox 
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    fireEvent.change(selectElement, { target: { value: 'spouse' } });
     // Find the select element
    expect(selectElement).toHaveValue('spouse');
    userEvent.selectOptions(selectElement,'spouse')
     // Find the dynamic div and simulate a click
    const dynamicDiv = getByText(name);
    fireEvent.click(dynamicDiv);
 
  });