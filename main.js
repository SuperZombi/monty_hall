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
				this.onGameEnd(true)
				document.querySelector('#doors > .door:not(.removed)').classList.add("prize")
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
		"win": "Congratulations! You won a prize!!! 🎉🎉🎉",
		"lose": "Unfortunately you lost 😢",

		"select": "Select",
		"skip": "Skip"
	},
	"ru": {
		"title": "Парадокс Монти Холла",
		"game": ["Представьте что вы на телеигре.\nЗа одной из дверей приз, остальные пустые.\nВыберите одну из дверей:",
				 "Ведущий убирает одну из пустых дверей и спрашивает вас:\n— Вы уверены в своём выборе?"],
		"win": "Ура! Вы выиграли приз!!! 🎉🎉🎉",
		"lose": "К сожалению, вы проиграли 😢",

		"select": "Выбрать",
		"skip": "Пропустить"
	},
	"uk": {
		"title": "Парадокс Монті Голла",
		"game": ["Уявіть, що ви на телегрі.\nЗа однією з дверей приз, інші порожні.\nВиберіть одну з дверей:",
				 "Ведучий прибирає одну з порожніх дверей і запитує вас: - Ви впевнені у своєму виборі?"],
		"win": "Ура! Ви виграли приз! 🎉🎉🎉",
		"lose": "На жаль, ви програли 😢",

		"select": "Вибрати",
		"skip": "Пропустити"		
	}
}

canSelect = true;
var skiper;
function main(){
	let user_lang = langEngine()
	let game_text = LANG[user_lang].game
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
	
	skiper = print(game_text.shift())
	var game = new Game();

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
			print(LANG["ru"].win)
		} else{
			print(LANG["ru"].lose)
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
}
