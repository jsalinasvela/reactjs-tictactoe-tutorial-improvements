import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const lines = [
	[0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],	
];

class Square extends React.Component {

	/*
	constructor(props){
		super(props);
		this.state = {
			value:null,
		};
	}
	*/
	render() {
	    return (
	      <button className="square" onClick={()=>{this.props.onClick()}} style={this.props.style}>
	        {this.props.value}
	      </button>
	    );
	}
}

class Board extends React.Component {
  	/*
	constructor(props){
		super(props);
		this.state ={
			squares:Array(9).fill(),
			xIsNext:true,
		};
	}
	*/

	
    renderSquare(i) {
	    return (
	    	<Square 
	    		//value={this.state.squares[i]} 
	    		//onClick={()=>this.handleClick(i)}
	    		value={this.props.squares[i]}
	    		onClick={()=>this.props.onClick(i)}
	    		style={this.props.myStyle[i]}
	    		key={i}
	    	/>
	    );
  	}

    render() {

		//const status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');

	    return (
		    <div>
		      	
		        <div className="status">{/*status*/}</div>

		        {/*
		        <div className="board-row">
		          {this.renderSquare(0)}
		          {this.renderSquare(1)}
		          {this.renderSquare(2)}
		        </div>
		        <div className="board-row">
		          {this.renderSquare(3)}
		          {this.renderSquare(4)}
		          {this.renderSquare(5)}
		        </div>
		        <div className="board-row">
		          {this.renderSquare(6)}
		          {this.renderSquare(7)}
		          {this.renderSquare(8)}
		        </div>
		        */
		        }

		        {this.createBoard()}
		    </div>		
	      
	    );
    }

    createBoard= ()=>{
    	let myBoard = [];

    	//OUter loop to create parent
    	for (let i=0; i<3;i++){
    		let children =[];
    		for (let j = 3*i; j < 3*i+3; j++) {
    			//console.log(j);
    			children.push(this.renderSquare(j));
    		}
    		myBoard.push(<div className='board-row' key={i}>{children}</div>)
    	}
    	return myBoard;
    }
}

class Game extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			history:[{
				squares:Array(9).fill(null),
				position:0,
				moveNumber:0
			}],
			stepNumber:0,
			xIsNext:true,
			ascending:true,
			winnerSquares:null,  
			isDraw:0,
			checkedDraw:Array(8).fill(null),
		};
	}

    render() {

    	const history = this.state.history;
    	const current = history[this.state.stepNumber];
    	//const winner = this.calculateWinner(current.squares);
    	const list_moves = history.slice(1, this.state.stepNumber + 1);

    	const rawmoves = (this.state.ascending)?list_moves:list_moves.reverse();

    	console.log("Rawmoves: "+JSON.stringify(rawmoves));

    	/*
    	const moves = rawmoves.map((step, move) => {
    		//const desc = (move)?('Go to move #'+move+JSON.stringify(step)):'Go to game start'
    		const lastPosCol=calcCol(step.position);
    		const lastPosRow=Math.ceil(step.position/3);
    		const divStyle={
    			fontWeight:'bold',
    		}
    		const desc = 'Go to move #'+(move)+' at position (col:'+lastPosCol+' row:'+lastPosRow+')';
    		//very next constant is to decide whether we are in the current step: If we are, we assign divStyle to the button and bold its content.
    		const moveStyle = (move===this.state.stepNumber)?divStyle:{};
    		return (
    			<li key={move}>
    				<button onClick={ () => this.jumpTo(move)} style={moveStyle}>{desc}</button>
    			</li>
    		);
    	}); */

    	const moves = rawmoves.map((step) => {
    		
    		const lastPosCol=calcCol(step.position);
    		const lastPosRow=Math.ceil(step.position/3);
    		const divStyle={
    			fontWeight:'bold',
    		}
    		const desc = 'Go to move #'+(step.moveNumber)+' at position (col:'+lastPosCol+' row:'+lastPosRow+')';
			//very next constant is to decide whether we are in the current step: If we are, we assign divStyle to the button and bold its content.
    		const moveStyle = (step.moveNumber===this.state.stepNumber)?divStyle:{};
    		return (
    			<li key={step.moveNumber}>
    				<button onClick={ () => this.jumpTo(step.moveNumber)} style={moveStyle}>{desc}</button>
    			</li>
    		);
    	});
    	
    	//let status;
    	//let squareStyle={};
    	
    	//if (winner) {
    		/*
    		status='Winner: '+winner;
    		console.log('Winner: '+ status);
    		*/
    		/*
    		squareStyle={
    			background:'yellow',
    		}
    		*/
    	//}else{
    		/*
    		status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
    		*/
    	//}

    	let togbutton = () =>{
    		return(
    			<button onClick={ () => this.toggleOrder()}>Toggle Order</button>
    		);
    	}

    	let highlightArray = ()=>{

    		let squareStyles= Array(9).fill(null);
    		let sqStyle={
    			background:'yellow',
    		}

    		console.log('winnerSquares after rendering: '+this.state.winnerSquares);

    		if (this.state.winnerSquares) {
    			console.log('I am here');
    			for (var i = 0; i < this.state.winnerSquares.length; i++) {
    				squareStyles[this.state.winnerSquares[i]]=sqStyle;
    			}
    			return squareStyles;
    		}else{
    			return squareStyles;
    		}
    	}

    	let getStatus = ()=>{

    		let nextStatus=this.state.xIsNext ? 'X':'O';
    		let status;
    		if (this.state.winnerSquares) {
    			status='Winner: '+this.state.winnerSquares;
    			console.log('Winner: '+ status);
    		}else{
    			if (this.state.isDraw>7 || (this.state.isDraw==7 &&  this.checkSeven(this.nullIndex(this.state.checkedDraw),nextStatus, current))){
    				//if there is a draw
    				status = "It's a DRAW!!!";
    					
    			}else{
    				//if it is not a draw yet, then check who is next in the game
    				status = 'Next player: ' + (nextStatus);
    			}
    			
    		}
    		return status;
    	}

	    return (
	      <div className="game">
	        <div className="game-board">
	          <Board 
	          	squares={current.squares}
	          	onClick={(i)=>this.handleClick(i)}
	          	myStyle={highlightArray()}
	          />
	        </div>
	        <div className="game-info">
	          <div>{/*status*/}</div>
	          <div>{getStatus()}</div>
	          <ol>
	          	<li><button onClick={ () => this.jumpTo(0)}>Go to Game Start</button></li>
	          	{moves}
	          </ol>
	          <div>{togbutton()}</div>
	        </div>
	      </div>
	    );
    }

    checkSeven(nullIndex, nextStatus, current){
    	for (var i = 0; i < lines[nullIndex].length; i++) {
    		if(current.squares[lines[nullIndex][i]] && current.squares[lines[nullIndex][i]]!=nextStatus){
    			return true;
    		}
    	}
    	return null;
    }


    handleClick(i){

    	const history = this.state.history.slice(0, this.state.stepNumber + 1);
    	const current = history[history.length-1];

		const squares = current.squares.slice();
		let nextStatus=this.state.xIsNext ? 'X':'O';

		//const squaresWinner = this.calculateWinner(squares);
		if (this.state.winnerSquares || squares[i] || this.state.isDraw>7 || (this.state.isDraw==7 &&  this.checkSeven(this.nullIndex(this.state.checkedDraw),nextStatus, current))) {
			//if there is already a winner or if this square was already clicked
			//do not do anything if this happens; only highlight if there is a winner
			return;
		}

		//we make the change based on the last state
		squares[i]= this.state.xIsNext ? 'X':'O';
		//
		const oldNumber= current.moveNumber;
		this.setState({
			history:history.concat([{
				squares:squares,
				position:i+1,
				moveNumber:oldNumber+1,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			//lastPosition: i+1,  //showing last position as [1,2...9]
		});

		console.log("Estado:"+this.state);
		console.log("history: "+JSON.stringify(this.state.history));


		//the constant 'squares' has now acquired the new value with the new move 
		const nowSquaresWinner = this.calculateWinner(squares);

		//history STATE is NOT CHANGINGGGG UNTIL WE GET TO THE RENDERRRR!!!!

		console.log('nowSquaresWinner: '+nowSquaresWinner);
		if (nowSquaresWinner) {
			console.log('I am changing this fucker');
			this.highlightWinners(nowSquaresWinner);
		}

	}


	jumpTo(step){
		this.setState({
			stepNumber:step,
			xIsNext:(step % 2)===0,
		});
	}

	toggleOrder(){
		this.setState({
			//changing the state of the toogle button
			ascending:!this.state.ascending,
		});
	}

	highlightWinners(squareWinners){
		console.log('I am changing this fucker');
		this.setState({
			winnerSquares:squareWinners,
		});

	}

	calculateWinner(squares){
		

		//const checkedDraw = Array(lines.length).fill(null);
		let aux=0;
		for (var i = 0; i < lines.length; i++) {
			const [a,b,c] = lines[i];
			if (squares[a] && squares[a]=== squares[b] && squares[a]===squares[c]) {
				//there is a winner
				//return squares[a];
				return [a,b,c];
			}
			//if following lines are executed, it means there is not a winner
			//checking whether the possible winning outcome has been filled with non-winning moves
			/*
			if (squares[a] && squares[b] && squares[c]) {
				const oldIsDraw=this.state.isDraw;
				this.setState({
					isDraw:oldIsDraw+1,
				});
				console.log("changing isDraw to:"+(oldIsDraw+1));
			}
			*/

			//check if at least 2 squares of a winning outcome are different => if this happens, then add up one to isDraw and checkedDraw
			//console.log('Draw array: '+checkedDraw.toString());
			
			if (!this.state.checkedDraw[i] && (this.checkDraw([squares[a], squares[b], squares[c]]))) {
				const oldIsDraw=this.state.isDraw;
				const newCheckedDraw=this.state.checkedDraw;
				newCheckedDraw[i]=true;
				//this variable aux is to deal with times when one move sets two or more possible winning outcomes to DRAW, given that even though we update the state here the real state is not updated until it is rendered
				aux+=1;

				this.setState({
					isDraw:oldIsDraw+aux,
					checkedDraw:newCheckedDraw,
				});

				console.log("changing isDraw to:"+(oldIsDraw+aux));
			}
		}
		return null;
	}

	checkDraw(threeSquares){
		let winningValue=null;
		for (var i = 0; i < threeSquares.length; i++) {
			if (threeSquares[i]) {
				if (threeSquares[i]!==winningValue && winningValue) {
					return true;
				}
				winningValue=threeSquares[i];
			}

		}
		return false;
	}

	nullIndex(myarray){
		for (var i = 0; i < myarray.length; i++) {
			if (!myarray[i]) {
				return i;
			}
		}
	}
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
  //console.log();
);

/*
function calculateWinner(squares){
	

}*/

function calcCol(position){

	let result= position%3;
	let colNumber;
	switch(result){
		case 0:
			colNumber=3;
			break;
		case 1:
			colNumber=1;
			break;
		case 2:
			colNumber=2;
			break;
		default:
			colNumber=0;
	}
	return colNumber;
}

/*

function highlightWinners(squareWinners){
	this.setState({
			winnerSquares:squareWinners,
		});

}
*/

