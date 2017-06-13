/*
    Mofi Scroll Bar
    Created by Goldis
    https://mofi.net.ua
    09.03.2017
    Version: 1.1.0
*/

const mofiScrollBarEvent = new Event('updateMofiScrollBar');
var mofiScrollBarInit = false;

/* Update Height Dragger */
function updateMofiScrollBar (el) {
    const scrollWrap = document.querySelector(el);

    if (!mofiScrollBarInit || !scrollWrap){
        console.error(`Wrong scroll element ${el}`);
        return false;
    };

    scrollWrap.dispatchEvent(mofiScrollBarEvent);
};


function mofiScrollBar (el) {
    const body = document.body;
    const scrollWrap = document.querySelector(el);

    if (!scrollWrap){
        console.error(`Wrong scroll element ${el}`);
        return false;
    };

    scrollWrap.classList.add('mofiScrollWrap');


    /* Set params */
    let draggerHeight = 0;
    let mouseDownY = null;
    let mouseMoveY = null;
    let scrollTop = null;
    let ratio = null;


    /* Get Content */
    const getContent = scrollWrap.innerHTML;
    scrollWrap.innerHTML = '';

    /* Creat Content Wrap */
    const createScrollBox = document.createElement('div');
    const createScrollmContainer = document.createElement('div');
    createScrollBox.classList.add('mofiScrollBox');
    createScrollmContainer.classList.add('mofiScrollContainer');

    /* Move Content */
    createScrollmContainer.innerHTML = getContent;

    createScrollBox.appendChild(createScrollmContainer);
    scrollWrap.appendChild(createScrollBox);


    /* Creat Scroll Bar */
    const createScrollBar = document.createElement('div');
    const createScrollDragger = document.createElement('div');
    createScrollBar.classList.add('mofiScrollBar');
    createScrollDragger.classList.add('mofiScrollDragger');

    createScrollBar.appendChild(createScrollDragger);
    scrollWrap.appendChild(createScrollBar);


    const scrollBar = scrollWrap.querySelector('.mofiScrollBar');
    var dragger = scrollWrap.querySelector('.mofiScrollDragger');

    if (!scrollBar || !dragger){
        console.error('Can NOT create a Scroll Bar');
        return false;
    };


    /* Select Content */
    const scrollBox = scrollWrap.querySelector('.mofiScrollBox');
    const content = scrollWrap.querySelector('.mofiScrollContainer');

    if (!scrollBox || !content){
        console.error('Can NOT select content');
        return false;
    };


    /* Set Position */
    function setPositionDragger () {
        let scrollValue = scrollBox.scrollTop;
        let percentValue = scrollValue / (content.clientHeight - scrollWrap.clientHeight);
        let topValue = (scrollWrap.clientHeight - draggerHeight) * percentValue;

        dragger.style.top = Math.floor(topValue) + 'px';
    }

    /* Set Height Dragger */
    function setHeightDragger (){
        ratio = scrollWrap.clientHeight / content.clientHeight;

        draggerHeight = Math.floor(scrollWrap.clientHeight * ratio);

        if (content.clientHeight < scrollWrap.clientHeight) {
            scrollBar.style.display = 'none';
            return false;
        } else {
            scrollBar.style.display = 'block';
            dragger.style.height = draggerHeight + 'px';
        }

        setPositionDragger();
    }

    /* MouseUp */
    function draggerMouseUp (){
        window.removeEventListener('mousemove', draggerMouseMove);
        window.removeEventListener('mouseup', draggerMouseUp);
        dragger.addEventListener('mousedown', draggerMouseDown);

        body.classList.remove('user-select');
    }

    /* Mouse Move */
    function draggerMouseMove (event){
        mouseMoveY = event.clientY;
        let mouseMove = mouseMoveY - mouseDownY;

        scrollBox.scrollTop = scrollTop + mouseMove / ratio;
    }

    /* Mouse Down */
    function draggerMouseDown (event){
        dragger.removeEventListener('mousedown', draggerMouseDown);
        window.addEventListener('mousemove', draggerMouseMove);
        window.addEventListener('mouseup', draggerMouseUp);

        body.classList.add('user-select');

        mouseDownY = event.clientY;
        scrollTop = scrollBox.scrollTop;
    }

    function installScrollBar (){
        mofiScrollBarInit = true;
        setHeightDragger();
    }

    installScrollBar();

    scrollBox.addEventListener('scroll', setPositionDragger);
    dragger.addEventListener('mousedown', draggerMouseDown);
    window.addEventListener('resize', installScrollBar);
    scrollWrap.addEventListener('updateMofiScrollBar', setHeightDragger);

};