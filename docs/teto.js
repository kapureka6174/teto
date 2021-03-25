'use strict';

// 落ちるスピード
const GAME_SPEED = 500;

//　フィールドのサイズ
const FIELD_COL = 10;
const FIELD_ROW = 20;

// 1ブロックのサイズ（ピクセル）
const BLOCK_SIZE = 30;

// キャンバスのサイズ
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

// テトロミノのサイズ(4×4)
const TETRO_SIZE = 4;

// canvasのテンプレ
let can = document.getElementById("can");
let con = can.getContext("2d");

//　キャンバスの枠　表示
can.width = SCREEN_W;
can.height = SCREEN_H;
can.style.border = "4px solid #555";

//　テトリミノ本体（二次元配列）
const TETRO_COLORS = [
    "#666",//0空
    "#6CF",//1水色
    "#F92",//2オレンジ
    "#66F",//3青
    "#C5C",//4紫
    "#FD2",//5黄色
    "#F44",//6赤
    "#5B5"//7緑
]

const TETRO_TYPES =[
    [], //0.空
    [//1.I
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [//2.L
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [//3.J
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [//4.T
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [//5.O
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [//6.Z
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [//7.S
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ]
]

let tetro;

//　テトロミノの座標
const START_X = FIELD_COL/2 - TETRO_SIZE/2
const START_Y = 0;
let tetro_x = START_X;
let tetro_y = START_Y;

let tetro_shaddow_x;
let tetro_shaddow_y;

// フィールドのブロック一つ一つを初期化
let field = [];

// 7種1巡のカウント
let count = [1,2,3,4,5,6,7];
let countRandom;

// ゲームオーバーフラッグ
let over = false;

// 1~7をランダムに出す
let tetro_t;
tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
//countRandom = tetro_t;
tetro = TETRO_TYPES[tetro_t];

init();
drawAll();

let setTimer;

const startGame = () => {
    setTimer = setInterval(dropTetro, GAME_SPEED);
}

startGame();

const stopGame = () => {
    clearInterval(setTimer)
}


function init() {
    for (let y = 0; y < FIELD_ROW; y++) {
        
        // 二次元配列にしている
        field[y] = [];
    
        for (let x = 0; x < FIELD_COL; x++) {
            field[y][x] = 0;
        }
    } 
}

// ブロック一つを描画する
function drawBlock(x, y, c) {
    //　テトリミノの位置を計測
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;

    //　表示
    con.fillStyle = TETRO_COLORS[c];
    con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);

    //　テトリミノの枠線
    con.strokeStyle = "black";
    con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

function drawAll() {

    con.clearRect(0, 0, SCREEN_W, SCREEN_H);

    // フィールドを表示する
    for (let y = 0; y < FIELD_ROW; y++) {

        for (let x = 0; x < FIELD_COL; x++) {

            if (field[y][x]) {
                drawBlock(x, y, field[y][x]);
            }
        }
    }

    // テトリミノを表示する
    for (let y = 0; y < TETRO_SIZE; y++) {

        for (let x = 0; x < TETRO_SIZE; x++) {

            if (tetro[y][x]) {
                drawBlock(tetro_x + x, tetro_y + y, tetro_t);
            }
        }
    }

    // テトリミノのガイドを表示する
    tetro_shaddow_x = tetro_x;
    tetro_shaddow_y = tetro_y;
    while(checkMove(0,1)){
        tetro_y++;
    }
    [tetro_y, tetro_shaddow_y] = [tetro_shaddow_y, tetro_y];

    for (let y = 0; y < TETRO_SIZE; y++) {

        for (let x = 0; x < TETRO_SIZE; x++) {

            if (tetro[y][x]) {
                drawBlock(tetro_shaddow_x + x, tetro_shaddow_y + y, 0);
            }
        }
    }
    

    if( over ){
        let s = "GAME OVER";
        con.font = "40px 'MS ゴシック'";
        let w = con.measureText(s).width;
        let x = SCREEN_W/2 - w/2;
        let y = SCREEN_H/2 - 20;
        con.linWidth = 4;
        con.strokeText(s,x,y);
        con.fillStyle = "white";
        con.fillText(s,x,y);
    }



}

// 新しく移動する場所にブロックがあるかどうかの確認
function checkMove(mx,my, nTetro){

    if( nTetro == undefined ) nTetro = tetro;

    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            
            if (nTetro[y][x]) {
                let nx = tetro_x + mx + x;
                let ny = tetro_y + my + y;

                if (ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx]){
                    return false;
                }
            }
        }
    }
    return true;
}

//　テトロミノの回転
function rotate() {
    let nTetro = [];

    for (let y = 0; y < TETRO_SIZE; y++) {
        nTetro[y] = [];

        for (let x = 0; x < TETRO_SIZE; x++) {
            nTetro[y][x] = tetro[TETRO_SIZE-x-1][y];
        }
    }
    return nTetro;
}

//　テトリミノをフィールドに固定
function fixTetro() {
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (tetro[y][x]) {
                field[tetro_y + y][tetro_x + x] = tetro_t;
            }
        }
    }
}

//　ラインがそろったかどうかを確認する
function checkLine() {

    let linec = 0;

    for (let y = 0; y < FIELD_ROW; y++) {
        let flag = true;

        for (let x = 0; x < FIELD_COL; x++) {
            if (!field[y][x]) {
                flag = false;
                break;
            }
        }

        if (flag) {
            linec++;

            for (let ny = y; ny > 0; ny--) {
                for (let nx = 0; nx < FIELD_COL; nx++) {
                    field[ny][nx] = field[ny - 1][nx];
                }
            }
        }
    }

    
}

//　ブロックの落ちる処理
function dropTetro() {

    if (over) return;

    if (checkMove(0, 1)) tetro_y++;

    else {
        fixTetro();
        checkLine();
        
        if (count.length == 7){
            count.splice(tetro_t-1,1);
        }
        else{
            count.splice(countRandom ,1);
        }

        if (count.length == 0){
            count = [1,2,3,4,5,6,7];
        }
        countRandom = Math.floor(Math.random() * (count.length)) ;
        tetro_t = count[countRandom];
        tetro = TETRO_TYPES[tetro_t];
        tetro_x = START_X;
        tetro_y = START_Y;

        if ( !checkMove(0, 0)){
            over = true
        }
    }
    drawAll();
}

//　キーボードを押された時の処理
document.onkeydown = function (e) {

    if( over ) return;
    //　onkeydownのkeyCodeを調べよう

    switch( e.keyCode){
        case 37://左
            if(checkMove(-1,0)) tetro_x--;
            break;
        case 38://上
            let nTetro = rotate();
            if (checkMove(0, 0, nTetro)) tetro = rotate();
            break;
        case 39://右
            if (checkMove(1, 0)) tetro_x++;
            break;
        case 40://下
            if (checkMove(0, 1)) tetro_y++;
            break;
        case 32://スペース
            while(checkMove(0,1)){
                tetro_y++;
            }
            break;
    }

    drawAll();
}

function reset() {
    tetro_x = START_X;
    tetro_y = START_Y;

    over = false;

    drawAll();

    document.activeElement.blur();
}



function stop(){
    let stop = document.getElementById('stop');
    stop.classList.toggle('btn-square-shadow');
    if (stop.classList.contains('btn-square-shadow')){
        stop.textContent = "スタート";
        stopGame();
    }
    else{
        stop.textContent = "ストップ";
        startGame();
    }
}
