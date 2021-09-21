let mappings = {
	"a": {
		"a": "à",
		"à": "â",
		"â": "ä",
		"ä": "a",
		"A": "À",
		"À": "Â",
		"Â": "Ä",
		"Ä": "A"
	},
	"c": {
		"c": "ç",
		"ç": "c",
		"C": "Ç",
		"Ç": "C"
	},
	"e": {
		"e": "é",
		"é": "è",
		"è": "ê",
		"ê": "ë",
		"ë": "e",
		"E": "É",
		"É": "È",
		"È": "Ê",
		"Ê": "Ë",
		"Ë": "E"
	},
	"i": {
		"i": "ï",
		"ï": "i",
		"I": "Ï",
		"Ï": "I"
	},
	"o": {
		"o": "ö",
		"ö": "o",
		"O": "Ö",
		"Ö": "O"
	},
	"u": {
		"u": "ü",
		"ü": "u",
		"U": "Ü",
		"Ü": "U"
	}
}
let active = {};
let toggle = {};

document.addEventListener("keydown", e => {
	if (!e || !e.key || !e.target || !("selectionStart" in e.target) || !("value" in e.target) || !(e.key in mappings)) return;
	let isActive = active[e.key];
	active[e.key] = true;
	if (!isActive) return;
	let replacement = mappings[e.key][e.target.value[e.target.selectionStart-1]];
	if (!replacement) return;
	e.preventDefault();
	if (!toggle[e.key]) toggle[e.key] = 0;
	toggle[e.key] = (toggle[e.key] + 1) % 3;
	if (toggle[e.key]) return;
	e.target.selectionStart -= 1;
	var start = e.target.selectionStart;
	var finish = e.target.selectionEnd;
	var allText = e.target.value;
	var sel = allText.substring(start, finish);
	var newText = allText.substring(0, start)+replacement+allText.substring(finish, allText.length);
	e.target.value=newText;
	e.target.selectionStart = finish;
	e.target.selectionEnd = finish;
});

document.addEventListener("keyup", e => {
	active[e.key] = false;
	toggle[e.key] = 0;
});
