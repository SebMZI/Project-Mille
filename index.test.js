const { differenceInMinutes, differenceInHours } = require("date-fns");
const {
  parseDate,
  isOverlap,
  generateNewDate,
  readCsvFile,
} = require("./index");
const OUTPUT_ARRAY = [
  {
    MailFrom: "antoine.mille.fb@gmail.com",
    MailTo: "toto@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 15 November 2023",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 15 March 2024 13:00:00",
      endDate: "Friday 15 March 2024 13:30:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 24 April 2024 17:00:00",
      endDate: "Wednesday 24 April 2024 18:00:00",
    },
  },
  {
    MailFrom: "antoine.mille.site@gmail.com",
    MailTo: "tata@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 19 April 2024 13:00:00",
      endDate: "Friday 19 April 2024 13:30:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 22 May 2024 17:00:00",
      endDate: "Wednesday 22 May 2024 18:00:00",
    },
  },
  {
    MailFrom: "site@gmail.com",
    MailTo: "tato@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 19 April 2024 13:30:00",
      endDate: "Friday 19 April 2024 14:00:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 22 May 2024 12:00:00",
      endDate: "Wednesday 22 May 2024 13:00:00",
    },
  },
  {
    MailFrom: "antoinette.millA.site@gmail.com",
    MailTo: "taaato@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Wednesday 24 April 2024 13:30:00",
      endDate: "Wednesday 24 April 2024 14:00:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 22 May 2024 13:00:00",
      endDate: "Wednesday 22 May 2024 14:00:00",
    },
  },
  {
    MailFrom: "antoine.milA.site@gmail.com",
    MailTo: "tazzto@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Wednesday 24 April 2024 13:00:00",
      endDate: "Wednesday 24 April 2024 13:30:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Friday 24 May 2024 13:00:00",
      endDate: "Friday 24 May 2024 14:00:00",
    },
  },
  {
    MailFrom: "antoinetteff.millA.site@gmail.com",
    MailTo: "taaeaato@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 26 April 2024 13:30:00",
      endDate: "Friday 26 April 2024 14:00:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Friday 24 May 2024 17:00:00",
      endDate: "Friday 24 May 2024 18:00:00",
    },
  },
  {
    MailFrom: "seb@gmail.com",
    MailTo: "to@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 19 April 2024 12:30:00",
      endDate: "Friday 19 April 2024 13:00:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Friday 24 May 2024 12:00:00",
      endDate: "Friday 24 May 2024 13:00:00",
    },
  },
  {
    MailFrom: "mzi@gmail.com",
    MailTo: "ta@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 19 April 2024 12:00:00",
      endDate: "Friday 19 April 2024 12:30:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 29 May 2024 13:00:00",
      endDate: "Wednesday 29 May 2024 14:00:00",
    },
  },
  {
    MailFrom: "mzi@gmail.com",
    MailTo: "tie@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Wednesday 24 April 2024 12:30:00",
      endDate: "Wednesday 24 April 2024 13:00:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 29 May 2024 12:00:00",
      endDate: "Wednesday 29 May 2024 13:00:00",
    },
  },
  {
    MailFrom: "mzi@gmail.com",
    MailTo: "tess@gmail.com",
    firstEmail: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondEmail: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Wednesday 24 April 2024 12:00:00",
      endDate: "Wednesday 24 April 2024 12:30:00",
    },
    lastEmail: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 29 May 2024 17:00:00",
      endDate: "Wednesday 29 May 2024 18:00:00",
    },
  },
];

describe("In the script", () => {
  describe("CSV Test", () => {
    it("Should have the correct number of columns", async function () {
      const dataCsvPath = "./data/data.csv";
      const data = await readCsvFile(dataCsvPath);
      const expectedColumns = 4;

      data.map((row) => {
        expect(Object.keys(row).length).toEqual(expectedColumns);
      });
    });
    it("Should throw an error if not .csv", async function () {
      const dataWrong = "./data/data.txt";
      let error;
      try {
        const data = await readCsvFile(dataWrong);
      } catch (err) {
        error = err;
      }
      expect(error.message).toEqual("File's extension needs to be .csv");
    });
    it("Should have dates in the correct format (dd/MM/yyyy)", async function () {
      const dataCsvPath = "./data/data.csv";
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

      try {
        const data = await readCsvFile(dataCsvPath);
        data.map((item) => {
          expect(dateRegex.test(item.Start)).toBeTruthy();
        });
      } catch (err) {
        error = err;
      }
    });
  });
  describe("parseDate should return a date string like  Wed Jan 03 2024 00:00:00 GMT+0100 (heure normale d`Europe centrale) when", () => {
    it("given 3/1/2024", () => {
      const date = "3/1/2024";
      const newDate = parseDate(date).toString();
      expect(newDate).toEqual(
        "Wed Jan 03 2024 00:00:00 GMT+0100 (heure normale d’Europe centrale)"
      );
    });
    it("given 15/11/2023", () => {
      const date = "15/11/2023";
      const newDate = parseDate(date).toString();
      expect(newDate).toEqual(
        "Wed Nov 15 2023 00:00:00 GMT+0100 (heure normale d’Europe centrale)"
      );
    });
  });

  describe("isOverlap should return a boolean", () => {
    let newDate = new Date("Friday 15 March 2024 13:00:00");

    it("truly when a date is overlapped", () => {
      const alreadyExists = isOverlap(newDate, OUTPUT_ARRAY);
      expect(alreadyExists).toBeTruthy();
    });
    it("falsy when generate a new date", () => {
      if (isOverlap(newDate, OUTPUT_ARRAY)) {
        newDate = generateNewDate(newDate, OUTPUT_ARRAY, "middle");
      }
      const alreadyExists = isOverlap(newDate, OUTPUT_ARRAY);
      expect(alreadyExists).toBeFalsy();
    });
  });

  describe("The duration within the time slot should", () => {
    it("be 30 minutes when it's the middle date", () => {
      OUTPUT_ARRAY.map((item) => {
        const diffMinutes = differenceInMinutes(
          new Date(item.secondEmail.endDate),
          new Date(item.secondEmail.startDate)
        );
        expect(diffMinutes).toEqual(30);
      });
    });
    it("be 1hour when it's the end date", () => {
      OUTPUT_ARRAY.map((item) => {
        const diffHours = differenceInHours(
          new Date(item.lastEmail.endDate),
          new Date(item.lastEmail.startDate)
        );
        expect(diffHours).toEqual(1);
      });
    });
  });
});
