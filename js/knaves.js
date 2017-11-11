/**
* Infrastructure for "knights and knaves" puzzles.
*/

/**
* Model classes
*/
var originalNameSet = ["Alice", "Bob", "Carol", "Dave", 
	"Edward", "Francine", "Gary", 
	"Henry", "Ingrid", "Joan", "Kevin", "Lisa", "Mike",
	"Neil", "Owen", "Pat", "Quinn", "Rachel", "Sally",
	"Trevor", "Unis", "Victoria", "Wallace","Xavier",
	"Zelda"];

var nameSet; //to do, move to Islanders scope

class Puzzle {

	constructor() {
		this.islanders = null;
		this.statements = null;
		this.islanderControllers = null;
	}

	getIslanders() {
		return this.islanders;
	}
	
	getStatements() {
		return this.statements;
	}

	getControllers() {
		return this.islanderControllers;
	}

	resetIslanderControllers(){
		this.islanderControllers = {};
		var k = null;
		for (k in this.islanders) {
			this.islanderControllers[this.islanders[k].name] = new IslanderController(this.islanders[k]);		
		}
	}

	knaveNames() {
		var x;
		var list = [];
		for (x in this.knaves) {
			list.push(this.knaves[x].name);
		}
		return list;
	}

	toString() {
		return "Puzzle islanders [" + prettyPrintList(this.islanders) + "] knaves: [" 
			+ prettyPrintList(this.knaveNames()) +"]";
	}
}

class CompoundPuzzle extends Puzzle {

	constructor(names){
		super();
		this.puzzles = [];
		this.knaves = [];
		this.knights = [];
		this.islanders = [];
		this.islanderControllers = {};
		this.statements =[];
		this.nameSet = names;	
	}

	join(target) {
		console.log("joining with " + target);
		this.puzzles.push(target);
		this.knaves = addAllUnique(this.knaves, target.knaves);
		this.islanders = addAllUnique(this.islanders, target.islanders);
		this.statements = addAllUnique(this.statements, target.statements);
		this.resetIslanderControllers();
	}

	randomJoin(target) {
		var choice = randomInt(2);
		console.log("debug: random completion selected " + choice)
		if (choice == 0) {
			this.joinWithMatch(target);
		} else {
			this.joinWithCompound(target);
		}
	}

	joinWithMatch(target) {
		//select before joining
		var s = randomElement(this.getIslanders());
		var t = randomElement(target.getIslanders());
		this.join(target);
		var state = s.matchStatementFor(t);
		this.statements.push(state);		
	}

	joinWithCompound(target) {
		var s = randomElement(this.getIslanders());
		var t = randomElement(target.getIslanders());
		this.join(target);
		var state = s.compoundStatementFor(t);
		this.statements.push(state);
	}


}

class SimplePuzzle extends Puzzle {
	
	constructor(count, names) {
		super();
		this.count = count;
		if (count == 1) {
			this.liarCount = 1;
		} else if (count < 4) {
			this.liarCount = randomInt(count);
		} else {
			this.liarCount = randomRange(Math.floor(count/2)-1, count-2);
		}
		this.knaves = [];
		this.knights = [];
		this.islanders = [];
		this.islanderControllers = {};
		this.nameSet = names;
		if (typeof this.nameSet === "undefined") {
			this.nameSet = copyArray(originalNameSet);
		}
		for (var i=0; i < this.liarCount; i++) {
			var pos = randomRange(0, this.nameSet.length -1);
			var islander = new Knave(this.nameSet.splice(pos, 1)[0]);
			this.knaves.push(islander);
			this.islanderControllers[islander.name] = new IslanderController(islander);
		}

		for (var i = this.liarCount; i <this.count; i++) {
			var pos = randomRange(0, this.nameSet.length -1);
			var islander = new Knight(this.nameSet.splice(pos, 1)[0]);
			this.knights.push(islander);
			this.islanderControllers[islander.name] = new IslanderController(islander);
		}
		this.islanders = shuffle(this.knaves.concat(this.knights));
		this.statements = this.generateStatements();
		console.log("initialized: " + this);
	}

	generateStatements() {
		var statements = [];
		if (this.islanders.length < 2) {
			return statements;
		}
		var x;
		for (x in this.islanders) {
			var prevSource;
			var target = this.islanders[x];
			var remainders = arrayWithoutElement(this.islanders, target);
			if (prevSource !== undefined) {
				remainders = arrayWithoutElement(remainders, prevSource);
				if (remainders.length == 0) {
					console.log("had trouble finding new source");
					remainders = ArrayWithoutElement(this.islanders,target);
				}
			}
			var source = randomElement(remainders);
			statements.push(source.statementFor(target));	
			prevSource = source;
		}
		statements = pruneStatements(statements);
		statements = joinConnectedSets(this.islanders, statements);
		return shuffle(statements);
	}

	completeWithMatch() {
		if (this.islanders.length < 2) {
			return;
		}
		var source = randomElement(this.islanders);
		var remainders = arrayWithoutElement(this.islanders,source);
		
		var nbrs = allSourcesAndTargets(source, this.statements);
		var left = arrayDifference(remainders, nbrs);
		var target;
		if (left.length == 0) {
			console.log("having trouble finding unconnected islander...")
			target = randomElement(remainders);
		} else {
			console.log("finding unconnected islander");
			target = randomElement(left);
		}
		this.statements.push(source.matchStatementFor(target));
		shuffle(this.statements);
	}

	completeWithCompound() {
		if (this.islanders.length < 2) {
			return;
		}		
		var source = randomElement(this.islanders);
		var remainders = arrayWithoutElement(this.islanders,source);
		var nbrs = allSourcesAndTargets(source, this.statements);
		var left = arrayDifference(remainders, nbrs);
		var target;
		if (left.length == 0) {
			console.log("having trouble finding unconnected islander...")
			target = randomElement(remainders);
		} else {
			console.log("finding unconnected islander");
			target = randomElement(left);
		}
		this.statements.push(source.compoundStatementFor(target));
		shuffle(this.statements);	
	}

	randomCompletion() {
		var choice = randomInt(2);
		if (choice == 0) {
			this.completeWithMatch();
		} else {
			this.completeWithCompound();
		}
	}

}

class Islander {
	constructor (n) {
		this.name = n;
	}

	matchStatementFor(i) {
		if (i.isKnight()) {
			return new Sympathetic(this, i);
		} else {
			return new Antithetic(this, i);
		}
	}

	toString() {
		return this.name;
	}
}

class Knave extends Islander {
	isKnight() {
		return false;
	}
	
	statementFor(i) {
		if (i.isKnight()){
			return new Accusation(this, i);
		} else {
			return new Affirmation(this, i);
		}
	}

	compoundStatementFor(i) {
		return new Joint(this, i);
	}
	type() {
		return "knave";
	}
}

class Knight extends Islander {
	isKnight() {
		return true;
	}

	statementFor(i) {
		if (i.isKnight()){
			return new Affirmation(this, i);
		} else {
			return new Accusation(this, i);
		}
	}

	compoundStatementFor(i) {
		return new Disjoint(this, i);
	}
	type() {
		return "knight";
	}
}

class Statement {
	constructor(source, target){
		this.source = source;
		this.target = target;
		this.text == this.buildStatement();
	}

	fullStatement() {
		var fs = this.source.name;
		fs += " says: " + this.text + "."
		console.log(fs);
		return fs;
	}

}

class TypeStatement extends Statement {

	done(solver) {
		var hasTarget = arrayContains(solver.knights,this.target) || arrayContains(solver.knaves,this.target);
		var hasSource = arrayContains(solver.knights,this.source) || arrayContains(solver.knaves,this.source);  
		return hasTarget && hasSource;
	}

	process(known, solver) {
		if (this.source == known || this.target == known){
			var islanders = [];
			islanders.push(this.source);
			islanders.push(this.target);
			islanders = removeElement(islanders, known);
			var unknown = islanders[0];
			solver.reasoning.push(this.reasoning(known));
			if (unknown.isKnight()) {
				addUnique(solver.knights,unknown);
			} else {
				addUnique(solver.knaves, unknown);
			}
		}
	}

	solve(solver) {
		solver.typeStatements.push(this);
	}
}

class Accusation extends TypeStatement {	
	buildStatement() {
		var options = [
			" is lying",
			" is a knave",
			" always lies",
			" never tells the truth",
			" lies",
			" is untruthful"		
		];
		this.text = this.target.name + randomElement(options);
		return this.text;		
	}	

	reasoning(known){
		var islanders = [];
		islanders.push(this.source);
		islanders.push(this.target);
		islanders = removeElement(islanders, known);
		var unknown = islanders[0];
		var s = "A knight or knave will call the opposite type a knave." +
			" When a knight does this, they are telling the truth, when a knave does it they are lying. ";
		s += "So from this we know that "
		s += this.target + " and " + this.source + " are opposite types. "; 
		s += " Since " + known + " is a " + known.type() + ", then " + unknown + " is a " + unknown.type(); 
		return s;
	}
	
}

class Affirmation extends TypeStatement {
	buildStatement() {
		var options = [
			" is truthful",
			" is a knight",
			" always tells the truth",
			" never lies",
			" tells the truth"
		];
		this.text = this.target.name + randomElement(options);
		return this.text;		
	}

	reasoning(known){
		var islanders = [];
		islanders.push(this.source);
		islanders.push(this.target);
		islanders = removeElement(islanders, known);
		var unknown = islanders[0];
		var s = "A knight or knave will call one of their same kind a knight." +
			" When a knight does this, they are telling the truth, when a knave does it they are lying. ";
		s += "So from this we know that "
		s += this.target + " and " + this.source + " are the same type. "; 
		s += " Since " + known + " is a " + known.type() + ", then " + unknown + " is a " + unknown.type(); 
		return s;
	}
}

class Sympathetic extends Statement {
	buildStatement() {
		var options = [
			" is my type"
		];
		this.text = this.target.name + randomElement(options);
		return this.text;
	}

	reasoning(){
		var s = "A knight or a knave will say they are the same type as a knight.";
		s += " So when " + this.source + " says '" + this.text + ",' we know that ";
		s += this.target + " is a knight."; 
		return s;
	}

	solve(solver) {
		solver.reasoning.push(this.reasoning());
		addUnique(solver.knights, this.target);		
	}
}

class Antithetic extends Statement {
	buildStatement() {
		var options = [
			" is not my type"
		];
		this.text = this.target.name + randomElement(options);
		return this.text;
	}	

	reasoning(){
		var s = "Both knights and knaves will say they are not the same type as a knave.";
		s += " So when " + this.source + " says '" + this.text + ",' we know that ";
		s += this.target + " is a knave."; 
		return s;
	}

	solve(solver) {
		solver.reasoning.push(this.reasoning());
		addUnique(solver.knaves,this.target);		
	}
}

class Disjoint extends Statement {
	buildStatement() {
		this.text = this.target.name;
		if (this.target.isKnight()) {
			this.text += " is a knight ";
		} else {
			this.text += " is a knave ";
		}
		this.text += "or I am a knave"
		return this.text;		
	}

	reasoning(){
		var s = "When " + this.source + " said '"+ this.text +",'";
		s += " we know this is not a false statement (if it was false, this would make the speaker a knave, which would make the statment true)."
		s += " So, " + this.source + " is a knight and " + this.target;
		s += " is a " + this.target.type() +".";
		return s;			
	}
	
	solve(solver) {
		solver.reasoning.push(this.reasoning());
		
		addUnique(solver.knights, this.source);
		if (this.target.isKnight()) {
			addUnique(solver.knights, this.target);
		} else {
			addUnique(solver.knaves, this.target);
		}
	}
}

class Joint extends Statement {
	buildStatement() {
		this.text = this.target.name;
		if (this.target.isKnight()) {
			this.text += " is a knave ";
		} else {
			this.text += " is a knight ";
		}
		this.text += "and I am a knave";
		return this.text;		
	}

	reasoning(){
		var s = "Because " + this.source + " said '"+ this.text +",'";
		s += " we know they are not making a true statement (if it was true, the speaker would be a knave, making the statmeent false)."; 
		s += " Therefore, " + this.source + " is a knave and ";
		if (this.target.isKnight()) {
			s += " is a knight.";
		} else {
			s += " is a knave.";
		}
		return s;			
	}

	solve(solver) {
		solver.reasoning.push(this.reasoning());
		addUnique(solver.knaves, this.source);
		if (this.target.isKnight()) {
			addUnique(solver.knights,this.target);
		} else {
			addUnique(solver.knaves,this.target);
		}
	}
}

class Solver {
	constructor(puzzle) {
		this.puzzle = puzzle;
		this.reasoning = [];
		this.typeStatements = [];
		this.knights = [];
		this.knaves = [];
	}

	solve() {
		console.log("computing solution....");
		var x;
		for (x in this.puzzle.statements) {
			var statement = this.puzzle.statements[x];
			statement.solve(this);
		}
		
		var remainingStatements = copyArray(this.typeStatements);
	
		while(remainingStatements.length !== 0) {
			var nextRemaining = copyArray(remainingStatements);
			var y;
			for (y in remainingStatements) {
				var s = remainingStatements[y];
				if (s.done(this)) {
					nextRemaining = removeElement(nextRemaining, s);
					continue;
				}
				var knaveCopy = copyArray(this.knaves);
				var z;
				for (z in knaveCopy){
					s.process(knaveCopy[z], this);
				}
				var knightCopy = copyArray(this.knights);
				var w;
				for (w in knightCopy){
					s.process(knightCopy[w], this);
				}
			}
			remainingStatements = nextRemaining;
		}
		var i;
		for (i in this.reasoning) {
			console.log(this.reasoning[i]);
		}
		console.log(this.toString());
	}

	toString() {
		return "knights: " + this.knights + " knaves: " + this.knaves;
	}
}

/**
* Controlers
*/

class IslanderController {
	constructor(islander) {
		this.islander = islander;
		this.selected = false;
	}

	display() {
		var txt = "glyphicon glyphicon-unchecked";
		if (this.selected) {
			txt = "glyphicon glyphicon-checked";
		}
		var btn = "<li><span class='padSpan'>" + this.islander.name + "</span>";
		btn +=  "<button type='button' id='"+ this.islander.name + "' class='btn btn-primary', onclick='selectIslander(event)'>";
		btn += "<span class='glypicon " + txt + " lrg-font'></span>"
		btn += "</button> </li>";
		return btn;		
	}	
}

class IslandControllers {
	constructor(island) {
		this.island = island;
	}

	accusationDisplay() {
		var p = "<div><p>"
		p += "You have met a group of " + this.island.islanders.length + " islanders.";
		p += " Their names are " + prettyPrintList(this.island.islanders) +".";
		p += "</div>";

		var s = "<div> <ul>";
		var i;
		var statements = this.island.getStatements();
		for (i in statements ) {
			s += statements[i].fullStatement();
			s += "</br>";
		}
		s += "</ul></div>";
		return p + s;
	
	}

	islandersDisplay() {
		var s = "<div> <ul>";
		var i;
		for (i in this.island.getIslanders()) {
			s += new IslanderController(this.island.getIslanders()[i]).display();
		}
		s += "</ul></div>";
		return s;
	}

}

var knavesList = [];
function selectIslander(event) {
	var theKnave = event.currentTarget.id;
	knavesList = addOrRemove(knavesList, theKnave);
	if (arrayContains(knavesList,theKnave)) {
		$("#" + theKnave).addClass("btn-danger");
	} else {
		$("#" + theKnave).removeClass("btn-danger");	
	}
	console.log(knavesList);
};


class StatementController {

}

/**
* Utility functions - mostly managing arrays
*/

function prettyPrintList(list) {
	var s = "";
	var i;
	for (i in list) {
		if (i != 0 && list.length != 2) {
			s +=",";
		} 
		if (i == list.length -1 && list.length !== 1) {
			s += " and";
		}
		s += " ";
		s += list[i];	
	}
	return s;
}

function joinConnectedSets(islanders, listOfStatements) {
	//1 calculate the connected sets
	var cSets = connectedSets(islanders, islanders, listOfStatements, [], []);

	//2 if there is only one connected set, then return
	if (cSets.length == 1) {
		console.log("the statments form a connected graph - no joins required");
		return listOfStatements;
	}
	//3 otherwise, add statements that will connect the sets
	// use a simple join based on the first element of the first set.
	var joiner = cSets[0][0];
	var remainingSets = removeElement(cSets, cSets[0]);
	var newStatements = [];
	var x;
	for (x in remainingSets) {
		var joinee = remainingSets[x][0];
		newStatements.push(joinee.statementFor(joiner));
		console.log("linking disjoint sets using " + joiner.name + " and " + joinee.name);
	}
	console.log("adding " + newStatements.length + " statements to connect the sets");
	return listOfStatements.concat(newStatements);
}


function pruneStatements(listOfStatements) {
	var x;
	var extras = [];
	for (x in listOfStatements) {
		var e = listOfStatements[x];
		if (arrayContains(extras, e)) continue;
		var s = e.source;
		var t = e.target;
		var remainder = arrayWithoutElement(listOfStatements, e);
		var y;
		for (y in remainder){
			var e1 = remainder[y];
			var s1 = e1.source;
			var t1 = e1.target;
			if (s1 === t && t1 ===s) {
				extras.push(e1);
			}
		}
	}
	console.log("pruning " + extras.length + " statments from original list of " + listOfStatements.length);
	return arrayDifference(listOfStatements, extras);
}

//returns all islanders that are neighbors of the current islander
function allSourcesAndTargets(islander, listOfStatements) {
	var list = [];
	list.push(islander);
	var x;
	for (x in listOfStatements) {
		var source = listOfStatements[x].source;
		var target = listOfStatements[x].target;
		if (islander === source) {
			list.push(target);
		}
		if(islander === target) {
			list.push(source);
		}
	}
	return list;
};

function allReachable(islander, listOfStatements, listSoFar) {
	var reachable = copyArray(listSoFar);	
	var immediateNeigbours = allSourcesAndTargets(islander, listOfStatements);
	reachable = addAllUnique(reachable,immediateNeigbours);
	//stop if we are not growing
	if (arraysEquivalent(reachable, listSoFar)) return listSoFar;
	//continue onto immediateNeighbors
	for (x in immediateNeigbours) {
		addAllUnique(reachable, allReachable(immediateNeigbours[x], listOfStatements, reachable));
	}
	return reachable;
};

function connectedSets(islanders, completeIslanders, listOfStatements, setList, soFar) {
	//1 start with the first islander, and get the connected set.
	var connect1 = allReachable(islanders[0], listOfStatements, []);
	addAllUnique(soFar, connect1);
	setList.push(connect1);
	//2 end contition
	if (arraysEquivalent(completeIslanders, soFar)) {
		return setList;
	}
	//3 recurse down
	var remainder = arrayDifference(islanders, soFar);
	return connectedSets(remainder,completeIslanders, listOfStatements, setList, soFar);
}


function randomInt(lessThan){
	return Math.floor(Math.random()*lessThan);
};

function randomRange(greaterThan, lessThan){
	var shifted = randomInt(lessThan - greaterThan);
	return lessThan - shifted; 
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = randomRange(0, currentIndex -1);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

function arrayWithoutElement(array, e) {
	var x;
	var remainder = [];
	for (x in array) {
		if (array[x] !== e) {
			remainder.push(array[x]);
		}
	}
	return remainder;
}

function arrayContains(array, e) {
	var x;
	for (x in array) {
		if (array[x] === e) {
			return true;
		}
	}
	return false;
};

function arrayContainsArray(array1, array2) {
	var x;
	for (x in array2) {
		var a = arrayContains(array1, array2[x]);
		if (a!==true) { return false };
	}
	return true;
};

function arraysEquivalent(array1, array2) {
	return arrayContainsArray(array1, array2) && arrayContainsArray(array2, array1);
};


function addOrRemove(array, e) {
	if (arrayContains(array,e)){
		return arrayWithoutElement(array, e);
	} else {
		array.push(e);
		return array;
	}
};

function removeElement(array, e) {
	var newArray = [];
	var x;
	for (x in array) {
		if (e !== array[x]) {
			newArray.push(array[x]);
		}
	}
	return newArray;
}

function addUnique(array, e) {
	if (arrayContains(array, e)){
		return array;
	} else {
		array.push(e);
		return array;
	}
};

function addAllUnique(array1, array2) {
	var x;
	for (x in array2){
		addUnique(array1, array2[x]);
	}
	return array1;
};

function arrayDifference(array1, array2) {
	var newArray = copyArray(array1);
	var x;
	for (x in array2) {
		newArray = removeElement(newArray, array2[x]);
	}
	return newArray;
}

function copyArray(array) {
	var newArray = [];
	var x;
	for (x in array) {
		newArray.push(array[x])
	}
	return newArray;
};

function randomElement(array) {
	var res =randomRange(0, array.length -1);
	console.log("random element: " + res);
	return array[res];
};
