function photographerFactory(data) {
	const { name, portrait, city, country, tagline, price, id } = data;
	const picture = `assets/photographers/${portrait}`;

	function getUserCardDOM() {
		const a = document.createElement("a");
		const article = document.createElement("article");
		const img = document.createElement("img");
		const h2 = document.createElement("h2");
		const h3 = document.createElement("h3");
		const h4 = document.createElement("h4");
		const h5 = document.createElement("h5");
		const link = "/photographer.html" + "?id=" + id;
		img.setAttribute("src", picture);
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
