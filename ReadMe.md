
# Project Mille

This script analyzes a .csv file and dynamically creates time slots of 30-minute or 1-hour based on the data it processes. By parsing the input file, the script intelligently generates organized time intervals.

## Authors

- [@SebMZI](https://github.com/SebMZI)


## Documentation

- [date-fns](https://date-fns.org/v2.16.1/docs/format)
- [csv-parser](https://www.npmjs.com/package/csv-parser)
- [nodemon](https://www.npmjs.com/package//nodemon)

### Function Read CSV File
  This function is using csv-parser and fs from node.js.
  It takes the path of the file and creates an object with different keys and values such as MailFrom, MailTo, Start, End.
  Then it pushes the objects into the dataArray.

```bash
  function readCsvFile() {
    return new Promise((resolve, reject) => {
      fs.createReadStream(dataCsvPath)
        .pipe(csv(["MailFrom", "MailTo", "Start", "End"]))
        .on("data", (data) => {
          data.MailFrom = data.MailFrom.replace(/"/g, "");
          data.MailTo = data.MailTo.replace(/"/g, "");
          dataArray.push(data);
        })
        .on("end", () => {
          resolve(dataArray);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
```

### Function isOverlap
  isOverlap is checking for overlap between two dates inside the same array (output array)
  if it found one it will return a boolean (true or false).
  The function is taking two arguments :
  - The current date
  - The output array that contains all the dates
  We take the current date and add to it 30 minutes or 1 hours and compare them to the rest of the array.

```bash
  function isOverlap(date, OUTPUT_ARRAY) {
    const startDateString = format(date, "EEEE dd LLLL yyyy HH:mm:ss");
    const endDateString = format(
      addMinutes(date, 30),
      "EEEE dd LLLL yyyy HH:mm:ss"
    );
    const lastDateString = format(
      addHours(date, 1),
      "EEEE dd LLLL yyyy HH:mm:ss"
    );
    return OUTPUT_ARRAY.some((it) => {
      const itStartDateString = it.secondEmail.startDate;
      const isSecondEndDate = it.secondEmail.endDate;
      const isLastStartDateString = it.lastEmail.startDate;
      const itEndDateString = it.lastEmail.endDate;
      return (
        isLastStartDateString === startDateString ||
        isSecondEndDate === endDateString ||
        itStartDateString === startDateString ||
        itEndDateString === lastDateString
      );
    });
  }
```


### Function generateNewDate
 GenerateNewDate is complementary to isOverlap function.
 When isOverlap function returns true it calls the generateNewDate.

 It takes in arguments the current date, the outputArray and the tye (middle or end).
 changeType is a random number generator. We compare it into a condition to either setHours, setMinutes or addDays.

 While days isn't a Wednesday or a Friday, the addDays won't stop. Same for the generateNewDate until isOverlap function returns false.

```bash
  function generateNewDate(currentDate, OUTPUT_ARRAY, type) {
    let newDate = currentDate;

    while (true) {
      const changeType = Math.floor(Math.random() * 3);

      if (changeType === 0) {
        newDate = setHours(newDate, generateHours(newDate));
      } else if (changeType === 1) {
        newDate = setMinutes(newDate, generateMinutes(type));
      } else {
        newDate = addDays(newDate, 1);

        while (getDay(newDate) !== 3 && getDay(newDate) !== 5) {
          newDate = addDays(newDate, 1);
        }
      }

      if (!isOverlap(newDate, OUTPUT_ARRAY, type)) {
        break;
      }
    }
   
    return newDate;
  }
```

## Installation

Clone the project first :

```bash
  git clone https://github.com/SebMZI/Project-Mille
  cd Project-Mille
```

Then install node modules :

```bash
  npm install
```
 
    
## Run the script

Start the development server

```bash
  npm run dev
```

Start the server

```bash
  npm run start
```
## Running Tests

To run tests, run the following command :

```bash
  npm run test
```


## Tech Stack

**Server:** NodeJs


## Roadmap

- Send email with Gmail
- Mail content would be a html file with file attachments
- More tests




