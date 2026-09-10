const sequelize = require('../config/bd');

const Autor = require('./Autor.model');
const Livro = require('./Livro.model');
const Categoria = require('./Categoria.model')

Autor.hasMany(Livro, {
  foreignKey: 'AutorId',
  as: 'livros'
});

Livro.belongsTo(Autor, {
  foreignKey: 'AutorId',
  as: 'autor'
});


Categoria.belongsToMany(
    Livro, {
        through: 'CategoriaDoLivro',
        foreignKey: 'categoriaId',
        as: 'livros'
    }
)

Livro.belongsToMany(
    Categoria, {
        through: 'CategoriaDoLivro',
        foreignKey: 'livroId',
        as: 'categorias'
    }
)


module.exports = {
    Autor,
    Livro,
    Categoria
}