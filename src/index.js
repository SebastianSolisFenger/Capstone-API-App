import './style.css';
import { getNasaApi, getDataDateImage, likeLink } from './modules/API-links.js';
import { getData, postData } from './modules/get-post-data.js';
import {
  containerDynamicCards,
  displayWindowPopup,
  closeWindowPopup,
} from './modules/pop-up.js';

const addFirstInterfaceCard = (image, titleCard, indexCard) => {
  const card = document.createElement('div');
  card.classList.add('cardContainer');
  card.innerHTML = `
  <div class="imgCardcontainer">
  <img src="${image}" add="Image provided by Nasa's Api">
  </div>
  <div class="title">
  <h3>${titleCard}</h3>
  <a href="#" id="${indexCard}star" class="like"><i class="fas fa-heart"></i></a>
  </div>
  <small class="small-class"></small>
  <input type="button" value="Comments" id="${indexCard}" class="comment">

  `;
  containerDynamicCards.appendChild(card);
};

const displayImage = (idImg) => {
  getData(getDataDateImage(idImg))
    .then((data) => displayWindowPopup(data.hdurl, data.title, data.infoDescript, idImg))
    .then(() => {
      const closePopupBtn = document.getElementById('closePopup');
      closePopupBtn.addEventListener('click', () => {
        closeWindowPopup(closePopupBtn);
      });
    })
    .catch((error) => console.log(error));
};

const sendLikesDom = (idLike, likes) => {
  const small = document.getElementById(idLike);
  small.parentElement.nextElementSibling.innerHTML = `${likes} likes`;
};

function countingElementsFunc(elem) {
  return elem.childElementCount;
}

const showFuncLikes = () => {
  getData(likeLink)
    .then((data) => data.forEach((card, index) => {
      if (index < countingElementsFunc(containerDynamicCards)) {
        sendLikesDom(card.item_id, card.likes);
      }
    }))
    .catch((error) => console.log(error));
};

const showAmountOfLikes = () => {
  getData(getNasaApi)
    .then((data) => data.forEach((card, ind) => addFirstInterfaceCard(card.hdurl, card.title, ind)))
    .then(() => {
      showFuncLikes();
    })
    .catch((error) => console.log(error));
};

const rawFunclike = (idLike, likes) => {
  const data = { item_id: idLike };
  postData(likeLink, data)
    .then((data) => {
      if (data.status === 201) {
        sendLikesDom(idLike, likes);
      }
    })
    .catch((error) => console.log(error));
};

showAmountOfLikes();
rawFunclike();

containerDynamicCards.addEventListener('click', (e) => {
  // THIS WILL DISPLAY THE CORRESPONDING LIKES
  // if (e.target.classList.contains('fa-heart')) {
  //   e.preventDefault();
  //   const likeCounter = parseInt(
  //     e.target.parentElement.parentElement.nextElementSibling.textContent,
  //     10,
  //   );
  //   const likes = likeCounter + 1;
  //   rawFunclike(e.target.parentElement.id, likes);
  // }
  if (e.target.classList.contains('comment')) {
    displayImage(parseInt(e.target.id, 10));
  }
});
