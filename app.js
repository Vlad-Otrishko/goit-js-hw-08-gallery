const galleryItems = [
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825_1280.jpg',
    description: 'Hokkaido Flower',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    description: 'Container Haulage Freight',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    description: 'Aerial Beach View',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    description: 'Flower Blooms',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    description: 'Alpine Mountains',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    description: 'Mountain Lake Sailing',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    description: 'Alpine Spring Meadows',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    description: 'Nature Landscape',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    description: 'Lighthouse Coast Sea',
  },
];

const galleryRef = document.querySelector('.js-gallery');
const modalRef = document.querySelector(".js-lightbox");
let targetedFrame; //это переменная для дальнейшей навигации клавишами вправо/влево

// ***********СОЗДАНИЕ ГАЛЕРЕИ****************
function galleryCreate () {
  return galleryItems
    .map(
      ({ preview, original, description }) => `<li class="gallery__item">
          <a class="gallery__link" href=${original}> <img class="gallery__image" src=${preview} data-source=${original}
          alt=${description}  onclick="event.preventDefault()"/>
  </a>
</li>`
    )
    .join(" ");
}
galleryRef.insertAdjacentHTML('beforeend', galleryCreate());
//************************************************************************************************** */

galleryRef.addEventListener("click", imageOnClick);//слушатель на контейнер галереи
modalRef.addEventListener("click", modalOnClick);//слушатель событий на модальном окне

//**********функции при клике на выбранный элемент ГАЛЕРЕИ */
function imageOnClick(event) {
  if (!event.target.classList.contains("gallery__image")) {
    return;
  }
  modalOpening(event);
  targetedFrame = event.target.closest(".gallery__item"); //"фокусировка" на элементе галереи <li>, в котором содержится
                                                        //event.target (картинка, на которую кликнули) -  это для дальнейшей навигации кнопками
}
//открытие модального окна
function modalOpening(event) {
  modalRef.classList.toggle("is-open");
  imageAssign(event);
  window.addEventListener("keydown", onKeyPress);// добавление слушателя событий клавиатуры на window только при открытом модальном окне 
}
//функция подстановка ссылки на "большое" изображение в атрибуты содержимого модального окна ('src', 'alt')
function imageAssign(event) {
  const lightBoxImageRef = modalRef.querySelector(".lightbox__image");
  lightBoxImageRef.setAttribute('alt', event.target.getAttribute('alt'));
    lightBoxImageRef.setAttribute(
      "src",
      event.target.getAttribute("data-source")
    );

}

//**********функции при клике на элементах открытого МОДАЛЬНОГО ОКНА */
function modalOnClick(event) {
 if ( event.target.className !== "lightbox__button" &&
  event.target.className !== "lightbox__overlay"
) {
  return;
}
  modalClose();
}
//закрытие модального окна, с "очисткой" атрибутов <img> модального окна и снятием слушателя клавиатуры
function modalClose() {
  modalRef.classList.toggle("is-open");
  imageReset();
  window.removeEventListener("keydown", onKeyPress);
}
//очистка атрибутов <img> модального окна
function imageReset() {
    const lightBoxImageRef = modalRef.querySelector(".lightbox__image");
    lightBoxImageRef.setAttribute("alt", "");
    lightBoxImageRef.setAttribute("src", "");
}
// ****ФУНКЦИИ СОБЫТИЙ КЛАВИАТУРЫ ******
function onKeyPress(event) {
  if (event.code === 'Escape')   //закрытие модального окна по Escape
  {
    modalClose(); return;
  }
    sliderFunction(event);  //навигация клавишами: вправо/влево
}

//функция навигации кнопками: вправо/влево

function sliderFunction(event) {
  console.log(event.code);
  const lightBoxImageRef = modalRef.querySelector(".lightbox__image");
  let newTargetedFrame;
  if (event.code !== "ArrowRight" && event.code !== "ArrowLeft") { return;} // guard clause
    if (event.code === "ArrowRight") {
      newTargetedFrame = targetedFrame.nextElementSibling;         // назначаем целевой элемент галереи, из которого будет взята ссылка(data-source) на изображение и записана в 'src' изображения модального окна 
                  if (targetedFrame === galleryRef.lastElementChild) {   //проверка, является ли текущий элемент галереи последним
                    newTargetedFrame = galleryRef.firstElementChild; //если да то "фокусируемся" на первом элементе галереи (чтобы можно было листать галерею по кругу)
                  }


      lightBoxImageRef.setAttribute(
        "alt",
        newTargetedFrame.querySelector(".gallery__image").getAttribute("alt")
      );
      lightBoxImageRef.setAttribute(
        "src",
        newTargetedFrame
          .querySelector(".gallery__image")
          .getAttribute("data-source")
      );
    }

  if (event.code === "ArrowLeft") {                              //те же логика, что и выше, для события  нажатия клавиши "вправо"
    newTargetedFrame = targetedFrame.previousElementSibling;
    if (targetedFrame === galleryRef.firstElementChild) {
      newTargetedFrame = galleryRef.lastElementChild;
    } 
    lightBoxImageRef.setAttribute(
      "alt",
      newTargetedFrame.querySelector(".gallery__image").getAttribute("alt")
    );
    lightBoxImageRef.setAttribute(
      "src",
      newTargetedFrame
        .querySelector(".gallery__image")
        .getAttribute("data-source")
    );
  }
  targetedFrame = newTargetedFrame;   // "фокусировка" на текущем элементе галереи
}
