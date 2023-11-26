require("dotenv").config();
const csv = require("csv-parser");
const nodemailer = require("nodemailer");
const path = require("path");
// const schedule = require("node-schedule");
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
const dataCsvPath = "./data/data.csv";
const FIRST_MAIL = {
  object: "Welcome to Mille! This is the first mail",
  content: "Hello welcome to Mille! This is the first mail!",
};
const SECOND_MAIL = {
  object: "Welcome to Mille! This is the second mail",
  content: "Here is your time slot.",
};
const LAST_MAIL = {
  object: "Welcome to Mille! This is the last mail",
  content: "Here is your time slot.",
};
const dataArray = [];
const OUTPUT_ARRAY = [];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mrgy.sebastien@gmail.com",
    pass: process.env.AUTH_TRANSPORTER_PASS, // Use the App Password here
  },
});

// Read the CSV file and populate dataArray with the data
function readCsvFile(dataCsv) {
  return new Promise((resolve, reject) => {
    //console.log(typeof dataCsv);
    const extCsv = path.extname(dataCsv);

    if (extCsv !== ".csv") {
      throw new Error("File's extension needs to be .csv");
    }
    fs.createReadStream(dataCsvPath)
      .pipe(csv(["MailFrom", "MailTo", "Start", "End"]))
      .on("data", (data) => {
        if (Object.keys(data).length > 4) {
          throw new Error("Csv file should contain only 4 columns!");
        }
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

// Look if the newDate is already in the output Array
function isOverlap(date, OUTPUT_ARRAY) {
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

function generateHours(date) {
  // console.log(date);
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

function parseDate(date) {
  return parse(date, "dd/MM/yyyy", new Date());
}

function analyzeData() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await readCsvFile(dataCsvPath);

      if (data) {
        data.map((item) => {
          const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
          if (!dateRegex.test(item.Start) || !dateRegex.test(item.End)) {
            throw new Error("Date format not supported! Should be xx/xx/xxxx");
          }

          const startDate = parseDate(item.Start);
          const endDate = parseDate(item.End);

          const durationInDays = differenceInDays(endDate, startDate);

          if (durationInDays < 0) {
            throw new Error("Invalid dates!");
          }

          let middleDate = addBusinessDays(startDate, durationInDays / 2);
          while (getDay(middleDate) !== 3 && getDay(middleDate) !== 5) {
            middleDate = addDays(middleDate, 1);
          }

          middleDate = addMinutes(
            addHours(middleDate, generateHours(middleDate)),
            generateMinutes("middle")
          );

          if (isOverlap(middleDate, OUTPUT_ARRAY)) {
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

async function getOutputArray() {
  try {
    const result = await analyzeData();
    scheduleEmails(result);
    //console.log("Emails scheduled successfully.");
  } catch (error) {
    //console.error("Error getting output array:", error);
  }
}

getOutputArray();

// Schdule emails
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
}

// Send email function
function sendMail(outputMail, outputItem, mailContent) {
  const htmlContent = fs.readFileSync("./index.html", "utf-8");
  // console.log(outputItem);

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
      //console.error("Error:", error);
    } else {
      // console.log("Email sent:", info.response);
    }
  });
}

module.exports = { parseDate, isOverlap, generateNewDate, readCsvFile };
