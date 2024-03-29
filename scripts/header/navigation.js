import { getItem, setItem } from "../common/storage.js";
import { renderWeek } from "../calendar/calendar.js";
import { renderHeader } from "../calendar/header.js";
import { getStartOfWeek, getDisplayedMonth } from "../common/time.utils.js";


const prevButton = document.querySelector(".navigation__nav-icon[data-direction='prev']");
const nextButton = document.querySelector(".navigation__nav-icon[data-direction='next']");
const todayButton = document.querySelector(".navigation__today-btn");
// const navElem = document.querySelector(".navigation");
const displayedMonthElem = document.querySelector(
  ".navigation__displayed-month"
);

function renderCurrentMonth() {
  // отрисовать месяц, к которому относиться текущая неделя (getDisplayedMonth)
  // вставить в .navigation__displayed-month
  const displayedWeekStart = getItem("displayedWeekStart");
  const displayedMonth = getDisplayedMonth(displayedWeekStart);
  displayedMonthElem.textContent = displayedMonth;
}

const onChangeWeek = (event) => {
  // при переключении недели обновите displayedWeekStart в storage
  // и перерисуйте все необходимые элементы страницы (renderHeader, renderWeek, renderCurrentMonth)
  const direction = event.target.dataset.direction;
  let newDisplayedWeekStart;
  
  if (direction === "prev" || direction === "next") {
    const displayedWeekStart = new Date(getItem("displayedWeekStart"));
    newDisplayedWeekStart = new Date(displayedWeekStart);

    if (direction === "prev") {
      newDisplayedWeekStart.setDate(new Date(displayedWeekStart.getDate()) - 7);
    } else {
      newDisplayedWeekStart.setDate(new Date(displayedWeekStart.getDate()) + 7);
    }
  } else if (direction === "today") {
    newDisplayedWeekStart = getStartOfWeek(new Date());
  }

  setItem("displayedWeekStart", newDisplayedWeekStart);
  renderHeader();
  renderWeek();
  renderCurrentMonth();
};



export const initNavigation = () => {
  renderCurrentMonth();
  // navElem.addEventListener("click", onChangeWeek);
  prevButton.addEventListener("click", onChangeWeek);
  nextButton.addEventListener("click", onChangeWeek);
  todayButton.addEventListener("click", onChangeWeek);
};
