import { conn } from '../database.js';

export async function getAllWines() {
  console.log("Fetching all wines from database");
  const sql = 'SELECT * FROM wines';
  const [rows] = await conn.query(sql);
  return rows;
}

export async function getWineById(wineId) {
  const sql = 'SELECT * FROM wines WHERE id = ?';
  const [rows] = await conn.query(sql, [wineId]);
  return rows[0];
}

export async function createWine(wineData) {
  const sql = 'INSERT INTO wines (name, vintage, quantity, price) VALUES (?, ?, ?, ?)';
  console.log("Inserting: " + wineData)
  const { name, vintage, quantity, price } = wineData;
  const [result] = await conn.query(sql, [name, vintage, quantity, price]);
  return result.insertId;
}

export async function updateWine(wineId, wineData) {
  const sql = 'UPDATE wines SET name = ?, vintage = ?, quantity = ?, price = ? WHERE id = ?';
  const { name, vintage, quantity, price } = wineData;
  const [result] = await conn.query(sql, [name, vintage, quantity, price, wineId]);
  return result.affectedRows;
}

export async function deleteWine(wineId) {
  const sql = 'DELETE FROM wines WHERE id = ?';
  const [result] = await conn.query(sql, [wineId]);
  return result.affectedRows;
}

/*module.exports = {
  getAllWines,
  getWineById,
  createWine,
  updateWine,
  deleteWine
}; */