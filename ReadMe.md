
# Project Mille

This script analyzes a .csv file and dynamically creates time slots of 30-minute or 1-hour based on the data it processes. By parsing the input file, the script intelligently generates organized time intervals.

## Authors

- [@SebMZI](https://github.com/SebMZI)

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

## Documentation

- [date-fns](https://date-fns.org/v2.16.1/docs/format)
- [csv-parser](https://www.npmjs.com/package/csv-parser)
- [nodemon](https://www.npmjs.com/package//nodemon)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [node-schedule](https://www.npmjs.com/package/node-schedule)

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

### Function analyzeData
  We are waiting for the csv file to be processed and then conditionally wait for the data.
  parsing the date by using the parseDate function.

  The differenceInDays helps us determine the duration in days between the start and end dates.
  
  Then we determine the middle date using the start date and the duration in days devided by 2.
  And addDays until we get a wednesday or a Friday. we need to set the Hours and the minutes to the date, that's why we are using the generateHours and generateMinutes functions.
 
  Next, we need to check if the date doesn't already exist inside the output array, to check we are using the isOverlap function by passing two argument the middle Date and the output array.
  It's almost the same process for the end date except we are looking for a date between 15 days before and 5 days before the end.

  Finally, we set the outputItem object and push it into the ouput array.
```bash
  function analyzeData() {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await readCsvFile();

        if (data) {
          data.map((item) => {
            const startDate = parseDate(item.Start);
            const endDate = parseDate(item.End);

            const durationInDays = differenceInDays(endDate, startDate);

            let middleDate = addBusinessDays(startDate, durationInDays / 2);
            while (getDay(middleDate) !== 3 && getDay(middleDate) !== 5) {
              middleDate = addDays(middleDate, 1);
            }

            middleDate = addMinutes(
              addHours(middleDate, generateHours(middleDate)),
              generateMinutes("middle")
            );

            if (isOverlap(middleDate, OUTPUT_ARRAY)) {
              // console.log(
              //   "Overlap detected for middle date. Generating a new date."
              // );
              middleDate = generateNewDate(middleDate, OUTPUT_ARRAY, "middle");
            }
            
            let endDayStart = addDays(endDate, -15);
            const endDayEnd = addDays(endDate, -5);

            while (endDayStart <= endDayEnd) {
              if (getDay(endDayStart) === 3 || getDay(endDayStart) === 5) {
                break;
              }
              endDayStart = addDays(endDayStart, 1);
            }
            endDayStart = addMinutes(
              addHours(endDayStart, generateHours(endDayStart)),
              generateMinutes("end")
            );

            if (isOverlap(endDayStart, OUTPUT_ARRAY)) {
              endDayStart = generateNewDate(endDayStart, OUTPUT_ARRAY, "end");
            }

            const outputItem = {
              MailFrom: item.MailFrom,
              MailTo: item.MailTo,
              firstEmail: {
                ...FIRST_MAIL,
                date: format(startDate, "EEEE dd LLLL yyyy"),
              },
              secondEmail: {
                ...SECOND_MAIL,
                startDate: format(middleDate, "EEEE dd LLLL yyyy HH:mm:ss"),
                endDate: format(
                  addMinutes(middleDate, 30),
                  "EEEE dd LLLL yyyy HH:mm:ss"
                ),
              },
              lastEmail: {
                ...LAST_MAIL,
                startDate: format(endDayStart, "EEEE dd LLLL yyyy HH:mm:ss"),
                endDate: format(
                  addHours(endDayStart, 1),
                  "EEEE dd LLLL yyyy HH:mm:ss"
                ),
              },
            };

            OUTPUT_ARRAY.push(outputItem);
          });

          resolve(OUTPUT_ARRAY);
        }
      } catch (error) {
        reject(error);
      }
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

 It takes in arguments :
 - the current date
 - the outputArray
 - the tye (middle or end).

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

### Function generateHours or generateMinutes
 GenerateHours takes in argument the date and looks if it's either a Wednesday or a Friday.
 It will the set the hoursRange.
 A random number will be generated to be the index of the array.
 The function will return the number from the index of the array

 GenerateMinutes takes in argument the type (middle or end) and looks if it's either middle or  end.
 It will the set the minutesRange.
 A random number will be generated to be the index of the array.
 The function will return the number from the index of the array

```bash
  function generateHours(date) {
    let hoursRange;
    const day = getDay(date);
    if (day === 3) {
      hoursRange = [[12, 13], [17]];
    } else if (day === 5) {
      hoursRange = [[12, 13]];
    }

    const randomIndex = Math.floor(Math.random() * hoursRange.length);
    const randomIndexofIndex = Math.floor(
      Math.random() * hoursRange[randomIndex].length
    );
    return hoursRange[randomIndex][randomIndexofIndex];
  }

  function generateMinutes(type) {
    let minutesRange;
    if (type === "middle") {
      minutesRange = [0, 30];
    } else if (type === "end") {
      minutesRange = [0];
    }
    const randomIndex = Math.floor(Math.random() * minutesRange.length);
    return minutesRange[randomIndex];
  }
```

### Function scheduleEmails
 scheduleEmails takes in arguments the outputArray of objects.
 We get access to one of each object by doing a .map() and schedule each email.

```bash
  function scheduleEmails(output) {
    output.map((outputItem) => {
      // Schedule the first email to be sent
      const firstMail = sendMail(outputItem, outputItem.firstEmail, FIRST_MAIL);
      // Schedule the second email to be sent
      const secondMail = sendMail(
        outputItem,
        outputItem.secondEmail,
        SECOND_MAIL
      );
      // Schedule the last email to be sent
      const lastMail = sendMail(outputItem, outputItem.lastEmail, LAST_MAIL);
    });

```

### Function sendMail
 sendMail is called inside the schedule function. it sets the mailOptions nodemailer (from, to, subject, text or html). 

 Then it sends the mail to the specified email address. And logs it.
```bash
  function sendMail(outputMail, outputItem, mailContent) {
    const htmlContent = fs.readFileSync("./index.html", "utf-8");
    console.log(outputItem);

    const replacedHtml = htmlContent
      .replace("{{content}}", mailContent.content)
      .replace(
        "{{startDate}}",
        outputItem.startDate ? `from ${outputItem.startDate}` : "You will receive"
      )
      .replace(
        "{{endDate}}",
        outputItem.endDate
          ? ` to ${outputItem.endDate}`
          : " two more emails soon!"
      );

    const mailOptions = {
      from: "mrgy.sebastien@gmail.com",
      to: outputMail.MailTo,
      subject: mailContent.object,
      html: replacedHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }
```

## Tech Stack

**Server:** NodeJs


## Roadmap

- Send email with Gmail
- Mail content would be a html file with file attachments
- More tests




