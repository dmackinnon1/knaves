# knaves
Another JavaScript learning project. A live example can be found [here](https://dmackinnon1.github.io/knaves/).

The page and scripts in "knaves" generate interactive "knights and knave" puzzles, as found in “What is the Name of this Book?” by Raymond M. Smullyan. 

Code in the knaves repo generates problems where all the islanders are knights or knaves, the puzzles are always completely solvable, and the statements made by knights and knaves are restricted to three basic types (Accusaions/Affirmations, Sympathetic/Antithetic, and "Knave Conjunctions"), as described in the blog post. 

There are a variety of puzzle 'topologies' generated for each difficulty selection - a large number of distinct puzzles are possible.

Using the main page, you can choose the difficulty of the puzzle:
![puzzle difficulty selection](https://raw.githubusercontent.com/dmackinnon1/knaves/master/imgs/difficultyButton.png)

An example of an easy puzzle is:

![puzzle example](https://raw.githubusercontent.com/dmackinnon1/knaves/master/imgs/puzzleExample.png)

The page invites you to catgegorize each islander as a knight or knave, and submit your solution:

![solution input](https://raw.githubusercontent.com/dmackinnon1/knaves/master/imgs/interactive.png)

If you wish, you can the reasoning behind a possible solution.

![reasoning display](https://raw.githubusercontent.com/dmackinnon1/knaves/master/imgs/reasoning.png)

## Statement types
There are many varieties of statements that knights and knaves can make. In the puzzles generated here, there are only a few types of statements.

### Accusations and Affirmations
In an accusation, an islander A says something like "B is a knave" or an equivalent statement like "B always lies." In an affirmation, islander A says something like "B is a knight" or "B always tells the truth."<br />

Unfortunately, we don't know if A is telling the truth or not, so how can we know if what they are saying about B is true or not? Even without knowing the type of A, we can learn something very helpful about A and B from these statements. If A and B are linked by an accusation, they must be of different types: either A is a knave and B is a knight, or vice versa. If A and B are linked by an affirmation, they must be of the same type: either both are knights, or both are knaves. See if you can reason out why this must be so.

### Knave Conjunctions
An example of a knave conjunction, is when A says "B is a knight, or I am a knave," or &nbsp;"C is a knave and I am a knave."

These are very helpful statements, as they always tell us the type of both the speaker and the spoken-of. Any islander who says "or I am a knave" will be making a statement that must be, overall, truthful and is therefore a knight, while any islander who says "and I am a knave" will by lying, and must be knave. Try and convince yourself of that.<br />

An interesting thing about "knave conjunctions" is that their usefulness comes from how close they are to the <a href="https://en.wikipedia.org/wiki/Liar_paradox">liar paradox</a>. The liar paradox is a more self-directed refinement of that original statement of Epimenides, where we imagine that someone says: "I am lying" and wonder if they are telling the truth or not.

An islander cannot make the statement "I am lying," or any equivalent statement such as "I am a knave." If such a statement is true, then the speaker is lying, making the statement also false; and if it is false, the speaker is lying, making the statement also true. So such a statement is contradictory - neither false or true, and our islanders are restricted to statements that are either true or false.

Islanders, however, can get close to generating the liar paradox by including its statement as a clause along with another statement. To see how they can do this, you have to be clear on how statements that include "and" and "or" work. If someone on the island says "X or Y" then only X or Y has to be true in order for the whole statement to be true. So a knight can say "X or Y" when only one of the statements is true. However, if a knave says "X or Y" then both X and Y must be false (if one was true, the whole statement would be true, and a knave cannot make a true statement). If an islander says "X and Y" then both X and Y have to be true in order for the statement to be true, and only one needs to be false for the statement to be false. So a knave can say "X and Y" when only one of the statements is false.

### Affinity and antipathy statements
Sometimes an islander A might say "B is my type" or maybe "C is not my type." We might not know if A is a knight or knave, but we can infer the type of B and C right away. No matter whether A is lying or telling the truth, if A claims "B is my type," then B must be a knight. On the other hand, if A claims that "C is not my type" we know that C is a knave. Do you agree?

It is interesting to compare these statements with our first type of statements, the "accusations/affirmations," these two types of statements are reciprocal in a way. When an islander directly says what type another islander is (an accusation or affirmation), all we learn is that the source and target of the statement are similar or different, without learning the actual type. However, when an islander makes a statement about similarity or difference, we learn exactly what type the target is, without learning if this is similar or different than the source.

## Accusation graphs
Accusations and affirmations among islanders don't tell us who is a knight and who is a knave, but they can allow us to identify which islanders are the same type and which are different types. In puzzles that feature several accusations or affirmations, identifying these groups is a good way to start towards a solution. 

If we start with just accusations and affirmations  we might have a puzzle like this:

> You meet a group of islanders, Alice (A), Bob (B), Carol (C), and Dave (D). We want to know whether they are kingts or kaves. Alice says "Bob is a liar", Bob says "Carol is a liar," Carol says "Bob is lying" and Dave says "Alice is telling the truth." 

A fun and helpful way to visualize the groups is to form an "accusation graph". In this graph, the nodes will be islanders, with solid edges for accusations and dashed edges for affirmations (1). Then we collapse the nodes that have a dashed edge between them (2). In the collapsed graph, duplicate solid edges can be merged, and there should be no cases where nodes with a solid edge between them are collapsed. Finally find a 2-colour vertex colouring of the graph (3). Interestingly, the direction of an accusation or affirmation is not important, so the graph is not directed.

<img width="379" height="335" alt="graph1" src="https://github.com/user-attachments/assets/883bad35-2f58-4ec0-9bed-1cd49feece4e" />

The accusation graph shows the distinct groups of islanders, but doesn't tell us which group is witch. This particular puzzle requires one more statement, perhaps a Knave conjunction or affinity/antipathy statement to decide which colour represents the knights and which colour represents the knaves.
