import * as sqlite from 'expo-sqlite';

export async function initDB(){
	const db = sqlite.openDatabase('main');
	await db.execAsync([
		{sql:'CREATE TABLE IF NOT EXISTS category(title TEXT NOT NULL, color TEXT NOT NULL)',args:[]},
		{sql:'CREATE TABLE IF NOT EXISTS task(title TEXT NOT NULL, note TEXT DEFAULT ?, done INTEGER DEFAULT 0, rank INTEGER NOT NULL, catid INTEGER NOT NULL, FOREIGN KEY(catid) REFERENCES category(rowid))',args:['',]},
		{sql:'CREATE TABLE IF NOT EXISTS archived(date TEXT, gratitude TEXT, tasks TEXT)',args:[]},
	],false);
	db.closeAsync();
}