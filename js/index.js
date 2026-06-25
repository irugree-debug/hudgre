function translit(word){
	var answer = '';
	var converter = {
		'а': 'A',    'б': 'B',    'в': 'V',    'г': 'G',    'д': 'D',
		'е': 'E',    'ё': 'E',    'ж': 'ZH',   'з': 'Z',    'и': 'I',
		'й': 'Y',    'к': 'K',    'л': 'L',    'м': 'M',    'н': 'N',
		'о': 'O',    'п': 'P',    'р': 'R',    'с': 'S',    'т': 'T',
		'у': 'U',    'ф': 'F',    'х': 'H',    'ц': 'C',    'ч': 'CH',
		'ш': 'SH',   'щ': 'SCH',  'ь': '',     'ы': 'Y',    'ъ': '',
		'э': 'E',    'ю': 'YU',   'я': 'YA',
 
		'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
		'Е': 'E',    'Ё': 'E',    'Ж': 'ZH',   'З': 'Z',    'И': 'I',
		'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
		'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
		'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'CH',
		'Ш': 'SH',   'Щ': 'SCH',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
		'Э': 'E',    'Ю': 'YU',   'Я': 'YA'
	};
 
	for (var i = 0; i < word.length; ++i ) {
		if (converter[word[i]] == undefined){
			answer += word[i];
		} else {
			answer += converter[word[i]];
		}
	}
 
	return answer;
}

function translatePassport(){
    var getName = document.getElementById('translatePassport').innerText;
    translit(getName);
    getName.replace(/ /, '');
    document.getElementById('translatePassport').innerText = getName;
}