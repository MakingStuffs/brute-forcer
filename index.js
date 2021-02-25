const pdfTools = require("./utils/pdfTools");
const zipTools = require("./utils/zipTools");
const permutationTools = require("./utils/permutationTools");
const fs = require("fs");

const getMaxCalls = (passwordArray, entriesPerBatch = 50) =>
  Math.ceil(passwordArray.length / entriesPerBatch);

// Iterate over the arr of passwords which are passed and then use the callback
// function provided to check if the password is correct or not.
const checkPasswords = async (
  offset = 0,
  increment = 50,
  arr,
  typeOfFiletoCheck
) => {
  // Initialise our variables
  let i;
  let passwordFound;
  let passwordsTested = [];
  let response;
  const callback =
    typeOfFiletoCheck === "pdf"
      ? pdfTools.checkPassword
      : zipTools.checkPassword;

  // Being looping from the passed offset and continue until we
  // have processed increment number of entries or the password is found
  for (i = offset; i < offset + increment && !passwordFound; i++) {
    // If password is found return an object with the correct password
    // and the number of passwords checked.
    if (passwordFound) {
      break;
    } else {
      // Otherwise add the tested password to the tested array
      passwordsTested.push(`${arr[i]}!`);
      // and then call our callback function
      callback(`${arr[i]}!`)
        .then((data) => {
          // If the function returns data the password wasw
          // correct so we set our variables
          passwordFound = data.passwordFound;
          response = data;
        })
        .catch((err) => {
          // Otherwise it was incorrect
          passwordFound = data.passwordFound;
          response = err;
        });
    }
  }

  // If the password is found or the index is at the length of
  // the array we return an object with the finding to the caller function.
  if (passwordFound || i === arr.length - 1) {
    return response;
  }
};

const preparePasswordChecks = async (
  entriesPerBatch,
  offset = 0,
  outputPath,
  typeOfFiletoCheck
) => {
  const maxCalls = getMaxCalls(passwords, entriesPerBatch);
  // initialise empty array for incorrect entries
  // stops us from checking the same entry twice
  let incorrectEntries = [];
  // Log to let the user know what is happening
  console.log(`Testing ${output.length} entries`);
  // Max calls will determine the maximum numnber of password
  // batches to check.
  // This function will iterate until max calls has been met
  // it will increment by 1 and increment the current index by
  // number of password to check per iteration.
  for (let i = 0; i <= maxCalls; i++) {
    // Set the current index (of passwords, not this loop)
    // to be this loop's index multiplied by the number of
    // entries to process with each batch
    let currentIndex = i * entriesPerBatch;
    // Get the next loop's password index so we know
    // how many we have processed.
    let nextIndex = currentIndex + entriesPerBatch;
    // Perform an array slice to get the chunk of indexes we wish to process
    let currentBatch = output.slice(currentIndex, nextIndex);

    try {
      // Execute the checkpasswords function on the current batch of passwords
      // We can pass an offset if we wish to continue processing from a broken
      // attempt in the past. Offset refers to an index in the passed array from which
      // we start processing.
      let result = await checkPasswords(
        offset,
        entriesPerBatch,
        currentBatch,
        typeOfFiletoCheck
      );
      // Check if we have either a result from the checkPassword function
      // and whther the password was foudn or not.
      if (result && result.passwordFound) {
        console.log(result);
        // If it has been found write it to disk.
        fs.writeFileSync(outputPath, JSON.stringify(result));
        // and then break the loop.
        break;
      } else {
        console.log(
          `Password not found in entries ${currentIndex} - ${nextIndex}`
        );
        // Otherwise the password was not found so we can add the
        // current batch of passwords to the incorrect array
        incorrectEntries.push(currentBatch);
        // If we have met the max number of calls this is the last iteration
        // In which case we will write the incorrect passwords to disk.
        if (i === maxCalls) {
          fs.writeFileSync(
            `./logs/test-${new Date().toLocaleDateString()}.json`,
            JSON.stringify({
              totalTested: incorrectEntries.length,
              testedPasswords: incorrectEntries,
              testDate: Date().toLocaleDateString(),
            })
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
};
