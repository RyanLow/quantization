const slider = document.getElementById('slider')
const upload = document.getElementById('upload')
const download = document.getElementById('download')

let image = new Image('images/toledo.jpg')

slider.addEventListener('change', quantizeImage)
upload.addEventListener('change', changeImage)
download.addEventListener('click', downloadImage)

function quantizeImage(image, k) {
    let centroids = _.sample(image, k)
    while (true) {

    }

    return quantizedImage;
}

function changeImage() {

}

function downloadImage() {
    
}