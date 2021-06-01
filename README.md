# Image Quantization

Visit at https://ryanlow.me/quantization/.

This is an image quantization tool/visualizer that uses the k-nearest neighbors algorithm to display an image using a small number of colors. Image quantization is generally a data compression technique, but it can also be used to create images with cool visual effects.

The k-nearest neighbors algorithm uses the RGB colorings of the image pixels as datapoints. Centroids are selected at random from the image. When the algorithm terminates, the quantized image containing the centroid colors and cluster assignments is shown.

This program is written with the help of some JavaScript libraries. 😲