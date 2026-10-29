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

### Accusations and affirmations
In an accusation, an islander A says something like "B is a knave" or an equivalent statement like "B always lies." In an affirmation, islander A says something like "B is a knight" or "B always tells the truth."<br />

Unfortunately, we don't know if A is telling the truth or not, so how can we know if what they are saying about B is true or not? Even without knowing the type of A, we can learn something very helpful about A and B from these statements. If A and B are linked by an accusation, they must be of different types: either A is a knave and B is a knight, or vice versa. If A and B are linked by an affirmation, they must be of the same type: either both are knights, or both are knaves. See if you can reason out why this must be so.

### Knave disjunctions
We're calling statements situations like "A says: B is a knight, or I am a knave" a "knave disjunction."

These are very helpful statements, as they always tell us the type of both the speaker and the spoken-of. Any islander who says "X or I am a knave" will be making a statement that must be, overall, truthful and is therefore a knight, and the statement X must be true. This is because, if the the overall statement "X or I am a knave" is false, then the speaker would be a knave, making the "I am a knave" part of the statement true, contradicting the falsity of the overall statement. So for these, we know the combined statement must be true and the speaker must be a knight. Since the second part of the statement is false ("I am a knave") we know that the first part of the statement X is the true part.

- When A says "B is a knight, or I am a knave" we know that both A and B must be knights.
- When A says "C is a knave, or I am a knave" we know that A is a knight and C is a knave.

### Knave conjunctions
We're calling statements situations like "A says: B is a knight, and I am a knave" a "knave conjunction."

Like knave disjunctions, these are helpful statements. Any islander who says "X and I am a knave" will be making a statement that must be, overall, false. This makes the speaker a knave, and forces the first part of the statement to be false as well. This is because, if the the overall statement "X and I am a knave" is true we get a contradiction: the speaker must be a knave for making a false statement, but then the conjunction would be true as they are saying "I am a knave." So for these statements, we know the overall statement must be false. Since the second part of the statement is true ("I am a knave") we know that the first part of the statement X is the false part.

- When A says "B is a knight, and I am a knave" we know that both A and B must be knaves.
- When A says "C is a knave, or I am a knave" we know that A is a knave and C is a knight.

### Affinity and antipathy statements
Sometimes an islander A might say "B is my type" or maybe "C is not my type." We might not know if A is a knight or knave, but we can infer the type of B and C right away. No matter whether A is lying or telling the truth, if A claims "B is my type," then B must be a knight. On the other hand, if A claims that "C is not my type" we know that C is a knave. Do you agree?

It is interesting to compare these statements with our first type of statements, the "accusations/affirmations," these two types of statements are reciprocal in a way. When an islander directly says what type another islander is (an accusation or affirmation), all we learn is that the source and target of the statement are similar or different, without learning the actual type. However, when an islander makes a statement about similarity or difference, we learn exactly what type the target is, without learning if this is similar or different than the source.

## Accusation graphs
Accusations and affirmations among islanders don't tell us who is a knight and who is a knave, but they can allow us to identify which islanders are the same type and which are different types. In puzzles that feature several accusations or affirmations, identifying these groups is a good way to start towards a solution. 

If we start with just accusations and affirmations  we might have a puzzle like this:

> You meet a group of islanders, Alice (A), Bob (B), Carol (C), and Dave (D). We want to know whether they are kingts or kaves. Alice says "Bob is a liar", Bob says "Carol is a liar," Carol says "Bob is lying" and Dave says "Alice is telling the truth." 

A fun and helpful way to visualize the groups is to form an "accusation graph". In this graph, the nodes will be islanders, with solid edges for accusations and dashed edges for affirmations (1). Then we collapse the nodes that have a dashed edge between them (2). In the collapsed graph, duplicate solid edges can be merged, and there should be no cases where nodes with a solid edge between them are collapsed. Finally find a 2-colour vertex colouring of the graph (3). Interestingly, the direction of an accusation or affirmation is not important, so the graph is not directed.

<img width="379" height="335" alt="graph1" src="https://github.com/user-attachments/assets/883bad35-2f58-4ec0-9bed-1cd49feece4e" />

The accusation graph shows the distinct groups of islanders, but doesn't tell us which group is witch.  We know that A, C, and D are the same type and B is a different type, but we don't know which grouping are knaves vs. knights. This particular puzzle requires one more statement, perhaps a Knave disjunction or conjunction or an affinity/antipathy statement to decide which colour represents the knights and which colour represents the knaves.
