var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                db.run(insert, ["user","user@example.com",md5("user123456")])
            }
        });  
    }
});

function findUserByCES(CES, cb) {
    console.log(CES);
    return  db.get(`SELECT * FROM users WHERE users_CES = ?`,[CES], (err, row) => {
            cb(err, row)
    });
}

function createUser(user, cb) {
    return  db.run('INSERT INTO users (users_CN, users_CES, users_password) VALUES (?,?,?)',user, (err) => {
        cb(err)
    });
}
module.exports = db
module.exports.findUserByCES = findUserByCES;
module.exports.createUser = createUser;
