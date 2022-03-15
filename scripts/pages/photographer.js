//Mettre le code JavaScript lié à la page photographer.html
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
	getUserMedia(photographers);
}
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
		}
	}
}

const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);

lightbox.addEventListener("click", (e) => {
	if (e.target !== e.currentTarget) return;
	lightbox.classList.remove("active");
});

function getUserMedia(data) {
	const photographerId = parseInt(getPhotographersId());

	for (i = 0; i < 59; i++) {
		const photographerMedia = data.media[i];
		if (photographerId === photographerMedia.photographerId) {
			if (photographerMedia.image) {
				const gallery = document.querySelector(".gallery");
				const galleryElt = document.createElement("div");
				const eltInfos = document.createElement("div");
				const likeContainer = document.createElement("div");
				const image = photographerMedia.image;
				const picture = `assets/media/${image}`;
				const img = document.createElement("img");
				const title = document.createElement("span");
				const likes = document.createElement("span");
				const heart = document.createElement("i");
				img.setAttribute("src", picture);
				img.setAttribute("id", "media");
				galleryElt.setAttribute("id", "gallery-element");
				eltInfos.setAttribute("class", "media-infos");
				heart.setAttribute("class", "far fa-heart");
				title.textContent = photographerMedia.title;
				likes.textContent = photographerMedia.likes;
				gallery.appendChild(galleryElt);
				galleryElt.appendChild(img);
				galleryElt.appendChild(eltInfos);
				eltInfos.appendChild(title);
				likeContainer.appendChild(likes);
				likeContainer.appendChild(heart);
				eltInfos.appendChild(likeContainer);
				img.addEventListener("click", (e) => {
					lightbox.classList.add("active");
					const img = document.createElement("img");
					const cross = document.createElement("img");
					const chevron = document.createElement("img");
					const chevronLeft = document.createElement("img");
					chevron.src = "assets/icons/chevron.svg";
					chevron.id = "chevron";
					chevronLeft.src = "assets/icons/chevron.svg";
					chevronLeft.id = "chevron-left";
					cross.src = "assets/icons/close.svg";
					cross.id = "cross";
					cross.addEventListener("click", (e) => {
						if (e.target !== e.currentTarget) return;
						lightbox.classList.remove("active");
					});
					img.src = picture;
					img.id = "lightbox-content";
					while (lightbox.firstChild) {
						lightbox.removeChild(lightbox.firstChild);
					}
					lightbox.appendChild(cross);
					lightbox.appendChild(chevron);
					lightbox.appendChild(chevronLeft);
					lightbox.appendChild(img);
				});
			} else {
				const gallery = document.querySelector(".gallery");
				const galleryElt = document.createElement("div");
				const eltInfos = document.createElement("div");
				const likeContainer = document.createElement("div");
				const video = photographerMedia.video;
				const videoPath = `assets/media/${video}`;
				const videoContainer = document.createElement("video");
				const title = document.createElement("span");
				const likes = document.createElement("span");
				const heart = document.createElement("i");
				videoContainer.setAttribute("src", videoPath);
				videoContainer.setAttribute("id", "media");
				galleryElt.setAttribute("id", "gallery-element");
				eltInfos.setAttribute("class", "media-infos");
				heart.setAttribute("class", "far fa-heart");
				title.textContent = photographerMedia.title;
				likes.textContent = photographerMedia.likes;
				gallery.appendChild(galleryElt);
				galleryElt.appendChild(videoContainer);
				galleryElt.appendChild(eltInfos);
				eltInfos.appendChild(title);
				likeContainer.appendChild(likes);
				likeContainer.appendChild(heart);
				eltInfos.appendChild(likeContainer);
				videoContainer.addEventListener("click", (e) => {
					lightbox.classList.add("active");
					const video = document.createElement("video");
					const cross = document.createElement("img");
					cross.src = "assets/icons/close.svg";
					cross.id = "cross";
					cross.addEventListener("click", (e) => {
						if (e.target !== e.currentTarget) return;
						lightbox.classList.remove("active");
					});
					video.src = videoPath;
					video.id = "lightbox-content";
					while (lightbox.firstChild) {
						lightbox.removeChild(lightbox.firstChild);
					}
					lightbox.appendChild(cross);
					lightbox.appendChild(video);
				});
			}
		}
	}
}

init();
