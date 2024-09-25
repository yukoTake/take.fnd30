'use strict'

const elmManArea = document.getElementById("main");
const elmMessage = document.getElementById("message");//メッセージ
const elmNeko = document.getElementById("img_neko");//ネコ
const elmNekoDead = document.getElementById("img_neko_dead")//ネコDead

const elmStartBtn = document.getElementById("start");//スタートボタン
const elmKumo = document.getElementById("kumo")//雲
/*
window.onload = function(){
    elmNeko = document.getElementById("img_neko");
    //elmManArea.appendChild(elmNeko);
}
    */

const elmWaniArea = document.getElementById("wani");//ワニ繁殖エリア
const waniAriaWidth = elmWaniArea.clientWidth;
const waniAriaHeight = elmWaniArea.clientHeight;



//Common----------------------------------------------------------

let getWani = 0;//獲得ワニ数
let time = 0 ;//残り時間
const timerLimit = 30;//制限時間
const elmSize = 30;//ワニ・攻撃のサイズ
const itemElmSize = elmSize * 1.5;//アイテムサイズ

let isRes; //ゲーム結果

//wani
const addLeftWani = 20;//ワニ進度
const waniIntervalSec = 200;//ワニ進行頻度/s
const madeWaniSec = 2000;//ワニ算出頻度/s

const waniArr = [];
let waniCount = -1;

//attack
let addLeftAtt = 30;
let attIntervalSec = 100;
let addTopAtt = 10;

const attArr = [];
let attCount = -1;

//item
let itemArr= [];
let isItem;//true：アイテム取得
let intervalItem;

//neko
const nekoSize = 50;
let elmNekoTop = 0;


//timer------------------------------------------------------------
const elmDisplayTimer = document.getElementById("display_timer")
const elmDisplayTime = document.getElementById("display_time");
const elmDisplayWani = document.getElementById("display_get");//獲得ワニ数表示エリア

elmDisplayTime.textContent = "--";
elmDisplayWani.textContent = "";

const timer = madeTimer();
const start = elmStartBtn.addEventListener("click", timer, false);

//TIMER
function madeTimer() {
    let intervalTimer;
    let limit = timerLimit;
    let isTimerMove = false;
    let madeWaniInterval;

    function startTimer() {
        if (!isTimerMove) {
            disableScroll();

            elmMessage.textContent = "ワニを撃退しよう、ヨシ！";
            elmMessage.style.fontSize = "150%"
            isTimerMove = true;
            isRes = true;
            isItem = false;
            resetArrElm();
            elmNeko.style.width = nekoSize + "px"
            elmNeko.style.height = nekoSize + "px"

            time = limit;
            getWani = 0;
            elmDisplayTime.textContent = time;
            elmDisplayWani.textContent = getWani;

            waniCount = -1;
            attCount = -1;

            intervalTimer = setInterval(moveTimer, 1000);

            let waniSan = madeWani(waniIntervalSec, addLeftWani);
            waniSan();

            madeWaniInterval = setInterval(() => {
                let waniSan = madeWani(waniIntervalSec, addLeftWani);
                waniSan();
            }, madeWaniSec)

        }
    }

    function moveTimer() {

        if (time <= 0) {

            clearInterval(intervalTimer);
            clearInterval(madeWaniInterval);
            isTimerMove = false;
            time --;
            if (isRes) {
                elmMessage.textContent = "🩷YOU WIN🩷";
                elmMessage.style.fontSize = "300%"
            };
            enableScroll();

        } else {
            time -= 1;
            elmDisplayTime.textContent = time;

            if (time === Math.floor(timerLimit * 0.7)) {
                elmMessage.textContent = "ちょっとスピードアップするよ！";
                //let nowAddLeftWani = addLeftWani * 2;//ワニ進度 px
                let nowWaniIntervalSec = Math.floor( waniIntervalSec * 0.8);//ワニ進行頻度 s
                let nowMadeWaniSec = Math.floor(madeWaniSec * 0.5)//算出頻度 s

                clearInterval(madeWaniInterval);
                madeWaniInterval = setInterval(() => {
                    let waniSan = madeWani(nowWaniIntervalSec, addLeftWani);
                    waniSan();
                }, nowMadeWaniSec)

                //アイテム算出
                madeItem()();
                //itemSan();

            } else if (time === Math.floor(timerLimit * 0.4)) {
                elmMessage.textContent = "ワニ大増殖！！";
                //let nowAddLeftWani = addLeftWani * 2;//ワニ進度 px
                let nowWaniIntervalSec = Math.floor( waniIntervalSec * 0.8);//ワニ進行頻度 s
                let nowMadeWaniSec = Math.floor(madeWaniSec * 0.3)//算出頻度 s

                clearInterval(madeWaniInterval);
                madeWaniInterval = setInterval(() => {
                    madeWani(nowWaniIntervalSec, addLeftWani)();
                    //waniSan();
                }, nowMadeWaniSec)

            }

            if (isItem) {
                elmNeko.style.width = nekoSize * 1.7 + "px"
                elmNeko.style.height = nekoSize * 1.7 + "px"
            }
        }
    }
    return startTimer;
}

function disableScroll() {
    // 現在の位置を保存
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // スクロール位置を固定
    window.onscroll = function() {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

// スクロール無効化解除
function enableScroll() {
    window.onscroll = function() {};
  }

//WANI------------------------------------------------------------
function madeWani(nowWaniIntervalSec, nowAddLeftWani) {

    let elmLeft = 0;
    let elmTop = Math.floor(Math.random()*(waniAriaHeight - elmSize*2));

    let intervalWani;
    waniCount ++;

    const thisWaniCount = waniCount;
    const newElm = document.createElement('div');


    function startWani() {

        newElm.id = "wani" + thisWaniCount;
        waniArr.push({id: thisWaniCount, left: elmLeft, top: elmTop});
        elmWaniArea.appendChild(newElm);

        newElm.style.width = elmSize + "px"
        newElm.style.height = elmSize + "px"
        newElm.style.position = "absolute";

        newElm.textContent = "🐊";
        newElm.style.fontSize = "130%";
        newElm.style.top = elmTop + "px";
        newElm.style.left = "0px";

        moveWani()
        intervalWani = setInterval(moveWani, nowWaniIntervalSec);
    }

    function moveWani() {

        if (waniArr[thisWaniCount] === null) {
            clearInterval(intervalWani);
            ;//newElm.remove();
        } else if (time <= 0 || elmLeft > waniAriaWidth - elmSize) {

            clearInterval(intervalWani);
            time = 0;
            if (elmLeft >= waniAriaWidth- elmSize) {

                isRes = false;
                newElm.textContent = "💀";
                newElm.style.fontSize = "200%";
                elmMessage.textContent = "🌚YOU LOSE🌚";
                elmMessage.style.fontSize = "300%"
                time = 0;

                madeDeadNeko()();
            }

        } else {
            if (elmLeft < waniAriaWidth) {
                elmLeft += nowAddLeftWani;
            }
            newElm.style.top = elmTop + "px";
            newElm.style.left = elmLeft + "px";
            waniArr[thisWaniCount] = ({id: thisWaniCount, left: elmLeft, top: elmTop});

        }
    }
    return startWani;
}

function madeDeadNeko() {
    let intervalDeadNeko;
    let deadNekoCount = 0;
    let elmTop = elmNekoTop;
    let elmLeft = 0;

    function startDeadNeko() {
        elmNekoDead.style.top = elmTop + "px";
        elmNekoDead.style.left = elmLeft + "px";

        elmNeko.style.visibility = "hidden";
        elmNekoDead.style.visibility = "visible";

        intervalDeadNeko = setInterval(moveDeadNeko, 200);
    }

    function moveDeadNeko() {
        if (deadNekoCount > 15) {
            clearInterval(intervalDeadNeko);
        } else {
            elmTop -= 5;
            elmLeft += 2;
            console.log(elmTop,elmLeft);
            elmNekoDead.style.top = elmTop + "px";
            elmNekoDead.style.left = elmLeft + "px";
            deadNekoCount += 1;
        }
    }
    return startDeadNeko;
}

function resetArrElm() {

    const elmWanis = document.getElementById("wani").children;
    Array.from(elmWanis).forEach(elm => elm.remove());

    const elmDead = document.getElementById("kumo").children;
    Array.from(elmDead).forEach(elm => {
        if (elm.id.slice(0,4) == "dead") {
            elm.remove();
        }
    })

    waniArr.splice(0);
    attArr.splice(0);

    elmNeko.style.visibility = "visible";
    elmNekoDead.style.visibility = "hidden";
}



//ATTACK---------------------------------------------------------
function madeAttack(isTop) {
    const elmTop = (isTop)? elmNekoTop + addTopAtt + 30 : elmNekoTop + addTopAtt;
    const newElm= document.createElement('div');
    let elmLeft = waniAriaWidth;
    let intervalAtt;

    attCount ++;
    const thisAttCount = attCount;

    function startAttack() {

        newElm.id = "att" + thisAttCount;

        elmWaniArea.appendChild(newElm);
        newElm.style.width = elmSize + "px"
        newElm.style.height = elmSize + "px"
        newElm.style.position = "absolute";
        newElm.textContent = "✨";

        newElm.style.top = elmTop + "px";
        elmLeft -= addLeftAtt;
        newElm.style.left = elmLeft + "px";

        intervalAtt =  setInterval(moveAttack, attIntervalSec)

    }

    function moveAttack() {
        if (time <= 0 || elmLeft <= 0) {
            newElm.remove();
            clearInterval(intervalAtt);

        } else {
            elmLeft -= addLeftAtt;
            newElm.style.left = elmLeft + "px";
            const touchWani = waniArr.filter(elm =>
                elm !== null && elm.left >= elmLeft && (elm.top > elmTop - itemElmSize/3
                    && elm.top < elmTop + itemElmSize/3));
            if (touchWani.length > 0) {
                let deleteID = touchWani[0].id;

                touchWani[0] = waniArr.filter(elm => elm !== null && elm.id === deleteID)[0];
                newElm.left = touchWani.left
                newElm.top = touchWani.top + addTopAtt;
                newElm.textContent = "👻";
                newElm.style.fontSize = "200%";
                getWani ++;
                elmDisplayWani.textContent = getWani;

                waniArr[deleteID] = null;
                let delElm = document.getElementById("wani" + deleteID);
                delElm.remove();

                setTimeout(function() {
                    clearInterval(intervalAtt);
                    newElm.remove();
                    attArr[thisAttCount] = null;

                    madeDeadWani(deleteID)();

                  }, 400);

            } else {
                //アイテムゲット時

                if (itemArr[0] !== undefined && itemArr[0].left >= elmLeft &&
                        itemArr[0].top > elmTop -itemElmSize/3  && itemArr[0].top < elmTop + itemElmSize/3) {

                    newElm.left = itemArr[0].left
                    newElm.top = itemArr[0].top + addTopAtt;
                    newElm.textContent = "🩷";
                    newElm.style.fontSize = "200%";
                    isItem = true;

                    itemArr.splice(0);

                    let delItem = document.getElementById("item0");
                    delItem.remove();
                    clearInterval(intervalItem);
                    clearInterval(intervalAtt);
                    attArr[thisAttCount] = null;

                    setTimeout(function() {
                        newElm.remove();
                    }, 400);

                }

            }

        }
            attArr[thisAttCount] = ({id: thisAttCount, left: elmLeft, top: elmTop});
        }

    return startAttack;
}

function madeDeadWani(ID) {

    const newElm = document.createElement('div');
    const elmTop = Math.floor(Math.random()*(elmKumo.clientHeight/5 * 3)) + elmKumo.clientHeight/10;
    const elmLeft = Math.floor(Math.random()*(elmKumo.clientWidth/5 * 3)) + elmKumo.clientWidth/10;
    let isLeft = true;
    let intervalDW;

    function startDeadWani() {

        newElm.id = "dead" +ID;
        elmKumo.appendChild(newElm);

        newElm.style.width = elmSize + "px"
        newElm.style.height = elmSize + "px"
        newElm.style.position = "absolute";

        newElm.textContent = "👻";
        newElm.style.fontSize = "150%";

        newElm.style.top = elmTop + "px";
        newElm.style.left = elmLeft + "px";

        intervalDW =  setInterval(moveDeadWani, 500)
    }

    function moveDeadWani() {

        if (time <= 0 ) {
            clearInterval(intervalDW);
        } else {
            if (isLeft) {
                newElm.style.left = elmLeft + 3 + "px";
                isLeft = false;
            } else {
                newElm.style.left = elmLeft - 3 + "px";
                isLeft = true;
            }
        }
    }
    return startDeadWani;
}



//ITEM------------------------------------------------------------
function madeItem() {

    let elmLeft = 0;
    let elmTop = Math.floor(Math.random()*(waniAriaHeight - elmSize*2));

    const newElm = document.createElement('div');

    function starItem() {
        newElm.id = "item0";
        itemArr.push({id: 0, left: elmLeft, top: elmTop});
        elmWaniArea.appendChild(newElm);

        newElm.style.width = elmSize * 0.5 + "px"
        newElm.style.height = elmSize * 0.5 + "px"
        newElm.style.position = "absolute";

        newElm.textContent = "🐟";
        newElm.style.fontSize = "160%";
        newElm.style.top = elmTop + "px";
        newElm.style.left = "0px";

        intervalItem = setInterval(moveItem, 200);
    }

    function moveItem() {
        if (time <= 0 || elmLeft > waniAriaWidth - elmSize) {
            clearInterval(intervalItem);
            newElm.remove();
            itemArr.splice(0);

        } else {
            if (elmLeft < waniAriaWidth) {
                elmLeft += 30;
            }
            newElm.style.top = elmTop + "px";
            newElm.style.left = elmLeft + "px";
            itemArr[0] = ({id: 0, left: elmLeft, top: elmTop});
        }
    }
    return starItem;
}


//NEKO_MOVE------------------------------------------------------------
document.addEventListener("keydown", function(event) {
    const nekoMovePx = 10;

    switch (event.key) {
        case  "ArrowDown":
            if (elmNekoTop < waniAriaHeight - elmNeko.height) {
                elmNekoTop += nekoMovePx
                elmNeko.style.top = elmNekoTop + "px";
            }
            break;

        case "ArrowUp":
            if(elmNekoTop > 0) {
                elmNekoTop -= nekoMovePx
                elmNeko.style.top = elmNekoTop + "px";
            }
            break;

        case "Enter":

            if (!isItem) {
                let attack = madeAttack(false);
                attack();
            } else {
                let attack_hand = madeAttack(false);
                attack_hand();

                let attack_kick = madeAttack(true);
                attack_kick();
            }
            break;
    }
})
