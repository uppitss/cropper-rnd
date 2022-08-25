import React, {useEffect, useRef, useState} from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './App.css';

function App() {

    const [graySrc, setGraySrc] = useState('')

    const [src, setSrc] = useState("https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg")
    const [rotateTo, setRotateTo] = useState(0)
    const [zoom, setZoom] = useState<number | undefined>(undefined)

    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);


    const cropperRef = useRef<HTMLImageElement>(null);

    const getCropper = () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        return cropper
    }

    useEffect(() => {
        getCropper().rotateTo(rotateTo)
    }, [rotateTo])

    useEffect(() => {
        if (zoom !== undefined) {
            getCropper().zoomTo(zoom)
        }
    }, [zoom])


    // const onCrop = () => {
    //     const imageElement: any = cropperRef?.current;
    //     const cropper: any = imageElement?.cropper;
    //     setCroppedImage(cropper.getCroppedCanvas().toDataURL())
    // };

    const countImageSize = () => {
        if (croppedImage !== undefined) {

            return ((croppedImage.length * 6 - "data:image/png;base64,".length * 8) / 8) / 1024

            // const stringLength = croppedImage.length - 'data:image/png;base64,'.length;
            // const sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
            // return sizeInBytes/1024;
        } else {
            return undefined
        }
    }

    var imageGrayscale = require('image-filter-grayscale');
    var imageFilterCore = require('image-filter-core')
    var nWorkers = 4;


    // const b64toBlob = (b64Data:string, contentType='', sliceSize=512) => {
    //     const byteCharacters = Buffer.from(b64Data,'base64');
    //     //atob(b64Data);
    //     const byteArrays = [];
    //
    //     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //         const slice = byteCharacters.slice(offset, offset + sliceSize);
    //
    //         const byteNumbers = new Array(slice.length);
    //         for (let i = 0; i < slice.length; i++) {
    //             byteNumbers[i] = slice.charCodeAt(i);
    //         }
    //
    //         const byteArray = new Uint8Array(byteNumbers);
    //         byteArrays.push(byteArray);
    //     }
    //
    //     const blob = new Blob(byteArrays, {type: contentType});
    //     return blob;
    // }

    function handleImage(e: React.ChangeEvent<HTMLInputElement>): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (e.target.files && e.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (event) {

                    resolve(this.result as string)
                    // var img = new Image();
                    // img.onload = function () {
                    //     canvas.width = img.width;
                    //     canvas.height = img.height;
                    //     ctx.drawImage(img, 0, 0);
                    // }
                    // img.src = event.target.result;
                }
                reader.readAsDataURL(e.target.files[0]);
            } else {
                reject()
            }
        })
    }

    return (
        <>
            <img src={graySrc}/>
            <div className={"preview_container"}>
                <div className={"preview_image"}>
                    <Cropper
                        src={src}
                        style={{height: 400, width: "100%"}}
                        // Cropper.js options
                        initialAspectRatio={16 / 9}
                        guides={true}
                        //crop={onCrop}
                        ref={cropperRef}
                    />
                </div>
                <div className={"preview_code"}>
                    <div className={"preview_container"} style={{padding: "20px"}}>
                        <div className={"button"}>
                            <input type={"button"} onClick={() => {
                                setRotateTo(prev => prev - 10)

                            }} value={"Вращать влево"}/>
                        </div>
                        <div className={"button"}>
                            <input type={"button"} onClick={() => {
                                setRotateTo(prev => prev + 10)

                            }} value={"Вращать вправо"}/>
                        </div>

                        <div className={"button"}>
                            <input type={"button"} onClick={() => {
                                setZoom(prev => (prev !== undefined ? prev : 0) + 0.1)
                            }} value={"Zoom +"}/>
                        </div>
                        <div className={"button"}>
                            <input type={"button"} onClick={() => {
                                setZoom(prev => (prev !== undefined ? prev : 1) - 0.1)
                            }} value={"Zoom -"}/>
                        </div>
                        <div className={"button"}>
                            Цвет
                            <input type={"file"}
                                   accept="image/png, image/gif, image/jpeg"
                                   onChange={(e) => {
                                       handleImage(e).then((base64Image) => {
                                           setSrc(prev => base64Image)
                                       });
                                   }
                                   }/>
                        </div>
                        <div className={"button"}>
                            Монохром
                            <input type={"file"}
                                   accept="image/png, image/gif, image/jpeg"
                                   onChange={(e) => {

                                       handleImage(e).then((base64Image) => {
                                           var img = new Image();
                                           img.src = base64Image;
                                           img.onload = (e) => {
                                               const width = img.width;
                                               const height = img.height;
                                               var canvas = document.createElement('canvas');
                                               canvas.width = width;
                                               canvas.height = height;
                                               var context = canvas.getContext('2d');
                                               if (context) {
                                                   context.drawImage(img, 0, 0);
                                                   var imageData = context.getImageData(0, 0, width, height);
                                                   (imageGrayscale(imageData, nWorkers) as Promise<any>).then((result) => {
                                                       let grayImg = imageFilterCore.convertImageDataToCanvasURL(result)
                                                       setSrc(prev => grayImg)
                                                   })
                                               }
                                           }
                                       });
                                   }}/>
                        </div>

                        <div className={"button"}>
                            <input type={"button"}
                                   onClick={() => {
                                       setCroppedImage(getCropper().getCroppedCanvas().toDataURL())
                                   }} value={"Применить"}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={"preview_container"}>
                <div className={"preview_image"}>
                    <img src={croppedImage} width={"100%"}/>
                </div>
                <div className={"preview_code"}>
                    <div>
                        Размер: {countImageSize()} кБ
                    </div>
                    <br/>
                    <textarea style={{width: "100%", height: "100%"}} value={croppedImage}/>
                </div>
            </div>

        </>

    );
}

export default App;
