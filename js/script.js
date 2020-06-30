const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperansTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperansTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.firstChild.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooeseOperation(button.firstChild.innerText);
    calculator.updateDisplay();
  });
});

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay('delete');
});

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.displayResult();
});

document.addEventListener('keydown', (event) => {
  const operators = ['+', '-', '*', '/'];
  const numbers = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const { key } = event;
  event.preventDefault();
  if (numbers.includes(key)) {
    calculator.appendNumber(key);
    calculator.updateDisplay();
  }
  if (operators.includes(key)) {
    calculator.chooeseOperation(key);
    calculator.updateDisplay();
  }
  if (key == 'Escape') {
    calculator.clear();
    calculator.updateDisplay();
  }
  if (key === 'Backspace') {
    calculator.delete();
    calculator.updateDisplay('delete');
  }
  if (key === 'Enter') {
    calculator.compute();
    calculator.displayResult();
  }
});