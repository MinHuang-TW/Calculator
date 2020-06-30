class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.currentOperandTextElement.innerText = '0';
    this.clear();
    this.last = '';
    this.counter = 0;
    this.restart = false;
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
    this.counter = 0;
    if (number === '%') return this.currentOperand = new Decimal(this.currentOperand).times(0.01).toString();
    if (number === '+/-') return this.currentOperand = new Decimal(this.currentOperand).times(-1).toString();

    if (number === '.') {
      if (this.currentOperand.toString().includes('.')) return;
      if (!this.currentOperand) this.currentOperand = '0';
    } else {
      if (this.restart) this.currentOperand = '';
    }
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooeseOperation(operation) {
    this.last = this.currentOperand;
    this.counter += 1;
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
      if (this.restart) {
        this.currentOperandTextElement.classList.remove('result');
        this.previousOperandTextElement.innerText = '';
        this.restart = false;
      }
      this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    } else {
      this.currentOperandTextElement.innerText = '0';
      this.currentOperandTextElement.classList.remove('result');
      this.restart = false;

      if (input === 'delete') return;
      if (this.counter > 1) return;
      if (!this.operation) return this.previousOperandTextElement.innerText = '';

      const record = ` ${this.getDisplayNumber(this.last)} ${this.operation}`;
      this.previousOperandTextElement.innerText.endsWith('=')
        ? this.previousOperandTextElement.innerText = record
        : this.previousOperandTextElement.innerText += record;
    }
  }

  displayResult() {
    if (this.currentOperand === '') return;
    this.currentOperandTextElement.classList.add('result');
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    this.previousOperandTextElement.innerText += ` ${this.getDisplayNumber(this.last)} =`;
    this.restart = true;
  }
}