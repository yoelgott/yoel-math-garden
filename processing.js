var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS-new/model.json');
};


function predictImage() {
    // console.log('processing...');
    
    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect);

    let height = image.rows;
    let width = image.cols;
    
    if (height > width) {
        width = Math.round(width / (height / 20));
        height = 20;
    } else {
        height = Math.round(height / (width / 20));
        width = 20;
    };

    let dsize = new cv.Size(width, height);
    // You can try more different parameters
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (20 - width)/2);
    const RIGHT = Math.floor(4 + (20 - width)/2);
    const TOP = Math.ceil(4 + (20 - height)/2);
    const BOTTOM = Math.floor(4 + (20 - height)/2);
    // console.log(`top: ${TOP}, bottom: ${BOTTOM}, left: ${LEFT}, roght: ${RIGHT}`);
    
    let s = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, s);

    // Centre of Mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);

    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;
    // console.log(`M00 ${Moments.m00}, cx: ${cx}, cy: ${cy}`);

    const x_shift = Math.round(image.cols/2.0 - cx);
    const y_shift = Math.round(image.rows/2.0 - cy);
    
    let newSize = new cv.Size(image.cols, image.rows)
    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, x_shift, 0, 1, y_shift]);
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, s);

    let pixelValues = image.data;
    pixelValues = Float32Array.from(pixelValues);
    pixelValues = pixelValues.map(function (value) {
        return value / 255.0;
    });
    
    // console.log(pixelValues);
    const X = tf.tensor([pixelValues]);
    // console.log(`Shape of tensor: ${X.shape}`);
    // console.log(`dtype of tensor: ${X.dtype}`);

    const result = model.predict(X);
    result.print();
    
    const output = result.dataSync()[0];

    // Testing Only
    // const outputCanvas = document.createElement('CANVAS');
    // cv.imshow(outputCanvas, image);
    // document.body.appendChild(outputCanvas);

    //Cleanup
    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete();
    X.dispose();
    result.dispose();

    return output;
};