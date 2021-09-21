let mappings = {
	"a": {
		"a": "à",
		"à": "â",
		"â": "ä",
		"ä": "a"
	},
	"A": {
		"A": "À",
		"À": "Â",
		"Â": "Ä",
		"Ä": "A"
	},
	"c": {
		"c": "ç",
		"ç": "c"
	},
	"C": {
		"C": "Ç",
		"Ç": "C"
	},
	"e": {
		"e": "é",
		"é": "è",
		"è": "ê",
		"ê": "ë",
		"ë": "e"
	},
	"E": {
		"E": "É",
		"É": "È",
		"È": "Ê",
		"Ê": "Ë",
		"Ë": "E"
	},
	"i": {
		"i": "ï",
		"ï": "ì",
		"ì": "î",
		"î": "i"
	},
	"I": {
		"I": "Ï",
		"Ï": "Ì",
		"Ì": "Î",
		"Î": "I"
	},
	"o": {
		"o": "ö",
		"ö": "ò",
		"ò": "ô",
		"ô": "o"
	},
	"O": {
		"O": "Ö",
		"Ö": "Ò",
		"Ò": "Ô",
		"Ô": "O"
	},
	"u": {
		"u": "ü",
		"ü": "ù",
		"ù": "û",
		"û": "u"
	},
	"U": {
		"U": "Ü",
		"Ü": "Ù",
		"Ù": "Û",
		"Û": "U"
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
