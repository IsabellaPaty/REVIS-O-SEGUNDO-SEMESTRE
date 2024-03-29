const express = require('express');
const bodyParser = require('body-parser');
const ejs = require ('ejs');
const app = express();
const mysql = require('mysql2');
const session = require('express-session');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'ALUNO',
  database: 'forrozinho',
  });
  //

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida.');
});

//
app.use(
  session({
  secret: 'ALUNO',
  resave: true,
  saveUninitialized: true,
  })
  );
  //


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home'); // Renderiza a tela de inicio
 
});

app.get('/contanto', (req, res) => {
  res.render('contanto'); // Renderiza a tela de inicio
 
});

app.get('/sobre', (req, res) => {
  res.render('sobre.ejs'); // Renderiza a tela de inicio
 
});

app.get('/login', (req, res) => {
  res.render('login.ejs'); // Renderiza a tela de inicio
 
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro.ejs'); // Renderiza a tela de inicio
 
});

app.get('/postagens', (req, res) => {

  db.query('SELECT * FROM Postagens', (err, result) => {
    if (err) throw err;
    res.render('postagens.ejs', { Postagens: result}); // Renderiza a tela de inicio
 
  })
});
//
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
  if (err) throw err;
  
  if (results.length > 0) {
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('/home');
  } else {
    res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
    }
    });
    });
  
  
  // Rota para a página do painel
  app.get('/dash', (req, res) => {
    res.render('dash'); // Renderiza a tela de inicio
  
  //
  //
  //
  //modificação aqui
  if (req.session.loggedin) {
  //res.send(`Bem-vindo, ${req.session.username}!<br><a href="/logout">Sair</a>`);
  res.sendFile(__dirname + '/views/dash.ejs');
  } else {
  res.send('Faça login para acessar esta página. <a href="/">Login</a>');
  }
  });
  
  // Rota para fazer logout
  app.get('/logout', (req, res) => {
  req.session.destroy(() => {
  res.redirect('/');
  });
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
    if (err) throw err;
    
    if (results.length > 0) {
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('/dash');
    } else {
    res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
    }
    });
    });

    // CREATE
app.post('/submit_post', (req, res) => {
  const { mensagens } = req.body;
  const sql = 'INSERT INTO Postagens (mensagens) VALUES (?)';
  db.query(sql, [mensagens], (err, result) => {
    if (err) {
      console.error('Erro ao inserir postagem:', err);
      res.redirect('/'); // Redireciona de volta ao formulário de cadastro em caso de erro
    } else {
      // Cadastro bem-sucedido; você pode redirecionar para a página de login ou outra página.
      res.redirect('/');
    }
  });
});

app.post('/cadastro', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      res.redirect('/cadastro'); // Redireciona de volta ao formulário de cadastro em caso de erro
    } else {
      // Cadastro bem-sucedido; você pode redirecionar para a página de login ou outra página.
      res.redirect('/');
    }
  });
});

// DELETE
app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.redirect('/postagens');
  });
});

// DELETE
app.get('/deletePost/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Postagens WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.redirect('/postagens');
  });
});





// Rota para a página do painel
app.get('/dash', (req, res) => {

  //modificação aqui
  if (req.session.loggedin) {
    //res.send(`Bem-vindo, ${req.session.username}!<br><a href="/logout">Sair</a>`);
    res.sendFile(__dirname + '/views/dash.html');
  } else {
    res.send('Faça login para acessar esta página. <a href="/">Login</a>');
  }
});
  
  // Rota para fazer logout
  app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
  
    
      


const port = 3005;
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
