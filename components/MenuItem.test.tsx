import { fireEvent, render, screen } from "@testing-library/react";
import { MenuItem } from "./MenuItem";

const SELECTED_CLASS = "bg-gray-200";

describe("MenuItem should", () => {
  it("show item name", () => {
    render(<MenuItem onClick={() => {}} title="Item Title" />);

    expect(screen.getByText("Item Title"));
  });

  it("be selected if specified", () => {
    render(<MenuItem onClick={() => {}} title="Item Title" selected={true} />);

    const item = screen.getByText("Item Title");

    expect(item).toHaveClass(SELECTED_CLASS);
  });

  it.each([false, undefined])(
    "be not selected if not specified",
    (selected) => {
      render(
        <MenuItem title="Item Title" selected={selected} onClick={jest.fn()} />
      );

      const item = screen.getByText("Item Title");

      expect(item).not.toHaveClass(SELECTED_CLASS);
    }
  );

  it("report when is clicked", () => {
    const onClick = jest.fn();
    render(<MenuItem title="Item Title" onClick={onClick} />);

    fireEvent.click(screen.getByText("Item Title"));

    expect(onClick).toHaveBeenCalled();
  });
});
