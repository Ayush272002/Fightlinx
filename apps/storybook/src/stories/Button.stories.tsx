import { Meta, StoryObj } from '@storybook/react';
import { Button } from '@repo/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for the button',
    },
    children: {
      control: 'text',
      description: 'The content inside the button, typically text',
    },
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
      description: 'The visual style of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['default', 'sm', 'lg', 'icon'],
      },
      description: 'The size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description:
        'Whether to use a custom component as the button element (e.g. Slot)',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when button is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Click me!',
    className: 'bg-blue-500 text-white hover:bg-blue-600',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
    children: 'Secondary Button',
    className: 'bg-gray-500 text-white hover:bg-gray-600',
  },
};

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    children: 'Large Button',
    className: 'bg-green-500 text-white hover:bg-green-600',
  },
};

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
    children: 'Small Button',
    className: 'bg-yellow-500 text-white hover:bg-yellow-600',
  },
};

export const IconButton: Story = {
  args: {
    variant: 'default',
    size: 'icon',
    children: '🔍',
    'aria-label': 'Search button',
    className: 'bg-blue-500 text-white hover:bg-blue-600',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Disabled Button',
    disabled: true,
    className: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  },
};

export const Custom: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Custom Styled Button',
    className: 'border border-blue-500 text-blue-500 hover:bg-blue-100',
  },
};

// AllVariants story with different Tailwind colors
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <Button
        {...args}
        variant="default"
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Default
      </Button>
      <Button
        {...args}
        variant="destructive"
        className="bg-red-500 text-white hover:bg-red-600"
      >
        Destructive
      </Button>
      <Button
        {...args}
        variant="outline"
        className="border border-blue-500 text-blue-500 hover:bg-blue-100"
      >
        Outline
      </Button>
      <Button
        {...args}
        variant="secondary"
        className="bg-gray-500 text-white hover:bg-gray-600"
      >
        Secondary
      </Button>
      <Button
        {...args}
        variant="ghost"
        className="bg-transparent text-gray-500 hover:bg-gray-100"
      >
        Ghost
      </Button>
      <Button
        {...args}
        variant="link"
        className="text-blue-500 underline hover:text-blue-600"
      >
        Link
      </Button>
    </div>
  ),
};
