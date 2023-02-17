window.onload = _=> main()

class Game {
	constructor(){
		this.prize = getRandomInt(3) + 1
		console.log(`The prize behind the ${this.prize} door.`)
	}
	next(callback){
		let avalible = document.querySelectorAll(`#doors > .door:not(.selected):not(.removed):not([num='${this.prize}'])`)
		let remove_door;
		if (avalible.length == 0){
			document.querySelector('#doors > .door.selected').classList.add("removed")
			document.querySelector('#doors > .door:not(.removed)').classList.add("prize")
			this.onGameEnd(false)
		} else{
			if (avalible.length > 1){
				let remove_num = getRandomInt(avalible.length)
				remove_door = avalible[remove_num]
			} else{
				remove_door = avalible[0]
			}
			remove_door.classList.add("removed")

			if (document.querySelectorAll('#doors > .door:not(.removed)').length == 1){
				document.querySelector('#doors > .door:not(.removed)').classList.add("prize")
				this.onGameEnd(true)
			} else{
				callback()
			}
		}
	}
	onGameEnd = function(result){}
}

var LANG = {
	"en": {
		"title": "Monty Hall problem",
		"game": ["Imagine that you are on a TV game.\nThere is a prize behind one of the doors, the rest are empty.\nChoose one of the doors:",
				 "The host removes one of the empty doors and asks you:\n— Are you sure of your choice?"],
		"on_win": "Congratulations! You won a prize!!! 🎉🎉🎉",
		"on_lose": "Unfortunately you lost 😢",

		"select": "Select",
		"skip": "Skip",
		"again": "Repeat",

		"history": "History",
		"win": "Win",
		"lose": "Loss"
	},
	"ru": {
		"title": "Парадокс Монти Холла",
		"game": ["Представьте что вы на телеигре.\nЗа одной из дверей приз, остальные пустые.\nВыберите одну из дверей:",
				 "Ведущий убирает одну из пустых дверей и спрашивает вас:\n— Вы уверены в своём выборе?"],
		"on_win": "Ура! Вы выиграли приз!!! 🎉🎉🎉",
		"on_lose": "К сожалению, вы проиграли 😢",

		"select": "Выбрать",
		"skip": "Пропустить",
		"again": "Повторить",

		"history": "История",
		"win": "Победа",
		"lose": "Поражение"
	},
	"uk": {
		"title": "Парадокс Монті Голла",
		"game": ["Уявіть, що ви на телегрі.\nЗа однією з дверей приз, інші порожні.\nВиберіть одну з дверей:",
				 "Ведучий прибирає одну з порожніх дверей і запитує вас: - Ви впевнені у своєму виборі?"],
		"on_win": "Ура! Ви виграли приз! 🎉🎉🎉",
		"on_lose": "На жаль, ви програли 😢",

		"select": "Вибрати",
		"skip": "Пропустити",
		"again": "Повторити",

		"history": "Історія",
		"win": "Перемога",
		"lose": "Поразка"
	}
}

var canSelect = true;
var skiper, game, user_lang;
function main(){
	user_lang = langEngine()
	localize(LANG[user_lang])

	document.querySelector("#skip button").onclick = _=>{
		if (skiper){skiper()}
	}

	document.querySelectorAll("#doors > .door").forEach(e=>{
		e.onclick = _=>{
			if (canSelect && !e.classList.contains("removed")){
				unSelectAllDoors()
				e.classList.add("selected")
			}
		}
	})

	run()
	function run(){
		let game_text = Object.assign([], LANG[user_lang].game)
		skiper = print(game_text.shift())
		game = new Game();

		let button = document.querySelector("#select-button > button")
		button.onclick = _=>{
			if (document.querySelector("#doors > .door.selected")){
				canSelect = false;
				button.disabled = true;
				game.next(_=>{
					canSelect = true;
					button.disabled = false;
					clear()
					skiper = print(game_text.shift())
				});
			} else{
				button.classList.add("shake")
				setTimeout(_=>{
					button.classList.remove("shake")
				}, 900)
			}
		}

		game.onGameEnd = function(result){
			clear()
			if (result){
				skiper = print(LANG[user_lang].on_win)
				document.querySelector("#titles").classList.add("win")
			} else{
				skiper = print(LANG[user_lang].on_lose)
				document.querySelector("#titles").classList.add("lose")
			}
			
			pushHistory(result, {
				prize_door: document.querySelector("#doors > .door.prize").getAttribute("num"),
				selected_door: document.querySelector("#doors > .door.selected").getAttribute("num")
			})

			setTimeout(_=>{
				button.innerHTML = LANG[user_lang].again
				button.onclick = _=>{
					clear()
					button.innerHTML = LANG[user_lang].select
					document.querySelector("#titles").classList.remove("win", "lose")
					document.querySelectorAll("#doors > .door").forEach(e=>{
						e.classList.remove("selected", "removed", "prize")
					})
					canSelect = true;
					run();
				}
				button.disabled = false
			}, 500)
		}	
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function unSelectAllDoors(){
	document.querySelectorAll("#doors > .door").forEach(e=>{
		e.classList.remove("selected")
	})
}

function clear(){
	if (skiper){skiper(true)}
	document.querySelector("#titles-text").innerHTML = ""
}
function print(text, speed=50, end=""){
	let _speed = speed;
	let input = document.querySelector("#titles-text")
	let _stop = false;
	
	function _print(array){
		if (_stop){return}
		if (end != "" && input.innerHTML.endsWith(end)){
			input.innerHTML = input.innerHTML.slice(0, -1)
		}

		if (array.at(0) == "\n"){
			input.innerHTML += "<br>"
		} else{
			input.innerHTML += array.at(0)
		}
		input.innerHTML += end

		if (array.length > 1){
			setTimeout(_=>{
				_print(array.slice(1))
			}, _speed)
		} else{
			if (end != ""){
				input.innerHTML = input.innerHTML.slice(0, -1)
			}
		}
		input.scrollTo(0, input.scrollHeight);
	}

	_print(
		text.split("\n")
			.map(x=>x.split(""))
			.map(x=>[...x, "\n"])
			.flat(1)
	)
	
	return function(exit=false){
		if (exit){_stop = true}
		_speed = 0;
	}
}

function langEngine(){
	let lang = window.location.hash.substr(1)
	if (!Object.keys(LANG).includes(lang)){
		lang = window.navigator.language.substr(0, 2).toLowerCase()
		if (!Object.keys(LANG).includes(lang)){
			lang = "en"
		}
	}
	document.querySelector(`#footer a[href='#${lang}']`).classList.add("selected")
	document.querySelectorAll("#footer a:not(.selected)").forEach(e=>{
		e.onclick = _=>{
			setTimeout(_=>window.location.reload(), 0)
		}
	})
	return lang
}
function localize(dict){
	document.title = dict.title
	document.querySelector("#skip button").innerHTML = dict.skip
	document.querySelector("#select-button button").innerHTML = dict.select
	document.querySelector("#history-title").innerHTML = dict.history
}

function pushHistory(result, cards){
	let count = document.querySelector("#history-counter").innerHTML.split("/").map(e=>parseInt(e))
	count[1]++;
	let element = parseHTML(`<div class="history-element">
		<div class="title"></div>
		<div class="cards">
			<div class="card"></div>
			<div class="card"></div>
			<div class="card"></div>
		</div>
	</div>`)
	if (result){
		count[0]++;
		element.querySelector(".title").classList.add("win")
		element.querySelector(".title").innerHTML = LANG[user_lang].win
	} else {
		element.querySelector(".title").classList.add("lose")
		element.querySelector(".title").innerHTML = LANG[user_lang].lose
	}
	element.querySelector(`.cards .card:nth-child(${cards.prize_door})`).classList.add("prize")
	element.querySelector(`.cards .card:nth-child(${cards.selected_door})`).classList.add("selected")
	document.querySelector("#history").appendChild(element)

	document.querySelector("#history-counter").innerHTML = count.join("/")
}

function parseHTML(txt) {
	var t = document.createElement('template');
    t.innerHTML = txt;
    return t.content.firstChild;
}
