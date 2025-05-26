import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * Main Container for QuickCalc
 * Provides a calculator UI supporting basic arithmetic operations (addition, subtraction, multiplication, division),
 * with division-by-zero handling. Instant result display. Responsive and styled to match given theme/colors.
 */
function QuickCalcMain() {
  // State: display = current visible value, input = complete user input (string for cases like "12+3*4"), operator = last operator, waitingForOperand = flag when ready for next number, error = error message (if any)
  const [display, setDisplay] = useState("0");
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [accumulator, setAccumulator] = useState(null); // Holds cumulative result
  const [error, setError] = useState(null);

  // Calculator color theming via inline styles
  const colors = {
    primary: "#1976D2",
    secondary: "#FFFFFF",
    accent: "#FFC107"
  };

  /**
   * Handles input of a digit or '.'.
   * @param {string} digit Char for digit or '.'.
   */
  // PUBLIC_INTERFACE
  function inputDigit(digit) {
    if (error) {
      setError(null);
      setDisplay(digit === '.' ? "0." : digit);
      setWaitingForOperand(false);
      return;
    }
    if (waitingForOperand) {
      setDisplay(digit === "." ? "0." : digit);
      setWaitingForOperand(false);
    } else {
      // Avoid multiple initial zeros
      if (display === "0" && digit !== ".") {
        setDisplay(digit);
      } else if (digit === "." && display.includes(".")) {
        return; // Ignore multiple decimals
      } else {
        setDisplay(display + digit);
      }
    }
  }

  /**
   * Processes an operator (+, -, ×, ÷).
   * @param {string} op
   */
  // PUBLIC_INTERFACE
  function performOperation(op) {
    if (error) return;
    const inputValue = parseFloat(display);
    if (accumulator == null) {
      setAccumulator(inputValue);
    } else if (pendingOperator) {
      const result = compute(accumulator, inputValue, pendingOperator);
      if (result === "error") {
        setError("Can't divide by zero");
        setDisplay("Error");
        setAccumulator(null);
        setPendingOperator(null);
        setWaitingForOperand(true);
        return;
      } else {
        setAccumulator(result);
        setDisplay(result.toString());
      }
    }
    setPendingOperator(op);
    setWaitingForOperand(true);
  }

  /**
   * Handles pressing '='.
   */
  // PUBLIC_INTERFACE
  function handleEquals() {
    if (error) return;
    if (pendingOperator && accumulator !== null) {
      const inputValue = parseFloat(display);
      const result = compute(accumulator, inputValue, pendingOperator);
      if (result === "error") {
        setError("Can't divide by zero");
        setDisplay("Error");
        setAccumulator(null);
        setPendingOperator(null);
        setWaitingForOperand(true);
        return;
      } else {
        setDisplay(result.toString());
        setAccumulator(null);
        setPendingOperator(null);
        setWaitingForOperand(true);
      }
    }
  }

  /**
   * Computes the result of an operation.
   */
  function compute(a, b, op) {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        if (b === 0) return "error";
        return a / b;
      default:
        return b;
    }
  }

  /**
   * Resets calculator state.
   */
  // PUBLIC_INTERFACE
  function handleClear() {
    setDisplay("0");
    setAccumulator(null);
    setPendingOperator(null);
    setWaitingForOperand(false);
    setError(null);
  }

  /**
   * Keyboard support (optional, but helpful)
   */
  React.useEffect(() => {
    function onKeyDown(e) {
      const { key } = e;
      if (/\d/.test(key)) {
        inputDigit(key);
      } else if (key === ".") {
        inputDigit(".");
      } else if (key === "+" || key === "-") {
        performOperation(key);
      } else if (key === "*" || key === "x" || key === "X") {
        performOperation("×");
      } else if (key === "/") {
        performOperation("÷");
      } else if (key === "=" || key === "Enter") {
        handleEquals();
      } else if (key === "Escape" || key === "c" || key === "C") {
        handleClear();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line
  }, [display, pendingOperator, accumulator, error]);

  // Button grid definition
  const buttons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  // Button click handler
  function handleButton(label) {
    if (/\d/.test(label)) {
      inputDigit(label);
    } else if (label === ".") {
      inputDigit(".");
    } else if (["+", "-", "×", "÷"].includes(label)) {
      performOperation(label);
    } else if (label === "=") {
      handleEquals();
    }
  }

  return (
    <div className="quickcalc-main" style={{ width: 320, margin: "40px auto", background: colors.secondary, borderRadius: 12, boxShadow: "0 3px 16px rgba(25,118,210,.08)", padding: 24 }}>
      <div 
        className="quickcalc-display"
        style={{
          background: "#F5F6FA",
          color: "#222",
          textAlign: "right",
          fontFamily: "'Menlo', 'monospace', 'Arial'",
          fontSize: 36,
          borderRadius: 8,
          padding: "16px 12px",
          marginBottom: 16,
          minHeight: 50,
          letterSpacing: 1,
          border: `1px solid ${colors.primary}33`
        }}
        data-testid="display"
      >
        {error ? <span style={{ color: "#d32f2f" }}>{display}</span> : display}
      </div>
      <div className="quickcalc-keypad" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <button
          onClick={handleClear}
          className="quickcalc-btn"
          style={{
            gridColumn: "span 4",
            padding: "12px 0",
            background: colors.primary,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: "500",
            marginBottom: 8,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          data-testid="clear-btn"
        >
          C
        </button>
        {buttons.flat().map((label, idx) => (
          <button
            key={idx}
            onClick={() => handleButton(label)}
            className="quickcalc-btn"
            style={{
              padding: label === "0" ? "16px 0 16px 0" : "16px",
              background: ["+", "-", "×", "÷", "="].includes(label)
                ? colors.primary
                : "#F5F6FA",
              color: ["+", "-", "×", "÷", "="].includes(label)
                ? "#fff"
                : "#222",
              border: "none",
              borderRadius: 8,
              fontSize: 20,
              fontWeight: "500",
              gridColumn: label === "0" ? "span 1" : undefined,
              boxShadow: "0 1px 2px #0001",
              cursor: "pointer",
              outline: "none",
              transition: "background 0.15s"
            }}
            aria-label={label}
            data-testid={`btn-${label}`}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Optional: Theme accent bar at the bottom */}
      <div style={{
        height: 6,
        width: "100%",
        background: `linear-gradient(90deg, ${colors.primary} 50%, ${colors.accent} 100%)`,
        borderRadius: "0 0 8px 8px",
        marginTop: 22
      }} />
    </div>
  );
}

export default QuickCalcMain;
