import { Meta, StoryObj } from '@storybook/react';
import { Button } from '@repo/ui';

// Meta configuration for the Button component
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    children: { control: 'text' },
    variant: {
      control: {
        type: 'select',
        options: [
          'default',
          'destructive',
          'outline',
          'secondary',
          'ghost',
          'link',
        ],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['default', 'sm', 'lg', 'icon'],
      },
    },
    asChild: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'default', // Using variant prop
    size: 'default', // Using size prop
    children: 'Click me!', // Button text
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary', // Using variant prop
    size: 'default',
    children: 'Secondary Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg', // Using size prop
    children: 'Large Button',
  },
};

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm', // Using size prop
    children: 'Small Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Disabled Button',
    disabled: true, // Disable the button
  },
};

export const Custom: Story = {
  args: {
    variant: 'outline', // Example of using an outline variant
    size: 'default',
    children: 'Custom Styled Button',
  },
};
