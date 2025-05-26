import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import QuickCalcMain from "./QuickCalcMain";

// Helper to click a calculator button by its test id
function clickBtn(label) {
  fireEvent.click(screen.getByTestId(`btn-${label}`));
}

describe("QuickCalcMain", () => {
  test("renders calculator UI with display and all buttons", () => {
    render(<QuickCalcMain />);
    expect(screen.getByTestId("display")).toBeInTheDocument();
    [
      ..."0123456789",
      ".",
      "+",
      "-",
      "×",
      "÷",
      "=",
    ].forEach((label) => {
      expect(screen.getByTestId(`btn-${label}`)).toBeInTheDocument();
    });
    expect(screen.getByTestId("clear-btn")).toBeInTheDocument();
  });

  test("digit and decimal input works", () => {
    render(<QuickCalcMain />);
    clickBtn("1"); clickBtn("2"); clickBtn(".");
    clickBtn("3"); clickBtn("4");
    expect(screen.getByTestId("display")).toHaveTextContent("12.34");
  });

  test("addition works", () => {
    render(<QuickCalcMain />);
    clickBtn("2");
    clickBtn("+");
    clickBtn("3");
    clickBtn("=");
    expect(screen.getByTestId("display")).toHaveTextContent("5");
  });

  test("subtraction works", () => {
    render(<QuickCalcMain />);
    clickBtn("9");
    clickBtn("-");
    clickBtn("3");
    clickBtn("=");
    expect(screen.getByTestId("display")).toHaveTextContent("6");
  });

  test("multiplication works", () => {
    render(<QuickCalcMain />);
    clickBtn("7");
    clickBtn("×");
    clickBtn("8");
    clickBtn("=");
    expect(screen.getByTestId("display")).toHaveTextContent("56");
  });

  test("division works", () => {
    render(<QuickCalcMain />);
    clickBtn("8");
    clickBtn("÷");
    clickBtn("2");
    clickBtn("=");
    expect(screen.getByTestId("display")).toHaveTextContent("4");
  });

  test("division by zero shows error", () => {
    render(<QuickCalcMain />);
    clickBtn("2");
    clickBtn("÷");
    clickBtn("0");
    clickBtn("=");
    expect(screen.getByTestId("display")).toHaveTextContent(/error/i);
  });

  test("clear button resets everything", () => {
    render(<QuickCalcMain />);
    clickBtn("1");
    clickBtn("+");
    clickBtn("2");
    clickBtn("=");
    expect(screen.getByTestId("display")).toHaveTextContent("3");
    fireEvent.click(screen.getByTestId("clear-btn"));
    expect(screen.getByTestId("display")).toHaveTextContent("0");
  });

  test("allows multiple operations in sequence", () => {
    render(<QuickCalcMain />);
    clickBtn("1");
    clickBtn("+");
    clickBtn("2");
    clickBtn("+");
    clickBtn("3");
    clickBtn("=");
    expect(screen.getByTestId("display")).toHaveTextContent("6");
  });

  test("handles sequential operator presses gracefully", () => {
    render(<QuickCalcMain />);
    clickBtn("5");
    clickBtn("+");
    clickBtn("-");
    clickBtn("2");
    clickBtn("=");
    // Should do 5 - 2 = 3 (treat last operator used)
    expect(screen.getByTestId("display")).toHaveTextContent("3");
  });

  test("does not allow multiple decimals in a number", () => {
    render(<QuickCalcMain />);
    clickBtn("1");
    clickBtn(".");
    clickBtn(".");
    clickBtn("2");
    expect(screen.getByTestId("display")).toHaveTextContent("1.2");
  });
});
