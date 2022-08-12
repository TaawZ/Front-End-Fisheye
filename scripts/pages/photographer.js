//Id of the selected photographer
function getPhotographersId() {
	return new URL(location.href).searchParams.get("id");
}

// global listener variable to prevent bad behavior
let currentKeydownListener = undefined;
let currentClickListener = undefined;

// simple init function

async function init() {
	const photographers = await getPhotographers();
	getUserHeader(photographers);
	gallery(photographers);
	filterMedia(photographers);
}

function displayLightbox(medias, currentIndex, lightbox) {
	lightbox.classList.add("active");
	const media = medias[currentIndex];
	const mediaContainer = retrieveMediaContainer(media);
	const cross = document.createElement("img");
	cross.setAttribute("alt", "close the lightbox");
	const chevron = document.createElement("img");
	chevron.setAttribute("alt", "see the right img");
	const chevronLeft = document.createElement("img");
	chevronLeft.setAttribute("alt", "see the left img");
	const title = document.createElement("span");
	title.textContent = media.title;
	title.setAttribute("id", "lightbox-title");
	const lightboxContainer = document.createElement("div");
	lightboxContainer.setAttribute("id", "lightbox-container");
	chevron.src = "assets/icons/chevron.svg";
	chevron.id = "chevron";
	chevronLeft.src = "assets/icons/chevron.svg";
	chevronLeft.id = "chevron-left";
	cross.src = "assets/icons/close.svg";
	cross.id = "cross";

	//mouse navigation with listeners

	if (currentClickListener) {
		document.removeEventListener("click", currentClickListener);
	}
	currentClickListener = (e) => {
		chevronLeft.addEventListener("click", (e) => {
			if (medias[currentIndex - 1]) {
				displayLightbox(medias, currentIndex - 1, lightbox);
			} else displayLightbox(medias, currentIndex + medias.length - 1, lightbox);
		});
		chevron.addEventListener("click", (e) => {
			if (medias[currentIndex + 1]) {
				displayLightbox(medias, currentIndex + 1, lightbox);
			} else displayLightbox(medias, currentIndex - medias.length + 1, lightbox);
		});
	};
	document.addEventListener("click", currentClickListener, false);
	cross.addEventListener("click", (e) => {
		if (e.target !== e.currentTarget) return;
		lightbox.classList.remove("active");
	});

	while (lightbox.firstChild) {
		lightbox.removeChild(lightbox.firstChild);
	}
	lightboxContainer.appendChild(chevronLeft);
	lightboxContainer.appendChild(mediaContainer);
	lightboxContainer.appendChild(cross);
	lightboxContainer.appendChild(chevron);
	lightboxContainer.appendChild(title);
	lightbox.appendChild(lightboxContainer);

	//keyboard navigation in the lightbox

	if (currentKeydownListener) {
		document.removeEventListener("keydown", currentKeydownListener);
	}
	(currentKeydownListener = (e) => {
		if (lightbox.classList.contains("active")) {
			if (e.key === "ArrowRight" && medias[currentIndex + 1]) {
				displayLightbox(medias, currentIndex + 1, lightbox);
			} else if (e.key === "ArrowRight" && !medias[currentIndex + 1]) {
				// if this is the last image, go back to the first one
				displayLightbox(medias, currentIndex - medias.length + 1, lightbox);
			} else if (e.key === "ArrowLeft" && medias[currentIndex - 1]) {
				displayLightbox(medias, currentIndex - 1, lightbox);
			} else if (e.key === "ArrowLeft" && !medias[currentIndex - 1]) {
				// Same here but in the other way
				displayLightbox(medias, currentIndex + medias.length - 1, lightbox);
			}
		}
	}),
		document.addEventListener("keydown", currentKeydownListener, false);
}

//creating lightbox and remove it when clicking outside it

const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);

lightbox.addEventListener("click", (e) => {
	if (e.target !== e.currentTarget) return;
	lightbox.classList.remove("active");
});

// function used to clear the gallery when we create a sorted one

function removeUnsorted(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

// close the lightbox when pressing Escape

window.addEventListener("keydown", (e) => {
	if ((lightbox.style.display = "flex" && e.key === "Escape")) {
		lightbox.classList.remove("active");
	}
});

//Function that will sort the gallery depending on the user's choice

const filterButton = document.querySelector("#button-container");
const dropdown = document.querySelector("div.dropdown");

function filterMedia(data) {
	const filterMenu = document.querySelector("div.filter-select");

	const date = document.querySelector("#date");
	const likes = document.querySelector("#likes");
	const title = document.querySelector("#title");
	title.addEventListener("click", (e) => {
		const photographerId = parseInt(getPhotographersId());
		const medias = data.media.filter((x) => x.photographerId === photographerId);
		medias.sort((a, b) => {
			var titleA = a.title.toLowerCase();
			var titleB = b.title.toLowerCase();
			if (titleA < titleB) return -1;
			if (titleA > titleB) return 1;
			return 0;
		});
		gallery(medias);
	});
	likes.addEventListener("click", (e) => {
		const photographerId = parseInt(getPhotographersId());
		const medias = data.media.filter((x) => x.photographerId === photographerId);
		medias.sort((a, b) => {
			return b.likes - a.likes;
		});
		gallery(medias);
	});
	date.addEventListener("click", (e) => {
		const photographerId = parseInt(getPhotographersId());
		const medias = data.media.filter((x) => x.photographerId === photographerId);
		medias.sort(function compare(a, b) {
			var dateA = new Date(a.date);
			var dateB = new Date(b.date);
			return dateA - dateB;
		});

		gallery(medias);
	});

	// listener for growth the dropdown menu

	filterMenu.addEventListener("click", (e) => {
		const arrow = document.querySelector("#filter-icon");
		arrow.classList.toggle("rotate");
		dropdown.classList.toggle("grow");
		filterButton.classList.toggle("border-misc");
	});
}

// Allow the user to press enter and display the lightbox

init();
