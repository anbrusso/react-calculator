import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
  class CalculatorDisplay extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
      if(!this.props.errorText){
        return (
          <div className="calculator-display">
            <input type="text" readOnly value = {this.props.value} maxLength="27"/>
          </div>
        );
      }
      else{
        return (
          <div className="calculator-display">
            <input type="text" readOnly value = {this.props.errorText} maxLength="27"/>
          </div>
        );
      }
    }
  }
  class CalculatorHistory extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
      return (
       this.props.history.map((h,i) => <div key={i + "sadf"}>{h}</div>)
      )
    }
  }
  class CalculatorButtons extends React.Component {
    constructor(props){
        super(props);
    }
    renderNumberButton(i){
      return  <button onClick={()=>{this.props.numberButton(i)}}> 
                {i}
              </button>
    }
    renderFunctionButton(i){
      return <button onClick={()=>{this.props.functionButton(i)}}> 
              {i}
            </button>
    }

    render() {
      return (
        <div className="calculator-buttons">
            {this.renderFunctionButton("%")}
            {this.renderFunctionButton("CE")}
            {this.renderFunctionButton("C")}
            {this.renderFunctionButton("<--")}

            {this.renderFunctionButton("1/x")}
            {this.renderFunctionButton("x^2")}
            {this.renderFunctionButton("sqrt(x)")}
            {this.renderFunctionButton("/")}

            {this.renderNumberButton(7)}
            {this.renderNumberButton(8)}
            {this.renderNumberButton(9)}
            {this.renderFunctionButton("*")}

            {this.renderNumberButton(4)}
            {this.renderNumberButton(5)}
            {this.renderNumberButton(6)}
            {this.renderFunctionButton("-")}

            {this.renderNumberButton(1)}
            {this.renderNumberButton(2)}
            {this.renderNumberButton(3)}
            {this.renderFunctionButton("+")}

            {this.renderFunctionButton("+/-")}
            {this.renderNumberButton(0)}
            {this.renderNumberButton(".")}
            {this.renderFunctionButton("=")}
        </div>
      );
    }
  }

  class Calculator extends React.Component {
      constructor(props){
          super(props);
          this.state = {
            operations : ["0"],
            isOperating : false,
            errorText : "",
            history: []
          }
      }
    //perform the button press for a number
    numberButton(button){
      const operations = this.state.operations.slice()
      const current = operations[operations.length - 1];
      const errorText = this.state.errorText;
      let isOperating = this.state.isOperating;
      let newtext;
      let newoperations
      //if the current number is a zero, we replace it with a new number
      if(current == "0"){
        newtext  = button + ""
        newoperations = this.state.operations.slice(0, operations.length - 1);
      }
      //there's already a number on the display.
      else{
        //when operator button is pressed, we replace the current display with a new number
        //otherwise we are appending to what is displayed
        if(isOperating){
          newtext = button + "";
          isOperating = false;
          newoperations = this.state.operations.slice();
        }
        else{
          //the decimal button is special, we don't want to add two of them
          if(button == "." && current.includes(".")){
            return;
          }
          newtext = current + button + ""
          newoperations = this.state.operations.slice(0, operations.length - 1);
        }
      }
      newoperations.push(newtext);
      
      this.setState({
        operations : newoperations,
        isOperating : isOperating,
        errorText : ""
      });
    }
    //given two string  numbers, performs the specified operation and returns the result.
    doBinaryOperation(firstnumber,secondnumber,operation){
      let result;
      switch(operation){
        case "+":
          result = parseFloat(firstnumber) + parseFloat(secondnumber);
          break;
        case "*":
          result = parseFloat(firstnumber) * parseFloat(secondnumber);
          break;
        case "-":
          result = parseFloat(firstnumber) - parseFloat(secondnumber);
          break;
        case "/":
          result = parseFloat(firstnumber) / parseFloat(secondnumber);
          break;
      }
      return result;
    }
    //given a string  number, performs the specified operation and returns the result.
    doUnaryOperation(number,operation){
      let result;
      switch(operation){
        case "+/-":
          result = -parseFloat(number);    
          break;
        case "x^2":
          result = Math.pow(parseFloat(number), 2);     
          break;
        case "1/x":
          result = 1/parseFloat(number);      
          break;
        case "sqrt(x)":
          let float = parseFloat(number);
          if(float > 0){
            result = Math.sqrt(number);
          }
          else{
            result = parseFloat(number);
          }
          break;
      }
      return result;
    }
    //perform the button press for a function button
    functionButton(button){
      const operations = this.state.operations.slice();
      const current = operations[operations.length - 1];
      let isOperating = this.state.isOperating;
      let newoperations = operations.slice();
      let newErrorText =  this.state.errorText;
      let newHistory =  this.state.history;
      switch(button){
        case "C":
          newHistory = [];
          //clear button resets the history completely
          newoperations = ["0"];
          break;
        case "CE":
          //clear entry button either sets the last number to zero, or if an operator is the last button pressed
          //it will push a zero.
          if(isOperating){
            newoperations.push("0");
            isOperating = false;
          }
          else{
            newoperations = this.state.operations.slice(0, operations.length - 1);
            newoperations.push("0");
          }
          break;
        case "<--":
          //backspace button only works when not operating, in which case it removes the last numbe entered.
          //when there is only one number it replaces it with zero.
          if(!isOperating){
            let removed = current.slice(0,-1);
            newoperations = this.state.operations.slice(0, operations.length - 1);
            if(removed){
              newoperations.push(removed);
            }
            else{
              newoperations.push("0");
            }
          }
          break;
        //unary operators all are handled the same
        case "+/-":
        case "1/x":
        case "x^2":
        case "sqrt(x)":
          let result;
          let number;
          //if an bianry operation is in progress, we clear it and use the number before it
          if(isOperating){
            number = this.state.operations[operations.length - 2];
            newoperations = this.state.operations.slice(0, operations.length - 1);
            isOperating = false;
          }
          else{
            number =  this.state.operations[operations.length - 1];
          }
          result = this.doUnaryOperation(number,button);
          newHistory.push(number + " " + button);
          newoperations.push(button);
          newoperations.push(result+"");
          break;
        //binary operators all are handled the same.
        case "+":
        case "-":
        case "*":
        case "/":
          //if a binary operator is already in progress, we just swithc operations, otherwise
          //we add the operation to the operation list.
          if(isOperating){
            newoperations = this.state.operations.slice(0, operations.length - 1);
            newoperations.push(button);
          }
          else{
            newoperations = this.state.operations.slice();
            newoperations.push(button);
            isOperating = true;
          }
          break;
        //equals button behavior varies considerably based on what was recently pressed.
        //TODO: this behavior needs to be worked through more.
        case "=":
          //if you hit equals while an operator was recently hit, do operation on same number.
          if(isOperating){
            let number = this.state.operations[operations.length - 2];
            let operation = this.state.operations[operations.length - 1];
            let result = this.doBinaryOperation(number,number,operation);
            newHistory.push(number + " " + operation + " " + number + " = " + result);
            newoperations = this.state.operations.slice();
            newoperations.push(number);
            newoperations.push("=");
            newoperations.push(result+"");
            isOperating = false;
          }
          else{
            let firstnumber = this.state.operations[operations.length - 3];
            let operation = this.state.operations[operations.length - 2];
            let secondnumber = this.state.operations[operations.length - 1];
            let result = this.doBinaryOperation(firstnumber,secondnumber,operation);
            if (result === Infinity){
              newErrorText = "Division by zero is undefined";
              newoperations = ["0"];
              this.setState({
                operations : newoperations,
                isOperating : isOperating,
                errorText : newErrorText
              });
              return;
            }
            newHistory.push(firstnumber + " " + operation + " " + secondnumber + " = " + result);
            newoperations = this.state.operations.slice();
            newoperations.push("=");
            newoperations.push(result+"");
          }
          break;
      }
      this.setState({
        operations : newoperations,
        isOperating : isOperating,
        errorText : newErrorText,
        history: newHistory
      });
    }
    render() {
      const operations = this.state.operations;
      const history = this.state.history;
      const isOperating = this.state.isOperating;
      const errorText = this.state.errorText;
      let display;
      //if an operation is in progress, it is on the operations list, so we ignore it so the display is showing the correc thing still.
      if (isOperating){
        display = operations[operations.length - 2];
      }
      else{
        display = operations[operations.length - 1];
      }
      console.log(operations);
      return (
        <div>
            <div className="calculator">
              <CalculatorDisplay 
                value = {display}
                errorText= {errorText}
              />
              <CalculatorButtons
                numberButton ={(button) => this.numberButton(button)}
                functionButton ={(button) => this.functionButton(button)}
              />
             </div>
            <CalculatorHistory
              history = {history}
            />
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Calculator />,
    document.getElementById('root')
  );