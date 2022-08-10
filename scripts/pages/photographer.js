//Retrieve the json file
async function getPhotographers() {
	return fetch("data/photographers.json")
		.then(function (res) {
			if (res.ok) {
				return res.json();
			} else {
				throw alert("Une erreur c'est produite.");
			}
		})
		.then(function (data) {
			return data;
		})
		.catch(function (err) {
			throw err;
		});
}
function getPhotographersId() {
	return new URL(location.href).searchParams.get("id");
}

async function init() {
	const photographers = await getPhotographers();
	getUserHeader(photographers);
	gallery(photographers);
	filterMedia(photographers);
}

//Retrieve user banner informations

function getUserHeader(data) {
	const photographerId = getPhotographersId();
	for (i = 0; i < 6; i++) {
		const photographer = data.photographers[i];
		if (photographerId == photographer.id) {
			const portrait = photographer.portrait;
			const picture = `assets/photographers/${portrait}`;
			const photographerHeader = document.querySelector(".photograph-header");
			const photographerInfos = document.querySelector(".photograph-infos");
			const h1 = document.createElement("h1");
			const h2 = document.createElement("h2");
			const h3 = document.createElement("h3");
			const img = document.createElement("img");
			img.setAttribute("src", picture);
			img.setAttribute("id", "photograph-img");
			h1.textContent = photographer.name;
			h2.textContent = photographer.city + ", " + photographer.country;
			h3.textContent = photographer.tagline;
			photographerInfos.appendChild(h1);
			photographerInfos.appendChild(h2);
			photographerInfos.appendChild(h3);
			photographerHeader.appendChild(img);
			const modalName = document.querySelector("#modal_name");
			modalName.textContent = photographer.name;
		}
	}
}

//creating lightbox and remove it when clicking outside it

const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);

lightbox.addEventListener("click", (e) => {
	if (e.target !== e.currentTarget) return;
	lightbox.classList.remove("active");
});

function removeUnsorted(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

// factory for treating all the medias that passes in the function

function gallery(data) {
	const photographerId = parseInt(getPhotographersId());
	const gallery = document.querySelector("div.gallery");
	var medias;
	let sum = 0;
	if (data.media) {
		medias = data.media.filter((x) => x.photographerId === photographerId);
	} else {
		removeUnsorted(gallery);
		medias = data;
	}
	medias.forEach((media, currentIndex) => {
		sum += media.likes;
		const galleryElt = document.createElement("div");
		const eltInfos = document.createElement("div");
		const likeContainer = document.createElement("div");
		const title = document.createElement("span");
		const likes = document.createElement("span");
		const heart = document.createElement("i");
		title.textContent = media.title;
		likes.textContent = media.likes;
		heart.addEventListener(
			"click",
			(e) => {
				likes.textContent = ++media.likes;
				totalLikes.textContent = ++sum;
			},
			{ once: true }
		);
		galleryElt.setAttribute("id", "gallery-element");
		eltInfos.setAttribute("class", "media-infos");
		likeContainer.setAttribute("class", "media-likes");
		heart.setAttribute("class", "fas fa-heart");
		const mediaContainer = retrieveMediaContainer(media);
		mediaContainer.addEventListener("click", (e) => {
			displayLightbox(medias, currentIndex, lightbox);
		});
		gallery.appendChild(galleryElt);
		galleryElt.appendChild(mediaContainer);
		galleryElt.appendChild(eltInfos);
		eltInfos.appendChild(title);
		likeContainer.appendChild(likes);
		likeContainer.appendChild(heart);
		eltInfos.appendChild(likeContainer);
	});
	const photographer = data.photographers.filter((x) => x.id === photographerId);
	const price = photographer[0].price;
	const totalLikes = document.querySelector("#total-likes");
	const pricing = document.querySelector("#price-day");
	totalLikes.textContent = sum;
	pricing.textContent = price + "€/jour";
}

// Check if the media is a video or an image

function retrieveMediaContainer(media) {
	const mediaContainer = document.createElement("div");
	if (media.image) {
		const image = media.image;
		const picture = `assets/media/${image}`;
		const img = document.createElement("img");
		img.setAttribute("src", picture);
		img.setAttribute("id", "media");
		img.setAttribute("tabindex", 0);
		mediaContainer.appendChild(img);
	} else if (media.video) {
		const video = media.video;
		const videoPath = `assets/media/${video}`;
		const videoContainer = document.createElement("video");
		const source = document.createElement("source");
		source.setAttribute("src", videoPath);
		source.setAttribute("type", "video/mp4");
		videoContainer.setAttribute("id", "media");
		videoContainer.setAttribute("controls", true);
		mediaContainer.appendChild(videoContainer);
		videoContainer.appendChild(source);
	}
	return mediaContainer;
}

// declaring listener to prevent bad behavior
let currentKeydownListener = undefined;
let currentClickListener = undefined;

function displayLightbox(medias, currentIndex, lightbox) {
	lightbox.classList.add("active");
	const media = medias[currentIndex];
	const mediaContainer = retrieveMediaContainer(media);
	const cross = document.createElement("img");
	const chevron = document.createElement("img");
	const chevronLeft = document.createElement("img");
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

	//listen on clicks

	if (currentClickListener) {
		document.removeEventListener("click", currentClickListener);
	}
	currentClickListener = (e) => {
		chevronLeft.addEventListener("click", (e) => {
			if (medias[currentIndex - 1]) {
				displayLightbox(medias, currentIndex - 1, lightbox);
			}
		});
		chevron.addEventListener("click", (e) => {
			if (medias[currentIndex + 1]) {
				displayLightbox(medias, currentIndex + 1, lightbox);
			}
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

	//keyboard navigation

	if (currentKeydownListener) {
		document.removeEventListener("keydown", currentKeydownListener);
	}
	(currentKeydownListener = (e) => {
		if (lightbox.classList.contains("active")) {
			if (e.key === "ArrowRight" && medias[currentIndex + 1]) {
				displayLightbox(medias, currentIndex + 1, lightbox);
			} else if (e.key === "ArrowLeft" && medias[currentIndex - 1]) {
				displayLightbox(medias, currentIndex - 1, lightbox);
			}
		}
	}),
		document.addEventListener("keydown", currentKeydownListener, false);
}

//function that prevent background to scroll when the modal is open

function preventScroll() {
	const body = document.querySelector("body");
	const modal = document.querySelector(".modal");
	if (modal.style.display === "flex") {
		body.style.overflowY = "hidden";
		console.log("noscroll");
	}
}

// close the lightbox when pressing Escape

window.addEventListener("keydown", (e) => {
	if ((lightbox.style.display = "flex" && e.key === "Escape")) {
		lightbox.classList.remove("active");
	}
});

//sorting system and listeners

const filterButton = document.querySelector("#button-container");
const dropdown = document.querySelector("div.dropdown");

filterButton.addEventListener("click", properRadius);

function properRadius() {
	filterButton.style.borderRadius = "5% 5% 0% 0%";
}

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
	filterMenu.addEventListener("click", (e) => {
		const arrow = document.querySelector("#filter-icon");
		arrow.classList.toggle("rotate");
		dropdown.classList.toggle("grow");
	});
}

init();
