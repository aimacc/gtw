 const axios = require("axios")
const crypto = require("crypto")
const fs = require("fs")

// ==========================================
// DATABASE FILE
// ==========================================

const DB_FILE = "./trx.json"

if (!fs.existsSync(DB_FILE)) {
fs.writeFileSync(DB_FILE, JSON.stringify({}))
}

function loadDB() {
return JSON.parse(fs.readFileSync(DB_FILE))
}

function saveDB(data) {
fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

// ==========================================
// API KEY
// ==========================================

const APIKEY = "jp_99b59faac0459bb3c24bc011e3ea"

// ==========================================
// EXPORT ROUTE
// ==========================================

module.exports = function(app) {

// ==========================================
// PAYMENT ROUTE
// ==========================================

app.get("/payment", async (req, res) => {

const { action } = req.query

// ==========================================
// CREATE PAYMENT
// ==========================================

if (action === "create") {

try {

const nominal = parseInt(req.query.nominal)

if (!nominal) {
return res.status(400).json({
status: false,
message: "Masukkan nominal"
})
}

const random = Math.floor(Math.random() * 99) + 1
const amount = nominal + random

const trxid = crypto
.randomBytes(4)
.toString("hex")
.toUpperCase()

const { data } = await axios.get(
`https://jagopay.my.id/api.php?apikey=${APIKEY}&action=qris_dinamis&nominal=${amount}`
)

if (!data.status) {

return res.status(500).json({
status: false,
message: "Gagal membuat QRIS"
})

}

const qris =
data.data?.qris_url ||
data.data?.qr_image

// ==========================================
// LOAD DATABASE
// ==========================================

const db = loadDB()

// ==========================================
// SAVE TRANSACTION
// ==========================================

db[trxid] = {
trxid,
amount,
status: "PENDING",
expired: Date.now() + 300000
}

saveDB(db)

// ==========================================
// RESPONSE
// ==========================================

return res.status(200).json({
status: true,
result: {
trxid,
amount,
status: "PENDING",
expired: "5 Menit",
qris
}
})

} catch (e) {

console.log(e)

return res.status(500).json({
status: false,
message: "Internal server error"
})

}

}

// ==========================================
// CEK PAYMENT
// ==========================================

if (action === "cekpay") {

try {

const trxid = req.query.trxid

if (!trxid) {

return res.status(400).json({
status: false,
message: "Masukkan trxid"
})

}

// ==========================================
// LOAD DATABASE
// ==========================================

const db = loadDB()

const trx = db[trxid]

if (!trx) {

return res.status(404).json({
status: false,
message: "Transaksi tidak ditemukan"
})

}

// ==========================================
// EXPIRED CHECK
// ==========================================

if (Date.now() > trx.expired) {

delete db[trxid]

saveDB(db)

return res.status(400).json({
status: false,
message: "Transaksi expired"
})

}

// ==========================================
// GET MUTASI
// ==========================================

const { data } = await axios.get(
`https://jagopay.my.id/api.php?apikey=${APIKEY}&action=qris_mutasi&page=1`
)

if (!data.status) {

return res.status(500).json({
status: false,
message: "Gagal mengambil mutasi"
})

}

const mutasi = data.data?.mutasi || []

// ==========================================
// MATCH PAYMENT
// ==========================================

const cocok = mutasi.find(v => {

const kredit = parseInt(
String(v.kredit).replace(/\./g, "")
)

return kredit === trx.amount

})

// ==========================================
// PENDING
// ==========================================

if (!cocok) {

return res.status(200).json({
status: true,
result: {
trxid,
amount: trx.amount,
status: "PENDING"
}
})

}

// ==========================================
// DELETE PAID TRANSACTION
// ==========================================

delete db[trxid]

saveDB(db)

// ==========================================
// SUCCESS RESPONSE
// ==========================================

return res.status(200).json({
status: true,
result: {
trxid,
amount: trx.amount,
status: "PAID",
brand: cocok.brand?.name || "-",
tanggal: cocok.tanggal,
keterangan: cocok.keterangan
}
})

} catch (e) {

console.log(e)

return res.status(500).json({
status: false,
message: "Internal server error"
})

}

}

// ==========================================
// INVALID ACTION
// ==========================================

return res.status(400).json({
status: false,
message: "Action tidak valid"
})

})

}
