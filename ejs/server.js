const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONTENEDOR
class Contenedor {

    LaId;
    listaOBJ = new Array();

    constructor(nombre){
        this.nombre = nombre;
        if(fs.existsSync(nombre)){
            this.listaOBJ = JSON.parse(fs.readFileSync(this.nombre, 'utf-8'));
            this.LaId = this.getId();
        }
        else {
            this.LaId = 1
            fs.writeFileSync(this.nombre, JSON.stringify([]));
        }

    }

    async getAll(){
        try{
            const contenido = await fs.promises.readFile(`./${this.nombre}`, 'utf-8')
            this.contenidoOBJ = JSON.parse (contenido)
            return this.contenidoOBJ;
            }
        catch (err) {
            console.log("error")
            }
    }

    async save(object) {
        try{
            object['id'] = this.LaId;
            this.LaId++;
            this.listaOBJ.push(object);
            await fs.promises.writeFile(this.nombre, JSON.stringify(this.listaOBJ, null, 2))
            console.log("El producto se guardo con la id: " + object.id)
            return Promise.resolve(object.id);
        }
        catch(error) {
            console.log(error)
        }
    }

    getId () {
        if (this.listaOBJ.length > 0) {
            let maxId = this.listaOBJ.reduce((acc,current) => {
                return Math.max(acc, current.id)
            }, 0)
            return maxId + 1;
        } else {
            return 1;
        }
    }
    
}

const productosContenedor = new Contenedor("productos.txt");


//PLANTILLAS
app.set("view engine", "ejs");

//GET
app.get("/productos", async (req, res) => {
  try {
    const productos = await productosContenedor.getAll();
    res.render("index", {
      pageTitle: "Desafio 05 - Ejs",
      productos: productos,
    });
  } catch (error) {
    console.log(error);
  }
});

//POST
app.post("/productos", async (req, res) => {
  try {
    const producto = req.body;
    await productosContenedor.save(producto);
    res.redirect("/productos");
  } catch (error) {
    console.log(error);
  }
});


let PORT = 8080;
const server = app.listen(PORT, () => console.log("Escuchando en " + PORT));