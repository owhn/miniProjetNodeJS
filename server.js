const express=require("express");
const app = express();
const PORT = 3000;

const socket=require("socket.io");


app.get('/', (req,res) =>{
  res.send('Hello World !');
});

app.get('/about', (req, res) => {
  res.send('Page À Propos');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenue sur mon API !', status: 'ok' });
});

app.listen(PORT, () => {                
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

