const showList = function (toShow, toHide) {
  document.getElementById(toShow).classList.remove('hidden');
  document.getElementById(toHide).classList.add('hidden');
};

const main = function () {
  Drafts.addEventListener('click', function () {
    showList('DraftsList', 'PublishedList');
  });
  Published.addEventListener('click', function () {
    showList('PublishedList', 'DraftsList');
  });
};

window.onload = main;