
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';
import NewApiImageService from './js/fetchPictures';
import renderGallery from './js/renderHtml';

const refs = {
  formEl: document.querySelector('#search-form'),
  divEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('#loadMore'),
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
    return Notiflix.Notify.warning('Please, fill in the search field');
  }

	fetchImages();
	event.currentTarget.reset();
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
	else {
		Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
	}
	imagesMarkup(response);
	
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
  rootMargin: '450px',
};
const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.loadMoreEl);
