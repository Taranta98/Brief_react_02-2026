
//Assegno al tipo della response da parte del backend 2 diverse tipologie di ritorno che vado a gestire in base al success:TRUE/FALSE
export type BackendResponse<T> = {
    success: true;
    timestamp: string;
    data : T;
    
} | {
    success: false;
    timestamp: string;
    message: string;
}

//Funzione per gestire le chiamate api dove gestisco l'URL e gli eventuali messaggi di errore 
export async function myFetch<T>(input : RequestInfo | URL , init? : RequestInit) {

   try {
     const res = await fetch(input,init);
     const resJson: BackendResponse<T> = await res.json();
     if(!resJson.success){
         throw new Error(resJson.message)
     }
 
     return resJson.data
   } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Errore generico');
   }
    
}
