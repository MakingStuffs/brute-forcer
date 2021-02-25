const fs = require("fs");

// Swap the letter at letterIndex with the replacement
const swapLetter = (word, letterIndex, replacement) => {
  let swapped = [...word];
  swapped[letterIndex] = replacement;
  return swapped.join("");
};

// Make the first letter of the password upper case
const getUpperCaseFirst = (word) => {
  let capFirst = [...word];
  capFirst.shift();
  capFirst.unshift(word[0].toUpperCase());
  return capFirst.join("");
};

// Make the first letter of the password lower case
const getLowerCaseFirst = (word) => {
  let lowerFirst = [...word];
  lowerFirst.shift();
  lowerFirst.unshift(word[0].toLowerCase());
  return lowerFirst.join("");
};

// mutate the word according to each key/value pair in the substitutions object
// Returns an array of mutated strings or an empty one.
const mutateWord = (word, substitutions) =>
  [...word].reduce((acc, curr, i) => {
    // The current letter matches one in the substitutions array
    if (shouldMutateLetter(curr, substitutions)) {
      // Get the replacement characters
      let replacements = [substitutions[curr]].flat();

      replacements.forEach((letter) => {
        let swapped = swapLetter(word, i, letter);
        let lowerCaseFirst = getLowerCaseFirst(swapped);
        let capFirst = getUpperCaseFirst(swapped);

        // Push each variant of the replacement into the output array
        acc.push(lowerCaseFirst, capFirst);
      });
    }
    // return the accumlated array
    return acc;
  }, []);

// Checks the passed letter against the substitutions list to see if it should b mutated
// returns boolean
const shouldMutateLetter = (letter, substitutions) =>
  Object.keys(substitutions).includes(letter);

// Get all mutations of the passed word according to the substitutions object
// Returns an array or strings or an empty one
const getMutations = (word, substitutions) => {
  // Make a temp array in case we need to remutate
  let temp = [getLowerCaseFirst(word), getUpperCaseFirst(word)];
  // Find out how many letters need to be mutated
  let totaltoMutate = [...word].filter((letter) =>
    shouldMutateLetter(letter, substitutions)
  ).length;
  // Create a loop to which mutates the word according to the number
  // of letters to mutate
  for (let i = 0; i < totaltoMutate; i++) {
    // Map the temp array and remutate each word for each iteration
    // This ensures we find all possible combinations
    let remutate = [
      ...temp.map((word) => mutateWord(word, substitutions)),
    ].flat();
    // Get a mutation list for the current word
    let mutations = mutateWord(word, substitutions);
    // Spread all arrays into on and then use a reducer to remove all doubles
    temp = [...temp, ...mutations, ...remutate].reduce((acc, curr) => {
      if (acc.includes(curr)) {
        return acc;
      } else {
        acc.push(curr);
        return acc;
      }
    }, []);
  }
  // Return the temp array
  return temp;
};

// Get all combintions of words according to word count
// I.e 2 would mean all two word combinations, 3 would be 3 etc etc
const getXcombos = (words, wordCount) => {
  const mutate = (output = [], currentIteration = 0) => {
    let temp = [];
    // If current iteration is less than the max do mutations
    if (currentIteration < wordCount) {
      // Iterate the wordlist
      for (let i in words) {
        // Check if this is the first iteration, if so just push the words to the output array
        if (currentIteration === 0) {
          temp.push(words[i]);
        } else {
          // If it is not the first iteration we can use the output array
          // and loop over it to continue our mutations

          for (let j in output) {
            // Check that we are not making a duplicate mutation
            // output[j] is the previously mutated index
            // words[i] is the current word
            // if output does not have a mutation which includes both words
            // we push the new mutation to the array
            if (!output.includes(`${output[j]}${words[i]}`)) {
              temp.push(`${output[j]}${words[i]}`);
            }
          }
        }
      }
      return mutate([...output, ...temp], currentIteration + 1);
    } else {
      // Return output when all iterations are complete
      console.log(output);
      return output;
    }
  };

  return mutate();
};

// Write all permutations to the path specified in outputPath
const writePermutationsToDisc = (word, substitutions, outputPath) => {
  const mutatedWords = getMutations(word, substitutions);
  fs.writeFileSync(
    `${outputPath}/${word}-${new Date().toISOString().split("T")[0]}.json`,
    JSON.stringify({ mutatedWords })
  );
};

// Write all combos to the path specified in outputPath
const writePaswordCombosToDisk = (words, wordsPerCombo, outputPath) => {
  const passwordCombos = getXcombos(words, wordsPerCombo);
  fs.writeFileSync(
    `${outputPath}/${new Date().toISOString().split("T")[0]}.json`,
    JSON.stringify({ passwordCombos })
  );
};

const mutateMany = (words, substitutions) => {
  let output = [];
  for (let word of words) {
    let temp = getMutations(word, substitutions);
    output = [...output, ...temp];
  }
  return output;
};

module.exports = {
  getMutations,
  mutateMany,
  getXcombos,
  writePaswordCombosToDisk,
  writePermutationsToDisc,
};
