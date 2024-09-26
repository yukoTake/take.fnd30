'use strict'

const elmManArea = document.getElementById("main");
const elmMessage = document.getElementById("message");//メッセージ
const elmnekoArea = document.getElementById("neko");//ネコarea
const elmNeko = document.getElementById("img_neko");//ネコ
const elmNekoDead = document.getElementById("img_neko_dead")//ネコDead
const elmFish = document.getElementById("fish");
const elmUp = document.getElementById("img_up");//レベルアップ吹き出し
const elmItemMessage = document.getElementById("display_middle");//アイテム出現メッセージエリア

const elmStartBtn = document.getElementById("start");//スタートボタン
const elmKumo = document.getElementById("display_left")//左（雲）エリア

const elmWaniArea = document.getElementById("wani");//ワニ繁殖エリア
const waniAriaWidth = elmWaniArea.clientWidth;
const waniAriaHeight = elmWaniArea.clientHeight;


//Common----------------------------------------------------------
const elmMoveSec = 100
const timerLimit = 20;//制限時間(s)
const elmSize = 30;//ワニ・攻撃のサイズ
const itemElmSize = elmSize * 1.5;//アイテムサイズ
let getWani = 0;//獲得ワニ数
let time = 0 ;//残り時間
let isRes; //ゲーム結果
let isTimerMove = false;

//wani
const addLeftWani = 10;//ワニ進度(px)
const madeWaniSec = 1200;//ワニ算出頻度/s
const waniArr = [];
let waniCount = -1;

//Obake
const addYokoObake = 4;//おばけ揺れ幅(px)
const intObakeSec = 500;//おばけ揺れ頻度/s

//attack
const addLeftAtt = 25;
const attArr = [];
let addTopAtt = 10;
let attCount = -1;

//item(fish)
const addLeftItem = 15;//アイテム進度(px)
const itemArr= [];
let isItem;//true：アイテム取得
let intervalItem;

//neko
const nekoSize = 50;
const nekoBig = 1.7;//アイテムでネコサイズアップする時の比率
let elmNekoTop = 0;
setElm({elm: elmNeko, width: nekoSize});

const nekoMotoBackColor = elmnekoArea.style.background;
const nekoMotoBackSize = elmnekoArea.style.backgroundSize;

//fish,up
setElm({elm: elmFish, left: nekoSize * nekoBig - elmFish.clientWidth});
setElm({elm: elmUp, left: nekoSize * nekoBig});

//timer------------------------------------------------------------
const elmDisplayTimer = document.getElementById("display_timer")
const elmDisplayTime = document.getElementById("display_time");
const elmDisplayWani = document.getElementById("display_get");//獲得ワニ数表示エリア

setElm({elm: elmDisplayTime, text: "--"});
setElm({elm: elmDisplayWani, text: ""});

elmStartBtn.addEventListener('mousedown', function() {madeTimer()()}, false);


//TIMER
function madeTimer() {
    let intervalTimer;
    let madeWaniInterval;

    function startTimer() {
        if (!isTimerMove) {
            time = timerLimit;
            disableScroll();
            winCangeBackGround();
            resetArrElm();

            isTimerMove = true;
            isRes = true;
            isItem = false;
            getWani = 0;
            waniCount = -1;
            attCount = -1;

            setElm({elm: elmMessage, text: "ワニを撃退しよう、ヨシ", fontsize: 150});
            setElm({elm: elmNeko, width: nekoSize, height: nekoSize});
            setElm({elm: elmDisplayTime, text: time});
            setElm({elm: elmDisplayWani, text: getWani});

            intervalTimer = setInterval(moveTimer, 1000);
            madeWaniInterval = setInterval(function(){madeWani(1, 1)()}, madeWaniSec);
        }
    }

    function moveTimer() {
        if (time <= 1) {
            clearInterval(intervalTimer);
            clearInterval(madeWaniInterval);
            isTimerMove = false;
            time --;

            if (isRes) {
                time = 0;
                setElm({elm: elmDisplayTime, text: time});
                setElm({elm: elmMessage, text: "🩷YOU WIN🩷", fontsize: 300});
                winCangeBackGround();
            };


        } else {
            time -= 1;
            setElm({elm: elmDisplayTime, text: time});

            if (time === Math.floor(timerLimit * 0.8)) {
                setElm({elm: elmMessage, text: "ちょっとスピードアップするよ！"});
                clearInterval(madeWaniInterval);
                madeWaniInterval = setInterval(function(){madeWani(1.2)()}, Math.floor(madeWaniSec * 0.8))
                madeItem()();//アイテム算出

            } else if (time === Math.floor(timerLimit * 0.4)) {
                setElm({elm: elmMessage, text: "ワニ大増殖！！"});
                clearInterval(madeWaniInterval);
                madeWaniInterval = setInterval(function(){madeWani(1.2)()}, Math.floor(madeWaniSec * 0.5));
            }
        }
    }
    return startTimer;
}

function disableScroll() {
    // 現在の位置を保存
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    // スクロール位置を固定
    window.onscroll = function() {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

// スクロール無効化解除
function enableScroll() {
    window.onscroll = function() {};
  }

function winCangeBackGround() {
    if (isRes && time === 0) {
        const color = "red, orange, yellow, green, indigo, violet";
        let colors = "";
        for(let i = 0; i < 5; i++) {
            colors += color +", ";
        }
        colors = colors.slice(0, -2);

        elmnekoArea.style.background = `linear-gradient(25deg, ${colors})`;
        elmnekoArea.style.backgroundSize = "500% 500%";
        elmnekoArea.style.animation = "gradientFlow 5s forwards";
    } else {
        elmnekoArea.style.background = nekoMotoBackColor;
        elmnekoArea.style.backgroundSize = nekoMotoBackSize;
        elmnekoArea.style.animation = "none";
    }
}

//WANI------------------------------------------------------------
function madeWani(addLeft) {
    waniCount ++;
    const nowAddLeftWani = addLeftWani * addLeft;
    let elmLeft = 0;
    let elmTop = Math.floor(Math.random()*(waniAriaHeight - elmSize*2));
    let intervalWani;

    const thisWaniCount = waniCount;
    const newElm = document.createElement('div');

    function startWani() {
        newElm.id = "wani" + thisWaniCount;
        waniArr.push({id: thisWaniCount, left: elmLeft, top: elmTop});
        elmWaniArea.appendChild(newElm);
        intervalWani = setInterval(moveWani, elmMoveSec);

        setElm({elm: newElm, width: elmSize, height: elmSize, position: "absolute",
            transform: "scaleX(-1)", top: elmTop, left: 0, text: "🐊", fontsize: 130});
    }

    function moveWani() {

        if (waniArr[thisWaniCount] === null) {
            clearInterval(intervalWani);

        } else if (time <= 0 || elmLeft > waniAriaWidth - elmSize) {
            clearInterval(intervalWani);
            time = 0;

            if (elmLeft >= waniAriaWidth - elmSize) {
                isRes = false;
                time = 0;

                setElm({elm: newElm, text: "💀", fontsize: 200});
                setElm({elm: elmMessage, text: "🌚YOU LOSE🌚", fontsize: 300});
                setElm({elm: elmFish, visible: "hidden"});
                setElm({elm: elmUp, visible: "hidden"});
                setElm({elm: elmNeko, visible: "hidden"})
                madeDeadNeko()();
            }

        } else {
            if (elmLeft < waniAriaWidth) {
                elmLeft += nowAddLeftWani;
            }
            setElm({elm: newElm, top: elmTop, left: elmLeft});
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
        setElm({elm: elmNekoDead, top: elmTop, left: elmLeft, visible: "visible"})
        intervalDeadNeko = setInterval(moveDeadNeko, elmMoveSec);
    }

    function moveDeadNeko() {
        if (deadNekoCount > 25) {
            clearInterval(intervalDeadNeko);
        } else {
            elmTop -= 5;
            elmLeft += 2;
            setElm({elm: elmNekoDead, top: elmTop, left: elmLeft})
            deadNekoCount += 1;
        }
    }
    return startDeadNeko;
}

function resetArrElm() {
    const elmWanis = document.getElementById("wani").children;
    Array.from(elmWanis).forEach(elm => elm.remove());

    const elmDead = document.getElementById("display_left").children;
    Array.from(elmDead).forEach(elm => {
        if (elm.id.slice(0,4) == "dead") {
            elm.remove();
        }
    })

    waniArr.splice(0);
    attArr.splice(0);

    setElm({elm: elmNeko, visible: "visible"});
    setElm({elm: elmNekoDead, visible: "hidden"});
    setElm({elm: elmFish, visible: "hidden"});
    setElm({elm: elmItemMessage, visible: "hidden"});
}

//ATTACK---------------------------------------------------------
function madeAttack(isTop) {
    attCount ++;
    const elmTop = (isTop)? elmNekoTop + addTopAtt + 30 : elmNekoTop + addTopAtt;
    const newElm= document.createElement('div');
    const thisAttCount = attCount;
    let elmLeft = waniAriaWidth;
    let intervalAtt;

    function startAttack() {
        newElm.id = "att" + thisAttCount;
        elmWaniArea.appendChild(newElm);
        elmLeft -= addLeftAtt;
        intervalAtt =  setInterval(moveAttack, elmMoveSec);

        setElm({elm: newElm, top: elmTop, left: elmLeft, width: elmSize, height: elmSize,
            position: "absolute", text:'✨'})
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
                getWani ++;
                let deleteID = touchWani[0].id;
                touchWani[0] = waniArr.filter(elm => elm !== null && elm.id === deleteID)[0];
                setElm({elm: newElm, top: touchWani.top + addTopAtt, left: touchWani.left, text:'👻', fontsize: 200})
                setElm({elm: elmDisplayWani, text: getWani});
                waniArr[deleteID] = null;
                document.getElementById("wani" + deleteID).remove();

                setTimeout(function() {
                    clearInterval(intervalAtt);
                    newElm.remove();
                    attArr[thisAttCount] = null;
                    madeDeadWani(deleteID)();
                  }, 400);

            } else {
                //アイテムゲット時
                if (itemArr[0] !== undefined && itemArr[0].left >= elmLeft - 10 &&
                        itemArr[0].top > elmTop -itemElmSize/2  && itemArr[0].top < elmTop + itemElmSize/3) {

                    setElm({elm: newElm, top: itemArr[0].top + addTopAtt, left: itemArr[0].left, text:'🩷', fontsize: 200});
                    setElm({elm: elmFish, visible: "visible"});
                    setElm({elm: elmNeko, width: nekoSize * nekoBig, height: nekoSize * nekoBig});
                    setElm({elm: elmUp, visible: "visible"});
                    setElm({elm: elmItemMessage, visible: "hidden"});
                    isItem = true;
                    itemArr.splice(0);

                    document.getElementById("item0").remove();
                    clearInterval(intervalItem);
                    clearInterval(intervalAtt);
                    attArr[thisAttCount] = null;

                    setTimeout(function() {
                        newElm.remove();
                    }, 400);

                    setTimeout(function() {
                        setElm({elm: elmUp, visible: "hidden"});
                    }, 2500);
                }
            }
        }
            attArr[thisAttCount] = ({id: thisAttCount, left: elmLeft, top: elmTop});
        }
    return startAttack;
}

function madeDeadWani(ID) {
    const newElm = document.createElement('div');
    const elmTop = Math.floor(Math.random()*(elmKumo.clientHeight/5 * 3)) + elmKumo.clientHeight / 10;
    const elmLeft = Math.floor(Math.random()*(elmKumo.clientWidth/5 * 3)) + elmKumo.clientWidth / 10;
    let isLeft = true;
    let intervalDW;

    function startDeadWani() {
        newElm.id = "dead" +ID;
        elmKumo.appendChild(newElm);
        intervalDW =  setInterval(moveDeadWani, intObakeSec);
        setElm({elm: newElm, top: elmTop, left: elmLeft, width: elmSize, height: elmSize,
            position: "absolute", text: "👻", transform: "scaleX(-1)", fontsize: 150})
    }

    function moveDeadWani() {
        if (time <= 0 ) {
            clearInterval(intervalDW);
        } else {
            if (isLeft) {
                setElm({elm: newElm, left: elmLeft + addYokoObake});
                isLeft = false;
            } else {
                setElm({elm: newElm, left: elmLeft - addYokoObake});
                isLeft = true;
            }
        }
    }
    return startDeadWani;
}



//ITEM------------------------------------------------------------
function madeItem() {
    const elmTop = Math.floor(Math.random()*(waniAriaHeight - elmSize*2));
    const newElm = document.createElement('div');
    let elmLeft = 20;

    function starItem() {
        newElm.id = "item0";
        itemArr.push({id: 0, left: elmLeft, top: elmTop});
        elmWaniArea.appendChild(newElm);
        intervalItem = setInterval(moveItem, elmMoveSec);

        setElm({elm: elmItemMessage, visible: "visible"});
        setElm({elm: newElm, top: elmTop, left: elmLeft, width: elmSize * 0.5, height: elmSize * 0.5,
            position: "absolute", text: "🐟", transform: "scaleX(-1)", fontsize: 160})
            console.log(elmLeft)
    }

    function moveItem() {
        console.log(elmLeft)
        if (time <= 0 || elmLeft > waniAriaWidth - elmSize) {
            clearInterval(intervalItem);
            newElm.remove();
            itemArr.splice(0);
            setElm({elm: elmItemMessage, visible: "hidden"});

        } else {
            if (elmLeft < waniAriaWidth) {
                elmLeft += addLeftItem;
            }

            setElm({elm: newElm, left: elmLeft});
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
                setElm({elm: elmNeko, top: elmNekoTop});
                setElm({elm: elmFish, top: elmNekoTop + nekoSize/2 });
                setElm({elm: elmUp, top: elmNekoTop - nekoSize});

            }
            break;

        case "ArrowUp":
            if(elmNekoTop > 0) {
                elmNekoTop -= nekoMovePx
                setElm({elm: elmNeko, top: elmNekoTop});
                setElm({elm: elmFish, top: elmNekoTop + nekoSize/2 });
                setElm({elm: elmUp, top: elmNekoTop - nekoSize});

            }
            break;

        case "Enter":
            if (elmNeko.style.visibility === "visible") {
                if (!isItem) {
                    madeAttack(false)();
                } else {
                    madeAttack(false)();
                    madeAttack(true)();
                }
            }
            break;
    }
})

function setElm({elm, top, left, text, width, height, position, transform, fontsize, visible}) {
    if (top !== undefined) {elm.style.top = top + "px"}
    if (left !== undefined) {elm.style.left = left + "px"}
    if (text !== undefined) {elm.textContent = text}
    if (width !== undefined) {elm.style.width = width + "px"}
    if (height !== undefined) {elm.style.height = height + "px"}
    if (position !== undefined) {elm.style.position = position}
    if (transform !== undefined) {elm.style.transform = transform}
    if (fontsize !== undefined) {elm.style.fontSize = fontsize + "%"}
    if (visible !== undefined) {elm.style.visibility = visible}
}
