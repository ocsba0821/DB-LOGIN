const express = require('express')
const mysql = require('mysql')
const path = require('path')
const static = require('serve-static')

const pool = mysql.createPool({
    
    connectionLimit : 10,
    host : 
    user : 
    password : 
    database : 
    debug : false
    
})

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/public',static(path.join(__dirname, 'public')));

app.post('/process/login', (req,res)=>{

    const SVID = req.body.id;
    const SVPW = req.body.password;

    pool.getConnection((err,conn)=>{

        if(err){
           conn.release();
           return;
        }
            //'SELECT * FROM products WHERE products.id = ?', [id]
        const exec = conn.query('select users.id,users.password from users where users.id = ? and users.password = ? ',
        [SVID, SVPW],
        (err, result) =>{
            conn.release();


        if(err){
            console.log('sql문 오류')
            console.dir(err);
            res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                    res.write('<h2>없는 아이디 입니다.</h2>')
                    res.end();
            return

        }
        if (result.length>0){
            console.dir(result)
            console.log('로그인 성공')

            res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
            res.write("<script>alert('로그인 성공')</script>");
                    res.end();
                    return;
        }
        else{
            console.log('로그인 실패')
            res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                    res.write("<script>alert('아이디 또는 비밀번호가 틀렸습니다.')</script>");
                    res.end();
        }
        })
        
    })
})

app.listen(3020, ()=>{
    console.log('starting 3020 port');
}
)
