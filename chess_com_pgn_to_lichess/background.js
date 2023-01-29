browser.browserAction.onClicked.addListener(() => {
  let now = new Date();
  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth() + 1;
  let paddedMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth;
  let monthPgnUrl = `https://api.chess.com/pub/player/mongrandseigneur/games/${currentYear}/${paddedMonth}`;

  let lastPgn = '';

  fetch(monthPgnUrl)
    .then(response => response.json())
    .then(data => {
      const lastObject = data.games[data.games.length - 1];
      lastPgn = lastObject.pgn;
      console.log(lastPgn);
    })
    .then(() => {
      browser.tabs.create({
        url: "https://lichess.org/paste",
        active: true
      })
      .then((tab) => {
        browser.tabs.executeScript(tab.id, {
            code: `document.querySelector("textarea[name='pgn']").value = ${JSON.stringify(lastPgn)};
	      document.getElementById("form3-analyse").checked = true;
              document.querySelector(".form-actions.single button").click();`
        });
      });
    })
    .catch(error => {
      console.error(error);
    });
});
