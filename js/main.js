// uCefJS = {
//     addEvent: function(eventName, eventCallback) {
//         if (window.uCef) {
//             window.uCefJS.addEvent(eventName, eventCallback);
//         }
//     },
//     triggerEvent: function(eventName, ...args) {
//         if (window.uCef) {
//             window.uCef.triggerEvent(eventName, args);
//         }
//     },
// };

var phoneNickname = '';
var phoneKey = '';
var phoneId = '';

uCefJS = {
    addEvent: function(eventName, eventCallback) {
        if (window.uCef) {
            window.uCef.addEvent(eventName, eventCallback);
        }
    },
    triggerEvent: function(eventName, ...args) {
        if (window.uCef) {
            window.uCef.triggerEvent(eventName, args);
        }
    },
};

if (window.location.hostname == 'greentech-rp.com') {
    httpType = 'https';
} else {
    httpType = 'http';
}

console.log("SCRIPT INIT ");

// cef.emit("game:hud:setComponentVisible", "interface", false);
// cef.emit("game:data:pollPlayerStats", true, 150);

$(document).keydown(function(event) {
    if (event.keyCode == 9) {
        event.preventDefault();
    }
})

const COLORPICKER_TICK = 10;

var cs_palette_index = -1,
    cs_picker_tick = 0,
    cs_last_color = [
        [255, 255, 255],
        [255, 255, 255]
    ];

// color-picker

var color_palette = [
    [255, 255, 255],
    [209, 211, 212],
    [128, 130, 133],
    [255, 156, 161],
    [226, 3, 56],
    [180, 10, 27],
    [128, 240, 255],
    [23, 113, 241],
    [35, 0, 176],
    [118, 254, 197],
    [0, 207, 145],
    [0, 65, 86],
    [109, 110, 113],
    [65, 64, 66],
    [0, 0, 0],
    [85, 107, 47],
    [255, 69, 0],
    [218, 165, 32],
    [138, 43, 226],
    [128, 0, 128],
    [139, 69, 19],
    [255, 228, 181],
    [127, 255, 0],
    [250, 128, 114]
];

function phoneLoading(id, nickname, timestamp, lastMessageId, key, tel) {
    phoneId = id;
    phoneNickname = nickname;
    phoneTimestamp = timestamp;
    phoneLastMessageId = lastMessageId;
    phoneKey = key;
    phoneTel = tel;

    if ((!phoneNickname || !phoneKey) && phoneCountConnect == 0) {
        phoneCountConnect++;
        showNotice(3, 'Ошибка', 'Ошибка при подключении (1).');
        uCefJS.triggerEvent('key:Reconnect', 1);
        return;
    } else if ((!phoneNickname || !phoneKey) && phoneCountConnect == 1) {
        phoneCountConnect++;
        return;
    }
}

function colorCallback(r, g, b, type = 0) {
    if (type) {
        if (++cs_picker_tick < COLORPICKER_TICK) {
            return;
        } else {
            cs_picker_tick = 0;
        }
    }

    cs_last_color[type][0] = r;
    cs_last_color[type][1] = g;
    cs_last_color[type][2] = b;

    uCefJS.triggerEvent('colorpicker:color', r, g, b);
}

function colorResponse(response) {
    uCefJS.triggerEvent('colorpicker:response', response);
}

function showColorPicker(show) {
    uCefJS.triggerEvent("showColorPicker", 255, 180, 0);
    document.getElementById('color-selector').style.display = (show) ? 'block' : 'none';

    if (show) {
        initColorPalette();
        selectPaletteType(1);
    }
}

function initColorPalette() {
    var palette_html = '';

    for (var idx = 0; idx < color_palette.length; idx++) {
        var color = color_palette[idx];

        palette_html += `
            <div class="color-selector-paint"
            style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]})"
            onclick="selectColorPalette(${idx})"></div>`;
    }

    document.getElementById('cs_palette_box').innerHTML = palette_html;

    selectColorPalette(0);
}

function selectColorPalette(index) {
    var paint_elem = document.getElementsByClassName('color-selector-paint');

    if (cs_palette_index != -1) {
        paint_elem[cs_palette_index].classList.toggle('cs_selected', 0);
    }

    paint_elem[index].classList.toggle('cs_selected', 1);
    cs_palette_index = index;

    colorCallback(color_palette[index][0], color_palette[index][1], color_palette[index][2])
}

function selectPaletteType(type) {
    var palette_elem = document.getElementById('cs_palette_box'),
        picker_elem = document.getElementById('cs_picker_box');

    palette_elem.style.display = (type) ? 'none' : 'grid';
    picker_elem.style.display = (type) ? 'block' : 'none';

    document.getElementById('cs_palette').classList.toggle('cs_selected', (!type));
    document.getElementById('cs_picker').classList.toggle('cs_selected', (type));

    colorCallback(cs_last_color[type][0], cs_last_color[type][1], cs_last_color[type][2], type);
}

$("#color-picker").spectrum({
        flat: true,
        allowEmpty: !1,
        showAlpha: false,
        showPallete: false
    }),
    (window.onload = function() {
        var e = $(".scroll");
        e.mousedown(function() {
                var i = this.scrollLeft + event.pageX;
                e.mousemove(function() {
                    return (this.scrollLeft = i - event.pageX), !1;
                });
            }),
            $(window).mouseup(function() {
                e.off("mousemove");
            });
    });

// ---

function showBuyMenu() {
    document.querySelector('#car-donate').style.display = 'flex';
}

function hideBuyMenu() {
    document.querySelector('#car-donate').style.display = 'none';
}

function responseBuyMenu(type) {
    uCefJS.triggerEvent('New:buyMenu', type);
}

function showGov(skin, number, name1, name2, name3, rank) {
    document.getElementById('government').style.display = 'block';

    document.getElementById('government-number').innerText = `УДОСТОВЕРЕНИЕ № ${number}`;
    document.getElementById('government-lastname').innerText = `${name1}`;
    document.getElementById('government-firstname').innerText = `${name2}`;
    document.getElementById('government-fathername').innerText = `${name3}`;

    document.getElementById('government-rank').innerText = `${rank}`;

    document.getElementById('government-photo').src = `/img/documents/passport/skins/${skin}.png`;
}

function hideGov() {
    document.getElementById('government').style.display = 'none';
}


function showSK(skin, number, name1, name2, name3, rank) {
    document.getElementById('sk').style.display = "block";
    document.getElementById('skavatar').src = `/img/documents/passport/skins/${skin}.png`;
    document.getElementById('sknumber').innerText = `${number}`;

    document.getElementById('sk-name1').innerText = `${name1}`;
    document.getElementById('sk-name2').innerText = `${name2}`;
    document.getElementById('sk-name3').innerText = `${name3}`;

    document.getElementById('sk-rank').innerText = `${rank}`;
}

function hideSK() {
    document.getElementById('sk').style.display = "none";
}

/*
            avatar
        numberudost
        date
        surname
        name
        patronymic
        onerank
        tworank
        dategive
*/
/*
                        mdate
                        mmount
                        myear

                        mdategive
                        mdategivemount
                        mdategiveyear
*/
function showMED(medavatar, meddata, medsurname, medname, medbirthdate, medaddress, meddolsh, medorg) {
    document.getElementById('medical').style.display = "block";
    document.getElementById('medavatar').src = `/img/documents/passport/skins/${medavatar}.png`;
    document.getElementById('meddata').innerText = `${meddata}`;

    document.getElementById('medsurname').innerText = `${medsurname}`;
    document.getElementById('medname').innerText = `${medname}`;
    document.getElementById('medbirthdate').innerText = `${medbirthdate}`;

    document.getElementById('medaddress').innerText = `${medaddress}`;
    document.getElementById('meddolsh').innerText = `${meddolsh}`;
    document.getElementById('medorg').innerText = `${medorg}`;
}

function hideMED() {
    document.getElementById('medical').style.display = "none";
}

// showPolis('Стриптиз Клуб "The Vogue Bar', '', 0, '-', 123456, 'ВАЗ 2101', 123456, 'А777МР152', 123456, '18.01.2024', '03.02.2024', 123456)

function showPolis(fio, address, vunumber, fio2, vunumber2, car, vinnumber, carnumber, stsnumber, datastart, dataend, number) {
    months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    document.getElementById('polisstrahovatelfio').innerText = fio;
    document.getElementById('polissobstvennikfio').innerText = fio;
    document.getElementById('polisfiovoditel1').innerText = fio;
    document.getElementById('polissobstvennikaddress').innerText = '603213 Нижегородская обл., ' + address;
    if (vunumber != 0) {
        document.getElementById('polisvuvoditel1').innerText = '52 01 ' + vunumber;
    } else if (vunumber == 0) {
        document.getElementById('polisvuvoditel1').innerText = '';
    }
    if (fio2 != '-') {
        document.getElementById('polisnumbervoditel2').innerText = '2';
        document.getElementById('polisfiovoditel2').innerText = fio2;
        document.getElementById('polisvuvoditel2').innerText = '52 01 ' + vunumber2;
        if (vunumber2 == 0) {
            document.getElementById('polisvuvoditel2').innerText = '';
        }
    } else if (fio2 == '-') {
        document.getElementById('polisnumbervoditel2').innerText = '';
        document.getElementById('polisfiovoditel2').innerText = '';
        document.getElementById('polisvuvoditel2').innerText = '';
    }
    document.getElementById('poliscar').innerText = car;
    document.getElementById('polisvinnumber').innerText = vinnumber;
    document.getElementById('poliscarnumber').innerText = carnumber;
    document.getElementById('polisdocumentnumber').innerText = stsnumber;
    document.getElementById('polisfromtime5').innerText = datastart.split('.')[0][0];
    document.getElementById('polisfromtime6').innerText = datastart.split('.')[0][1];
    document.getElementById('polisfromtime7').innerText = datastart.split('.')[1][0];
    document.getElementById('polisfromtime8').innerText = datastart.split('.')[1][1];
    document.getElementById('polisfromtime9').innerText = datastart.split('.')[2][2];
    document.getElementById('polisfromtime10').innerText = datastart.split('.')[2][3];
    document.getElementById('polisfrom2time1').innerText = datastart.split('.')[0][0];
    document.getElementById('polisfrom2time2').innerText = datastart.split('.')[0][1];
    document.getElementById('polisfrom2time3').innerText = datastart.split('.')[1][0];
    document.getElementById('polisfrom2time4').innerText = datastart.split('.')[1][1];
    document.getElementById('polisfrom2time5').innerText = datastart.split('.')[2][2];
    document.getElementById('polisfrom2time6').innerText = datastart.split('.')[2][3];
    document.getElementById('polistotime1').innerText = dataend.split('.')[0][0];
    document.getElementById('polistotime2').innerText = dataend.split('.')[0][1];
    document.getElementById('polistotime3').innerText = dataend.split('.')[1][0];
    document.getElementById('polistotime4').innerText = dataend.split('.')[1][1];
    document.getElementById('polistotime5').innerText = dataend.split('.')[2][2];
    document.getElementById('polistotime6').innerText = dataend.split('.')[2][3];
    document.getElementById('polisto2time1').innerText = dataend.split('.')[0][0];
    document.getElementById('polisto2time2').innerText = dataend.split('.')[0][1];
    document.getElementById('polisto2time3').innerText = dataend.split('.')[1][0];
    document.getElementById('polisto2time4').innerText = dataend.split('.')[1][1];
    document.getElementById('polisto2time5').innerText = dataend.split('.')[2][2];
    document.getElementById('polisto2time6').innerText = dataend.split('.')[2][3];
    document.getElementById('polisdatastartday').innerText = datastart.split('.')[0];
    document.getElementById('polisdatastartmonth').innerText = months[datastart.split('.')[1] - 1];
    document.getElementById('polisdatastartyear').innerText = datastart.split('.')[2][2] + datastart.split('.')[2][3];
    document.getElementById('polisdatastart2day').innerText = datastart.split('.')[0];
    document.getElementById('polisdatastart2month').innerText = months[datastart.split('.')[1] - 1];
    document.getElementById('polisdatastart2year').innerText = datastart.split('.')[2][2] + datastart.split('.')[2][3];
    document.getElementById('polisnumber').innerText = number;
    document.getElementById('polis').style.display = 'block';
}

function hidePolis() {
    document.getElementById('polis').style.display = 'none';
}

// showSTS('А777МР77', 'VW2035SFK34023421', 'JEEP GRAND CHEROKEE', 'внедорожник 5 дв.', 'B', '2009',
//     '255, 255, 255', '150/321', '3512', 'AB', '2347861',
//     '3900', '3100', '81 24 203548', 'Вилман', 'Андрей', 'Владимирович',
//     '', '4.1.2024', 0)
// showLastSTS()

function showSTS(stscarnumber, stsvinnumber, stscar, stscartype, stscarcategory, stscaryear,
    stscarcolor, stscardvigpower, stscardvigamount, stspassseria, stspassnumber,
    stscarmassa, stscarmassaout, stsnumber, stsownersurname, stsownername, stsownerpatronymic,
    stsaddress, stsdate, ststype) {
    listSTS[Object.keys(listSTS).length] = [stscarnumber, stsvinnumber, stscar, stscartype, stscarcategory, stscaryear,
        stscarcolor, stscardvigpower, stscardvigamount, stspassseria, stspassnumber,
        stscarmassa, stscarmassaout, stsnumber, stsownersurname, stsownername, stsownerpatronymic,
        stsaddress, stsdate, ststype
    ];
    document.getElementById('sts').style.display = "block";
    document.getElementById('stscarnumber').innerText = stscarnumber.toUpperCase();
    document.querySelector('#stsvinnumber span').innerText = stsvinnumber.toUpperCase();
    document.getElementById('stscar').innerText = stscar.toUpperCase();
    document.getElementById('stscartype').innerText = stscartype.toUpperCase();
    document.getElementById('stscarcategory').innerText = stscarcategory.toUpperCase();
    document.getElementById('stscaryear').innerText = stscaryear;
    document.getElementById('stscarcolor').style.color = 'rgb(' + stscarcolor + ')';
    document.getElementById('stscardvigpower').innerText = stscardvigpower;
    document.getElementById('stscardvigamount').innerText = stscardvigamount;
    document.getElementById('stspassseria').innerText = stspassseria;
    document.getElementById('stspassnumber').innerText = stspassnumber;
    document.getElementById('stscarmassa').innerText = stscarmassa;
    document.getElementById('stscarmassaout').innerText = stscarmassaout;
    document.getElementById('stsnumber').innerText = stsnumber;
    document.getElementById('stsnumber2').innerText = stsnumber;
    document.getElementById('stsownersurname').innerText = stsownersurname.toUpperCase();
    if (ststype == 0) {
        document.getElementById('stsownersurnameeng').innerText = (translite(stsownersurname)).toUpperCase();
        trans = '';
        result = '';
        document.getElementById('stsownername').innerText = stsownername.toUpperCase();
        document.getElementById('stsownernameeng').innerText = (translite(stsownername)).toUpperCase();
        document.getElementById('stsownerpatronymic').innerText = stsownerpatronymic.toUpperCase();
        document.getElementById('stscity').innerText = '';
        document.getElementById('stsstreet').innerText = '';
        document.getElementById('stshome').innerText = '';
    } else if (ststype == 1) {
        document.getElementById('stsownersurnameeng').innerText = '';
        document.getElementById('stsownername').innerText = '';
        document.getElementById('stsownernameeng').innerText = '';
        document.getElementById('stsownerpatronymic').innerText = '';
        document.getElementById('stscity').innerText = '';
        document.getElementById('stsstreet').innerText = '';
        document.getElementById('stshome').innerText = '';
    }
    document.getElementById('stsday').innerText = dateTimeFormat(stsdate.split('.')[0]);
    document.getElementById('stsmonth').innerText = dateTimeFormat(stsdate.split('.')[1]);
    document.getElementById('stsyear').innerText = stsdate.split('.')[2].slice(2);
    document.getElementById('stskorpus').innerText = '-';
    document.getElementById('stskvartira').innerText = '-';

    stscarwidth = document.querySelector('#stscar').textContent.split('').length;
    if (stscarwidth > 18) {
        document.getElementById('stscar').style.top = '35.3%';
        document.getElementById('stscar').style.fontSize = '69%';
    } else {
        document.getElementById('stscar').style = '';
    }
}

function hideSTS() {
    document.getElementById('sts').style.display = "none";
    trans = '';
    result = '';
}

function zoomLastSTS() {
    document.querySelector('#laststs').classList.toggle('zoomed');
}

function zoomLastVU() {
    document.querySelector('#lastvu').classList.toggle('zoomed');
}

function zoomLastSP() {
    document.querySelector('#lastpassport').classList.toggle('zoomed');
}

function showLastSTS(type = Object.keys(listSTS).length - 1) {
    if (listSTS[type]) {
        document.querySelector('#laststs').setAttribute('idsts', type);
        document.querySelector('#laststs').style.display = "block";
        document.querySelector('#laststs #stscarnumber').innerText = listSTS[type][0].toUpperCase();
        document.querySelector('#laststs #stsvinnumber span').innerText = listSTS[type][1].toUpperCase();
        document.querySelector('#laststs #stscar').innerText = listSTS[type][2].toUpperCase();
        document.querySelector('#laststs #stscartype').innerText = listSTS[type][3].toUpperCase();
        document.querySelector('#laststs #stscarcategory').innerText = listSTS[type][4].toUpperCase();
        document.querySelector('#laststs #stscaryear').innerText = listSTS[type][5];
        document.querySelector('#laststs #stscarcolor').style.color = 'rgb(' + listSTS[type][6] + ')';
        document.querySelector('#laststs #stscardvigpower').innerText = listSTS[type][7];
        document.querySelector('#laststs #stscardvigamount').innerText = listSTS[type][8];
        document.querySelector('#laststs #stspassseria').innerText = listSTS[type][9];
        document.querySelector('#laststs #stspassnumber').innerText = listSTS[type][10];
        document.querySelector('#laststs #stscarmassa').innerText = listSTS[type][11];
        document.querySelector('#laststs #stscarmassaout').innerText = listSTS[type][12];
        document.querySelector('#laststs #stsnumber').innerText = listSTS[type][13];
        document.querySelector('#laststs #stsnumber2').innerText = listSTS[type][13];
        document.querySelector('#laststs #stsownersurname').innerText = listSTS[type][14].toUpperCase();
        if (listSTS[type][19] == 0) {
            document.querySelector('#laststs #stsownersurnameeng').innerText = (translite(listSTS[type][14])).toUpperCase();
            trans = '';
            result = '';
            document.querySelector('#laststs #stsownername').innerText = listSTS[type][15].toUpperCase();
            document.querySelector('#laststs #stsownernameeng').innerText = (translite(listSTS[type][15])).toUpperCase();
            document.querySelector('#laststs #stsownerpatronymic').innerText = listSTS[type][16].toUpperCase();
            document.querySelector('#laststs #stscity').innerText = listSTS[type][17].split(' ')[0].toUpperCase();
            document.querySelector('#laststs #stsstreet').innerText = listSTS[type][17].split(' ')[1].toUpperCase();
            document.querySelector('#laststs #stshome').innerText = listSTS[type][17].split(' ')[2];
        } else if (listSTS[type][19] == 1) {
            document.querySelector('#laststs #stsownersurnameeng').innerText = '';
            document.querySelector('#laststs #stsownername').innerText = '';
            document.querySelector('#laststs #stsownernameeng').innerText = '';
            document.querySelector('#laststs #stsownerpatronymic').innerText = '';
            document.querySelector('#laststs #stscity').innerText = '';
            document.querySelector('#laststs #stsstreet').innerText = '';
            document.querySelector('#laststs #stshome').innerText = '';
        }

        document.querySelector('#laststs #stsday').innerText = dateTimeFormat(listSTS[type][18].split('.')[0]);
        document.querySelector('#laststs #stsmonth').innerText = dateTimeFormat(listSTS[type][18].split('.')[1]);
        document.querySelector('#laststs #stsyear').innerText = listSTS[type][18].split('.')[2].slice(2);

        document.querySelector('#laststs #stskorpus').innerText = '-';
        document.querySelector('#laststs #stskvartira').innerText = '-';

        stscarwidth = ($('#laststs #stscar').width() / $('#laststs #stscar').parent().width() * 100).toFixed();
        if (stscarwidth > 26) {
            document.querySelector('#laststs #stscar').style.top = '35.3%';
            document.querySelector('#laststs #stscar').style.fontSize = '69%';
        } else {
            document.querySelector('#laststs #stscar').style = '';
        }
    }
}

function hideLastSTS() {
    document.querySelector('#laststs').style.display = "none";
    trans = '';
    result = '';
}

// showDialog(0, 'Заголовок', '{FF0000}Текст\n{FF0000}Текст2', 'Кнопка1', 'Кнопка2')

function showDialog2() {
    showDialog(2, 'Меню', 'Статистика\nКоманды сервера\nРепорт\nДонат', 'Далее', 'Закрыть')
}

// showRadar()

// vusurname vusurnametranslate vuname vunametranslate vuborndate vub vuc vud vuavatar
// showVU('Вилман', 'Андрей Владимирович', '11.11.2011', 1, 1, 1, 1, '3', 123456)

function checkEng(text) {
    engAlph = 'abcdefghijklmnopqrstuvwxyz';
    newText = '';
    text.split('').forEach(element => {
        if (engAlph.indexOf(element.toLowerCase()) == -1) {
            newText += '<span>' + element + '</span>';
        } else {
            newText += '<span style="color: red;">' + element + '</span>';
        }
    });
    return newText;
}

function showVU(vusurname, vuname, vuborndate, vua, vub, vuc, vud, vuavatar, number) {
    trans = '';
    result = '';
    listVU[Object.keys(listVU).length] = [vusurname, vuname, vuborndate, vua, vub, vuc, vud, vuavatar, number];
    document.getElementById('vu').style.display = "block";

    document.getElementById('vusurname').innerHTML = `${vusurname}`;

    var vusurnametranslate = translit(vusurname.toUpperCase())
    document.getElementById('vusurnametranslate').innerHTML = `${vusurnametranslate}`;

    document.getElementById('vuname').innerHTML = `${vuname}`;

    var vunametranslate = translite(vuname.toUpperCase())
    document.getElementById('vunametranslate').innerHTML = `${vunametranslate}`;
    document.getElementById('vuborndate').innerHTML = `${vuborndate}`;

    if (vua == 1) {
        document.getElementById('vua').style.display = "block";
    }
    if (vub == 1) {
        document.getElementById('vub').style.display = "block";
    }
    if (vuc == 1) {
        document.getElementById('vuc').style.display = "block";
    }
    if (vud == 1) {
        document.getElementById('vud').style.display = "block";
    }

    document.getElementById('vuavatar').src = `/img/documents/passport/skins/${vuavatar}.png`
    document.querySelector('#vu .content .number').textContent = '52 01 ' + number
}

function hideVU() {
    document.getElementById('vu').style.display = "none";
    document.getElementById('vua').style.display = "none";
    document.getElementById('vub').style.display = "none";
    document.getElementById('vuc').style.display = "none";
    document.getElementById('vud').style.display = "none";
    trans = '';
    result = '';
}

function showLastVU(type = Object.keys(listVU).length - 1) {
    if (listVU[type]) {
        document.querySelector('#lastvu').setAttribute('idvu', type);
        document.querySelector('#lastvu #vusurname').innerHTML = `${checkEng(listVU[type][0])}`;

        var vusurnametranslate = translit(listVU[type][0].toUpperCase())
        document.querySelector('#lastvu #vusurnametranslate').innerHTML = `${vusurnametranslate}`;

        document.querySelector('#lastvu #vuname').innerHTML = `${checkEng(listVU[type][1])}`;

        var vunametranslate = translite(listVU[type][1].toUpperCase())
        document.querySelector('#lastvu #vunametranslate').innerHTML = `${vunametranslate}`;
        document.querySelector('#lastvu #vuborndate').innerHTML = `${listVU[type][2]}`;

        if (listVU[type][3] == 1) {
            document.querySelector('#lastvu #vua').style.display = "block";
        }
        if (listVU[type][4] == 1) {
            document.querySelector('#lastvu #vub').style.display = "block";
        }
        if (listVU[type][5] == 1) {
            document.querySelector('#lastvu #vuc').style.display = "block";
        }
        if (listVU[type][6] == 1) {
            document.querySelector('#lastvu #vud').style.display = "block";
        }

        document.querySelector('#lastvu #vuavatar').src = `/img/documents/passport/skins/${listVU[type][7]}.png`
        document.querySelector('#lastvu .content .number').textContent = '52 01 ' + listVU[type][8]
        document.querySelector('#lastvu').style.display = "block";
    }
}

function hideLastVU() {
    document.getElementById('lastvu').style.display = "none";
}

function showSUD(sudavatar, sudday, sudmonth, sudyear, sudnumber, sudfamily, sudname, sudnoname, sudrang) {
    document.getElementById('sud').style.display = "block";
    document.getElementById('sudavatar').src = `/img/documents/passport/skins/${sudavatar}.png`
    document.getElementById('sudday').innerText = `${sudday}`;

    document.getElementById('sudmonth').innerText = `${sudmonth}`;
    document.getElementById('sudyear').innerText = `${sudyear}`;
    document.getElementById('sudnumber').innerText = `${sudnumber}`;

    document.getElementById('sudfamily').innerText = `${sudfamily}`;
    document.getElementById('sudname').innerText = `${sudname}`;
    document.getElementById('sudnoname').innerText = `${sudnoname}`;
    document.getElementById('sudrang').innerText = `${sudrang}`;
}

function hideSUD() {
    document.getElementById('sud').style.display = "none";
}


function showMVD(mvdavatar, mvdnumberudost, mvdnumber, mvdday, mvdmonth, mvdyear, mvdfamily, mvdname, mvdtwoname, mvdfirstrang, mvdtworang) {
    document.getElementById('mvd').style.display = "block";
    document.getElementById('mvdavatar').src = `/img/documents/passport/skins/${mvdavatar}.png`;
    document.getElementById('mvdnumberudost').innerText = `${mvdnumberudost}`;

    document.getElementById('mvdnumber').innerText = `${mvdnumber}`;
    document.getElementById('mvdday').innerText = `${mvdday}`;
    document.getElementById('mvdmonth').innerText = `${mvdmonth}`;

    document.getElementById('mvdyear').innerText = `${mvdyear}`;
    document.getElementById('mvdfamily').innerText = `${mvdfamily}`;
    document.getElementById('mvdname').innerText = `${mvdname}`;

    document.getElementById('mvdtwoname').innerText = `${mvdtwoname}`;
    document.getElementById('mvdfirstrang').innerText = `${mvdfirstrang}`;
    document.getElementById('mvdtworang').innerText = `${mvdtworang}`;
}

function hideMVD() {
    document.getElementById('mvd').style.display = "none";
}

// showVNG(25, 123123, 123123, 21, 12, 2006, 'Вилман', 'Андрей', 'Владимирович', 'ранг', 'ранг 2')

function showVNG(vngavatar, vngnumberudost, vngnumber, vngday, vngmonth, vngyear, vngfamily, vngname, vngtwoname, vngfirstrang, vngtworang) {
    document.getElementById('vng').style.display = "block";
    document.getElementById('vngavatar').src = `/img/documents/passport/skins/${vngavatar}.png`;
    document.getElementById('vngnumberudost').innerText = `${vngnumberudost}`;

    document.getElementById('vngnumber').innerText = `${vngnumber}`;
    document.getElementById('vngday').innerText = `${vngday}`;
    document.getElementById('vngmonth').innerText = `${vngmonth}`;

    document.getElementById('vngyear').innerText = `${vngyear}`;
    document.getElementById('vngfamily').innerText = `${vngfamily}`;
    document.getElementById('vngname').innerText = `${vngname}`;

    document.getElementById('vngtwoname').innerText = `${vngtwoname}`;
    document.getElementById('vngfirstrang').innerText = `${vngfirstrang}`;
    document.getElementById('vngtworang').innerText = `${vngtworang}`;
}

function hideVNG() {
    document.getElementById('vng').style.display = "none";
}

// showVP(25, 123123, 123123, 21, 12, 2006, 'Вилман', 'Андрей', 'Владимирович', 'ранг', 'ранг 2')

function showVP(vpavatar, vpnumberudost, vpnumber, vpday, vpmonth, vpyear, vpfamily, vpname, vptwoname, vpfirstrang, vptworang) {
    document.getElementById('vp').style.display = "block";
    document.getElementById('vpavatar').src = `/img/documents/passport/skins/${vpavatar}.png`;
    document.getElementById('vpnumberudost').innerText = `${vpnumberudost}`;
    document.getElementById('vpnumber').innerText = `${vpnumber}`;
    document.getElementById('vpfamily').innerText = `${vpfamily}`;
    document.getElementById('vpname').innerText = `${vpname}`;
    document.getElementById('vptwoname').innerText = `${vptwoname}`;
    document.getElementById('vpfirstrang').innerText = `${vpfirstrang}`;
    document.getElementById('vptworang').innerText = `${vptworang}`;
}

function hideVP() {
    document.getElementById('vp').style.display = "none";
}

// showCORDD(1, 123123, 'Вилман', 'Андрей', 'Владимирович', 'инспектор')

function showCORDD(corddavatar, corddnumberudost, corddfamily, corddname, corddtwoname, corddfirstrang) {
    document.getElementById('cordd').style.display = "block";
    document.getElementById('corddavatar').src = `/img/documents/passport/skins/${corddavatar}.png`;
    document.getElementById('corddnumberudost').innerText = `${corddnumberudost}`;
    document.getElementById('corddfamily').innerText = `${corddfamily}`;
    document.getElementById('corddname').innerText = `${corddname}`;
    document.getElementById('corddtwoname').innerText = `${corddtwoname}`;
    document.getElementById('corddfirstrang').innerText = `${corddfirstrang}`;
}

function hideCORDD() {
    document.getElementById('cordd').style.display = "none";
}

// showPROKUROR(1, 123123, 'Иванов', 'Иван', 'Иванович', 1, 'Прокурор', 'Отдел')

function showPROKUROR(skin, number, name1, name2, name3, dopusk, rank, otdel) {
    document.getElementById('prokuror').style.display = "block";
    document.getElementById('prokuroravatar').src = `/img/documents/passport/skins/${skin}.png`
    document.getElementById('dopusk').innerText = `${dopusk}`;

    document.getElementById('prokurorudostoverenie1').innerText = `${number}`;
    document.getElementById('prokurorudostoverenie2').innerText = `${number}`;

    document.getElementById('prokuror-name1').innerText = `${name1}`;
    document.getElementById('prokuror-name2').innerText = `${name2}`;
    document.getElementById('prokuror-name3').innerText = `${name3}`;

    document.getElementById('givedayprokuror').innerText = `13`;
    document.getElementById('givemonthprokuror').innerText = `марта`;
    document.getElementById('giveyearprokuror').innerText = `24`;

    document.getElementById('datedayprokuror').innerText = `13`;
    document.getElementById('datemonthprokuror').innerText = `апреля`;
    document.getElementById('dateyearprokuror').innerText = `28`;

    document.getElementById('prokurorrang').innerText = `${rank}`;
    document.getElementById('prokurorotdel').innerText = `${otdel}`;
}

function hidePROKUROR() {
    document.getElementById('prokuror').style.display = "none";
}

// showFSB(25, 'Иванов', 'Иван', 'Иванович', 'Прокурор', 'Отдел')

function showFSB(skin, name1, name2, name3, rank, otdel) {
    document.getElementById('fsb').style.display = "block";
    document.getElementById('fsbavatar').src = `/img/documents/passport/skins/${skin}.png`

    document.getElementById('fsb-name1').innerText = `${name1}`;
    document.getElementById('fsb-name2').innerText = `${name2}`;
    document.getElementById('fsb-name3').innerText = `${name3}`;

    document.getElementById('fsbrang').innerText = `${rank}`;
    document.getElementById('fsbotdel').innerText = `${otdel}`;
}

function hideFSB() {
    document.getElementById('fsb').style.display = "none";
}

function showMChS(mavatar, mnumberudost, mdate, mmount, myear, msurname, mname, mpatronymic, monerank, mtworank, mdategive, mdategivemount, mdategiveyear) {

    document.getElementById('mchs').style.display = "block";
    document.getElementById('mavatar').src = `/img/documents/passport/skins/${mavatar}.png`
    document.getElementById('mnumberudost').innerText = `${mnumberudost}`;

    document.getElementById('mdate').innerText = `${mdate}`;
    document.getElementById('mmount').innerText = `${mmount}`;
    document.getElementById('myear').innerText = `${myear}`;

    document.getElementById('msurname').innerText = `${msurname}`;
    document.getElementById('mname').innerText = `${mname}`;
    document.getElementById('mpatronymic').innerText = `${mpatronymic}`;
    document.getElementById('monerank').innerText = `${monerank}`;
    document.getElementById('mtworank').innerText = `${mtworank}`;

    document.getElementById('mdategive').innerText = `${mdategive}`;
    document.getElementById('mdategivemount').innerText = `${mdategivemount}`;
    document.getElementById('mdategiveyear').innerText = `${mdategiveyear}`;
}

function hideMChS(mavatar, mnumberudost, mdate, mmount, myear, msurname, mname, mpatronymic, monerank, mtworank, mdategive, mdategivemount, mdategiveyear) {
    document.getElementById('mchs').style.display = "none";
}

function showPassport(surname, name, patronymic, sex, birthdate, avatar) {
    trans = '';
    result = '';
    listPassport[Object.keys(listPassport).length] = [surname, name, patronymic, sex, birthdate, avatar];
    translit(surname + name + patronymic);
    document.getElementById('passport').style.display = "block";
    document.getElementById('surname').innerText = `${surname}`;
    document.getElementById('name').innerText = `${name}`;
    document.getElementById('patronymic').innerText = `${patronymic}`;
    document.getElementById('sex').innerText = `${sex}`;
    document.getElementById('birthdate').innerText = `${birthdate}`;
    document.getElementById('avatar').src = `/img/documents/passport/skins/${avatar}.png`
    document.getElementById('translatePassport').innerText = `${trans}`
}

function hidePassport() {
    document.getElementById('passport').style.display = "none";
    trans = '';
}

function showLastSP(type = Object.keys(listPassport).length - 1) {
    if (listPassport[type]) {
        trans = '';
        result = '';
        translit(listPassport[type][0] + listPassport[type][1] + listPassport[type][2]);
        document.querySelector('#lastpassport #passport').style.display = "block";
        document.querySelector('#lastpassport #surname').innerText = `${listPassport[type][0]}`;
        document.querySelector('#lastpassport #name').innerText = `${listPassport[type][1]}`;
        document.querySelector('#lastpassport #patronymic').innerText = `${listPassport[type][2]}`;
        document.querySelector('#lastpassport #sex').innerText = `${listPassport[type][3]}`;
        document.querySelector('#lastpassport #birthdate').innerText = `${listPassport[type][4]}`;
        document.querySelector('#lastpassport #avatar').src = `/img/documents/passport/skins/${listPassport[type][5]}.png`
        document.querySelector('#lastpassport #translatePassport').innerText = `${trans}`
    }
}

function hideLastSP() {
    document.querySelector('#lastpassport #passport').style.display = "none";
    trans = '';
}

var turn_left = false,
    turn_right = false,
    turn_signal_timer = null;

function setBar(type, value) {
    var progress_value = value;

    if (progress_value > 100) {
        progress_value = 100;
    }

    document.getElementById(`progress_${type}`).style = `width: calc(${progress_value}% - 0.4vw)`;
    document.getElementById(`text_${type}`).innerText = `${Math.round(value)}`;

    if (type == 'health' || type == 'armour') {
        document.querySelectorAll('#hud-' + type).forEach(element => {
            element.style.width = value + '%';
        });
    }
}

function cleanNeedClasses(element) {
    element.classList.remove('short_low');
    element.classList.remove('short_normal');
    element.classList.remove('short_good');
    element.classList.remove('short_high');
}

function setNeed(type, value) {
    if (value < 0) {
        value = 0;
    } else if (value > 200) {
        value = 200;
    }

    var bar_status = 'low';

    if (value >= 80) {
        bar_status = 'high';
    } else if (value >= 50) {
        bar_status = 'good';
    } else if (value >= 25) {
        bar_status = 'normal';
    }

    var bar_elem = document.getElementById(`need_${type}`);

    cleanNeedClasses(bar_elem);

    bar_elem.classList.add(`short_${bar_status}`);
    document.getElementById(`text_${type}`).innerText = `${value}`;

    if (type == 'food' || type == 'drink') {
        document.querySelectorAll('#hud-' + type).forEach(element => {
            element.textContent = value + '%';
        });
        document.querySelectorAll('#hud-height-' + type).forEach(element => {
            element.style.height = value / 2 + '%';
        });

        document.querySelectorAll('.newHud-3-eat-water-block [hud-' + type + '-id]').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelector('.newHud-3-eat-water-block [hud-' + type + '-id="' + Math.ceil((value / 2) / 5) * 5 + '"]').style.display = '';
    }
}

interfaceCarShow = false;
lastHudId = '';

// showInterface('newHud-2', true)
// showInterface('car', true)

function showInterface(interface, show, type) {
    if (interface == 'newHud-0' || interface == 'newHud-1' || interface == 'newHud-2' || interface == 'newHud-3') {
        lastHudId = interface;
        if (show) {
            showInterface('newHud-0', false)
            if (interface == 'newHud-0') {
                document.querySelector('#money').style.display = '';
                document.querySelector('#bottom').style.display = '';
                document.querySelector('#gun').style.display = '';
                document.querySelector('#gun').hidden = false;
                document.querySelector('#bars').style.display = '';
                document.querySelector('#top #logo img').setAttribute('src', '/img/logo.png');
            } else if (interface == 'newHud-1') {
                document.querySelector('.newHudBottom').style.display = '';
                document.querySelector('.newHud-1').style.display = '';
                document.querySelector('#top #logo img').setAttribute('src', '/img/logo-white.png');
            } else if (interface == 'newHud-2') {
                document.querySelector('.newHudBottom').style.display = '';
                document.querySelector('.newHud-2').style.display = '';
                document.querySelector('#top #logo img').setAttribute('src', '/img/logo-white.png');
            } else if (interface == 'newHud-3') {
                document.querySelector('.newHudBottom').style.display = '';
                document.querySelector('.newHud-3').style.display = '';
                document.querySelector('#top #logo img').setAttribute('src', '/img/logo-green.png');
            }
        }
        if (!show) {
            document.querySelector('#money').style.display = 'none';
            document.querySelector('#bottom').style.display = 'none';
            document.querySelector('#gun').style.display = 'none';
            document.querySelector('#bars').style.display = 'none';
            document.querySelector('.newHud-1').style.display = 'none';
            document.querySelector('.newHud-2').style.display = 'none';
            document.querySelector('.newHud-3').style.display = 'none';
            document.querySelector('.newHudBottom').style.display = 'none';
        }
    } else if (isInterfaceHidden(interface) !== undefined) {
        var interface_elem = document.getElementById(interface);

        interface_elem.hidden = !show;

        if (show) {
            if (interface == 'car' && !interfaceCarShow) {
                interfaceCarShow = true;
                interface_elem.style.display = 'flex';
                if (type == 0) {
                    document.querySelector('.fuel svg#fuel').style.display = '';
                    document.querySelector('.fuel svg#fuel-elec').style.display = 'none';
                } else if (type == 1) {
                    document.querySelector('.fuel svg#fuel').style.display = 'none';
                    document.querySelector('.fuel svg#fuel-elec').style.display = '';
                }
                setTimeout(() => {
                    interface_elem.style.bottom = '4%';
                }, 200);
            } else {
                interface_elem.style = '';
            }
        } else {
            if (interface == 'car' && interfaceCarShow) {
                interfaceCarShow = false;
                interface_elem.style.bottom = '-30%';
                setTimeout(() => {
                    if (!interfaceCarShow) {
                        interface_elem.style.display = 'none';
                    }
                }, 700);
            } else {
                interface_elem.style = `display: none`;
            }
        }
    }
}

function showTransmission(type, show) {
    if (type == 'manual' || type == 'automatic') {
        var display_type = 'none';

        if (show) {
            display_type = 'block';
        }

        document.getElementById(`transmission_${type}`).style = `display: ${display_type}`;

        clearTransmissionGears(type);
    }
}

function setSpeedIcon(type, value) {
    var icon_elem = document.getElementById(`flag_${type}`);
    if (icon_elem !== null) {
        icon_elem.classList.remove('active');
        if (Boolean(value)) {
            icon_elem.classList.add('active');
        }
    }
}

function getWeaponImage(weaponid) {
    switch (weaponid) {
        case 1:
            return 'kast';
            break;
        case 3:
            return 'dubina';
            break;
        case 4:
            return 'knife';
            break;
        case 5:
            return 'bita';
            break;
        case 9:
            return 'pila';
            break;
        case 22:
            return 'pya';
            break;
        case 23:
            return 'silenced';
            break;
        case 24:
            return 'makarov';
            break;
        case 27:
            return 'pp_kedr';
            break;
        case 28:
            return 'pkp';
            break;
        case 29:
            return 'aksu';
            break;
        case 30:
            return 'ak';
            break;
        case 31:
            return 'akm';
            break;
        case 32:
            return 'ak12';
            break;
        case 33:
            return 'ak12_obves';
            break;
        case 34:
            return 'svd';
            break;
        case 35:
            return 'rpg';
            break;
        case 41:
            return 'spr';
            break;
        case 42:
            return 'fire';
            break;
        case 43:
            return 'cam';
            break;
        case 46:
            return 'par';
            break;
        default:
            return 'fist';
    }
}

function setSpeedCircle(speed) {
    if (speed > 240) {
        speed = 240
    }
    var speed_value = Math.round((188.25 / 240) * speed);

    document.getElementById('speed_circle').style = `stroke-dasharray: ${speed_value}% 500%;`;
}

function isInterfaceHidden(interface) {
    var interface_elem = document.getElementById(interface);

    if (interface_elem !== null) {
        //console.log("Hidden return");
        return interface_elem.hidden;
    } else {
        //console.log("UNDERFINDED INTERFACE");
        return undefined;
    }
}

function moneyFormat(number) {
    var text_fmt = `${number}`;
    var text_tmp = text_fmt;
    var text_len = text_fmt.length;

    var dots_count = 0;

    for (var idx = 0; idx < (text_len - 1); idx++) {
        if (text_tmp[idx] == '.') {
            continue;
        }

        if (((text_len - (idx + 1)) % 3) == 0) {
            dots_count++;

            text_tmp = text_tmp.slice(0, idx + dots_count) + '.' + text_tmp.slice(idx + dots_count);
        }
    }

    return text_tmp;
}

function moneyFormat2(number) {
    var text_fmt = `${number}`;
    var text_tmp = text_fmt;
    var text_len = text_fmt.length;

    var dots_count = 0;

    for (var idx = 0; idx < (text_len - 1); idx++) {
        if (text_tmp[idx] == '.') {
            continue;
        }

        if (((text_len - (idx + 1)) % 3) == 0) {
            dots_count++;

            text_tmp = text_tmp.slice(0, idx + dots_count) + ' ' + text_tmp.slice(idx + dots_count);
        }
    }

    return text_tmp;
}

function dateTimeFormat(number) {
    number = Number(number);
    if (number < 10) {
        number = '0' + number;
    }

    return ('' + number);
}

function updateDateTime() {
    var listDay = {
        'понедельник': 'пнд',
        'вторник': 'втр',
        'среда': 'срд',
        'четверг': 'чтв',
        'пятница': 'птн',
        'суббота': 'сбт',
        'воскресенье': 'вск'
    };
    var hudtime = new Intl.DateTimeFormat('ru-RU', {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Europe/Moscow'
    }).format(hudtime);
    var huddate = new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeZone: 'Europe/Moscow'
    }).format(huddate);
    var huddatefis = new Intl.DateTimeFormat('ru-RU', {
        weekday: 'long',
        timeZone: 'Europe/Moscow'
    }).format(huddatefis) + ', ' + new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        timeZone: 'Europe/Moscow'
    }).format(huddatefis);
    var huddateday = new Intl.DateTimeFormat('ru-RU', {
        weekday: 'long',
        timeZone: 'Europe/Moscow'
    }).format(huddateday);
    var time_elem = document.querySelector('#date .time span');
    var date_elem = document.querySelector('#date .date span');
    var radar_time = document.querySelector('.radar-time-datetime');
    var alcotester_time = document.querySelector('.alcotester-screen-main-time');
    var alcotester_date = document.querySelector('.alcotester-screen-main-date');

    radar_time.innerHTML = huddate.replaceAll('.', '<span style="font-family: \'Arial\';">.</span>') + ' ' + hudtime.replaceAll(':', '<span style="font-family: \'Arial\';">:</span>');
    date_elem.innerText = huddate;
    time_elem.innerText = hudtime;
    document.querySelector('.newHudDate .time span').textContent = hudtime;
    document.querySelector('.newHudDate .date span').textContent = huddate;
    alcotester_time.innerText = listDay[huddateday] + ' ' + hudtime;
    alcotester_date.innerText = huddate.replaceAll('.', '/');
    document.querySelector('.fis-m-time').innerText = hudtime;
    document.querySelector('.fis-m-date').innerText = huddatefis;
    document.querySelector('.phone-header-time').innerHTML = hudtime;

}

var signActive = false;
//setTurnLight('left', 1)

function turnLightsHandler() {
    if (turn_left) {
        document.getElementById(`turn_signal_left`).classList.toggle('active');
    }

    if (turn_right) {
        document.getElementById(`turn_signal_right`).classList.toggle('active');
    }

    if (Boolean(turn_left) == false && Boolean(turn_right) == false) {
        clearInterval(turn_signal_timer);
        turn_signal_timer = null;
    }
}

function setTurnLight(type, value) {
    console.log(type, value)
    if (type == 'left' || type == 'right') {
        if (turn_signal_timer == null && Boolean(value) == true) {
            turn_signal_timer = setInterval(turnLightsHandler, 700);
        }

        if (type == 'left') {
            turn_left = Boolean(value);
        } else {
            turn_right = Boolean(value);
        }

        document.getElementById(`turn_signal_${type}`).classList.remove('active');

        if (Boolean(value) == true) {
            document.getElementById(`turn_signal_${type}`).classList.add('active');
        }
    }
}

function clearTransmissionGears(type) {
    if (type == 'manual' || type == 'automatic') {
        var gear_list = document.getElementById(`transmission_${type}`).getElementsByClassName('gear');

        for (var idx = 0; idx < gear_list.length; idx++) {
            gear_list[idx].classList.remove('active');
        }
    }
}

function setTransmissionGear(type, gear) {
    if (type == 'train') {
        document.querySelector("#train_transmission").classList.remove("forward");
        document.querySelector("#train_transmission").classList.remove("back");
        let cls = "";
        if (gear == 'n') cls = "";
        if (gear == 'r') cls = "back";
        if (gear == 'd') cls = "forward";
        document.querySelector("#train_transmission").classList.add(cls);
    }
    if (type == 'manual' || type == 'automatic') {
        clearTransmissionGears(type);

        var gear_elem = document.getElementById(`t${type[0]}_gear_${gear}`);

        if (gear_elem !== null) {
            gear_elem.classList.add('active');
        }
    }
}

// every minute timer
updateDateTime();
setInterval(() => {
    updateDateTime();
}, 30 * 1000);

var trans = '';

function test() {

    translit(test);
    alert(trans);
}

function translit(word) {
    var converter = {
        'а': 'A',
        'б': 'B',
        'в': 'V',
        'г': 'G',
        'д': 'D',
        'е': 'E',
        'ё': 'E',
        'ж': 'ZH',
        'з': 'Z',
        'и': 'I',
        'й': 'Y',
        'к': 'K',
        'л': 'L',
        'м': 'M',
        'н': 'N',
        'о': 'O',
        'п': 'P',
        'р': 'R',
        'с': 'S',
        'т': 'T',
        'у': 'U',
        'ф': 'F',
        'х': 'H',
        'ц': 'C',
        'ч': 'CH',
        'ш': 'SH',
        'щ': 'SCH',
        'ь': '',
        'ы': 'Y',
        'ъ': '',
        'э': 'E',
        'ю': 'YU',
        'я': 'YA',

        'А': 'A',
        'Б': 'B',
        'В': 'V',
        'Г': 'G',
        'Д': 'D',
        'Е': 'E',
        'Ё': 'E',
        'Ж': 'ZH',
        'З': 'Z',
        'И': 'I',
        'Й': 'Y',
        'К': 'K',
        'Л': 'L',
        'М': 'M',
        'Н': 'N',
        'О': 'O',
        'П': 'P',
        'Р': 'R',
        'С': 'S',
        'Т': 'T',
        'У': 'U',
        'Ф': 'F',
        'Х': 'H',
        'Ц': 'C',
        'Ч': 'CH',
        'Ш': 'SH',
        'Щ': 'SCH',
        'Ь': '',
        'Ы': 'Y',
        'Ъ': '',
        'Э': 'E',
        'Ю': 'YU',
        'Я': 'YA'
    };

    for (var i = 0; i < word.length; ++i) {
        if (converter[word[i]] == undefined) {
            trans += word[i];
        } else {
            trans += converter[word[i]];
        }
    }

    return trans;
}


// document.addEventListener('keydown', function(event) {
// if (event.code == 'KeyP') {
// 	showFIS()
// }
// else if (event.code == 'KeyO') {
// 	hideFIS()
// }});

var result = '';

function translite(word) {
    trans = '';
    result = '';
    var conv = {
        'а': 'A',
        'б': 'B',
        'в': 'V',
        'г': 'G',
        'д': 'D',
        'е': 'E',
        'ё': 'E',
        'ж': 'ZH',
        'з': 'Z',
        'и': 'I',
        'й': 'Y',
        'к': 'K',
        'л': 'L',
        'м': 'M',
        'н': 'N',
        'о': 'O',
        'п': 'P',
        'р': 'R',
        'с': 'S',
        'т': 'T',
        'у': 'U',
        'ф': 'F',
        'х': 'H',
        'ц': 'C',
        'ч': 'CH',
        'ш': 'SH',
        'щ': 'SCH',
        'ь': '',
        'ы': 'Y',
        'ъ': '',
        'э': 'E',
        'ю': 'YU',
        'я': 'YA',

        'А': 'A',
        'Б': 'B',
        'В': 'V',
        'Г': 'G',
        'Д': 'D',
        'Е': 'E',
        'Ё': 'E',
        'Ж': 'ZH',
        'З': 'Z',
        'И': 'I',
        'Й': 'Y',
        'К': 'K',
        'Л': 'L',
        'М': 'M',
        'Н': 'N',
        'О': 'O',
        'П': 'P',
        'Р': 'R',
        'С': 'S',
        'Т': 'T',
        'У': 'U',
        'Ф': 'F',
        'Х': 'H',
        'Ц': 'C',
        'Ч': 'CH',
        'Ш': 'SH',
        'Щ': 'SCH',
        'Ь': '',
        'Ы': 'Y',
        'Ъ': '',
        'Э': 'E',
        'Ю': 'YU',
        'Я': 'YA'
    };

    for (var i = 0; i < word.length; ++i) {
        if (conv[word[i]] == undefined) {
            result += word[i];
        } else {
            result += conv[word[i]];
        }
    }

    return result;
}

function cefSoundPlay(sound) {
    const audioContext = new(window.AudioContext || window.webkitAudioContext)();

    // Загрузка аудио файла
    fetch('/sounds/' + sound)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start();
        })
        .catch(error => console.error('Error loading audio:', error));
}

isCursor = false;

function setCursor(state) {
    if (isCursor != state) {
        uCefJS.triggerEvent('client:toggleCursor', state);
        isCursor = state;
    }
}

uCefJS.addEvent("game:data:playerStats", (hp, max_hp, arm, breath, wanted, weapon, ammo, max_ammo, money, speed) => {
    setBar('health', hp);
    setBar('armour', arm);

    var weapon_img = getWeaponImage(weapon);
    var ammo_text = '';

    if (weapon_img !== 'fist') {
        ammo_text = `${ammo}-${(max_ammo - ammo)}`;
    }

    document.getElementById('img_weapon').src = `/img/weapon_${weapon_img}.png`;
    document.getElementById('text_ammo').innerText = ammo_text;

    if (weapon_img == 'fist') {
        document.querySelectorAll('#hud-weapon').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('#hud-ammo').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelector('.newHud-2-weapon-block').style.display = 'none';
        document.querySelector('.newHud-3 #hud-weapon').setAttribute('src', '/img/weapon_' + weapon_img + '.png');
        document.querySelector('.newHud-3 #hud-weapon').style.display = '';
    } else {
        document.querySelectorAll('#hud-weapon').forEach(element => {
            element.setAttribute('src', '/img/weapon_' + weapon_img + '.png');
            element.style.display = '';
        });
        document.querySelectorAll('#hud-ammo').forEach(element => {
            element.textContent = `${ammo}/${(max_ammo - ammo)}`;
            element.style.display = '';
        });
        document.querySelector('.newHud-2-weapon-block').style.display = '';
    }

    //document.getElementById('text_cash').innerText = `${moneyFormat(money)} ₽`;

    if (!isInterfaceHidden('car')) {
        var game_speed = Math.round(speed);

        document.getElementById('text_speed').innerText = `${game_speed}`;
        setSpeedCircle(game_speed);
    }

    if (!isInterfaceHidden('train')) {
        document.getElementById("train-speed").innerHTML = `${Math.round(speed)}`;
    }
});

uCefJS.addEvent('speedometer:carSpeed', (speed) => {
    if (!isInterfaceHidden('car')) {
        var game_speed = Math.round(speed);
        document.getElementById('text_speed').innerText = `${game_speed}`;
    }

    if (!isInterfaceHidden('train')) {
        document.getElementById("train-speed").innerHTML = `${Math.round(speed)}`;
    }
});

uCefJS.addEvent('interface:set:icon', (type) => {
    setSpeedIcon(type, true);
});

uCefJS.addEvent('interface:unset:icon', (type) => {
    setSpeedIcon(type, false);
});

uCefJS.addEvent('interface:set:turnlight', (type, value) => {
    setTurnLight(type, Boolean(parseInt(value)));
});

uCefJS.addEvent('interface:set:turn:left', (value) => {
    setTurnLight('left', Boolean(parseInt(value)));
});

uCefJS.addEvent('interface:set:turn:right', (value) => {
    setTurnLight('right', Boolean(parseInt(value)));
});

uCefJS.addEvent('interface:set:city', (city) => {
    document.getElementById('text_city').innerText = city;
    document.querySelector('.newHudPlace-city').textContent = city;
});

uCefJS.addEvent("interface:set:street", (street) => {
    document.getElementById('text_street').innerText = street;
    document.querySelector('.newHudPlace-street').textContent = street;
});

uCefJS.addEvent("interface:set:card", (card) => {
    document.getElementById('text_card').innerText = `${moneyFormat(card)} ₽`;

    document.querySelectorAll('#hud-money-bank span').forEach(element => {
        element.textContent = `${moneyFormat(card)}`;
    });
});

uCefJS.addEvent('interface:set:need', (type, value) => {
    if (type == 'food' || type == 'drink') {
        setNeed(type, value);
    }
});

uCefJS.addEvent('interface:set:fuel', (value) => {
    document.getElementById('text_fuel').innerText = `${value.toFixed(1)}`;
});

uCefJS.addEvent('interface:set:mileage', (value) => {
    document.getElementById('text_mileage').innerText = `${value} км`;
});

uCefJS.addEvent('interace:set:fuelmil', (fuel, mileage) => {
    document.getElementById('text_fuel').innerText = `${fuel.toFixed(1)}`;
    document.getElementById('text_mileage').innerText = `${mileage} км`;

    if (fuel < 5) {
        document.getElementById('fuel_icon').classList.add("active");
        document.getElementById('text_fuel').classList.add("active");
    } else {
        document.getElementById('fuel_icon').classList.remove("active");
        document.getElementById('text_fuel').classList.remove("active");
    }
});

uCefJS.addEvent("interface:show", (name, type) => {
    showInterface(name, true, type);
});

uCefJS.addEvent('interface:hide', (name) => {
    showInterface(name, false);
});

uCefJS.addEvent('interface:showtrans', (name) => {
    showTransmission(name, true);
});

uCefJS.addEvent('interface:hidetrans', (name) => {
    showTransmission(name, false);
});

uCefJS.addEvent('interface:set:gear', (type, gear) => {
    setTransmissionGear(type, gear);
});

uCefJS.addEvent('interface:set:showPassport', (surname, name, patronymic, sex, birthdate, avatar) => {
    showPassport(surname, name, patronymic, sex, birthdate, avatar);
})

uCefJS.addEvent('interface:set:hidePassport', (surname, name, patronymic, sex, birthdate, avatar) => {
    hidePassport(surname, name, patronymic, sex, birthdate, avatar);
})

uCefJS.addEvent('interface:set:showMChS', (mavatar, mnumberudost, mdate, mmount, myear, msurname, mname, mpatronymic, monerank, mtworank, mdategive, mdategivemount, mdategiveyear) => {
    showMChS(mavatar, mnumberudost, mdate, mmount, myear, msurname, mname, mpatronymic, monerank, mtworank, mdategive, mdategivemount, mdategiveyear);
})

uCefJS.addEvent('interface:set:hideMChS', (mavatar, mnumberudost, mdate, mmount, myear, msurname, mname, mpatronymic, monerank, mtworank, mdategive, mdategivemount, mdategiveyear) => {
    hideMChS(mavatar, mnumberudost, mdate, mmount, myear, msurname, mname, mpatronymic, monerank, mtworank, mdategive, mdategivemount, mdategiveyear);
})

uCefJS.addEvent('interface:set:showMED', (medavatar, meddata, medsurname, medname, medbirthdate, medaddress, meddolsh, medorg) => {
    showMED(medavatar, meddata, medsurname, medname, medbirthdate, medaddress, meddolsh, medorg);
})

uCefJS.addEvent('interface:set:hideMED', () => {
    hideMED();
})

uCefJS.addEvent('interface:set:showSTS', (stscarnumber, stsvinnumber, stscar, stscartype, stscarcategory, stscaryear,
    stscarcolor, stscardvigpower, stscardvigamount, stspassseria, stspassnumber,
    stscarmass, stscarmassaout, stsnumber, stsownersurname, stsownername, stsownerpatronymic,
    stsaddress, stsdate, ststype) => {
    showSTS(stscarnumber, stsvinnumber, stscar, stscartype, stscarcategory, stscaryear,
        stscarcolor, stscardvigpower, stscardvigamount, stspassseria, stspassnumber,
        stscarmass, stscarmassaout, stsnumber, stsownersurname, stsownername, stsownerpatronymic,
        stsaddress, stsdate, ststype);
})

uCefJS.addEvent('interface:set:hideSTS', () => {
    hideSTS();
})

uCefJS.addEvent('interface:set:showLastSTS', () => {
    showLastSTS();
})

uCefJS.addEvent('interface:set:hideLastSTS', () => {
    hideLastSTS();
})

uCefJS.addEvent('interface:Dialog:show', (type, title, text, button1, button2) => {
    console.log('interface:Dialog:show: ' + type, title, text, button1, button2);
    showDialog(type, title, text, button1, button2);
})

uCefJS.addEvent('interface:Dialog:hide', () => {
    hideDialog();
})

uCefJS.addEvent('interface:set:showVU', (vusurname, vuname, vuborndate, vua, vub, vuc, vud, vuavatar, number) => {
    showVU(vusurname, vuname, vuborndate, vua, vub, vuc, vud, vuavatar, number);
})

uCefJS.addEvent('interface:set:hideVU', () => {
    hideVU();
})

uCefJS.addEvent('interface:show:LastVU', () => {
    showLastVU();
})

uCefJS.addEvent('interface:hide:LastVU', () => {
    hideLastVU();
})

uCefJS.addEvent('interface:show:LastSP', () => {
    showLastSP();
})

uCefJS.addEvent('interface:hide:LastSP', () => {
    hideLastSP();
})

uCefJS.addEvent('interface:set:showSK', (skin, number, name1, name2, name3, rank) => {
    showSK(skin, number, name1, name2, name3, rank);
})

uCefJS.addEvent('interface:set:hideSK', () => {
    hideSK();
})

uCefJS.addEvent('interface:set:showPROKUROR', (skin, number, name1, name2, name3, dopusk, rank, otdel) => {
    showPROKUROR(skin, number, name1, name2, name3, dopusk, rank, otdel);
})

uCefJS.addEvent('interface:set:hidePROKUROR', () => {
    hidePROKUROR();
})

uCefJS.addEvent('interface:set:showFSB', (skin, name1, name2, name3, rank, otdel) => {
    showFSB(skin, name1, name2, name3, rank, otdel);
})

uCefJS.addEvent('interface:set:hideFSB', () => {
    hideFSB();
})

uCefJS.addEvent('interface:set:showGov', (skin, number, name1, name2, name3, rank) => {
    showGov(skin, number, name1, name2, name3, rank);
})

uCefJS.addEvent('interface:set:hideGov', () => {
    hideGov();
})

//
uCefJS.addEvent('interface:set:showMVD', (mvdavatar, mvdnumberudost, mvdnumber, mvdday, mvdmonth, mvdyear, mvdfamily, mvdname, mvdtwoname, mvdfirstrang, mvdtworang) => {
    showMVD(mvdavatar, mvdnumberudost, mvdnumber, mvdday, mvdmonth, mvdyear, mvdfamily, mvdname, mvdtwoname, mvdfirstrang, mvdtworang);
})

uCefJS.addEvent('interface:set:hideMVD', () => {
    hideMVD();
})

uCefJS.addEvent('interface:set:showVNG', (vngavatar, vngnumberudost, vngnumber, vngday, vngmonth, vngyear, vngfamily, vngname, vngtwoname, vngfirstrang, vngtworang) => {
    showVNG(vngavatar, vngnumberudost, vngnumber, vngday, vngmonth, vngyear, vngfamily, vngname, vngtwoname, vngfirstrang, vngtworang);
})

uCefJS.addEvent('interface:set:hideVNG', () => {
    hideVNG();
})

uCefJS.addEvent('interface:set:showVP', (vpavatar, vpnumberudost, vpnumber, vpday, vpmonth, vpyear, vpfamily, vpname, vptwoname, vpfirstrang, vptworang) => {
    showVP(vpavatar, vpnumberudost, vpnumber, vpday, vpmonth, vpyear, vpfamily, vpname, vptwoname, vpfirstrang, vptworang);
})

uCefJS.addEvent('interface:set:hideVP', () => {
    hideVP();
})

uCefJS.addEvent('interface:set:showCORDD', (corddavatar, corddnumberudost, corddfamily, corddname, corddtwoname, corddfirstrang) => {
    showCORDD(corddavatar, corddnumberudost, corddfamily, corddname, corddtwoname, corddfirstrang);
})

uCefJS.addEvent('interface:set:hideCORDD', () => {
    hideCORDD();
})

uCefJS.addEvent('interface:set:showSUD', (sudavatar, sudday, sudmonth, sudyear, sudnumber, sudfamily, sudname, sudnoname, sudrang) => {
    showSUD(sudavatar, sudday, sudmonth, sudyear, sudnumber, sudfamily, sudname, sudnoname, sudrang);
})

uCefJS.addEvent('interface:set:hideSUD', () => {
    hideSUD();
})

uCefJS.addEvent('interface:show:colorpicker', (price) => {
    showColorPicker(true);

    document.getElementById('cs_price').innerHTML = `${moneyFormat(price)} ₽`;
})

uCefJS.addEvent('interface:hide:colorpicker', () => {
    showColorPicker(false);
})

uCefJS.addEvent('game:data:money', (moneyCount) => {
    document.getElementById('text_cash').innerText = `${moneyFormat(moneyCount)} ₽`;

    document.querySelectorAll('#hud-money-cash span').forEach(element => {
        element.textContent = `${moneyFormat(moneyCount)}`;
    });

    document.querySelector('.casino-window-body-money-text span').textContent = `${moneyFormat(moneyCount)}`;
})

uCefJS.addEvent('game:data:speed', (game_speed) => {
    document.getElementById('text_speed').innerText = `${game_speed}`;
    // setSpeedCircle(speed_car);
})

uCefJS.addEvent('client:toggleCursor', (state) => {
    setCursor(state);
})

uCefJS.addEvent('interface:set:showDialog2', () => {
    showDialog2();
})

uCefJS.addEvent('interface:show:FIS', (type, fioinspector, zvanie, rang) => {
    showFIS(type, fioinspector, zvanie, rang);
})

uCefJS.addEvent('interface:hide:FIS', () => {
    hideFIS();
})

uCefJS.addEvent('interface:set:FISVU', (response, surname, name, patronymic, birthday, face, protokols, wanted) => {
    setFISVU(response, surname, name, patronymic, birthday, face, protokols, wanted);
})

uCefJS.addEvent('interface:set:FISTS', (response, surname, name, patronymic, birthday, face, vunomer, car, carnumber, polis, wantedcar) => {
    setFISTS(response, surname, name, patronymic, birthday, face, vunomer, car, carnumber, polis, wantedcar);
})

uCefJS.addEvent('interface:set:FISFIZ', (response, surname, name, patronymic, birthday, face, vunomer, telnomer, address, car, nedv, wanted) => {
    setFISFIZ(response, surname, name, patronymic, birthday, face, vunomer, telnomer, address, car, nedv, wanted);
})

uCefJS.addEvent('interface:set:ISMVD', (response, surname, name, patronymic, birthday, face, telnomer, org, address, license, protokols, sudimosti, wanted) => {
    setISMVD(response, surname, name, patronymic, birthday, face, telnomer, org, address, license, protokols, sudimosti, wanted);
})

uCefJS.addEvent('interface:set:FIScheckFIO', (type, protokolnumber) => {
    openKoap(type, protokolnumber);
})

uCefJS.addEvent('interface:set:FIScheckVin', (vin, type) => {
    armCheckVin(2, vin, type)
})

uCefJS.addEvent('interface:set:takeProtokol', (type, img, dataprotokol, dataprotokolPawn) => {
    showProtokol(type, img, dataprotokol, dataprotokolPawn);
})

uCefJS.addEvent('interface:show:LastProt', () => {
    if (protokolHand) {
        showProtokol(0, lastProtokol = 1);
    }
})

uCefJS.addEvent('interface:hide:LastProt', () => {
    if (protokolHand) {
        hideProtokol(0, 1);
    }
})

uCefJS.addEvent('interface:set:hideProtokol', () => {
    hideProtokol(0);
})

uCefJS.addEvent('interface:set:EsrCheck', (type) => {
    esrAddPopup(type);
})

uCefJS.addEvent('interface:set:EsrAlert', (type) => {
    esrAlert(type);
})

uCefJS.addEvent('interface:set:EsrAdd', (type, id, face, fio, category, birthday, adddate, inspector, text) => {
    esrAdd(type, id, face, fio, category, birthday, adddate, inspector, text);
})

uCefJS.addEvent('interface:set:showPolis', (fio, address, vunumber, fio2, vunumber2, car, vinnumber, carnumber, stsnumber, datastart, dataend, number) => {
    showPolis(fio, address, vunumber, fio2, vunumber2, car, vinnumber, carnumber, stsnumber, datastart, dataend, number)
})

uCefJS.addEvent('interface:set:hidePolis', () => {
    hidePolis()
})

uCefJS.addEvent('interface:show:radar', (type) => {
    showRadar(type)
})

uCefJS.addEvent('interface:hide:radar', () => {
    hideRadar()
})

uCefJS.addEvent('interface:set:radar', (car, carnumber, speed, fix) => {
    setRadar(car, carnumber, speed, fix)
})

uCefJS.addEvent('interface:set:radarWanted', (wanted) => {
    setRadarWanted(wanted)
})

uCefJS.addEvent('interface:show:RadarAIM', () => {
    showRadarAim()
})

uCefJS.addEvent('interface:hide:RadarAIM', () => {
    hideRadarAim()
})

uCefJS.addEvent('interface:set:radarPost', (nickname, car, carNumber, speedOgran, speed) => {
    radarPostProtokol(nickname, car, carNumber, speedOgran, speed)
})

uCefJS.addEvent('interface:show:buyMenu', () => {
    showBuyMenu()
})

uCefJS.addEvent('interface:hide:buyMenu', () => {
    hideBuyMenu()
})

uCefJS.addEvent('interface:show:DonateNomer', () => {
    showDonateNomer()
})

uCefJS.addEvent('interface:hide:DonateNomer', () => {
    hideDonateNomer()
})

uCefJS.addEvent('interface:show:MainMenu', (nickname, vip, lvl, exp, moneydo, moneycash, moneybank, sex, warn, phonenumber, phonebalance, years, org, otdel, rang, job, hunger, thirst, blacklist, surname, name, patronymic, birthday, hud, study) => {
    showMenu(nickname, vip, lvl, exp, moneydo, moneycash, moneybank, sex, warn, phonenumber, phonebalance, years, org, otdel, rang, job, hunger, thirst, blacklist, surname, name, patronymic, birthday, hud, study);
})

uCefJS.addEvent('interface:hide:MainMenu', () => {
    hideMenu();
})

uCefJS.addEvent('interface:set:UpdateWeather', (type, deg) => {
    updateWeather(type, deg);
})

uCefJS.addEvent('interface:show:Azsmenu', () => {
    showAzsmenu();
})

uCefJS.addEvent('interface:show:AzsmenuCharge', (current, pricetank) => {
    showAzsmenuCharge(current, pricetank);
})

uCefJS.addEvent('interface:hide:Azsmenu', () => {
    hideAzsmenu();
})

uCefJS.addEvent('interface:set:Azsresponse', (type, current, max, pricetank) => {
    setAzsmenuPage(type, current, max, pricetank);
})

uCefJS.addEvent('interface:set:showNotice', (type, title, text) => {
    showNotice(type, title, text);
})

uCefJS.addEvent('interface:show:Start', (type) => {
    document.querySelector('.start').style.display = 'flex';
    document.querySelector('.start-main.start-' + type).style.display = 'block';
})

uCefJS.addEvent('interface:hide:Start', (type) => {
    document.querySelector('.start').style.display = 'none';
    document.querySelector('.start-main.start-' + type).style.display = 'none';
})

uCefJS.addEvent('interface:show:SGU', () => {
    document.querySelector('.sgu-elekt').style.display = '';
})

uCefJS.addEvent('interface:hide:SGU', () => {
    document.querySelector('.sgu-elekt').style.display = 'none';
})

uCefJS.addEvent('sound:Play', (id) => {
    uCefJS.triggerEvent('sound:Play', Number(id), true);
})

uCefJS.addEvent('sound:Playloop', (id) => {
    uCefJS.triggerEvent('sound:Play', Number(id), false);
})

uCefJS.addEvent('sound:Pause', (id) => {
    uCefJS.triggerEvent('sound:Pause', Number(id));
})

uCefJS.addEvent('sound:Stop', (id) => {
    uCefJS.triggerEvent('sound:Stop', Number(id));
})

uCefJS.addEvent('interface:show:Tonik', (isInspector, window) => {
    showTonik(isInspector, window);
})

uCefJS.addEvent('interface:hide:Tonik', () => {
    hideTonik();
})

uCefJS.addEvent('interface:set:TonikSetResponse', (type) => {
    tonikSetResponse(type);
})

uCefJS.addEvent('interface:show:Alcotester', (isInspector) => {
    showAlcotester(isInspector);
})

uCefJS.addEvent('interface:hide:Alcotester', () => {
    hideAlcotester();
})

uCefJS.addEvent('interface:set:AlcotesterSetResponse', (isInspector, type) => {
    alcotesterSetResponse(isInspector, type);
})

uCefJS.addEvent('interface:set:AlcotesterShowCheck', (type, img, dataprotokol) => {
    alcotesterShowCheck(type, img, dataprotokol);
})

uCefJS.addEvent('interface:set:showImgLink', (type, link) => {
    document.querySelector('.link-img').setAttribute('id', type);
    document.querySelector('.link-img').setAttribute('src', link);
    document.querySelector('.link-img').style.display = 'block';
})

uCefJS.addEvent('interface:set:hideImgLink', (type, link) => {
    document.querySelector('.link-img').style.display = 'none';
})

uCefJS.addEvent('interface:set:Alert1', () => {
    uCefJS.triggerEvent('Esr:Alert', 1);
})

uCefJS.addEvent('interface:set:Alert2', () => {
    uCefJS.triggerEvent('Esr:Alert', 2);
})

uCefJS.addEvent('interface:show:Bankomat', (type, nickname, pincode, numberCard, phoneBalance) => {
    showBankomat(type, nickname, pincode, numberCard, phoneBalance);
})

uCefJS.addEvent('interface:hide:Bankomat', () => {
    hideBankomat();
})

uCefJS.addEvent('interface:set:bankomatResponse', (type, subtype, value, value2, value3) => {
    bankomatResponse(type, subtype, value, value2, value3);
})

// uCefJS.addEvent('interface:show:Phone', () => {
//     phoneShow();
// })

// uCefJS.addEvent('interface:hide:Phone', () => {
//     phoneHide();
// })

// uCefJS.addEvent('interface:set:MessageRecieve', (tel, text) => {
//     phoneCreateMessage(tel, 'recieve', text);
// })

uCefJS.addEvent('sound:play', () => {
    radaron = new Audio('1.mp3');
    radaron.play();
})

uCefJS.addEvent('send:chat:message', (color, message, category) => {
    chat.sendMessage(color, message, category);
})

uCefJS.addEvent('interface:show:Casino', (type, nickname, table) => {
    showCasino(type, nickname, table);
})

uCefJS.addEvent('interface:hide:Casino', () => {
    hideCasino();
})

uCefJS.addEvent('interface:set:casinoResponse', (type, response, response2) => {
    casinoResponse(type, response, response2);
})

uCefJS.addEvent('interface:show:Avtosalon', (isLeader) => {
    showAvtosalon(isLeader);
})

uCefJS.addEvent('interface:hide:Avtosalon', () => {
    hideAvtosalon();
})

uCefJS.addEvent('interface:set:AvtosalonCar', (namecar, year, speed, fuel, engine, power, typefuel, rashod, rear, kpp, kuzov, price, limitAll, limit) => {
    ASsetCar(namecar, year, speed, fuel, engine, power, typefuel, rashod, rear, kpp, kuzov, price, limitAll, limit);
})

uCefJS.addEvent('interface:show:AvtosalonButton', (text) => {
    showAvtosalonButton(text);
})

uCefJS.addEvent('interface:hide:AvtosalonButton', () => {
    hideAvtosalonButton();
})

uCefJS.addEvent('interface:show:AvtosalonNotice', (text) => {
    showAvtosalonNotice(text)
})

uCefJS.addEvent('interface:show:Boxbet', (nickname, money, key) => {
    showBoxbet(nickname, money, key);
})

uCefJS.addEvent('interface:hide:Boxbet', () => {
    hideBoxbet();
})

uCefJS.addEvent('interface:set:BoxbetNotice', () => {
    window.__cef('interface:set:BoxbetNotice');
})

// uCefJS.addEvent('interface:phone:Notice', () => {
//     phoneCheckingNew();
// })

uCefJS.addEvent('interface:set:phoneLoading', (id, nickname, timestamp, lastMessageId, key, tel) => {
    phoneLoading(id, nickname, timestamp, lastMessageId, key, tel);
})

// uCefJS.addEvent('interface:set:phoneCheckingNew', () => {
//     phoneCheckingNew();
// })

uCefJS.addEvent('interface:show:Tuning', (carId, isVipPlus, speed, boost, down, offset, vivorot, tire, width, razval, toner1, toner2, toner3) => {
    showTuning(carId, isVipPlus, speed, boost, down, offset, vivorot, tire, width, razval, toner1, toner2, toner3);
})

uCefJS.addEvent('interface:hide:Tuning', () => {
    hideTuning();
})

uCefJS.addEvent('interface:hide:Testdrive', () => {
    document.querySelector('.testdrive').style.display = 'none';
    clearInterval(testDriveInterval);
})

uCefJS.addEvent('interface:show:Handdoc', (type, doc, width, link) => {
    showHanddoc(type, doc, width, link);
})

uCefJS.addEvent('interface:hide:Handdoc', () => {
    hideHanddoc();
})

uCefJS.addEvent('interface:set:Handdoc', (type, doc, width, link) => {
    showHanddoc(type, doc, width, link);
})

uCefJS.addEvent('interface:show:Vikup', (name, id, car, price, wheel, paintjob, speed, stage, distcount, dist, iznos, teh, dtpcount, dtp, torg, torgtype) => {
    showVikup(name, id, car, price, wheel, paintjob, speed, stage, distcount, dist, iznos, teh, dtpcount, dtp, torg, torgtype);
})

uCefJS.addEvent('interface:hide:Vikup', () => {
    hideVikup();
})

uCefJS.addEvent('interface:show:Adminpanel', (nickname, id, name, surname, patronymic, level, cash, bank, frac, rang, food, drink, address, warns, blockVU, mute, jail) => {
    showAdminpanel(nickname, id, name, surname, patronymic, level, cash, bank, frac, rang, food, drink, address, warns, blockVU, mute, jail);
})

uCefJS.addEvent('interface:hide:Adminpanel', () => {
    hideAdminpanel();
})

uCefJS.addEvent('interface:show:AdminpanelCar', (car, id, owner, hp) => {
    showAdminpanelCar(car, id, owner, hp);
})

uCefJS.addEvent('interface:hide:AdminpanelCar', () => {
    hideAdminpanelCar();
})

uCefJS.addEvent('interface:show:spawn', (hasHome, hasFrak) => {
    showSpawn(hasHome, hasFrak);
});

uCefJS.addEvent('interface:show:Login', (nickname, hasCode) => {
    showLogin(nickname, hasCode);
});

uCefJS.addEvent('interface:show:reg', (nickname) => {
    showReg(nickname);
});

uCefJS.addEvent('interface:hide:Login', () => {
    hideLogin();
})

uCefJS.addEvent('interface:set:LoginCheck', (type, status) => {
    loginCheckAuth(type, status);
})

uCefJS.addEvent('interface:test:tuning', (down) => {
    uCefJS.triggerEvent('Debug:Chat', parseFloat(down));
    uCefJS.triggerEvent('Tuning:Change', 0.0, 0.0, parseFloat(down), 0.0, 0.0, 0, 0, 0, 150, 150, 150);
})

uCefJS.addEvent('interface:show:Lottery', (minutes, priz1, priz2, priz3, priz4, priz5, priz6, priz7, priz8, priz9, priz10) => {
    showLottery(minutes, priz1, priz2, priz3, priz4, priz5, priz6, priz7, priz8, priz9, priz10);
})

uCefJS.addEvent('interface:hide:Lottery', () => {
    hideLottery();
})

uCefJS.addEvent('interface:show:TuningExt', (id, installed) => {
    showTuningExt(id, installed);
})

uCefJS.addEvent('interface:hide:TuningExt', () => {
    hideTuningExt();
})

uCefJS.addEvent('interface:show:TuningExtAgain', () => {
    showTuningExtAgain();
})

uCefJS.addEvent('interface:set:restartCef', (type) => {
    document.querySelectorAll('script').forEach(element => {
        if (element.id == type + 'JS') {
            element.remove();
        }
    });

    var jsAssets = document.createElement('script');
    jsAssets.type = 'text/javascript';
    jsAssets.src = '/js/' + type + '.js?v=' + Date.now();
    jsAssets.id = type + 'JS';
    document.head.appendChild(jsAssets);
    console.log(type + ' (2) загружен')
})

uCefJS.addEvent('GreenShop:Open', () => {
    GHshow();
})
// Функция обновления (DOM манипуляция)
window.updateHud = function(health, armour, cash, bank, food, water) {
    if (document.getElementById('hud-health')) document.getElementById('hud-health').style.width = health + '%';
    if (document.getElementById('hud-armour')) document.getElementById('hud-armour').style.width = armour + '%';
    if (document.querySelector('#hud-money-cash span')) document.querySelector('#hud-money-cash span').innerText = cash;
    if (document.querySelector('#hud-money-bank span')) document.querySelector('#hud-money-bank span').innerText = bank;
    if (document.getElementById('hud-height-food')) document.getElementById('hud-height-food').style.height = food + '%';
    if (document.getElementById('hud-height-drink')) document.getElementById('hud-height-drink').style.height = water + '%';
}

// Слушатель событий для КРМП/САМП (через uCefJS)
uCefJS.addEvent('interface:hud:update', (health, armour, cash, bank, food, water) => {
    updateHud(health, armour, cash, bank, food, water);
});