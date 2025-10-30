import {toast} from "react-toastify";

export function toastResponseError(response : Response | undefined) {
    if(response === undefined) {
        toast.error("Erreur de connexion avec le serveur");
    } else if(!response.ok) {
        toast.error("Erreur inattendue HTTP Status : " + response.status);
    }
}

export function toastSearchNotFound() {
    toast.warning("Aucun résultat");
}