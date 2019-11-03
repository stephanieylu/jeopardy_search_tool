baseURL = "https://cors-anywhere.herokuapp.com/http://jservice.io/api/";
var favorites = [];

function buildCategoryList() {
	//Dynamically create the select options for categories in search form by calling the API

	let req = new XMLHttpRequest();
	req.open('GET', baseURL + "categories?count=100", true);
	req.send();

	req.onload = function() {
		let categories = JSON.parse(this.responseText);

		let list = document.getElementById("category");
		let placeholder = document.createElement("option");
		let text = document.createTextNode("--Select a Category--")
		placeholder.appendChild(text)
		placeholder.setAttribute("value", "");
		list.appendChild(placeholder);

		for (let element of categories) {
			let option = document.createElement("option");
			option.setAttribute("value", element.id);
			let text = document.createTextNode(element.title);
			option.appendChild(text);
			list.appendChild(option);
		}
	}
}

function filtered_search() {
	//Call the API with query parameters based on user input

	var query = "clues?";
 
	if (document.getElementById("difficulty").value != "") {
		query += "value=" + document.getElementById("difficulty").value + "&";
	}
	if (document.getElementById("min_date").value) {
		query += "min_date=" + document.getElementById("min_date").value + "&";
	}
	if (document.getElementById("max_date").value) {
		query += "max_date=" + document.getElementById("max_date").value + "&";
	}
	if (document.getElementById("category").value) {
		query += "category=" + document.getElementById("category").value + "&";
	}

	console.log(baseURL + query);

	var request = new XMLHttpRequest();
	request.open('GET', baseURL + query, true);
	request.send();

	request.onload = function() {
		data = JSON.parse(this.responseText);

		if (request.status >= 200 && request.status < 400) {
			data.forEach(clue => {
			console.log(clue.question)
	   	})
	  	} else {
	    console.log('error')		
		}

		displayResult(data);
	}
}

function random_clues() {
	//Generate 50 random clues

	var request = new XMLHttpRequest();
	request.open('GET', baseURL + "random?count=50", true);
	request.send();
	console.log(baseURL + "random?count=50");

	request.onload = function() {
		data = JSON.parse(this.responseText);

		if (request.status >= 200 && request.status < 400) {
			data.forEach(clue => {
			console.log(clue.question)
	   	})
	  	} else {
	    console.log('error')		
		}

		displayResult(data);
	}
}

function displayResult(data) {
	const container = document.getElementById("root");

	//Clear previous search results, if user is searching again
	if (document.getElementById("results")) {
		container.removeChild(document.getElementById("results"));
	}

	const results = document.createElement("div");
	results.setAttribute("id", "results");
	container.appendChild(results);

	//Button for viewing favorites
	const viewFavs = document.createElement("input");
	viewFavs.setAttribute("id", "viewFavs");
	viewFavs.setAttribute("type", "button");
	viewFavs.setAttribute("onclick", "displayResult(favorites)");
	viewFavs.setAttribute("value", "View My Favorites");
	results.appendChild(viewFavs);
	br = document.createElement("br");
	results.appendChild(br);

	//Create heading for search results
	const h2 = document.createElement("h2");
	h2.setAttribute("id", "result_heading");
	h2.textContent = "Search Results";
	results.appendChild(h2);

	//Display message if no results
	if (data.length == 0) {
		const p = document.createElement("p");
		p.setAttribute("id", "no_results");
		p.textContent = "Sorry, there are no results that match your search.";
		results.appendChild(p);
		return;
	}

	generateTable(data);
}

function generateTable(data) {

	//Create table to display search results
	const table = document.createElement("table");
	table.setAttribute("id", "table");

	let thead = table.createTHead();
	let row = thead.insertRow();
	const headers = ["", "Question", "Answer", "Value", "Category", "Air Date", "Favorite"];
	headers.forEach(header => {
		let th = document.createElement("th");
		let text = document.createTextNode(header);
		th.appendChild(text);
		row.appendChild(th);
	})

	//Populate the table
	var number = 1;

	for (let element of data) {
		let row = table.insertRow();

		let enumerate = row.insertCell();
		let clue_num = document.createTextNode(number);
		enumerate.appendChild(clue_num);
		number += 1;
		
		let question_cell = row.insertCell();
		let question = document.createTextNode(element.question);
		question_cell.appendChild(question);

		let answer_cell = row.insertCell();
		let answer = document.createTextNode(element.answer);
		answer_cell.appendChild(answer);

		let value_cell = row.insertCell();
		let value = document.createTextNode(element.value);
		value_cell.appendChild(value);

		let category_cell = row.insertCell();
		let category = document.createTextNode(element.category.title);
		category_cell.appendChild(category);

		let airdate_cell = row.insertCell();
		let datetime = element.airdate;
		datetime = moment(datetime).calendar();	//convert ISO 8601 string to MM/DD/YYYY
		let airdate = document.createTextNode(datetime);
		airdate_cell.appendChild(airdate);

		let favorites_cell = row.insertCell();
		let checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("id", element.id);
		checkbox.setAttribute("onclick", "saveToFavorites(this)")
		if (favorites.includes(element)) {
			checkbox.setAttribute("checked", "true");
		}
		favorites_cell.appendChild(checkbox);
	}

	results.appendChild(table);
	window.location = "index.html#root";
}

function saveToFavorites(element) {

	console.log(element);
	console.log(element.id);
	console.log(element.checked);

	//If user unchecks box, remove clue from favorites
	let index = 0
	for (let i of favorites) {
		if (i.id == element.id) {
			favorites.splice(index, 1);
			console.log(favorites);
			return;
		}
		index += 1;
	}

	//If user checks box, add clue to favorites
	for (let i of data) {
		if (i.id == element.id) {
			favorites.push(i);
			break;
		}
	}	
	console.log(favorites);
}
