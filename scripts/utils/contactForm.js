function displayModal() {
	modal.style.display = "block";
	document.body.style.overflow = "hidden";
}

function closeModal() {
	modal.style.display = "none";
	document.body.style.overflow = "";
	return false;
}
//global variables
const send = document.querySelector("#send");
const inputs = document.querySelectorAll("input");
const modal = document.getElementById("contact_modal");
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
const focusableContent = modal.querySelectorAll(focusableElements);
const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

window.addEventListener("keydown", (e) => {
	if ((modal.style.display = "block" && e.key === "Escape")) {
		modal.style.display = "none";
		document.body.style.overflow = "";
	}
});

//retrieve form content in console
send.addEventListener("click", (e) => {
	inputs.forEach((input) => {
		console.log(input.value);
	});
});

//Force focus inside the modal
document.addEventListener("keydown", function (e) {
	let isTabPressed = e.key === "Tab" || e === 9;
	if (!isTabPressed) {
		return;
	}
	if (e.shiftKey) {
		if (document.activeElement === firstFocusableElement) {
			e.preventDefault();
		}
	} else {
		if (document.activeElement === lastFocusableElement) {
			firstFocusableElement.focus();
			e.preventDefault();
		}
	}
});

firstFocusableElement.focus();
