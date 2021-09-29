let remote = "https://pandapip1.github.io/AccentPress/config/accents.json";
let active = {};
let toggle = {};
fetch(remote).then(res => res.json()).then(raw_mappings => {
	let mappings = {};
	Object.keys(raw_mappings).filter(lang => true).forEach(lang => {
		raw_mappings[lang].forEach(letters => {
			let baselet = letters[0];
			let baseletU = letters[0].toUpperCase();
			if (!mappings[letters[0]]){
				mappings[baselet] = {};
				mappings[baseletU] = {};
				mappings[baselet][baselet] = baselet;
				mappings[baseletU][baseletU] = baseletU;
			}
			letters.forEach(letter => {
				let letterU = letter.toUpperCase();
				if (!mappings[baselet]][letter]) Object.keys(mappings[baselet]).forEach(letter2replace => {
					if (mappings[baselet][letter2replace] == baselet){
						mappings[baselet][letter2replace] = letter;
						mappings[baselet][letter] = baselet;
					}
				});
				if (!mappings[baseletU]][letterU]) Object.keys(mappings[baseletU]).forEach(letter2replace => {
					if (mappings[baseletU][letter2replace] == baseletU){
						mappings[baseletU][letter2replace] = letterU;
						mappings[baseletU][letter] = baseletU;
					}
				});
			});
		});
	});
	document.addEventListener("keydown", e => {
		if (!e || !e.key || !e.target || !("selectionStart" in e.target) || !("value" in e.target) || !(e.key in mappings)) return;
		let isActive = active[e.key];
		active[e.key] = true;
		if (!isActive) return;
		let replacement = mappings[e.key][e.target.value[e.target.selectionStart-1]];
		if (!replacement) return;
		e.preventDefault();
		if (!toggle[e.key]) toggle[e.key] = 0;
		toggle[e.key] = (toggle[e.key] + 1) % 4;
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
});
