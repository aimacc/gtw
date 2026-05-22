const axios = require("axios")
const crypto = require("crypto")

global.dbtrx = global.dbtrx || {}

const APIKEY = "jp_99b59faac0459bb3c24bc011e3ea"

module.exports = function(app) {

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
error: "Masukkan nominal"
})
}

const random = Math.floor(Math.random() * 99) + 1
const amount = nominal + random

const trxid = crypto.randomBytes(4).toString("hex").toUpperCase()

const { data } = await axios.get(
`https://jagopay.my.id/api.php?apikey=${APIKEY}&action=qris_dinamis&nominal=${amount}`
)

if (!data.status) {
return res.status(500).json({
status: false,
error: "Gagal membuat QRIS"
})
}

const qris = data.data?.qris_url || data.data?.qr_image

global.dbtrx[trxid] = {
trxid,
amount,
status: "PENDING",
expired: Date.now() + 300000
}

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

return res.status(500).json({
status: false,
error: e.message
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
error: "Masukkan trxid"
})
}

const trx = global.dbtrx[trxid]

if (!trx) {
return res.status(404).json({
status: false,
error: "Transaksi tidak ditemukan"
})
}

if (Date.now() > trx.expired) {

delete global.dbtrx[trxid]

return res.status(400).json({
status: false,
error: "Transaksi expired"
})

}

const { data } = await axios.get(
`https://jagopay.my.id/api.php?apikey=${APIKEY}&action=qris_mutasi&page=1`
)

const mutasi = data.data?.mutasi || []

const cocok = mutasi.find(v => {

const kredit = parseInt(
String(v.kredit).replace(/\./g, "")
)

return kredit === trx.amount

})

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

delete global.dbtrx[trxid]

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

return res.status(500).json({
status: false,
error: e.message
})

}

}

return res.status(400).json({
status: false,
error: "Action tidak valid"
})

})

  }
