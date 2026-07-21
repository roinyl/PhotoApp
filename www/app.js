let photoBase64 = null;



const cameraButton =
    document.getElementById("camera");


const uploadButton =
    document.getElementById("upload");


const preview =
    document.getElementById("preview");


const status =
    document.getElementById("status");



/*
    Plugin caméra Capacitor
*/

const {
    Camera,
    CameraResultType,
    CameraSource

} = Capacitor.Plugins;



cameraButton.onclick = async () => {


    try {


        const photo =
            await Camera.getPhoto({

                quality: 80,

                source:
                    CameraSource.Camera,

                resultType:
                    CameraResultType.DataUrl

            });



        preview.src =
            photo.dataUrl;


        preview.style.display =
            "block";



        photoBase64 =
            photo.dataUrl.split(",")[1];



        uploadButton.disabled =
            false;



        status.innerHTML =
            "Photo prête";



    }

    catch(error) {


        console.error(error);


        status.innerHTML =
            "Erreur caméra";

    }


};




/*
    Upload Raspberry
*/


uploadButton.onclick = async () => {


    if(!photoBase64)
        return;



    status.innerHTML =
        "Envoi...";



    try {


        const response =
            await fetch(
                "https://photo.cybernyl.xyz/upload",
                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"

                    },


                    body:JSON.stringify({

                        image:
                        photoBase64

                    })

                });



        const result =
            await response.json();



        if(result.success){


            status.innerHTML =
                "✅ Envoyé : "
                + result.file;


        }

        else {


            status.innerHTML =
                "❌ Erreur serveur";

        }



    }

    catch(error){


        console.error(error);


        status.innerHTML =
            "❌ Serveur inaccessible";


    }


};
