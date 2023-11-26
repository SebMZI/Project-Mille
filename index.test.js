const { differenceInMinutes, differenceInHours } = require("date-fns");
const { parseDate, isOverlap, generateNewDate } = require("./index");
const OUTPUT_ARRAY = [
  {
    MailFrom: "antoine.mille.fb@gmail.com",
    MailTo: "toto@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 15 November 2023",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 15 March 2024 13:00:00",
      endDate: "Friday 15 March 2024 13:30:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 24 April 2024 17:00:00",
      endDate: "Wednesday 24 April 2024 18:00:00",
    },
  },
  {
    MailFrom: "antoine.mille.site@gmail.com",
    MailTo: "tata@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 19 April 2024 13:00:00",
      endDate: "Friday 19 April 2024 13:30:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 22 May 2024 17:00:00",
      endDate: "Wednesday 22 May 2024 18:00:00",
    },
  },
  {
    MailFrom: "site@gmail.com",
    MailTo: "tato@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 19 April 2024 13:30:00",
      endDate: "Friday 19 April 2024 14:00:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 22 May 2024 12:00:00",
      endDate: "Wednesday 22 May 2024 13:00:00",
    },
  },
  {
    MailFrom: "antoinette.millA.site@gmail.com",
    MailTo: "taaato@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Wednesday 24 April 2024 13:30:00",
      endDate: "Wednesday 24 April 2024 14:00:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 22 May 2024 13:00:00",
      endDate: "Wednesday 22 May 2024 14:00:00",
    },
  },
  {
    MailFrom: "antoine.milA.site@gmail.com",
    MailTo: "tazzto@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Wednesday 24 April 2024 13:00:00",
      endDate: "Wednesday 24 April 2024 13:30:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Friday 24 May 2024 13:00:00",
      endDate: "Friday 24 May 2024 14:00:00",
    },
  },
  {
    MailFrom: "antoinetteff.millA.site@gmail.com",
    MailTo: "taaeaato@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 26 April 2024 13:30:00",
      endDate: "Friday 26 April 2024 14:00:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Friday 24 May 2024 17:00:00",
      endDate: "Friday 24 May 2024 18:00:00",
    },
  },
  {
    MailFrom: "seb@gmail.com",
    MailTo: "to@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 19 April 2024 12:30:00",
      endDate: "Friday 19 April 2024 13:00:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Friday 24 May 2024 12:00:00",
      endDate: "Friday 24 May 2024 13:00:00",
    },
  },
  {
    MailFrom: "mzi@gmail.com",
    MailTo: "ta@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Friday 19 April 2024 12:00:00",
      endDate: "Friday 19 April 2024 12:30:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 29 May 2024 13:00:00",
      endDate: "Wednesday 29 May 2024 14:00:00",
    },
  },
  {
    MailFrom: "mzi@gmail.com",
    MailTo: "tie@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Wednesday 24 April 2024 12:30:00",
      endDate: "Wednesday 24 April 2024 13:00:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 29 May 2024 12:00:00",
      endDate: "Wednesday 29 May 2024 13:00:00",
    },
  },
  {
    MailFrom: "mzi@gmail.com",
    MailTo: "tess@gmail.com",
    firstDate: {
      object: "Welcome to Mille!",
      content: "Hello welcome to Mille! This is the first mail!",
      date: "Wednesday 03 January 2024",
    },
    secondDate: {
      object: "Welcome to Mille!",
      content: "This is the second mail!",
      startDate: "Wednesday 24 April 2024 12:00:00",
      endDate: "Wednesday 24 April 2024 12:30:00",
    },
    lastDate: {
      object: "Welcome to Mille!",
      content: "This is the third mail!",
      startDate: "Wednesday 29 May 2024 17:00:00",
      endDate: "Wednesday 29 May 2024 18:00:00",
    },
  },
];

describe("In the script", () => {
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
          new Date(item.secondDate.endDate),
          new Date(item.secondDate.startDate)
        );
        expect(diffMinutes).toEqual(30);
      });
    });
    it("be 1hour when it's the end date", () => {
      OUTPUT_ARRAY.map((item) => {
        const diffHours = differenceInHours(
          new Date(item.lastDate.endDate),
          new Date(item.lastDate.startDate)
        );
        expect(diffHours).toEqual(1);
      });
    });
  });
});
