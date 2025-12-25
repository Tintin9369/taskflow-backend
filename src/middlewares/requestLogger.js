export default function logger(req, res, next){
    console.log('middleware start');
    
    console.log("la méthode utilisée est :", req.method);
    console.log("l'URL appelée est :", req.url);
    console.log("date et heure de la requête : ", new Date().toISOString());
    
    next();
    console.log('middleware end');
}