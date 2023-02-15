export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
export const KEY = 'c8dd7962-eb88-42db-b817-4e5c93136002';
export const SPOON_KEY = 'b74001295d444d32b61510c3bcc93eaa';
export const MODAL_CLOSE_SEC = 2.5;

export const uuid = function () {
  const random = Math.random();
  const id = Number(random).toString(32);
  return id;
};

//---------Calendar Options------------

export const calendarWeeKView = {
  week: {
    eventView: false,
    taskView: ['task'],
  },
};

export const calendarMealOptions = {
  template: {
    taskTitle() {
      return `
                  <div class="breakfast"> BREAKFAST </div>
                  <div class="lunch"> LUNCH </div>
                  <div class="dinner"> DINNER </div>`;
    },
  },
};

export const calendarPopupForm = {
  useFormPopup: true,
  useDetailPopup: true,
};
