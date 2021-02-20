/* 設定 */
const config = {
    YT: {
        width: window.innerWidth / 2,
        height: (window.innerHeight - 60) / 2,
        loadingPlayerNumber: 0,
        playerList: [],
        dataList: [{
            id: '',
            area: 'player1'
        }, {
            id: '',
            area: 'player2'
        }, {
            id: '',
            area: 'player3'
        }, {
            id: '',
            area: 'player4'
        }]
    }
}
const playPause = document.getElementById('play_pause');
const mute = document.getElementById('mute');
const volume = document.getElementById('volume');

/* YouTube IFrame Player API */

// 初期化
function initPlayer() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

// 動画生成
function onYouTubeIframeAPIReady() {
    for (let i = 0; i < config.YT.dataList.length; i++) {
        config.YT.playerList[i] = new YT.Player(config.YT.dataList[i]['area'], {
            width: config.YT.width,
            height: config.YT.height,
            videoId: config.YT.dataList[i]['id'],
            playerVars: {
                playsinline: 1,           // インライン再生
                autoplay: 1,              // 自動再生
                loop: 1,                  // ループ有効
                controls: 1,              // コントロールバー非表示
                enablejsapi: 1,           // JavaScript API 有効
                modestbranding: 1,        // yutubeロゴの非表示
                iv_load_policy: 3,        // 動画アノテーションを表示しない
                disablekb: 1,             // キーボード操作OFF
                rel: 1                    // 再生終了時に関連動画を表示しない
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    }
}

// 読み込み完了
function onPlayerReady(e) {
    for (let i = 0; i < config.YT.dataList.length; i++) {
        if (e.target.getIframe().id == config.YT.dataList[i]['area']) {
            config.YT.playerList[i].mute();
            config.YT.playerList[i].playVideo();
        }
    };
}

/* イベント */

// 音量設定
volume.addEventListener('click', () => setVolume(volume.value));
function setVolume(value) {
    for (let i = 0; i < config.YT.dataList.length; i++) {
        config.YT.playerList[i].setVolume(value);
    }
};

// 再生・一時停止設定
playPause.addEventListener('click', () => {
    for (let i = 0; i < config.YT.dataList.length; i++) {
        if (config.YT.playerList[i].getPlayerState() === 1) {
            config.YT.playerList[i].pauseVideo();
            button_ani('pause');
        } else {
            config.YT.playerList[i].playVideo();
            button_ani('play');
        }
    }
});

// 消音設定
mute.addEventListener('click', () => {
    for (let i = 0; i < config.YT.dataList.length; i++) {
        if (config.YT.playerList[i].isMuted()) {
            config.YT.playerList[i].unMute();
            volume.value = config.YT.playerList[i].getVolume();
            button_ani('unMute');
        } else {
            config.YT.playerList[i].mute();
            volume.value = 0;
            button_ani('mute');
        }
    }
});

// リサイズ
window.onresize = () => {
    for (let i = 0; i < config.YT.dataList.length; i++) {
        config.YT.playerList[i].setSize(window.innerWidth / 2, (window.innerHeight - 60) / 2);
    };
};

function resizePlayer() {

}

// URL設定
document.body.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const input = document.activeElement;
        config.YT.loadingPlayerNumber = Number(input.className.substring(6, 7)); // 現在読込中のPlayer番号
        const id = input.value.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i); // YouTubeの正規表現
        input.value = '';

        // URLが正しくない時
        if (!id) {
            alert('正しいURLを入力して下さい');
            return;
        }

        // URLが正しい時
        config.YT.dataList[config.YT.loadingPlayerNumber - 1]['id'] = id[1]; // Playerにidを追加

        // 全てのURLを追加した時
        if (config.YT.dataList[0]['id'] &&
            config.YT.dataList[1]['id'] &&
            config.YT.dataList[2]['id'] &&
            config.YT.dataList[3]['id'])
        {
            initPlayer();
            return;
        }

        // 追加後
        const span = document.createElement('span');
        span.innerHTML = '登録完了！<br>他のプレイヤーのURLを入力して下さい';
        document.getElementById(`player${config.YT.loadingPlayerNumber}`).appendChild(span);
        input.remove();
    }
});

/* ボタンアニメーション */
function button_ani(type) {
    const funcs = {

        play() { 
            const e = document.getElementsByClassName('play_pause_svg')[0];
            e.setAttribute('xlink:href', './assets/img/graphics.svg#pause');
        },

        pause() { 
            const e = document.getElementsByClassName('play_pause_svg')[0];
            e.setAttribute('xlink:href', './assets/img/graphics.svg#play');
        },

        mute() { 
            const e = document.getElementsByClassName('mute_svg')[0];
            e.insertAdjacentHTML('beforeend', '<use xlink:href="./assets/img/graphics.svg#mute"></use>');
        },

        unMute() {
            const e = document.getElementsByClassName('mute_svg')[0];
            e.innerHTML = '<use xlink:href="./assets/img/graphics.svg#volume_up"></use>';
        }

    }

    funcs[type]();
}