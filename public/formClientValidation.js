(() => {
	'use strict';
	const forms = document.querySelectorAll('.validate');
	forms.forEach((form) => {
		form.addEventListener('submit', function (event) {
			if (!form.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}
			form.classList.add('was-validated');
		});
	});
})();
