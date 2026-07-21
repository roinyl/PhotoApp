const {
    Camera,
    CameraResultType,
    CameraSource,
    CameraDirection
} = Capacitor.Plugins;


let photoBase64 = null;


const cameraButton = document.getElementById("camera");
const uploadButton = document.getElementById("upload");
const preview = document.getElementById("preview");
const status = document.getElementById("status");



/*
    Ouverture caméra avant
*/

cameraButton.onclick = async () => {

    try {

        const photo = await Camera.getPhoto({

            quality: 80,

            source: CameraSource.Camera,

            direction: CameraDirection.Front,

            resultType: CameraResultType.DataUrl

        });


        // Affichage aperçu

        preview.src = photo.dataUrl;

        preview.style.display = "block";



        // Récupération du Base64 sans le préfixe

        photoBase64 =
            photo.dataUrl.split(",")[1];



        uploadButton.disabled = false;


        status.innerHTML =
            "✅ Photo prête";


    } catch (error) {

        console.error(error);

        status.innerHTML =
            "❌ Erreur caméra";

    }

};





/*
    Upload vers Raspberry Pi
*/

uploadButton.onclick = async () => {


    if (!photoBase64) {

        status.innerHTML =
            "Aucune photo";

        return;

    }



    status.innerHTML =
        "📤 Envoi en cours...";



    try {


        const response = await fetch(
            "https://photo.cybernyl.xyz/upload",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"

                },


                body: JSON.stringify({

                    image: photoBase64

                })

            }
        );



        const result =
            await response.json();



        if (result.success) {


            status.innerHTML =
                "✅ Envoyée : "
                + result.file;


        } else {


            status.innerHTML =
                "❌ Erreur serveur";


        }



    } catch (error) {


        console.error(error);


        status.innerHTML =
            "❌ Serveur inaccessible";


    }


};
