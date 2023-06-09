{ // Навігація сайтом
class Navigator {
	constructor() {
	  this.links = [];
	  this.activeSection = '#home';
	}
  
	navigate(x) {
	  const lastActiveSection = document.querySelector(this.activeSection);
	  lastActiveSection.classList.remove('active');
	  this.activeSection = x;
	  const section = document.querySelector(x);
	  section.classList.add('active');
	}
  
	initiate() {
	  window.addEventListener('popstate', () => {
		this.links = Array.from(document.querySelectorAll('nav a '));
		this.links.filter((el) => el.href !== window.location.href).forEach((el) => {
		  el.classList.remove('active');
		});
		this.links.filter((el) => el.href === window.location.href)[0].classList.add('active');
		this.navigate(window.location.hash);
	  });
	}
  }
  
  const nav1 = new Navigator();
  nav1.initiate();
}
// Управління DOM елементами
const domElements = {
	results: document.getElementById('results'),
	search: {
		input: document.getElementById('search-input'),
		button: document.getElementById('search-button')
	},
	filters: {
		category: document.getElementById('filter-category'),
	},
	listForm:{
		authorList: document.querySelector('#authorList'),
		editButton: document.querySelector('#editButton'),
		disabNo: document.querySelectorAll('.form-group input'),
		saveButton: document.querySelector('#saveButton'),
		deleteButton: document.querySelector('#deleteButton')
	},
	newAuthorAdd:{
		firstName: document.querySelector('.name-input'),
		lastName: document.querySelector('.lastName-input'),
		patronymic: document.querySelector('.patronymic-input'),
		dataBrth: document.querySelector('.dataBrth-input'),
		titleInput: document.querySelector('.title-input'),
		pagesInput: document.querySelector('.pages-input'),
		genre: document.querySelector('.genre'),
	},
	newBookAdd:{
		firstNameNew: document.querySelector('.name-inputNew'),
		lastNameNew: document.querySelector('.lastName-inputNew'),
		patronymicNew: document.querySelector('.patronymic-inputNew'),
		dataBrthNew: document.querySelector('.dataBrth-inputNew'),
		titleInputNew: document.querySelector('.title-inputNew'),
		pagesInputNew: document.querySelector('.pages-inputNew'),
		genres: document.querySelector('.genres'),
	},
	newGenreBook:{
		genreBtn: document.querySelector('#newGenreBtn'),
		overlay: document.querySelector('.overlay'),
		contents: document.querySelector('.contents'),
		closeBtn:document.querySelector('.close'),
		newGenreToList: document.querySelector("#newGenreToList"),
		genreSelect: document.querySelector(".genres")
	},
	newGenreAuthor:{
		genreBtn: document.querySelector('#newGenreBtnA'),
		overlay: document.querySelector('.overlayA'),
		contents: document.querySelector('.contentsA'),
		closeBtn:document.querySelector('.closeA'),
		newGenreToListA: document.querySelector("#newGenreToListA"),
		genreSelectA: document.querySelector(".genre")
	},
	newGenreEdit:{
		plusEdit: document.querySelector('.plusEdit'),
		minusEdit: document.querySelector('.minusEdit'),
		genreBtn: document.querySelector('#newGenreBtnB'),
		overlay: document.querySelector('.overlayB'),
		contents: document.querySelector('.contentsB'),
		closeBtn:document.querySelector('.closeB'),
		newGenreToList: document.querySelector("#newGenreToListB"),
		newGenreInput: document.querySelector("#newGenreInputB"),
		genreSelect: document.querySelector(".genreEd"),
		genreInp: document.querySelector("#genreInp")
	}
}

// Список авторів та книг
class ListService {
    selectedData;
    data;
    listElement;
    constructor(data, listElement, displayFn) {
		this.data = data;
        this.listElement = listElement;
		  for (let index = 0; index < data.length; index++) {
            const currentData = data[index];
            let li = document.createElement("li");
            li.textContent = displayFn(currentData);
            currentData.id = index; 
            li.dataset.id = index;
            this.listElement.append(li);
        }
    }
    select(id) {
		this.selectedData = cardsData[id];
        // this.selectedData = this.data.filter(x => x.id == id)[0];
        this.deselectAll();
        // const index = this.data.indexOf(this.selectedData);
        this.listElement.children[id].classList.toggle("selected");
    }
	
	adds(val){
		let li = document.createElement("li");
		li.classList.add("selected");
		li.textContent = val;
		for (let index = 0; index < cardsData.length; index++) {
			li.dataset.id = index;
		}
		this.listElement.append(li);
		localStorage.setItem("authors", JSON.stringify(cardsData));
	}
    deselectAll() {
        for (let i = 0; i < this.listElement.children.length; i++) {
            const child = this.listElement.children[i];
            child.classList.remove("selected");
        }
    }
    deleteSelectedItem() {
        const index = this.data.indexOf(this.selectedData);
        if (index != -1) {
            this.listElement.children[index].remove();
            this.data.splice(index, 1);
			delete this.data.index
			localStorage.setItem("authors", JSON.stringify(cardsData));
        }
    }	
}

// Список авторів та книг => заповнення форми        
class DataFormService {
    currentAuthor;
    form;
    constructor(form) {
        this.form = form;
    }
    fillForm(data) {
		this.currentAuthor = data;
        this.form.firstName.value = data.author.firstName;
        this.form.lastName.value = data.author.lastName;
        this.form.patronymic.value = data.author.patronymic;
        this.form.dataBrth.value = data.author.dataBrth;
        this.form.title.value = data.title;
		this.form.countPage.value = data.count;
		this.form.genreInp.value = data.category;
    }
    saveForm() {
        this.currentAuthor.author.firstName = this.form.firstName.value;
        this.currentAuthor.author.lastName = this.form.lastName.value;
        this.currentAuthor.author.patronymic = this.form.patronymic.value;
        this.currentAuthor.author.dataBrth = this.form.dataBrth.value;
        this.currentAuthor.title = this.form.title.value;
		this.currentAuthor.category = this.form.genreInp.value;
		this.currentAuthor.count = this.form.countPage.value;
        
		localStorage.setItem("authors", JSON.stringify(cardsData));
    }
    resetForm() {
        this.form.reset();
    }
}


	let fromStorage = localStorage.getItem("authors");
	if(fromStorage) {
		cardsData = JSON.parse(fromStorage);
	}

    let listService = new ListService(cardsData, authorList, x => x.author.firstName + " " + x.author.lastName + " - '" + x.title + "'");
    let formService = new DataFormService(document.forms[0]);

		
    domElements.listForm.authorList.addEventListener("click", function (e) {
        if (e.target.tagName != "LI") return;
        const userNumber = e.target.dataset.id;
        listService.select(userNumber);
        formService.fillForm(listService.selectedData);
    });

	domElements.listForm.editButton.addEventListener("click", function (e) {
        domElements.listForm.disabNo.forEach(el => 
			el.disabled = false)
        e.preventDefault();
		domElements.newGenreEdit.plusEdit.style.display="inline-flex";
		domElements.newGenreEdit.minusEdit.style.display="none";
    });
    domElements.listForm.saveButton.addEventListener("click", function (e) {
        if(document.forms[0].checkValidity()){
			domElements.listForm.disabNo.forEach(el => 
				el.disabled = true)
			e.preventDefault();
			domElements.newGenreEdit.plusEdit.style.display="none";
			domElements.newGenreEdit.minusEdit.style.display="inline-flex";
			domElements.newGenreEdit.genreInp.value = domElements.newGenreEdit.genreSelect.value;
			formService.saveForm();
		}
	});
    
	domElements.listForm.deleteButton.addEventListener("click", function (e) {
		let isDelete = confirm("Дійсно видалити дані зі списку?");
		if(isDelete){
			listService.deleteSelectedItem();
			formService.resetForm();
			location.reload();
		}
    });
	
	

{ // Управління новим автором, книгою та жанром
	let formAddNewAuthor = document.forms[1];
	formAddNewAuthor.addEventListener("submit", function(e) {
		e.preventDefault();
		alert("Автора додано!")
		for (let i = 0; i < formAddNewAuthor.elements.length; i++) {
			const element = formAddNewAuthor.elements[i];
			element.value = " ";
		}
	})
	// модальне вікно
	domElements.newGenreAuthor.genreBtn.addEventListener('click', function(){
		domElements.newGenreAuthor.overlay.style.display = 'flex';
	});
	domElements.newGenreAuthor.contents.addEventListener('click', function(e){
		e.stopPropagation();
	});
	domElements.newGenreAuthor.overlay.addEventListener('click', function(e){
		domElements.newGenreAuthor.overlay.style.display = 'none';
	});
	domElements.newGenreAuthor.closeBtn.addEventListener('click', function(e){
		domElements.newGenreAuthor.overlay.style.display = 'none';
	});
	// додаємо новий жанр в section
	domElements.newGenreAuthor.newGenreToListA.addEventListener("click", function(){
		newGenre(formAddNewAuthor.elements.newGenreInputA, domElements.newGenreAuthor.overlay)
	})

	let addAuthorBtn = document.querySelector("#add-author-btn");
	addAuthorBtn.addEventListener("click", addAuthorHandler);
	function addAuthorHandler(e) {
		if(formAddNewAuthor.checkValidity()){
			cardsData.push({ title: domElements.newAuthorAdd.titleInput.value, 
				category: domElements.newAuthorAdd.genre.value,
				count: domElements.newAuthorAdd.pagesInput.value, 
				author: {firstName: domElements.newAuthorAdd.firstName.value, 
				lastName: domElements.newAuthorAdd.lastName.value,
				patronymic: domElements.newAuthorAdd.patronymic.value,
				dataBrth: domElements.newAuthorAdd.dataBrth.value}})
				
			listService.adds(domElements.newAuthorAdd.firstName.value + " " + domElements.newAuthorAdd.lastName.value + " - '" + domElements.newAuthorAdd.titleInput.value + "'", authorList, x => x.author.firstName + " " + x.author.lastName );
			cardsArr = generateCards(cardsData);
			domElements.results.innerHTML = cardsArr.join('');
		}
	}


	let formAddNewBook = document.forms[2];
	formAddNewBook.addEventListener("submit", function(e) {
		e.preventDefault();
		alert("Книгу додано!")
		for (let i = 0; i < formAddNewBook.elements.length; i++) {
			const element = formAddNewBook.elements[i];
			element.value = " ";
		}
	})
	// модальне вікно
	domElements.newGenreBook.genreBtn.addEventListener('click', function(){
		domElements.newGenreBook.overlay.style.display = 'flex';
	});
	domElements.newGenreBook.contents.addEventListener('click', function(e){
		e.stopPropagation();
	});
	domElements.newGenreBook.overlay.addEventListener('click', function(e){
		domElements.newGenreBook.overlay.style.display = 'none';
	});
	domElements.newGenreBook.closeBtn.addEventListener('click', function(e){
		domElements.newGenreBook.overlay.style.display = 'none';
	});
	// додаємо новий жанр в section
	domElements.newGenreBook.newGenreToList.addEventListener("click", function(){
		newGenre(formAddNewBook.elements.newGenreInput, domElements.newGenreBook.overlay);
	})
	
	let addBookBtn = document.querySelector("#add-book-btn");
	addBookBtn.addEventListener("click", addBookHandler);
	function addBookHandler() {
		if(formAddNewBook.checkValidity()){
			cardsData.push({ title: domElements.newBookAdd.titleInputNew.value, 
				category: domElements.newBookAdd.genres.value,
				count: domElements.newBookAdd.pagesInputNew.value, 
				author: {firstName: domElements.newBookAdd.firstNameNew.value, 
				lastName: domElements.newBookAdd.lastNameNew.value,
				patronymic: domElements.newBookAdd.patronymicNew.value,
				dataBrth: domElements.newBookAdd.dataBrthNew.value}})
				
			listService.adds(domElements.newBookAdd.firstNameNew.value + " "+ domElements.newBookAdd.lastNameNew.value + " - '" + domElements.newBookAdd.titleInputNew.value + "'");
			cardsArr = generateCards(cardsData);
			domElements.results.innerHTML = cardsArr.join('');
		}
	}

	// модальне вікно => новий жанр в редагуванні
	domElements.newGenreEdit.genreBtn.addEventListener('click', function(){
		domElements.newGenreEdit.overlay.style.display = 'flex';
	});
	domElements.newGenreEdit.contents.addEventListener('click', function(e){
		e.stopPropagation();
	});
	domElements.newGenreEdit.overlay.addEventListener('click', function(e){
		domElements.newGenreEdit.overlay.style.display = 'none';
	});
	domElements.newGenreEdit.closeBtn.addEventListener('click', function(e){
		domElements.newGenreEdit.overlay.style.display = 'none';
	});
	// додаємо новий жанр в section
	domElements.newGenreEdit.newGenreToList.addEventListener("click", function(){
		newGenre(document.forms[0].elements.newGenreInputB, domElements.newGenreEdit.overlay)
	})

	// функція додавання нового жанру в section
	function newGenre(nameFormInp, elOverlay ) {
		let selects = document.getElementsByClassName('addOption');
		elOverlay.style.display = 'none';
		
		for( let i = 0; i < selects.length; i++ ) {
			selects[i].options.add( new Option(nameFormInp.value, nameFormInp.value, false, true ));
			category[nameFormInp.value] = nameFormInp.value;
			localStorage.setItem("category", JSON.stringify(category));
		}
	}
}
	let fromStorageCategory = localStorage.getItem("category");
		if(fromStorageCategory) {
			category = JSON.parse(fromStorageCategory);
		}

	function addOptions(sel) {
		for (const key in category) {
			const element = category[key];
			let opt = new Option(element, element);
			sel.add(opt);
		}
		return sel;
	}
	addOptions(domElements.filters.category)


	// генерація карток книг
	function generateCards(data) {
		let cards = [];
		for (let i = 0; i < data.length; i++) {
			cards.push(`
			<div class="card">
				<img src="img/default_book.gif" alt="book" class="card__img">
				<div class="card__content">
					<h3 class="card__title">${data[i].title}</h3>
					<div class="card__description">${data[i].author.firstName + " " + 
												data[i].author.patronymic + " " +
												data[i].author.lastName}
						<div class="card__param">
							<div id="year">(${data[i].author.dataBrth})</div>
						</div>
					</div>
					<div class="card__info">
						<div class="card__param">
							<label for="">Жанр:</label> <br/>
							<div id="typ">${data[i].category}</div>
						</div>
						<div>
							<label for="">Кількість сторінок:</label>
							<div id="count"> ${data[i].count} </div >
						</div>
					</div>
				</div >
			</div >
			`)
		}
		return cards;
	}
	
	let cardsArr = generateCards(cardsData);
	domElements.results.innerHTML = cardsArr.join('');
	
	
{ // Пошук книг
	let searchValue = '';
	// Зміна значення поля
	domElements.search.input.oninput = (event) => {
		searchValue = event.target.value;
		filterSearch();
	}
	// Клік по кнопці пошуку
	domElements.search.button.onclick = () => {
		filterSearch();
	}

	// Фільтрація знайдених книг
	function filterSearch() {
		const rgx = new RegExp(searchValue, 'i');
		let filteredCardData = cardsData.filter(card => {
			if (rgx.test(card.title)) {
				return true;
			} else {
				return false;
			}
		})
		const newFilteredCardHtml = generateCards(filteredCardData);
		domElements.results.innerHTML = newFilteredCardHtml.join('');
	}
}


{ // Фільтрація книг
	const filtersType = [
		'category',
	]

	// Відслідковування зміни фільтрів
	filtersType.forEach(type => handleChangeFilter(type));

	// Відслідковування зміни значення фільтрів
	function handleChangeFilter(type) {
		domElements.filters[type].onchange = (event) => {
			const value = event.target.value;
			const filteringCards = filterCards(type, value, cardsData);
			const fullFilteredCards = checkOutherFilters(filtersType, filteringCards, type);
			const cardsHTML = generateCards(fullFilteredCards).join('');
			domElements.results.innerHTML = cardsHTML;
		}
	}

	function filterCards(filterType, value, cards) {
		const filteredCards = cards.filter(card => {
			const reg = new RegExp(value);
			if (reg.test(card[filterType])) {
				return true;
			} else {
				return false;
			}
		})
		return filteredCards;
	}

	// Фільтрація по значеннях сусідніх фільтрів
	function checkOutherFilters(filtersType, filteredCards, extraFilterType) {
		let updateFilteredCards = filteredCards;
		const filteredFiltersType = filtersType.filter(type => type !== extraFilterType);

		filteredFiltersType.forEach(type => {
			const value = domElements.filters[type].value;
			const reg = new RegExp(value);
			const newFilteredCards = updateFilteredCards.filter(card => {
				if (reg.test(card.author[type])) {
					return true;
				} else {
					return false;
				}
			})
			updateFilteredCards = newFilteredCards;
		})
		return updateFilteredCards;
	}
}