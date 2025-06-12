import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectEditFields from './ProjectEditFields';

describe('ProjectEditFields', () => {
  it('calls confirm and cancel callbacks', async () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    render(
      <ProjectEditFields
        name="test"
        description="desc"
        onNameChange={() => {}}
        onDescriptionChange={() => {}}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
    await userEvent.click(screen.getByLabelText('confirm'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByLabelText('cancel'));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
