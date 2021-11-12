import domready from "domready"
import "./style.css"

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

/**
 * @type CanvasRenderingContext2D
 */
let ctx;
let canvas;

const numSlices = 4;

function createNoiseSlices()
{
    const { width, height } = config;

    const noiseSlices = [];

    const sliceWidth = 0 | width * 1.25
    const sliceHeight = 0 | height / numSlices;

    for (let i=0; i < numSlices; i++)
    {
        const canvas = document.createElement("canvas");
        canvas.width = sliceWidth;
        canvas.height = sliceHeight;

        /**
         * @type CanvasRenderingContext2D
         */
        const ctx = canvas.getContext("2d");

        const imageData = ctx.createImageData(sliceWidth, sliceHeight);
        const { data } = imageData;

        let off = 0;
        for (let y = 0; y < sliceHeight; y++)
        {
            for (let x = 0; x < sliceWidth; x++)
            {
                const n = Math.random();
                const v = 160 + Math.floor(Math.pow(n, 0.7)* (256-160));

                data[off] = 255;
                data[off + 1] = 255;
                data[off + 2] = 255;
                data[off + 3] = v;

                off += 4;
            }
        }

        ctx.putImageData(imageData, 0, 0)

        noiseSlices.push(canvas);
    }

    return noiseSlices;
}

window.onload = (
    () => {



        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        //const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;


        const img = document.getElementById("img");
        const bg = document.getElementById("bg");
        let { width: w, height: h } = bg;
        bg.height = height;

        const width = w * height/h;

        config.width = width;
        config.height = height;


        let left = (0 | (window.innerWidth - width) / 2) + "px";
        canvas.style.left = left;
        bg.style.left = left;
        bg.className = ""

        canvas.width = width;
        canvas.height = height;


        const render = () => {

            ctx.globalCompositeOperation = "source-over"

            ctx.clearRect(0,0, width, height);

            ctx.drawImage(img, 0, 0, width, height)


            const sliceOffset = 0 | -width * 0.25
            const sliceHeight = 0 | height / numSlices;

            const mask = numSlices - 1;
            let y = 0 | -Math.random() * sliceHeight;
            let slice = 0 | Math.random() * numSlices;

            ctx.globalCompositeOperation = "destination-out"

            const noiseSlices = createNoiseSlices();

            for (let i=0; i <= numSlices; i++)
            {
                ctx.drawImage(noiseSlices[(slice +i) & mask], 0 | Math.random() * sliceOffset , y)
                y += sliceHeight;
            }

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }
);
