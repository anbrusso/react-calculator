import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
  class CalculatorDisplay extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
      return (
        <div className="calculator-display">
          <input type="text" readOnly value = {this.props.value} maxLength="27"/>
        </div>
      );
    }
  }
  class CalculatorButtons extends React.Component {
    constructor(props){
        super(props);
    }
    renderNumberButton(i){
      return  <button onClick={()=>{this.props.onClick("number",i)}}> 
                {i}
              </button>
    }
    renderFunctionButton(i){
      return <button onClick={()=>{this.props.onClick("function",i)}}> 
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
            isMultiple : false
          }
      }

    updateDisplay(type, button){
      const operations = this.state.operations.slice()
      const current = operations[operations.length - 1];
      const isMultiple = this.state.isMultiple;
      if(type==="function"){
        switch(button){
          
        }
          if(button === "C"){
            let newoperations = ["0"];
            this.setState({
              operations : newoperations
            });
          }
          else if(button === "+/-"){
            let newoperations = this.state.operations.slice(0, operations.length - 1);
            if(current.charAt(0)==="-"){
              newoperations.push(current.replace("-",""));
            }
            else{
              newoperations.push("-"+current);
            }
            this.setState({
              operations : newoperations,
              isMultiple : false
            });
          }
          else if(button === "+" || button === "-" || button === "*" || button === "/"){
            let newoperations;
            if(isMultiple){
              newoperations = this.state.operations.slice(0, operations.length - 2);
              newoperations.push(button);
              newoperations.push("0");
            }
            else{
              newoperations = this.state.operations.slice();
              newoperations.push(button);
              newoperations.push("0");
            }
            this.setState({
              operations : newoperations,
              isMultiple : true
            });
          }
          else if(button === "="){
            let newoperations;
            let firstnumber = this.state.operations[operations.length - 3];
            let secondnumber = this.state.operations[operations.length - 1];
            let operation = this.state.operations[operations.length - 2];
            let result;
            if(operation === "+"){
              result = parseFloat(firstnumber) + parseFloat(secondnumber);
            }
            else if(operation === "-"){
              result = parseFloat(firstnumber) - parseFloat(secondnumber);
            }
            else if(operation === "*"){
              result = parseFloat(firstnumber) * parseFloat(secondnumber);
            }
            else if(operation === "/"){
              result = parseFloat(firstnumber) / parseFloat(secondnumber);
            }
            newoperations = this.state.operations.slice();
            newoperations.push(result+"");
            this.setState({
              operations : newoperations,
              isMultiple : false
            });
          }
      }
      else if(type == "number"){
        let newtext;
        if(current == "0"){
          newtext  = button + ""
        }
        else{
          newtext = current + button + ""
        }
        let newoperations = this.state.operations.slice(0, operations.length - 1);
        newoperations.push(newtext);
        this.setState({
          operations : newoperations,
          isMultiple : isMultiple
        });
      }
    }
    render() {
      const operations = this.state.operations.slice()
      const current = operations[operations.length - 1];
      console.log(operations);
      return (
        <div className="calculator">
            <CalculatorDisplay 
              value = {current} 
            />
            <CalculatorButtons
              onClick ={(type,action) => this.updateDisplay(type,action)}
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