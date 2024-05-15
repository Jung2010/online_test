let tick = 0;
let beforeTime = new Date();
const display = domId('display');
const pixel = 50;
let goSec = 5;// go (goSec)px / 1 second
let dats = [];
let fpsLogs = [];
let target = 0;
let minTick = 15;
let direction = 'north';
const objs = {
    Tree : {
        size: 2
    },
    Player : {
        size: 1
    }
};
let camera = {
    x: 0,
    y: 0
};
const setMaxFps = (x)=>{
    minTick = 1000/x;
};
(async function load() {
    try {
        if (new Date() - beforeTime <= minTick) {
            setTimeout(load, minTick - (new Date() - beforeTime));
            return;
        }
        let historys;
        dats = await getFetch('datas.json').then(async (r) => {
            return r;
        });

        const keys = {
            left: kpf(37),
            up: kpf(38),
            right: kpf(39),
            down: kpf(40)
        };
        const speed = tick * (goSec/1000);
        if (keys.left) {
            direction = 'west';
            moveX(target, -speed,{
                noCollide: true
            });
        } else if (keys.right) {
            direction = 'east';
            moveX(target, speed,{
                noCollide: true
            });
        } else if (keys.up) {
            direction = 'north';
            moveY(target, -speed,{
                noCollide: true
            });
        } else if (keys.down) {
            direction = 'south';
            moveY(target, speed,{
                noCollide: true
            });
        }

        frames(dats);
        tick = new Date() - beforeTime;
        beforeTime = new Date();

        const pane = domId('pane');
        const fps = Math.round(1000 / tick);
        const maxFps = Math.round(1000 / minTick);
        fpsLogs.push(fps);
        const averageFps = Math.round(fpsLogs.sum() / fpsLogs.length);

        pane.html(`
        <div>
            TARGET : ${target} <br>
            FPS : ${fps} <br>
            Tick_Rate : ${tick} <br>
            Maximum_FPS : ${maxFps} ( ${Math.round(minTick)}t/s ) 
            <button class='noBackground' onmouseup='setMaxFps(prompt("Input Value"))'>Set</button>
            <br>
            Average_FPS : ${averageFps} <br>
            Player_SPEED : ${goSec} px/s <br>
            Direction : ${direction} <br>
            <meter max='${maxFps}' value='${fps}' low='30' optimum='40'></meter>
        </div>
        <div>
            ${dats.reduce((html,dat,index)=>{
                return html+`
                <p style='${index===target?'color:royalblue;':''}'>
                    ${dat.type}(${index}) : ( ${Math.round(dat.x)}, ${Math.round(dat.y)})
                    ${index===target?`
                    ←
                    `:dat.type==='Player'?(`
                    <button class='changeBtn noBackground' onmouseup='target=${index};'>
                      ↺
                    </button>
                    `):``}
                </p>
                `;
            },'')}
        </div>
        `);

        load();
    } catch (e) {
        console.log(e);
        load();
    }
})();
const frames = (dats) => {
    const px = pixel;
    let ballWidth = 1;
    const targetObj = dats[target];
    camera.x = targetObj.x - window.innerWidth/ px / 2;
    camera.y = targetObj.y - window.innerHeight/ px / 2;
    display.innerHTML = '';
    display.innerHTML = (dats.reduce((pre, cur, index) => {
        const thisDat = {...cur};
        let {type} = thisDat;
        if(objs[type]?.size!==undefined)ballWidth=objs[type].size;
        thisDat.x -= camera.x;
        thisDat.y -= camera.y;
        thisDat.x *= px;
        thisDat.y *= px;
        let html = '';
        if(type === 'Player') {
            html = `
            <div class='ballLabel'
            style='
            ${index===target?'color:royalblue;':''}
            left: ${thisDat.x}px;
            top: ${thisDat.y-20}px;
            width: ${ballWidth*px}px;
            text-align: center;
            '
            >${index}</div>
            <div class='ball' style='
            ${index===target?'background:royalblue;':''}
            left: ${thisDat.x}px;
            top: ${thisDat.y}px;
            width: ${ballWidth*px}px;
            height: ${ballWidth*px}px;
            ' ></div>
            `
        } else if(type === 'Tree') {
            html = `
            <div class='tree' style='
            left: ${thisDat.x}px;
            top: ${thisDat.y}px;
            width: ${ballWidth*px}px;
            height: ${ballWidth*px}px;
            ' ></div>
            `
        }
        return pre + html;
    }, ''))
}
const moveY = async (target, value, option) => {
    const thisTarget = {
        ...dats[target]
    };
    const clonedDats = [
        ...dats
    ];
    thisTarget.y += value;
    clonedDats[target] = null;
    const crackExpected = (clonedDats.reduce((pre,cur)=>{
        if(cur === null) return pre;
        const size = objs[thisTarget.type]?.size;
        const curSize = objs[cur.type]?.size;
        return [...pre,isColliding({
            ...thisTarget,
            w: size, h: size
        },
        {
            ...cur,
            w: curSize, h: curSize
        })]
    },[]).some((v)=>v));
    if(option?.noCollide&&crackExpected) {
        const decreasing = clonedDats.reduce((pre,cur)=>{
            if(cur === null) return pre;
            const size = objs[thisTarget.type]?.size;
            const curSize = objs[cur.type]?.size;
            const overLap = getOverlapRatio({
                ...thisTarget,
                w: size, h: size
            },
            {
                ...cur,
                w: curSize, h: curSize
            },'y');
            return overLap>pre?overLap:pre;
        },0);
        thisTarget.y+=decreasing*(value<0?1:-1);
        console.log(decreasing);
    }
    return await tp(target,thisTarget);
}
const moveX = async (target, value, option) => {
    const thisTarget = {
        ...dats[target]
    };
    const clonedDats = [
        ...dats
    ];
    thisTarget.x += value;
    clonedDats[target] = null;
    const crackExpected = (clonedDats.reduce((pre,cur)=>{
        if(cur === null) return pre;
        const size = objs[thisTarget.type]?.size;
        const curSize = objs[cur.type]?.size;
        return [...pre,isColliding({
            ...thisTarget,
            w: size, h: size
        },
        {
            ...cur,
            w: curSize, h: curSize
        })]
    },[]).some((v)=>v));
    if(option?.noCollide&&crackExpected) {
        const decreasing = clonedDats.reduce((pre,cur)=>{
            if(cur === null) return pre;
            const size = objs[thisTarget.type]?.size;
            const curSize = objs[cur.type]?.size;
            const overLap = getOverlapRatio({
                ...thisTarget,
                w: size, h: size
            },
            {
                ...cur,
                w: curSize, h: curSize
            },'x');
            return overLap>pre?overLap:pre;
        },0);
        thisTarget.x+=decreasing*(value<0?1:-1);
        console.log(decreasing);
    }
    thisTarget.x += value;
    return await tp(target,thisTarget);
}
const tp = async (target,dat) => {
    return await fetch(`behave.php?target=${target}&&dat=${dat.json()}`);
}
const reset = () => {
    try {
        fetch('reset.php');
    } catch (e) {
        console.log('Failed to Reset\nReason:' + e);
    }
}
domQ('body').addEventListener('keydown', (e) => {
    const devP = domId('developerPane');
    if (e.key === 'D') {
        if (devP.style.display === 'none') {
            devP.style.display = 'inline-block';
        } else {
            devP.style.display = 'none';
        }
    }
});