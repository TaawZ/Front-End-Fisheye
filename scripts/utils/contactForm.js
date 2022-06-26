function displayModal() {
	const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
	const modal = document.getElementById("contact_modal");
	modal.style.display = "none";
	return false;
}

const inputs = document.querySelectorAll("input");
const send = document.querySelector("#send");
send.addEventListener("click", (e) => {
	let i = 0;
	while (i < inputs.length) {
		console.log(inputs[i].value);
		i++;
	}
	return;
});
