import "./itineraryCalendar.css";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

export const ItineraryCalendarPage = ({ history }) => {
  const itineraryData = [
    {
      day: 1,
      places: [
        {
          location: "Golden Gate Bridge",
          lat: 37.8199286,
          lng: -122.4782551,
          startTime: "6:00 AM",
          endTime: "11:00 AM",
          cost: "100",
          desc: "Bridge day",
        },
        {
          location: "Bay Bridge",
          lat: 37.7893726,
          lng: -122.3873613,
          startTime: "12:30 PM",
          endTime: "6:00 PM",
          cost: "50",
          desc: "Fish day",
        },
      ],
    },
    {
      day: 2,
      places: [
        {
          location: "Fisherman's Wharf",
          lat: 37.8085771,
          lng: -122.4125282,
          startTime: "10:00 AM",
          endTime: "3:00 PM",
          cost: "200",
          desc: "Beach Day",
        },
      ],
    },
    {
      day: 3,
      places: [
        {
          location: "Alcatraz Island",
          lat: 37.8266636,
          lng: -122.4230122,
          startTime: "3:00 PM",
          endTime: "8:00 PM",
          cost: "150",
          desc: "Island day",
        },
      ],
    },
    {
      day: 4,
      places: [
        {
          location: "Alcatraz Island",
          lat: 37.8266636,
          lng: -122.4230122,
          startTime: "3:00 PM",
          endTime: "8:00 PM",
          cost: "150",
          desc: "Island day",
        },
      ],
    },
  ];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const colors = ["#e9f5ff", "#cde6dd", "#F2EFFF", "#FEC027"];

  const isHourWithinPlaceTimeRange = (hour, startTime, endTime) => {
    const startHour = parseInt(timeTo24HourFormat(startTime).split(":")[0], 10);
    const endHour = parseInt(timeTo24HourFormat(endTime).split(":")[0], 10);
    return hour >= startHour && hour < endHour;
  };
  const timeTo24HourFormat = (time) => {
    const [hours, minutesAndPeriod] = time.split(":");
    const [minutes, period] = minutesAndPeriod.split(" ");

    let hoursIn24Format = parseInt(hours, 10);
    if (period.toLowerCase() === "pm" && hours !== "12") {
      hoursIn24Format += 12;
    } else if (period.toLowerCase() === "am" && hours === "12") {
      hoursIn24Format = 0;
    }

    return `${hoursIn24Format}:${minutes}`;
  };

  const timeToGridColumn = (time) => {
    const [hours, minutes] = timeTo24HourFormat(time).split(":").map(Number);
    return hours + 2; // +2 because the first column is the day name
  };

  const timeSpanToGridColumns = (startTime, endTime) => {
    return timeToGridColumn(endTime) - timeToGridColumn(startTime) + 1;
  };
  const containerStyle = {
    backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.4)
    ), url(https://pixabay.com/get/g7c8760f4a9af9e60398c9db3dada3a60e07b375b7fba71d86ed362df4e7a7c4d9b615022f8f3ac3e46d5e2f97d5c35c9a86921aa9fddd1748afbfe7ceabb56bb_640.jpg)`, // Set the dynamic image URL
    backgroundSize: "cover", // Adjust as needed
    backgroundRepeat: "no-repeat", // Adjust as needed
    width: "100%", // Set dimensions and other styles
    height: "260px",
    position: "relative",
  };
  return (
    <>
      <div className="itinerary-page-container">
        <div className="image" style={containerStyle}>
          <div className="itinerary-info">
            <p
              style={{
                fontSize: "32px",
              }}
              className="mb-1"
            >
              San Franscisco 3 day Trip Plan
            </p>
            <div className="add-flex mb-2">
              <button className="planbutton planbutton3">
                verified trip plan
              </button>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="calendar-days"
                class="svg-inline--fa fa-w-14 fa-fw ml-3"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"
                ></path>
              </svg>
              <span className="ml-2">Apr 3,2023 - Apr 4,2023</span>
            </div>

            <div className="add-flex">
              <div className="add-flex">
                {Array(4)
                  .fill()
                  .map((_, index) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 star-icon"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  ))}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 star-icon-color"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </div>
              <span className="ml-3">1268 ratings</span>
            </div>
          </div>
        </div>
        <div className="itinerary-rating space-flex">
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
              }}
              className="mb-2"
            >
              Trip Created By <span style={{ color: "#f75940" }}>Rakshith</span>
            </h2>
            <div className="add-flex">
              <img
                src="https://pixabay.com/get/g976243b86e50d1758819fb7695c655280a4a8fdae1fbd4cfa00b36f9671837138363a334782781431c1fbd8c5f722d51fd12270746ec9d38e7767ab7fbd0e8b7_640.jpg"
                style={{ height: "52px", width: "52px", borderRadius: "50%" }}
              ></img>
              <div className="add-flex ml-2">
                {Array(5)
                  .fill()
                  .map((_, index) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 star-icon-color fill-color"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  ))}
                <span
                  className="ml-2"
                  style={{
                    fontSize: "10px",
                    marginTop: "-4px",
                    fontWeight: "700",
                  }}
                >
                  Rate Rakshith
                </span>
              </div>
            </div>
          </div>
          <div className="add-flex">
            <button className="planbutton planbutton2">Join</button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 height-icon star-icon-color fill-color ml-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
        </div>
        <div className="calendar-container">
          <div className="time-header">
            <div className="hour hour-not"></div>
            {hours.map((hour) => (
              <div key={hour} className="hour">
                {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? "am" : "pm"}
              </div>
            ))}
          </div>
          {itineraryData &&
            itineraryData.map((day, index) => (
              <div key={index} className="day-container">
                <div className="day-header">
                  <div>
                    <p>Monday</p>
                    <p style={{ color: "#f75940" }}>September 11</p>
                  </div>
                </div>
                {hours.map((hour) => {
                  const placeForHour = day.places.find((place) =>
                    isHourWithinPlaceTimeRange(
                      hour,
                      place.startTime,
                      place.endTime
                    )
                  );

                  if (placeForHour) {
                    if (!placeForHour.processed) {
                      placeForHour.processed = true;
                      return (
                        <div
                          key={hour}
                          className="place-card"
                          style={{
                            gridColumnStart: timeToGridColumn(
                              placeForHour.startTime
                            ),
                            gridColumnEnd: timeToGridColumn(
                              placeForHour.endTime
                            ),
                            backgroundColor: colors[index],
                          }}
                        >
                          <div className="card-flex">
                            <img
                              src="https://pixabay.com/get/g71e87d8fe33409bc4a2881323dab396a8a8ccb9e41c9955998f8898f5f669dddd4ccfdd6913e56bf853dc221161a5d10c0fe03abceb2e3f6f6aed154e911e3dc_640.jpg"
                              style={{
                                height: "52px",
                                width: "52px",
                                borderRadius: "16px",
                              }}
                            ></img>
                            <div className="column-flex">
                              <span style={{ color: "#f75940" }}>
                                {placeForHour.location}
                              </span>
                              <span>Beach Day</span>
                            </div>
                          </div>
                          <div className="cost-card">
                            <span style={{ color: "#f75940" }}>
                              {placeForHour.cost} $
                            </span>
                          </div>
                        </div>
                      );
                    }
                  } else {
                    return <div key={hour} className="hour"></div>;
                  }
                })}
              </div>
            ))}
        </div>
      </div>
      {/* <FullCalendar plugins={[timeGridPlugin]} initialView={"timeGridWeek"} /> */}
    </>
  );
};

export default ItineraryCalendarPage;
