import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";
import CalIcon from "./assets/icon-next-date.svg";
import IconRight from "./assets/icon-left.svg";
import IconLeft from "./assets/icon-right.svg";
import { Grid, Button } from "@material-ui/core";

function App() {
  const weekDayLong = moment.weekdays();
  const [state, setState] = useState({
    currentDate: moment(new Date()),
    dateCells: [],
  });

  const setDate = (currentDate) => (e) => {
    setState(() => {
      const dateObj = moment(currentDate);
      const firstDayOfMonth = dateObj.startOf("month").format("d");
      const lastDayOfMonth = dateObj.endOf("month").format("d");
      const daysInMonth = dateObj.daysInMonth();
      let newDateCell = [];

      let prevDateObj = moment(currentDate);
      let previousMonth = prevDateObj.subtract(1, "months").format("MMM");
      let lastDayOfPreviousMonth = parseInt(
        prevDateObj.set({ month: previousMonth }).endOf("month").format("D"),
        10
      );
      let yearOfPrevMonth = prevDateObj
        .set({ month: previousMonth })
        .endOf("month")
        .format("YYYY");

      for (let i = firstDayOfMonth; i > 0; i--) {
        let momentObject = moment().set({
          date: lastDayOfPreviousMonth,
          month: previousMonth,
          year: yearOfPrevMonth,
        });
        newDateCell = [
          {
            date: momentObject,
            isPrevious: true,
            hasAppointments: i === 8 || i === 13 || i === 18 || i === 23,
          },
        ].concat(newDateCell);
        --lastDayOfPreviousMonth;
      }

      for (let i = 1; i <= daysInMonth; i++) {
        let momentObject = moment().set({
          date: i,
          month: dateObj.format("MMM"),
          year: dateObj.format("YYYY"),
        });
        newDateCell.push({
          date: momentObject,
          isCurrent: true,
          hasAppointments: i === 8 || i === 13 || i === 18 || i === 23,
        });
      }

      if (parseInt(lastDayOfMonth, 10) < 6) {
        let nextDateObj = moment(currentDate);
        let nextMonth = nextDateObj.add(1, "months").format("MMM");
        nextDateObj.set({ month: nextMonth });
        let firstDayOfNextMonth = 1;
        let yearOfNextMonth = nextDateObj
          .set({ month: nextMonth })
          .format("YYYY");

        for (let i = parseInt(lastDayOfMonth, 10); i < 6; i++) {
          let momentObject = moment().set({
            date: firstDayOfNextMonth,
            month: nextMonth,
            year: yearOfNextMonth,
          });
          newDateCell.push({
            date: momentObject,
            isNext: true,
            hasAppointments: i === 8 || i === 13 || i === 18 || i === 23,
          });
          ++firstDayOfNextMonth;
        }
      }

      newDateCell = newDateCell.map((date, i) => ({
        ...date,
        isToday: moment(currentDate.format("YYYY-MM-DD")).isSame(
          date.date.format("YYYY-MM-DD")
        ),
        weekOff: date.date.day() === 0 || date.date.day() === 6,
      }));

      const weekRow = [];
      Array(newDateCell.length / 7)
        .fill([])
        .forEach((dateArray, index) => {
          const week = [];
          for (let i = index * 7; i < index * 7 + 7; i++) {
            week.push(newDateCell[i]);
            dateArray.push(week[i]);
          }
          weekRow.push(week);
        });
      return { currentDate: currentDate, dateCells: newDateCell, weekRow };
    });
  };

  useEffect(() => {
    setDate(moment(new Date()))();
  }, []);

  return (
    <div className="App">
      <div className="cal-nav-bar">
        <Button
          className="today-button"
          variant="contained"
          color="primary"
          disableElevation
          onClick={setDate(moment(new Date()))}
        >
          <img src={CalIcon} alt="calIcon" />
          <span>Today</span>
        </Button>
        <div className="nav-buttons">
          <img
            src={IconLeft}
            alt="iconLeft"
            onClick={setDate(
              moment(state.currentDate).subtract(1, "months").set({ date: 1 })
            )}
          />
          <span>{state.currentDate.format("MMMM YYYY")}</span>
          <img
            src={IconRight}
            alt="iconRight"
            onClick={setDate(
              moment(state.currentDate).add(1, "months").set({ date: 1 })
            )}
          />
        </div>
      </div>
      <Grid container className="week-grid">
        {weekDayLong.map((day) => (
          <Grid item xs className="calendar-header" key={`week_day__${day}`}>
            <span key={day}>{day.toUpperCase()}</span>
          </Grid>
        ))}
      </Grid>
      {state.weekRow &&
        state.weekRow.map((week, week_i) => {
          return (
            <Grid container key={`week__${week_i}`} style={{ height: "100%" }}>
              {week.map((date, i) => {
                return (
                  <Grid item xs key={`day__${i}`}>
                    <div
                      key={date.date.format("DDMMYYYY")}
                      className={`calendar-cell${
                        (i + week_i) % 2 === 0 ? " light" : " dark"
                      }${
                        date.isNext || date.isPrevious || date.weekOff
                          ? " faded"
                          : ""
                      }`}
                      onClick={setDate(date.date)}
                    >
                      <div
                        className={`calendar-cell-inner${
                          date.isToday ? " border" : ""
                        }`}
                      >
                        <span className="date">
                          {date.date.format("DD")}
                          {date.isToday && (
                            <small>{date.date.format("MMMM")}</small>
                          )}
                        </span>
                        {date.hasAppointments && !date.weekOff && (
                          <span className="caption">No Appointment</span>
                        )}
                        {date.weekOff && (
                          <span className="caption">Week Off</span>
                        )}
                      </div>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          );
        })}
    </div>
  );
}

export default App;
