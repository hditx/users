const controller = {}
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('users.db', sqlite3.OPEN_READWRITE , (err) => {
    if(err) return console.error(err)
})

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error(err.message)
            } else {
                resolve(rows)
            }
        })
    })
}

function get(sql, params = []) {
    return new Promise(((resolve, reject) => {
        db.get(sql,params, (err, row) => {
            if(err){
                return console.error(err.message)
            } else {
                resolve(row)
            }
        })
    }))
}

controller.getAll = async (req, res) => {
    let rows = await all('SELECT * FROM users', [])
    res.render('users', {
        data: rows
    })
}

controller.delete = (req, res) => {
    const id = req.params.id
    const sql = 'DELETE FROM users WHERE id = ?'
    db.run(sql, [id], (err) => {
        if (err) console.error(err.message)
        res.redirect('/')
    })
}

controller.save = (req, res) => {
    const { name, last_name, dni, birth_day } = req.body
    const sql = 'INSERT INTO users(name, last_name, dni, birth_day) VALUES (?, ?, ? ,?)'
    db.run(sql, [name, last_name, dni, birth_day], (err) => {
        if (err) console.error(err.message)
    })
    res.redirect('/')
}

controller.edit = async (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM users WHERE id = ?'
    let row = await get(sql, id)
    res.render('user_edit', {
        data: row
    })
}

controller.update = (req, res) => {
    const id = req.params.id
    const { name, last_name, dni, birth_day } = req.body
    db.run('UPDATE users set name = ?, last_name = ?, dni = ?, birth_day = ?  WHERE id = ?', [name, last_name, dni, birth_day, id], (err) => {
        if(err) console.error(err.message)
        res.redirect('/')
    })

}

controller.find = async (req, res) => {
    let { name, last_name, first_date, last_date } = req.body
    let param = []
    let sql = "SELECT * FROM users WHERE id is not null "
    if (name != null && name != '') {
        sql += "and lower(name) LIKE lower( ? ) "
        name = "%" + name + "%"
        param.push(name)
    }
    if (last_name != null && last_name != '') {
        sql += "and lower(last_name) LIKE lower( ? ) "
        last_name = "%" + last_name + "%"
        param.push(last_name)
    }
    if (first_date != null && first_date != '' && (last_date == null || last_date == '')) {
        sql += "and birth_day >= ?"
        param.push(first_date)
    }
    if (last_date != null && last_date != '' && (first_date == null || first_date == '')) {
        sql += "and birth_day <= ?"
        param.push(last_date)
    }
    if (last_date != null && last_date != '' && first_date != null && first_date != ''){
        sql += "and birth_day between ? and ?"
        param.push(first_date)
        param.push(last_date)
    }
    let rows = await all(sql, param)
    res.render('users', {
        data: rows
    })
}

module.exports = controller