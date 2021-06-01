/* Preset variables */
const MAX_K = 128
const INITIAL_IMG = 'images/antelope_canyon.png'

/* DOM elements */
const kbox = document.getElementById('kbox')
const quantize = document.getElementById('quantize')
const reset = document.getElementById('reset')
const upload = document.getElementById('upload')
const download = document.getElementById('download')
const status = document.getElementById('status')
const output = document.getElementById('output')
const ctx = output.getContext('2d')

/* Event listeners */
quantize.addEventListener('click', () => {
    status.style.visibility = 'visible'
    setTimeout(quantizeImage, 0)
})
reset.addEventListener('click', resetImage)
upload.addEventListener('change', changeImage)
download.addEventListener('click', downloadImage)

/* Load initial image into canvas, stores original of image being quantized */
let rawImage = drawImage(INITIAL_IMG)

function drawImage(src) {
    let img = new Image()
    img.src = src
    img.onload = () => {
        output.width = img.width
        output.height = img.height
        ctx.drawImage(img, 0, 0)
    }

    return img
}

function validateKValue(k) {
    let message = undefined

    if (!Number.isInteger(k) || k < 1) {
        message = 'Invalid value for k (must be a positive integer)'
    } else if (k > MAX_K) {
        message = `Please choose a smaller value for k (${MAX_K} or less)`
    }

    if (message) {
        alert(message)
        status.style.visibility = 'hidden'
        throw new Error(message)
    }

    return k
}

function nearestNeighbor(point, centroids) {
    let min = Infinity
    let argMin = undefined

    for (let i = 0; i < centroids.length; i++) {
        let c = centroids[i]
        let dist = 0

        for (let j = 0; j < 4; j++) {
            dist += Math.pow(point[j] - c[j], 2)
        }

        if (dist < min) {
            min = dist
            argMin = i
        }
    }

    return argMin
}

function computeCentroid(cluster) {
    let centroid = Array(4).fill(0)

    for (let elem of cluster) {
        for (let i = 0; i < 4; i++) {
            centroid[i] += elem[i]
        }
    }

    return centroid.map(x => x / cluster.length)
}

function quantizeImage() {
    let k = validateKValue(Number(kbox.value))
    ctx.drawImage(rawImage, 0, 0)
    imageData = ctx.getImageData(0, 0, output.width, output.height)
    let pixels = _.chunk(imageData.data, 4)
    let centroids = _.sampleSize(pixels, k)
    
    while (true) {
        let clusters = Array(k).fill().map(x => [])
        let assignments = []

        for (let p of pixels) {
            let assignment = nearestNeighbor(p, centroids)
            clusters[assignment].push(p)
            assignments.push(assignment)
        }

        let newCentroids = clusters.map(computeCentroid)

        if (_.isEqual(centroids, newCentroids)) {
            imageData.data.set(assignments.map(a => centroids[a]).flat())
            ctx.putImageData(imageData, 0, 0)
            status.style.visibility = 'hidden'
            break;
        }

        centroids = newCentroids
    }
}

function resetImage() {
    ctx.drawImage(rawImage, 0, 0)
}

function changeImage() {
    rawImage = drawImage(URL.createObjectURL(this.files[0]))
}

function downloadImage() {
    let a = document.createElement('a')
    a.download = 'quantized_image.png'
    a.href = output.toDataURL()
    a.click()
}