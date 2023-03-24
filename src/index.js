
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';
import NewApiImageService from './js/fetchPictures';
import './sass/index.scss';


const refs = {
  formEl: document.querySelector('#search-form'),
  divEl: document.querySelector('.gallery'),
  observerEl: document.querySelector('#sentinel'),
};

const simpleLightbox = new SimpleLightbox('.gallery a');

const ImagesApi = new NewApiImageService();

let totalPages = 1;

refs.formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  refs.divEl.innerHTML = '';
  ImagesApi.resetPage();
  ImagesApi.query = event.target.elements.searchQuery.value.trim();
  if (ImagesApi.query === '') {
    return Notiflix.Notify.warning('Please enter a query');
  }

  fetchImages();
}

async function fetchImages() {
  const response = await ImagesApi.fetchImage();
  const { hits, totalHits } = response;
  totalPages = Math.ceil(totalHits / 40);
  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
	imagesMarkup(response);
	Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
}

function renderGallery(image) {
  return image
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
              <a class="gallery__link" href="${largeImageURL}">
                  <div class="photo-card">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                      <div class="info">
                          <p class="info-item">
                              <b>Likes</b>
                              ${likes}
                          </p>
                          <p class="info-item">
                              <b>Views</b>
                              ${views}
                          </p>
                          <p class="info-item">
                              <b>Comments</b>
                              ${comments}
                          </p>
                          <p class="info-item">
                              <b>Downloads</b>
                              ${downloads}
                          </p>
                      </div>
                  </div>
              </a>
          `;
      }
    )
    .join('');
}

function imagesMarkup(data) {
  refs.divEl.insertAdjacentHTML('beforeend', renderGallery(data.hits));
	simpleLightbox.refresh();
  if (ImagesApi.page === totalPages) {
    Notiflix.Notify.info(
      'We are sorry, but you have reached the end of search results.'
    );
  }
  ImagesApi.incrementPage();
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && ImagesApi.query !== '') {
      ImagesApi.fetchImage().then(images => {
        imagesMarkup(images);
        simpleLightbox.refresh();
      });
    }
  });
};

const options = {
  rootMargin: '150px',
};
const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.observerEl);


















// import fetchPictures from './js/fetchPictures';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';


// const searchForm = document.querySelector('#search-form');
// const loadMoreBtn = document.querySelector('.load-more');
// const gallery = document.querySelector('.gallery');

// searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.addEventListener('click', onLoadMore);



// function onSearch(e) {
//   e.preventDefault();
//   const searchQuery = e.currentTarget.searchQuery.value;
//   page = 1;

//   fetchPictures(searchQuery, page);
// }

// function renderHits(hits) {
// 	return hits
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         likes,
//         tags,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `<div class="photo-card">
//   <a href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>${likes}
//     </p>
//     <p class="info-item">
//       <b>Views</b>${views}
//     </p>
//     <p class="info-item">
//       <b>Comments</b>${comments}
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>${downloads}
//     </p>
//   </div>
// </div>
// `;
//       }
//     )
//     .join('');
// };


// renderHits(hits);


// function onLoadMore() {

// 	fetchPictures();
// }

// const lightbox = new SimpleLightbox('.gallery a', {
//   captionPosition: 'bottom',
//   captionsData: 'alt',
//   captionDelay: '250',
// });
