import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button'; // Adjust path if necessary

describe('<Button />', () => {
  it('renders the title and calls onPress', () => {
    const onPressMock = jest.fn();
    const title = 'Click Me';
    const { getByText } = render(
      <Button title={title} onPress={onPressMock} />,
    );

    const buttonElement = getByText(title);
    expect(buttonElement).toBeDefined();

    fireEvent.press(buttonElement);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
