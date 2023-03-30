const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'testegama',
  password: 'testegama123'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
  
  connection.query('CREATE DATABASE IF NOT EXISTS meu_banco_de_dados', (err) => {
    if (err) {
      console.error('Erro ao criar o banco de dados: ', err);
      return;
    }
    console.log('Banco de dados criado com sucesso!');
    
    connection.query(`
      CREATE TABLE IF NOT EXISTS hardwares (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        categoria VARCHAR(255) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        descricao TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela: ', err);
        return;
      }
      console.log('Tabela criada com sucesso!');
    });
  });
});

// Aqui você pode definir as rotas da API que utilizarão a conexão com o MySQL



const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Configuração do MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'senha',
  database: 'my_ecommerce'
});

// Analisa o corpo das requisições como JSON
router.use(bodyParser.json());

// Lista todos os produtos
router.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
});

// Cria um novo produto
router.post('/products', (req, res) => {
  const product = req.body;
  db.query('INSERT INTO products SET ?', product, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      product.id = result.insertId;
      res.json(product);
    }
  });
});

// Retorna um produto pelo ID
router.get('/products/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM products WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (results.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(results[0]);
    }
  });
});

// Atualiza um produto pelo ID
router.put('/products/:id', (req, res) => {
  const id = req.params.id;
  const product = req.body;
  db.query('UPDATE products SET ? WHERE id = ?', [product, id], (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.json(product);
    }
  });
});

// Deleta um produto pelo ID
router.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM products WHERE id = ?', id, (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    });
  });
  

