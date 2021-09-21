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

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

document.addEventListener("keydown", e => {
	if (!e || !e.key || !e.target || !e.target.selectionStart || !("value" in e.target) || !mappings[e.key] || !mappings[e.key][e.target.value[e.target.selectionStart-1]]) return;
	let isActive = active[e.key];
	active[e.key] = true;
	if (!isActive) return;
	e.target.value = e.target.value.replaceAt(e.target.selectionStart-1, mappings[e.key][e.target.value[e.target.selectionStart-1]]);
	e.preventDefault();
});

document.addEventListener("keyup", e => {
	active[e.key] = true;
});
