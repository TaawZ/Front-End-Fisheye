function photographerFactory(data) {
	const { name, portrait, city, country, tagline, price, id } = data;
	const picture = `assets/photographers/${portrait}`;

	function getUserCardDOM() {
		const a = document.createElement("a");
		const article = document.createElement("article");
		article.setAttribute("class", "select-photographer");
		const img = document.createElement("img");
		const h2 = document.createElement("h2");
		const h3 = document.createElement("h3");
		const h4 = document.createElement("h4");
		const h5 = document.createElement("h5");
		const link = "/photographer.html" + "?id=" + id;
		img.setAttribute("src", picture);
		img.setAttribute("alt", "photographer photo");
		a.setAttribute("href", link);
		h2.textContent = name;
		h3.textContent = city + ", " + country;
		h4.textContent = tagline;
		h5.textContent = price + "€/jour";
		article.appendChild(a);
		a.appendChild(img);
		a.appendChild(h2);
		a.appendChild(h3);
		a.appendChild(h4);
		a.appendChild(h5);
		return article;
	}

	return { name, portrait, city, country, tagline, price, id, getUserCardDOM };
}

//Retrieve user informations and displaying it

function getUserHeader(data) {
	const photographerId = getPhotographersId();
	for (i = 0; i < data.photographers.length; i++) {
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
			img.setAttribute("alt", "photographer photo");
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

//Creates the div that will contain the media even if this is a video
function retrieveMediaContainer(media) {
	const mediaContainer = document.createElement("div");
	if (media.image) {
		const image = media.image;
		const picture = `assets/media/${image}`;
		const img = document.createElement("img");
		img.setAttribute("src", picture);
		img.setAttribute("class", "media");
		img.setAttribute("alt", "photographer photos");
		mediaContainer.appendChild(img);
	} else if (media.video) {
		const video = media.video;
		const videoPath = `assets/media/${video}`;
		const videoContainer = document.createElement("video");
		const source = document.createElement("source");
		source.setAttribute("src", videoPath);
		source.setAttribute("type", "video/mp4");
		source.setAttribute("alt", "photographer video");
		videoContainer.setAttribute("class", "media");
		videoContainer.setAttribute("controls", true);
		mediaContainer.appendChild(videoContainer);
		videoContainer.appendChild(source);
	}
	return mediaContainer;
}

// function that will produce the gallery based on the medias it will receive
function gallery(data) {
	const photographerId = parseInt(getPhotographersId());
	const gallery = document.querySelector("div.gallery");
	var medias;
	var index = 0;
	let sum = 0;
	if (data.media) {
		medias = data.media.filter((x) => x.photographerId === photographerId);
	} else {
		removeUnsorted(gallery);
		medias = data;
	}
	medias.forEach((media, currentIndex) => {
		sum += media.likes;
		index++;
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
		galleryElt.setAttribute("class", "gallery-element");
		galleryElt.setAttribute("tabIndex", index);
		eltInfos.setAttribute("class", "media-infos");
		likeContainer.setAttribute("class", "media-likes");
		heart.setAttribute("class", "fas fa-heart");
		const mediaContainer = retrieveMediaContainer(media);

		galleryElt.addEventListener("keydown", (e) => {
			if (e.key === "Enter") displayLightbox(medias, currentIndex, lightbox);
		});

		mediaContainer.addEventListener("click", (e) => {
			displayLightbox(medias, currentIndex, lightbox);
		});
		if (currentKeydownListener) {
			document.removeEventListener("keydown", currentKeydownListener);
		}
		document.addEventListener("keydown", currentKeydownListener, false);
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
