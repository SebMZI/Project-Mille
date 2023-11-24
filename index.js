const csv = require("csv-parser");
const {
  format,
  differenceInDays,
  parse,
  addBusinessDays,
  getDay,
  addDays,
  addHours,
  addMinutes,
  setHours,
  setMinutes,
} = require("date-fns");
const fs = require("fs");
const dataArray = [];
const dataCsvPath = "./data/data.csv";
const FIRST_TEXT = "Hello welcome to Mille!";
const SECOND_TEXT = "This is the second text";
const LAST_TEXT = "This is the last text";
const OUTPUT_ARRAY = [];

// Compare the newDate string to the existing dates strings in the array and return a boolean
function isOverlap(date, OUTPUT_ARRAY, type) {
  // format the new date into a string
  // start date
  const startDateString = format(date, "EEEE dd LLLL yyyy HH:mm:ss");
  // date with 30min more
  const endDateString = format(
    addMinutes(date, 30),
    "EEEE dd LLLL yyyy HH:mm:ss"
  );
  // date with 1 hour more
  const lastDateString = format(
    addHours(date, 1),
    "EEEE dd LLLL yyyy HH:mm:ss"
  );

  return OUTPUT_ARRAY.some((it) => {
    const itStartDateString = it.secondDate.startDate;
    const isSecondEndDate = it.secondDate.endDate;
    const isLastStartDateString = it.lastDate.startDate;
    const itEndDateString = it.lastDate.endDate;

    return (
      isLastStartDateString === startDateString ||
      isSecondEndDate === endDateString ||
      itStartDateString === startDateString ||
      itEndDateString === lastDateString
    );
  });
}

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
  console.log(
    "After Generating Date: " + format(newDate, "EEEE dd LLLL yyyy HH:mm:ss")
  );
  return newDate;
}

// generate an hours with a range
function generateHours(date) {
  console.log(date);
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

// generate a minute with a range
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

// read the csv file
fs.createReadStream(dataCsvPath)
  .pipe(csv(["MailFrom", "MailTo", "Start", "End"]))
  .on("data", (data) => {
    data.MailFrom = data.MailFrom.replace(/"/g, "");
    data.MailTo = data.MailTo.replace(/"/g, "");
    dataArray.push(data);
  })
  .on("end", () => {
    if (dataArray) {
      for (let i = 0; i < dataArray.length; i++) {
        const data = dataArray[i];
        const startDate = parse(data.Start, "dd/MM/yyyy", new Date());
        const endDate = parse(data.End, "dd/MM/yyyy", new Date());

        const durationInDays = differenceInDays(endDate, startDate);

        let middleDate = addBusinessDays(startDate, durationInDays / 2);
        while (getDay(middleDate) !== 3 && getDay(middleDate) !== 5) {
          middleDate = addDays(middleDate, 1);
        }

        middleDate = addMinutes(
          addHours(middleDate, generateHours(middleDate)),
          generateMinutes("middle")
        );

        console.log(
          "isAMiddleDate",
          isOverlap(middleDate, OUTPUT_ARRAY),
          format(middleDate, "EEEE dd LLLL yyyy HH:mm:ss")
        );

        if (isOverlap(middleDate, OUTPUT_ARRAY)) {
          console.log(
            "Overlap detected for middle date. Generating a new date."
          );
          middleDate = generateNewDate(middleDate, OUTPUT_ARRAY, "middle");
        }

        console.log(
          "After middle date check:",
          format(middleDate, "EEEE dd LLLL yyyy HH:mm:ss")
        );

        console.log(
          "isAMiddleDate",
          isOverlap(middleDate, OUTPUT_ARRAY),
          format(middleDate, "EEEE dd LLLL yyyy HH:mm:ss")
        );

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

        console.log(
          "isAnEndDate",
          isOverlap(endDayStart, OUTPUT_ARRAY),
          format(endDayStart, "EEEE dd LLLL yyyy HH:mm:ss")
        );

        if (isOverlap(endDayStart, OUTPUT_ARRAY)) {
          console.log("Overlap detected for end date. Generating a new date.");
          endDayStart = generateNewDate(endDayStart, OUTPUT_ARRAY, "end");
        }

        console.log(
          "After end date check:",
          format(endDayStart, "EEEE dd LLLL yyyy HH:mm:ss")
        );

        console.log(
          "isAnEndDate",
          isOverlap(endDayStart, OUTPUT_ARRAY),
          format(endDayStart, "EEEE dd LLLL yyyy HH:mm:ss")
        );

        const outputObject = {
          MailFrom: data.MailFrom,
          MailTo: data.MailTo,
          firstDate: {
            Object: "Welcome to the Jungle!",
            text: FIRST_TEXT,
            date: format(startDate, "EEEE dd LLLL yyyy"),
          },
          secondDate: {
            Object: "Welcome to the Jungle!",
            text: SECOND_TEXT,
            startDate: format(middleDate, "EEEE dd LLLL yyyy HH:mm:ss"),
            endDate: format(
              addMinutes(middleDate, 30),
              "EEEE dd LLLL yyyy HH:mm:ss"
            ),
          },
          lastDate: {
            Object: "Welcome to the Jungle!",
            text: LAST_TEXT,
            startDate: format(endDayStart, "EEEE dd LLLL yyyy HH:mm:ss"),
            endDate: format(
              addHours(endDayStart, 1),
              "EEEE dd LLLL yyyy HH:mm:ss"
            ),
          },
        };

        OUTPUT_ARRAY.push(outputObject);
        console.log("New Array", OUTPUT_ARRAY, OUTPUT_ARRAY.length);
      }
    }
  })
  .on("error", (error) => {
    console.error("Error reading CSV file:", error);
  });
