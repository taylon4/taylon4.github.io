
const container = document.querySelector('.container')
const widthBox = document.querySelector('.width')
const heightBox = document.querySelector('.width')
let width = heightBox.value
let height = heightBox.value
const color = document.querySelector('.color_select')
const clear = document.querySelector('.clear')
const download = document.querySelector('.download')
var mousehold = false;

function create_grid(width, height){
    if(width > 200){width = 200}
    if(height > 200){height = 200}
    
    container.style.setProperty("--w", width);
    container.style.setProperty("--h", height);
    
    //create all pixels on board
    for(let i = 0; i < width*height; i++){
        const div = document.createElement('div')
        div.classList.add('pixel')
        div.style.setProperty("--y", height - ~~(i/height)-1)
        div.style.setProperty("--x", i%width)
       
        //set them all to WHITE
        div.style.setProperty("--red",255)
        div.style.setProperty("--green",255)
        div.style.setProperty("--blue",255)

        div.addEventListener('mouseover', function(){
            if(mousehold){
                div.style.backgroundColor = color.value
                
                //write color to pixel
                var value = color.value.match(/[A-Za-z0-9]{2}/g);
                // ["XX", "XX", "XX"] -> [n, n, n]
                value = value.map(function(v) { return parseInt(v, 16) });
                // [n, n, n] -> rgb(n,n,n);
                //set the pixel rgb
                div.style.setProperty("--red",value[0])
                div.style.setProperty("--green",value[1])
                div.style.setProperty("--blue",value[2])
                //console.log(value[0])
            }
        })

        div.addEventListener('mousedown', function(){
            div.style.backgroundColor = color.value
            //write color to pixel
            var value = color.value.match(/[A-Za-z0-9]{2}/g);
            // ["XX", "XX", "XX"] -> [n, n, n]
            value = value.map(function(v) { return parseInt(v, 16) });
            // [n, n, n] -> rgb(n,n,n);
            //set the pixel rgb
            div.style.setProperty("--red",value[0])
            div.style.setProperty("--green",value[1])
            div.style.setProperty("--blue",value[2])
        })

        container.appendChild(div)
    }
}

//mouse hold events
window.addEventListener('mousedown', function(){
    mousehold = true;
});
window.addEventListener('mouseup', function(){
    mousehold = false;
});

function reset(){
    container.innerHTML = ''
    create_grid(width, height)
}

clear.addEventListener('click', function(){
    reset()
})

widthBox.addEventListener('keyup', function(){
    width = widthBox.value
    reset()
})
heightBox.addEventListener('keyup', function(){
    height = heightBox.value
    reset()
})

function random_board(){ //fill about 30% of the pixels with random values
    reset();
    let pixels = document.querySelectorAll('.pixel')
    for(let i = 0; i < pixels.length; i++){
        let decide = Math.random();
        if(decide < 0.3){ //only 30% of the time
            let r = ~~(56+Math.random()*200)
            let g = ~~(56+Math.random()*200)
            let b = ~~(56+Math.random()*200)
            pixels[i].style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
            pixels[i].style.setProperty("--red",r)
            pixels[i].style.setProperty("--green",g)
            pixels[i].style.setProperty("--blue",b)
        }
    }
}

document.querySelector(".random_board").addEventListener('click', random_board)

function download_pixels(){
    let pixels = document.querySelectorAll('.pixel')

    var text = ""
    text += "P6\n" + width + " " + height + "\n255\n"
    for(let h = 0; h < height; h++){
        for(let w = 0; w < width; w++){
            let i = h*width + w
            //console.log(i)
            let r = pixels[i].style.getPropertyValue("--red")
            let g = pixels[i].style.getPropertyValue("--green")
            let b = pixels[i].style.getPropertyValue("--blue")
            text += String.fromCharCode(r)
            text += String.fromCharCode(g)
            text += String.fromCharCode(b)
            //console.log(r + " " + g + " " + b)
            let x = pixels[i].style.getPropertyValue("--x")
            let y = pixels[i].style.getPropertyValue("--y")
            console.log(x + " " + y)
        }
    }
    
    blob = new Blob([text], {type:"image/x-portable-pixmap"});
    url = window.URL.createObjectURL(blob);


    var element = document.createElement('a')
    element.setAttribute('href', 'data:image/x-portable-pixmap;base64,' + btoa(text))
    
    var filename = "GFG.ppm";
    element.setAttribute('download', filename)
    document.body.appendChild(element)
    element.click()
}

download.addEventListener('click', function(){
    download_pixels()
})

function getPositiveAngleDiff(a, b){
    return a < b ? a+360-b : a-b
}

//num is a number between 0 and 1
function getRainbowRGB(num){
    let angle = num*360
    let rgb = []
    for(let i = 1; i <= 3; i++){
        let startAngle = ((i+1)*120)%360
        let diffFromStart = getPositiveAngleDiff(angle, startAngle)
        if(diffFromStart < 60){
            rgb[i-1] = ~~(diffFromStart/60*255)
        }
            
        else if (diffFromStart <= 180){
            rgb[i-1] = 255
        }
            
        else if (diffFromStart < 240){
            rgb[i-1] = ~~((240-diffFromStart)/60*255)
        }
        else{
            rgb[i-1] = 0
        }
            
    }
    return rgb
}

function rainbowify(){
    let pixels = document.querySelectorAll('.pixel')
    for(let i = width-1; i >= 0; i--){
        let num = (i)/width
        for(let j = 0; j < width; j++){
            let r = pixels[i*width+j].style.getPropertyValue("--red")
            let g = pixels[i*width+j].style.getPropertyValue("--green")
            let b = pixels[i*width+j].style.getPropertyValue("--blue")
            if(!(r==255 &&g==255&&b==255)){//if pixel is not white
                let rgb = getRainbowRGB(num)
                console.log(rgb)
                pixels[i*width+j].style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                pixels[i*width+j].style.setProperty("--red",rgb[0])
                pixels[i*width+j].style.setProperty("--green",rgb[1])
                pixels[i*width+j].style.setProperty("--blue",rgb[2])
            }
            
        }
    }
}

document.querySelector(".rainbow").addEventListener('click', rainbowify)

create_grid(width, height);