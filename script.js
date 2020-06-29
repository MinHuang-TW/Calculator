class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.currentOperandTextElement.innerText = '0';
    this.clear();
    this.last = '';
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.toString().includes('.')) return;
    if (!this.currentOperand) this.currentOperand = '0';
    if (number === '%') return this.currentOperand = new Decimal(this.currentOperand).times(0.01);
    if (number === '+/-') return this.currentOperand = new Decimal(this.currentOperand).times(-1);
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooeseOperation(operation) {
    this.last = this.currentOperand;
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') this.compute();
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const previous = new Decimal(this.previousOperand);
    const current = new Decimal(this.currentOperand);
    if (isNaN(previous) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = previous.plus(current);
        break;
      case '-':
        computation = previous.minus(current);
        break;
      case '×':
      case '*':
        computation = previous.times(current);
        break;
      case '÷':
      case '/':
        computation = previous.dividedBy(current);
        break;
      default:
        return;
    }
    this.last = current;
    this.currentOperand = computation.toSignificantDigits(8);
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) integerDisplay = '';
    else integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });

    if (decimalDigits != null) return `${integerDisplay}.${decimalDigits}`;
    else return integerDisplay;
  }

  updateDisplay(input) {
    if (this.currentOperand !== '') {
      if (input === 'done') {
        this.previousOperandTextElement.innerText += ` ${this.getDisplayNumber(this.last)} =`;
        this.currentOperandTextElement.classList.add('result');
      }
      this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    } else {
      this.currentOperandTextElement.innerText = '0';
      this.currentOperandTextElement.classList.remove('result');
      if (this.operation != null) {
        const record = ` ${this.getDisplayNumber(this.last)} ${this.operation}`;
        this.previousOperandTextElement.innerText.endsWith('=')
          ? this.previousOperandTextElement.innerText = record
          : this.previousOperandTextElement.innerText += record
      }
      else this.previousOperandTextElement.innerText = '';
    }
  }
}

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
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooeseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay('done');
});

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
});

document.addEventListener('keydown', (event) => {
  const operators = ['+', '-', '*', '/'];
  const numbers = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const { key } = event;
  event.preventDefault();
  if (numbers.includes(key)) calculator.appendNumber(key);
  if (operators.includes(key)) calculator.chooeseOperation(key);
  if (key === 'Backspace') calculator.delete();
  if (key === 'Enter') calculator.compute();
  if (key == 'Escape') calculator.clear();
  calculator.updateDisplay(key === 'Enter' && 'done');
});