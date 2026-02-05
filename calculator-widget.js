(function() {
  // Prüfen ob Calculator bereits existiert
  if (document.getElementById('calc-widget-container')) {
    document.getElementById('calc-widget-container').remove();
    return;
  }

  // Styles erstellen
  const styles = `
    #calc-widget-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #calc-widget {
      width: 280px;
      background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
      overflow: hidden;
      user-select: none;
    }
    #calc-header {
      background: linear-gradient(145deg, #3a3a3a, #2d2d2d);
      padding: 10px 15px;
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #calc-header span {
      color: #fff;
      font-weight: 600;
      font-size: 14px;
    }
    #calc-close {
      background: #ff5f57;
      border: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    #calc-close:hover {
      opacity: 0.8;
    }
    #calc-display {
      background: #1a1a1a;
      padding: 20px 15px;
      text-align: right;
    }
    #calc-expression {
      color: #888;
      font-size: 14px;
      height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #calc-result {
      color: #fff;
      font-size: 36px;
      font-weight: 300;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #calc-buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: #333;
      padding: 1px;
    }
    .calc-btn {
      border: none;
      padding: 20px;
      font-size: 20px;
      cursor: pointer;
      transition: background 0.1s;
      background: #505050;
      color: #fff;
    }
    .calc-btn:hover {
      background: #606060;
    }
    .calc-btn:active {
      background: #707070;
    }
    .calc-btn.operator {
      background: #ff9500;
      color: #fff;
    }
    .calc-btn.operator:hover {
      background: #ffaa33;
    }
    .calc-btn.operator:active {
      background: #cc7700;
    }
    .calc-btn.function {
      background: #a5a5a5;
      color: #000;
    }
    .calc-btn.function:hover {
      background: #b5b5b5;
    }
    .calc-btn.zero {
      grid-column: span 2;
      text-align: left;
      padding-left: 30px;
    }
    .calc-btn.equals {
      background: #ff9500;
    }
  `;

  // Style-Element einfügen
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Calculator HTML erstellen
  const container = document.createElement('div');
  container.id = 'calc-widget-container';
  container.innerHTML = `
    <div id="calc-widget">
      <div id="calc-header">
        <span>Taschenrechner</span>
        <button id="calc-close" title="Schließen"></button>
      </div>
      <div id="calc-display">
        <div id="calc-expression"></div>
        <div id="calc-result">0</div>
      </div>
      <div id="calc-buttons">
        <button class="calc-btn function" data-action="clear">AC</button>
        <button class="calc-btn function" data-action="sign">+/-</button>
        <button class="calc-btn function" data-action="percent">%</button>
        <button class="calc-btn operator" data-action="divide">÷</button>
        <button class="calc-btn" data-value="7">7</button>
        <button class="calc-btn" data-value="8">8</button>
        <button class="calc-btn" data-value="9">9</button>
        <button class="calc-btn operator" data-action="multiply">×</button>
        <button class="calc-btn" data-value="4">4</button>
        <button class="calc-btn" data-value="5">5</button>
        <button class="calc-btn" data-value="6">6</button>
        <button class="calc-btn operator" data-action="subtract">−</button>
        <button class="calc-btn" data-value="1">1</button>
        <button class="calc-btn" data-value="2">2</button>
        <button class="calc-btn" data-value="3">3</button>
        <button class="calc-btn operator" data-action="add">+</button>
        <button class="calc-btn zero" data-value="0">0</button>
        <button class="calc-btn" data-value=".">.</button>
        <button class="calc-btn operator equals" data-action="equals">=</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // Calculator Logik
  let currentValue = '0';
  let previousValue = '';
  let operation = null;
  let shouldResetDisplay = false;

  const display = document.getElementById('calc-result');
  const expression = document.getElementById('calc-expression');

  function updateDisplay() {
    display.textContent = currentValue;
  }

  function inputDigit(digit) {
    if (shouldResetDisplay) {
      currentValue = digit;
      shouldResetDisplay = false;
    } else {
      currentValue = currentValue === '0' ? digit : currentValue + digit;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (shouldResetDisplay) {
      currentValue = '0.';
      shouldResetDisplay = false;
      updateDisplay();
      return;
    }
    if (!currentValue.includes('.')) {
      currentValue += '.';
      updateDisplay();
    }
  }

  function handleOperator(nextOp) {
    const value = parseFloat(currentValue);

    if (operation && !shouldResetDisplay) {
      const result = calculate();
      currentValue = String(result);
      updateDisplay();
    }

    previousValue = currentValue;
    operation = nextOp;
    shouldResetDisplay = true;

    const opSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
    expression.textContent = previousValue + ' ' + opSymbols[operation];
  }

  function calculate() {
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    switch (operation) {
      case 'add': return prev + current;
      case 'subtract': return prev - current;
      case 'multiply': return prev * current;
      case 'divide': return current !== 0 ? prev / current : 'Fehler';
      default: return current;
    }
  }

  function handleEquals() {
    if (!operation) return;

    const opSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
    expression.textContent = previousValue + ' ' + opSymbols[operation] + ' ' + currentValue + ' =';

    const result = calculate();
    currentValue = typeof result === 'number' ?
      (Number.isInteger(result) ? String(result) : result.toFixed(8).replace(/\.?0+$/, '')) :
      result;
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
  }

  function clear() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    shouldResetDisplay = false;
    expression.textContent = '';
    updateDisplay();
  }

  function toggleSign() {
    currentValue = String(parseFloat(currentValue) * -1);
    updateDisplay();
  }

  function percentage() {
    currentValue = String(parseFloat(currentValue) / 100);
    updateDisplay();
  }

  // Event Listeners
  document.getElementById('calc-buttons').addEventListener('click', (e) => {
    if (!e.target.classList.contains('calc-btn')) return;

    const value = e.target.dataset.value;
    const action = e.target.dataset.action;

    if (value !== undefined) {
      if (value === '.') {
        inputDecimal();
      } else {
        inputDigit(value);
      }
    } else if (action) {
      switch (action) {
        case 'clear': clear(); break;
        case 'sign': toggleSign(); break;
        case 'percent': percentage(); break;
        case 'equals': handleEquals(); break;
        default: handleOperator(action);
      }
    }
  });

  // Schließen-Button
  document.getElementById('calc-close').addEventListener('click', () => {
    container.remove();
    styleEl.remove();
  });

  // Drag-Funktionalität
  const widget = document.getElementById('calc-widget');
  const header = document.getElementById('calc-header');
  let isDragging = false;
  let dragOffsetX, dragOffsetY;

  header.addEventListener('mousedown', (e) => {
    if (e.target.id === 'calc-close') return;
    isDragging = true;
    const rect = container.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    container.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.clientX - dragOffsetX;
    const y = e.clientY - dragOffsetY;
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    container.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Tastatur-Support
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('calc-widget-container')) return;

    const key = e.key;
    if (/[0-9]/.test(key)) {
      inputDigit(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (key === '+') {
      handleOperator('add');
    } else if (key === '-') {
      handleOperator('subtract');
    } else if (key === '*') {
      handleOperator('multiply');
    } else if (key === '/') {
      e.preventDefault();
      handleOperator('divide');
    } else if (key === 'Enter' || key === '=') {
      handleEquals();
    } else if (key === 'Escape') {
      clear();
    } else if (key === 'Backspace') {
      currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
      updateDisplay();
    }
  });
})();
