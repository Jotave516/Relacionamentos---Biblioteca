const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const sequelize = require('./config/bd')
const methodOverride = require('method-override');


const Autor = require('./models/Autor.model')
const Livro = require('./models/Livro.model')
const Categoria = require('./models/Categoria.model')

require('./models/Relacionamentos.model')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.engine(
    'handlebars', 
    exphbs.engine( {defaultLayout: false} )
);

app.set(
    'view engine', 
    'handlebars'
);


app.get(
    '/',
    async(req,res) => {
        res.render('home')
    }
)

app.get(
    '/criar',
    async(req,res) => {
        await Autor.create({
            nome:'Dante'
        })
        await Autor.create({
            nome:'Shakespare'
        })
        await Autor.create({
            nome:'Graciliano Ramos'
        })
        await Autor.create({
            nome:'Oda'
        })
        await Autor.create({
            nome:'Jorge orwell'
        })
        await Categoria.create({
            nome:'Drama'
        })
        await Categoria.create({
            nome:'Comédia'
        })
        await Categoria.create({
            nome:'Sátira'
        })
        res.send('criado')
    }
)



app.get('/cadastrar', async(req,res) =>{
    const categorias = await Categoria.findAll({ raw: true });
    const autores = await Autor.findAll({ raw: true });
    res.render('cadastrar', { categorias, autores })
});

app.post('/cadastrar', async(req, res) => {
      try {
             const titulo = req.body.titulo;
             const anoPublicacao = req.body.anoPublicacao;
             const autorId = req.body.autorId;
             const categoriaIds = req.body.categoriaIds

            const livro = await Livro.create({
            titulo: titulo,
            anoPublicacao: anoPublicacao,
            AutorId: autorId,
            categoriaIds: categoriaIds
         });
         const idsDasCategorias = Array.isArray(categoriaIds)
                ? categoriaIds
                : [categoriaIds];
            await livro.setCategorias(idsDasCategorias);
            const livroComCategorias = await Livro.findByPk(livro.id, {
            include: { model: Categoria, as: 'categorias' }
        });
            res.send('Livro e categorias cadastrados com sucesso!')

        } catch (erro) {
            console.log('Erro ao inserir livro', erro)
            res.status(500).send('Erro ao inserir livro')
        }
    }
)

app.get('/listar', async (req, res) => {
    res.render('listarlivro')
})

app.get('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByPk(req.params.id, {
            include: [{ model: Categoria, as: 'categorias' }]
        })

        console.log('Livro encontrado:', livro.toJSON())
        res.send(livro.toJSON())
    } catch (erro) {
        console.error('Erro ao buscar livro:', erro)
        res.status(500).send('Erro ao buscar livro')
    }
})

async function conectarBD() {
    try{
        await sequelize.sync();
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
    }
}


conectarBD()

app.listen(
    3000,
    () => console.log('Servidor em execução')
)