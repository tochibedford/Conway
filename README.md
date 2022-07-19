# Conway
## Implementing Conway's Game of Life using DOM elements


As seen on [this wikipedia article](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life):
The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

Any live cell with two or three live neighbours survives.
Any dead cell with three live neighbours becomes a live cell.
All other live cells die in the next generation. Similarly, all other dead cells stay dead.

## Guide
- For speed, Try reducing browser window size, so less grid cells are created
- Grid is randomly generated, for now
- Any cell can be switch on (brought to life) if it's dead, by clicking on it
- Any cell can be switch off (killed) if it's alive, by clicking on it
