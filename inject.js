let mappings = {
	"a": {
		"a": "à",
		"à": "â",
		"â": "ä",
		"ä": "a"
	},
	"c": {
		"c": "ç",
		"ç": "c"
	},
	"e": {
		"e": "é",
		"é": "è",
		"è": "ê",
		"ê": "ë",
		"ë": "e"
	},
	"i": {
		"i": "ï",
		"ï": "i"
	},
	"o": {
		"o": "ö",
		"ö": "o"
	},
	"u": {
		"u": "ü",
		"ü": "u"
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
