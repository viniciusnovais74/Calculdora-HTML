class CalcController {
   //construtor onde fica os principais objetos
   constructor() {
      this._audio = new Audio('click.mp3');
      this._lastOperator = '';
      this._lastNumber = '';
      this._audioOnOff = false;
      this._operation = [];
      this._locale = 'pt-BR';
      this._displayCalcEl = document.querySelector("#display");
      this._dateEl = document.querySelector("#data");
      this._timeEl = document.querySelector("#hora");
      this._currentDate;
      this.initialize();
      this.initButtonsEvents();
      this.initKeyboard();

   }

   initialize() {

      this.setDisplayDateTime();

      setInterval(() => {

         this.setDisplayDateTime();

      }, 1000);

      this.setLastNumberToDispay();
      this.pasteFromClipboard();

      document.querySelectorAll('.btn-ac').forEach(btn => {
         btn.addEventListener('dblclick', e => {

            this.toggleAudio();

         });
      });
   }

   toggleAudio() {

      this._audioOnOff = !this._audioOnOff;

   }

   playAudio() {

      if (this._audioOnOff) {

         this._audio.currentTime = 0;
         this._audio.play();

      }
   }
   initKeyboard() {
      document.addEventListener('keyup', e => {

         this.playAudio();

         switch (e.key) {
            case 'Escape':
               this.clearAll();
               break;

            case 'Backspace':
               this.clearEntry();
               break;

            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
               this.addOperation(e.key);
               break;


            case '.':
            case ',':
               this.addDot();
               break;

            case 'Enter':
            case '=':
               this.calc();
               break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
               this.addOperation(parseInt(e.key));
               break;
            case 'c':
               if (e.ctrlKey) this.copyToClipboard();
               break;
         }
      });
   }

   pasteFromClipboard() {

      document.addEventListener('paste', e => {

         let text = e.clipboardData.getData('Text');

         this.displayCalc = parseFloat(text);

         console.log(text);
      })

   }

   copyToClipboard() {

      let input = document.createElement('input');

      input.value = this.displayCalc;

      document.body.appendChild(input);

      input.select();

      document.execCommand("Copy");

      input.remove();
   }
   //addEventListenerAll - Evento criado NÃO NATIVO para o Javascript onde verificara varios dados e informações.
   addEventListenerAll(element, events, fn) {

      events.split(' ').forEach(event => {

         element.addEventListener(event, fn, false);

      });
   }

   //Display de Data e Hora e Calculadora - Lembrete os dados são puxados dos dados privados.
   setDisplayDateTime() {
      this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
         day: "2-digit",
         month: "long",
         year: "numeric"
      });
      this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

   }

   getLastItem(isOperator = true) {

      let lastItem;

      for (let i = this._operation.length - 1; i >= 0; i--) {


         if (this.isOperator(this._operation[i]) == isOperator) {
            lastItem = this._operation[i];
            break;
         }

         if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
         }
      }

      return lastItem;
   }
   setLastNumberToDispay() {

      let lastNumber = this.getLastItem(false);

      if (!lastNumber) lastNumber = 0;

      this.displayCalc = lastNumber;



   }

   //Operadores de Funções - Inicio
   clearAll() {

      this._lastNumber = '';
      this._lastOperator = '';
      this._operation = [];
      this.setLastNumberToDispay();

   }

   clearEntry() {

      this._operation.pop();

      this.setLastNumberToDispay();

   }
   isOperator(value) {
      return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
   }
   getLastOperation() {
      return this._operation[this._operation.length - 1];
   }
   setLastOperation(value) {
      return this._operation[this._operation.length - 1] = value;
   }

   pushOperation(value) {

      this._operation.push(value);

      if (this._operation.length > 3) {

         this.calc();

      }
   }

   getResult() {

      return eval(this._operation.join(""));

   }

   calc() {

      let last = '';

      this._lastOperator = this.getLastItem();

      if (this._operation.length < 3) {

         let firsItem = this._operation[0];

         this._operation = [firsItem, this._lastOperator, this._lastNumber];

      }
      if (this._operation.length > 3) {

         last = this._operation.pop();

         this._lastNumber = this.getResult();

      } else if (this._operation.length == 3) {

         this._lastNumber = this.getLastItem(false);

      }
      /* 
          console.log('_lastOperator', this._lastOperator);
          console.log('lastNumber', this._lastNumber);
          */
      let result = this.getResult();


      if (last == "%") {

         result /= 100;

         this._operation = [result];

      } else {

         this._operation = [result];

         if (last) this._operation.push(last);

      }
      this.setLastNumberToDispay();
   }



   addOperation(value) {

      if (isNaN(this.getLastOperation())) {

         if (this.isOperator(value)) {

            this.setLastOperation(value);

         } else if (isNaN(value)) {

            console.log("outra coisa teste", value);

         } else {

            this.pushOperation(value);
            this.setLastNumberToDispay();
         }


      } else {

         if (this.isOperator(value)) {

            this.pushOperation(value);

         } else {

            let newValue = this.getLastOperation().toString() + value.toString();

            this.setLastOperation(newValue);

            this.setLastNumberToDispay();

         }

      }

   }

   setError() {
      this.displayCalc = "Erro";
   }

   addDot() {

      let lastOperation = this.getLastOperation();

      if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;


      if (this.isOperator(lastOperation) || !lastOperation) {
         this.pushOperation('0.');
      } else {
         this.setLastOperation(lastOperation.toString() + '.');
      }
      this.setLastNumberToDispay();
   }
   //Operadores de Funções - Final


   //Executaveis dos Buttons
   execBtn(value) {

      this.playAudio();

      switch (value) {

         case 'ac':
            this.clearAll();
            break;

         case 'ce':
            this.clearEntry();
            break;

         case 'soma':
            this.addOperation('+');
            break;

         case 'subtracao':
            this.addOperation('-');
            break;

         case 'multiplicacao':
            this.addOperation('*');
            break;

         case 'divisao':
            this.addOperation('/');
            break;

         case 'porcento':
            this.addOperation('%');
            break;

         case 'ponto':
            this.addDot('.');
            break;

         case 'igual':
            this.calc();
            break;

         case '0':
         case '1':
         case '2':
         case '3':
         case '4':
         case '5':
         case '6':
         case '7':
         case '8':
         case '9':
            this.addOperation(parseInt(value));
            break;


         default:
            this.setError();
            break;

      }
   }


   initButtonsEvents() {

      let buttons = document.querySelectorAll("#buttons > g, #parts > g");

      buttons.forEach((btn, index) => {

         this.addEventListenerAll(btn, "click drag", e => {

            let textbtn = btn.className.baseVal.replace("btn-", "");

            this.execBtn(textbtn);
         })

         this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

            btn.style.cursor = "pointer";

         })

      })

   }

   //Retorno de parametros privados para publicos
   get displayDate() {
      return this._dateEl.innerHTML;
   }

   set displayDate(value) {
      this._dateEl.innerHTML = value;
   }
   get displayTime() {
      return this._timeEl.innerHTML;
   }

   set displayTime(value) {
      this._timeEl.innerHTML = value;
   }

   get displayCalc() {
      return this._displayCalcEl.innerHTML;
   }

   set displayCalc(value) {

      if (value.toString().length > 10) {
         this.setError(); return
      }
      this._displayCalcEl.innerHTML = value;
   }

   get currentDate() {
      return new Date();
   }

   set currentDate(value) {
      this._currentDate = value;
   }
}