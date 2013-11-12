
/*
 * GET home page.
 */

module.exports = function(app){
  app.get('/',function(req,res){
    res.render('index', { title: 'Express' });
  });

  app.get('/login',function(req,res){
    res.render('login', { title: 'Express' });
  });

  app.get('/people',function(req,res){
    res.render('people', { title: 'Express' });
  });

  app.get('/setting',function(req,res){
    res.render('setting', { title: 'Express' });
  });

  app.get('/stock',function(req,res){
    res.render('stock', { title: 'Express' });
  });

};
