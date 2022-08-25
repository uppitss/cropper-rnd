import React, {useEffect, useRef, useState} from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './App.css';

function App() {
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

    const countImageSize = () =>{
        if (croppedImage !== undefined){

            return ((croppedImage.length * 6 - "data:image/png;base64,".length * 8) / 8)/1024

            // const stringLength = croppedImage.length - 'data:image/png;base64,'.length;
            // const sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
            // return sizeInBytes/1024;
        }
        else {
            return undefined
        }
    }

    return (
        <>
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
                            <input type={"file"}
                                   accept="image/png, image/gif, image/jpeg"
                                   onChange={(e) => {
                                       if (e.target.files && e.target.files[0]) {
                                           const url = URL.createObjectURL(e.target.files[0]);
                                           setSrc(url);
                                       }
                                   }}/>
                        </div>

                        <div className={"button"}>
                            <input type={"button"}
                                   onClick={()=>{
                                       setCroppedImage(getCropper().getCroppedCanvas().toDataURL())
                                   }} value={"Применить"} />
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
                    <br />
                    <textarea style={{width: "100%", height: "100%"}} value={croppedImage}/>
                </div>
            </div>

        </>

    );
}

export default App;
