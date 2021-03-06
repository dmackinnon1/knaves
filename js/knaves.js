
/**
 * Names used in puzzles
 */
var originalNameSet = ["Alice", "Bob", "Carol", "Dave", 
	"Edward", "Francine", "Gary", 
	"Henry", "Ingrid", "Joan", "Kevin", "Lisa", "Mike",
	"Neil", "Owen", "Pat", "Quinn", "Rachel", "Sally",
	"Trevor", "Unis", "Victoria", "Wallace","Xavier",
	"Yasmin","Zelda"];

var originalNameSet1 = ["Arthur", "Beatrix", "Connor", "Denise", 
	"Eustice", "Frank", "Gwen", 
	"Hillary", "Ira", "Justin", "Kirstin", "Larry", "Michelle",
	"Nancy", "Oberon", "Pamela", "Quentin", "Robert", "Samuel",
	"Tracy", "Uri", "Vincent", "Wendy","Xan",
	"Yuri","Zoro"];

function nameSet() {
	return randomElement([originalNameSet1, originalNameSet]);
}

controllers = {};
controllers.disabled = false;
/**
* Model classes
*/

class PuzzleGenerator {

	constructor() {
		this.puzzle = null;
	}

	easy() {
		var choice = randomInt(3);
		console.log("easy puzzle topology: " + choice);		
		if (choice == 0) {
			this.easy0();
		} else if (choice == 1){
			this.easy1();		
		} else {
			this.easy2();
		}
	}

	medium() {
		var choice = randomInt(3);
		console.log("medium puzzle topology: " + choice);
		if (choice == 0) {
			this.medium0();
		} else if (choice == 1){
			this.medium1();		
		}  else if (choice == 2){
			this.medium2();
		}
	}

	hard(){
		var choice = randomInt(2);
		console.log("hard puzzle topology: " + choice);
		if (choice == 0) {
			this.hard0();
		} else if (choice == 1){
			this.hard1();		
		}  
	}

	easy0(){
		this.puzzle = new SimplePuzzle(2, copyArray(nameSet()));
		this.puzzle.completeWithMatch();
		return this.puzzle;		
	}

	easy1(){
		this.puzzle = new SimplePuzzle(2, copyArray(nameSet()));
		this.puzzle.completeWithCompound();
		return this.puzzle;
	}

	easy2(){
		this.puzzle = new SimplePuzzle(3, copyArray(nameSet()));
		this.puzzle.randomCompletion();
		return this.puzzle;
	}

	medium0(){
		var names = copyArray(nameSet());
		var basic = new SimplePuzzle(3, names);
		var basic1 = new SimplePuzzle(1, names);
		basic.randomCompletion();
		this.puzzle = new CompoundPuzzle();
		this.puzzle.join(basic);
		this.puzzle.randomJoin(basic1);
		return this.puzzle;
	}

	medium1(){
		var names = copyArray(nameSet());
		var basic = new SimplePuzzle(3, names);
		basic.completeWithMatch();
		this.puzzle = new CompoundPuzzle();
		this.puzzle.join(basic);
		return this.puzzle;
	}

	medium2(){
		var names = copyArray(nameSet());
		var basic = new SimplePuzzle(1, names);
		var basic1 = new SimplePuzzle(3, names);
		this.puzzle = new CompoundPuzzle();	
		this.puzzle.join(basic);		
		this.puzzle.joinWithCompound(basic1);
		return this.puzzle;
	}

	hard0() {
		var names = copyArray(nameSet());
		var basic = new SimplePuzzle(3, names);
		var basic2 = new SimplePuzzle(3,names);
		this.puzzle = new CompoundPuzzle();
		this.puzzle.join(basic);
		this.puzzle.joinWithCompound(basic2);
	}

	hard1() {
		var names = copyArray(nameSet());
		var basic = new SimplePuzzle(3, names);
		var basic2 = new SimplePuzzle(3,names);
		basic.completeWithMatch();
		this.puzzle = new CompoundPuzzle();
		this.puzzle.join(basic);
		this.puzzle.joinWithMatch(basic2);
	}

	hard2() {
		var names = copyArray(nameSet());
		var basic = new SimplePuzzle(3, names);
		var basic2 = new SimplePuzzle(2,names);
		var basic3 = new SimplePuzzle(1, names);
		basic.completeWithMatch();
		this.puzzle = new CompoundPuzzle();
		this.puzzle.join(basic2);
		this.puzzle.joinWithCompound(basic3);
		this.puzzle.join(basic);	
	}

	extraHard0(){
		var names = copyArray(nameSet());
		var basic = new SimplePuzzle(2, names);
		var basic2 = new SimplePuzzle(1, names);
		var basic3 = new SimplePuzzle(3, names);
		var basic4 = new SimplePuzzle(1, names);
		this.puzzle = new CompoundPuzzle();
		this.puzzle.join(basic);
		this.puzzle.joinWithCompound(basic2)		
		this.puzzle.joinWithMatch(basic3);
		this.puzzle.joinWithMatch(basic4);
	}

	extraHard1(){
		var names = copyArray(nameSet());
		var basic = new SimplePuzzle(2, names);
		var basic2 = new SimplePuzzle(2, names);
		var basic3 = new SimplePuzzle(1, names);
		var basic4 = new SimplePuzzle(2, names);
		basic4.completeWithMatch();
		this.puzzle = new CompoundPuzzle();
		this.puzzle.join(basic);
		this.puzzle.joinWithCompound(basic2)		
		this.puzzle.joinWithMatch(basic3);
		this.puzzle.join(basic4);
	}


	controller() {
		return new IslandControllers(this.puzzle);
	}

	solutionSummary(knavesList, knightsList) {
		var result = arraysEquivalent(knavesList, this.puzzle.knaveNames()); 
		result = result && arraysEquivalent(knightsList, this.puzzle.knightNames());
		
		var s = "<br> You said the knaves were " + prettyPrintList(knavesList) + ",";
		if (knavesList.length == 0) {
			s = "<br> You said there were no knaves,";
		} else if (knavesList.length == 1) {
			s = "<br> You said that the one knave was " + prettyPrintList(knavesList) + ",";
		}
		
		s+= " and that ";
		if (knightsList.length == 0) {
			s += "there were no knights.";
		} else if (knightsList.length == 1) {
			s += "the one knight was " + prettyPrintList(knightsList) + ".";
		} else {
			s += "the knights were " + prettyPrintList(knightsList) + "."
		}

		s+="<br>";
		if (result) {
			s += " <em> You were right.</em>" ;
		} else {
			s += " <em> You were wrong.</em>"
			if (this.puzzle.knaveNames().length == 0) {
				s += " There were no knaves ";	
			} else if (this.puzzle.knaveNames().length == 1) {
				s += " The only knave was " 
					+ prettyPrintList(this.puzzle.knaveNames());	
			} else {
				s += " The knaves were " 
					+ prettyPrintList(this.puzzle.knaveNames());
			}
			s += ", and"
			if (this.puzzle.knightNames().length == 0) {
				s += " there were no knights";	
			} else if (this.puzzle.knightNames().length == 1) {
				s += " the only knight was " 
					+ prettyPrintList(this.puzzle.knightNames());	
			} else {
				s += " the knights were " 
					+ prettyPrintList(this.puzzle.knightNames());
			}
			s += ".";
		}
		return s;
	}

	showReasoning() {
		var solver = new Solver(this.puzzle);
		return solver.solve();
	}

}

/**
* There are SimplePuzzles and CompoundPuzzles.
* A basic puzzle forms a connected graph of islanders, connected by
* Accusation/Affirmation statements.
*
* More interesting puzzles are formed by joining SimplePuzzles into 
* CompoundPuzzles.
*/

class Puzzle {

	constructor() {
		this.islanders = null;
		this.statements = null;
		this.knaves = null;
		this.knights = null;
		this.islanderControllers = null;
	}

	getIslanders() {
		return this.islanders;
	}
	
	getStatements() {
		return this.statements;
	}

	knaveNames() {
		var x;
		var list = [];
		for (x in this.knaves) {
			list.push(this.knaves[x].name);
		}
		return list;
	}

	knightNames() {
		var x;
		var list = [];
		for (x in this.knights) {
			list.push(this.knights[x].name);
		}
		return list;
	}

	toString() {
		return "Puzzle knights [" + prettyPrintList(this.knights) + "] knaves: [" 
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
		this.knights = addAllUnique(this.knights, target.knights);
		this.islanders = addAllUnique(this.islanders, target.islanders);
		this.statements = addAllUnique(this.statements, target.statements);
		//this.resetIslanderControllers();
	}

	randomJoin(target) {
		var choice = randomInt(2);
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
			target = randomElement(remainders);
		} else {
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
			target = randomElement(remainders);
		} else {
			target = randomElement(left);
		}
		this.statements = removeStatementWith(source, target, this.statements);
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

/**
* In these puzzles, there are Islanders which
* are either Knights or Knaves.
* Knights and Knaves in SimplePuzzles are connected
* by Accusation/Affirmation statements.
* Other statement types can be used to complete the puzzle.
*/
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

/**
* There are various Statements that the islanders
* make about each other.
* A statement may behave differently depending
* on the types of islanders involved.
* The statement also provides information to the
* Solver, and is used in generating a written solution
* to the puzzle.
*/
class Statement {
	constructor(source, target){
		this.source = source;
		this.target = target;
		this.text == this.buildStatement();
	}

	fullStatement() {
		var fs = this.source.name;
		fs += " says: " + this.text + "."
		return fs;
	}

	toString() {
		return this.fullStatement();
	}

}

/**
* TypeStatements are either Accusations or Affirmations.
* They have some common solution-processing behavior.
* In an Accusation, the source claims the target is a knave.
* In an Affirmation, the source claims the target is a knight.
*/
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
		var s = "All islanders will call a member of the opposite type a knave.";
		s += " So when " + this.source +" says that " + this.target +" is a knave, we know that "
		s += this.target + " and " + this.source + " are opposite types. "; 
		s += " Since " + known + " is a " + known.type() + ", then " + unknown + " is a " + unknown.type() +"."; 
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
		var s = "All islanders will call one of their same kind a knight.";
		s += " So when " + this.source +" says that " + this.target +" is a knight, we know that "
		s += this.target + " and " + this.source + " are the same type. "; 
		s += " Since " + known + " is a " + known.type() + ", then " + unknown + " is a " + unknown.type() +"."; 
		return s;
	}
}

/**
* Two other statement types are Sympathetic and Antithetic
* statements. In these a claim is made about being the same
* or different type.
* A Sympathetic statement is when the source says they are the
* same type as the target. An Antithetic statment is when the
* source says they are a different type.
*/
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
		s += " So when " + this.source + " says they are the same type as " + this.target + ", we know that ";
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
		s += " So when " + this.source + " says they are a different type than " + this.target + ", we know that ";
		s += this.target + " is a knave."; 
		return s;
	}

	solve(solver) {
		solver.reasoning.push(this.reasoning());
		addUnique(solver.knaves,this.target);		
	}
}
/**
* Two final statement types are Disjoint and Joint
* statements. Here the target makes a statement with 
* two clauses. 
* A Disjoint statement uses an OR conjunction,
* in the form "X or I am a knave"
* A Joint statement uses an AND conjunction, 
* in the form "Y and I am a knave"
*/
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
		s += " we know " + this.source + " must be making a true statement."; 
		s += " (If it was false, this would make the speaker a knave, which would make the statment true, but knaves cannot make true statements.)";
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
		s += " we know " + this.source + " is not making a true statement."; 
		s += " (If it was true, the speaker would be a knight claiming to be a knave, which cannot happen.)"; 
		s += " Therefore, " + this.source + " is a knave and " + this.target;
		s += " is a " + this.target.type() +".";
		return "<br>" + s;			
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

/**
* The Solver computes a solution to the puzzle. Because of the 
* way the puzzles are built in PuzzleGenerator, we know that
* they are solvable, so the purpose of the Solution is not to 
* verify this, but only to generate one possible written description
* of the solution, in order to display this on the page if requested.
*
*/
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
		/* Do an initial pass for all statements
		*  This will resolve all immediately knowable types.
		*  The remaining statements will be 'TypeStatements'
		*  and will be used in the second pass to complete
		*  the puzzle.
		*/
		for (x in this.puzzle.statements) {
			var statement = this.puzzle.statements[x];
			statement.solve(this);
		}
		
		//type statements are gathered during the initial solving phase
		var remainingStatements = copyArray(this.typeStatements);
	
		while(remainingStatements.length !== 0) {
			var nextRemaining = copyArray(remainingStatements);
			var y;
			for (y in remainingStatements) {
				var s = remainingStatements[y];
				//skip if the pair is already resolved
				if (s.done(this)) {
					nextRemaining = removeElement(nextRemaining, s);
					continue;
				}
				// for each known knave, see if the statement is about the knave
				var knaveCopy = copyArray(this.knaves);
				var z;
				for (z in knaveCopy){
					s.process(knaveCopy[z], this);
				}
				//skip remaining processing if the pair is now resolved
				if (s.done(this)) {
					nextRemaining = removeElement(nextRemaining, s);
					continue;
				}
				// for each known knight, see if the statement is about the knight
				var knightCopy = copyArray(this.knights);
				var w;
				for (w in knightCopy){
					s.process(knightCopy[w], this);
				}
			}
			remainingStatements = nextRemaining;
		}
		// since the puzzles are known to be solvable, we know that a solution
		// has been constructed.
		var str = "<ul>";
		var i;
		for (i in this.reasoning) {
			str +="<li>";
			str += this.reasoning[i];
			str +="</li>";
		}
		str += "</ul>";
		str += "For these reasons we know";
		if (this.puzzle.knaveNames().length == 0) {
				str += " there were no knaves ";	
			} else if (this.puzzle.knaveNames().length == 1) {
				str += " the only knave was " 
					+ prettyPrintList(this.puzzle.knaveNames());	
			} else {
				str += " the knaves were " 
					+ prettyPrintList(this.puzzle.knaveNames());
			}
			str += ", and"
			if (this.puzzle.knightNames().length == 0) {
				str += " there were no knights";	
			} else if (this.puzzle.knightNames().length == 1) {
				str += " the only knight was " 
					+ prettyPrintList(this.puzzle.knightNames());	
			} else {
				str += " the knights were " 
					+ prettyPrintList(this.puzzle.knightNames());
			}
		str += ".";
		this.validate();
		return "<br>" + str;
	}

	toString() {
		return "knights: " + this.knights + " knaves: " + this.knaves;
	}

	/*
	* After solve() has been invoked, we can validate the solution against
	* the known answer in the original problem.
	* This is just an extra validation for debugging purposes - in principle
	* the Solver will always generate a correct solution...
	*/
	validate() {
		var isValid = arraysEquivalent(this.knights, this.puzzle.knights);
		isValid = isValid && arraysEquivalent(this.knaves, this.puzzle.knaves);
		if (isValid !== true) {
			console.log("ERROR: automated solver did not find the complete solution");
			console.log("solver: " + this.toString());
			console.log("puzzle: " + this.puzzle.toString());
		} else {
			console.log("debug: automated solver found complete solution");
			console.log("solver: " + this.toString());
			console.log("puzzle: " + this.puzzle.toString());		
		}
	}
}

/**
* Controlers are used to interface between the model and the UI.
*/

class IslanderController {
	constructor(islander) {
		this.islander = islander;
	}

	display() {
		var txt = "glyphicon glyphicon-unchecked";
		var btn = "<tr><td>" + this.islander.name + "</td>";
		btn +=  "<td><button type='button' id='knight_"+ this.islander.name + "' class='btn btn-primary', onclick='selectKnight(event)'>";
		btn += "<span class='glypicon " + txt + " lrg-font'></span>"
		btn += "</button></td>";
		btn +=  "<td><button type='button' id='knave_"+ this.islander.name + "' class='btn btn-primary', onclick='selectKnave(event)'>";
		btn += "<span class='glypicon " + txt + " lrg-font'></span>"
		btn += "</button></td>";
		btn += "</tr>";
		return btn;		
	}	
}

class IslandControllers {
	constructor(island) {
		this.island = island;
		controllers.disabled = false;
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
		var s = "<div> <table>";
		var i;
		s+="<tr><th>Islander</th><th>knight?</th><th>knave?</th></tr>"
		for (i in this.island.getIslanders()) {
			s += new IslanderController(this.island.getIslanders()[i]).display();
		}
		s += "</table></div>";
		return s;
	}
}
/**
* Button functions
*/
var knavesList = [];
var knightsList = [];

function selectKnave(event) {
	if (controllers.disabled) return;
	var id = event.currentTarget.id;
	var theKnave = id.substring(id.indexOf('_')+1, id.length);	
	knavesList = addOrRemove(knavesList, theKnave);
	knightsList = removeElement(knightsList, theKnave);
	if (arrayContains(knavesList,theKnave)) {
		$("#knave_" + theKnave).addClass("btn-danger");		
		$("#knave_" + theKnave).html("<span class='glypicon glyphicon glyphicon-ok lrg-font'></span>");		
		$("#knight_" + theKnave).removeClass("btn-success");
		$("#knight_" + theKnave).html("<span class='glypicon glyphicon glyphicon-unchecked lrg-font'></span>");	

	} else {
		$("#knave_" + theKnave).removeClass("btn-danger");	
		$("#knave_" + theKnave).html("<span class='glypicon glyphicon glyphicon-unchecked lrg-font'></span>");	
	}
	console.log("knavesList: " + knavesList);
};

function selectKnight(event) {
	if (controllers.disabled) return;
	var id = event.currentTarget.id;
	var theKnight = id.substring(id.indexOf('_')+1, id.length);
	knightsList = addOrRemove(knightsList, theKnight);
	knavesList = removeElement(knavesList, theKnight);
	if (arrayContains(knightsList,theKnight)) {
		$("#knight_" + theKnight).addClass("btn-success");
		$("#knight_" + theKnight).html("<span class='glypicon glyphicon glyphicon-ok lrg-font'></span>");				
		$("#knave_" + theKnight).removeClass("btn-danger");
		$("#knave_" + theKnight).html("<span class='glypicon glyphicon glyphicon-unchecked lrg-font'></span>");	
	} else {
		$("#knight_" + theKnight).removeClass("btn-success");
		$("#knight_" + theKnight).html("<span class='glypicon glyphicon glyphicon-unchecked lrg-font'></span>");	
	}
	console.log("knightsList: " + knightsList);
};


/**
* Utility functions 
* - functions for managing the graph of islanders linked by TypeStatements
* - functions for manipulating arrays
* - randomization utilities
*/

/**
* TypeStatement Graph functions. 
* These are used to create the set of TypeStatements that connects
* a SimplePuzzle.
*/

// Used to form connected graphs of type statements
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

// Used to prune redundant type statements
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
// assumes list is already pruned
// remove first statement involving these two, if it exists.
function removeStatementWith(islander1, islander2, listOfStatements) {
	var x;
	for (x in listOfStatements) {
		var e = listOfStatements[x];
		var s = e.source;
		var t = e.target;
		if ((s === islander1 || s === islander2) && (t === islander1 || t === islander2)){
			listOfStatements = arrayWithoutElement(listOfStatements, e);
			console.log("removing statement: " + e.toString());
			return listOfStatements;
		}
	}
	console.log("no statements removed");
	return listOfStatements;	
}

//returns all islanders that are neighbors (via a type statement) of the current islander
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

// returns all reachable islanders from a given islander through
// the graph of type statements
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

//returns the set of graphs that are connected by type statements
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

/**
* Array Manipulation Functions
* A bunch of array management functions
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
	if (array1.length != array2.length) return false;
	if (array1.length === 0 && array2.length === 0) return true;
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


/**
* Randomization Utilities
*/

function randomInt(lessThan){
	return Math.floor(Math.random()*lessThan);
};

/**
* returns a pseudo-random integer in the range 
* [greaterThan, lessThan]
*
*/
function randomRange(greaterThan, lessThan){
	var shifted = randomInt(lessThan - greaterThan + 1);
	return lessThan - shifted; 
};

function randomElement(array) {
	var res =randomRange(0, array.length-1);
	return array[res];
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