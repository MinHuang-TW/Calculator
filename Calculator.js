export default class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.currentOperandTextElement.innerText = '0';
    this.clear();
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
    if (number === '%') return this.currentOperand = this.currentOperand * 0.01;
    if (number === '+/-') {
      return this.currentOperand = this.currentOperand > 0 
        ? new Decimal(this.currentOperand).negated()
        : new Decimal(this.currentOperand).absoluteValue();
    }
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooeseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') this.compute();
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const previous = new Decimal(this.previousOperand);
    const current = this.currentOperand;
    if (isNaN(previous) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = previous.plus(current);
        break;
      case '-':
        computation = previous.minus(current);
        break;
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

  updateDisplay() {
    if (this.currentOperand === '') this.currentOperandTextElement.innerText = '0';
    else this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

    if (this.operation != null) this.previousOperandTextElement.innerText = 
      `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    else this.previousOperandTextElement.innerText = '';
  }
}