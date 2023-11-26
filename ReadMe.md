
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




