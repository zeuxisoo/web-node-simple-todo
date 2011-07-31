var config = require('../config'),
	date_utils = require('date-utils'),
	sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database(config.db.path);

var todo = {
	index: function(req, res) {			
		db.all("SELECT * FROM todo ORDER BY id DESC", function(err, row) {
			res.render('index', {
				todos: row,
				message: {
					error: req.flash('error'),
					success: req.flash('success')
				}
			});
		});
	},
	
	new: function(req, res) {
		var title = req.body.name || '',
			title = title.trim();
			
		if (title.length > 0) {
			db.prepare("INSERT INTO todo (topic, status, create_at) VALUES (?, ?, ?)").run(title, 0, new Date().toFormat("YYYY-MM-DD"));

			req.flash('success', '新增事項成功');
		}else{
			req.flash('error', '沒有輸入項目');
		}
		
		res.redirect('/');
	},
	
	finish: function(req, res) {
		var id = req.params.id;
		
		if (id.match(/^([0-9]+)$/)) {
			db.run("UPDATE todo SET status = 1 WHERE id = ?", [id]);
			
			req.flash('success', '完成事項成功');
		}else{
			req.flash('error', '找不到記錄');
		}
		
		res.redirect('/');
	},
	
	unfinish: function(req, res) {
		var id = req.params.id;
		
		if (id.match(/^([0-9]+)$/)) {
			db.run("UPDATE todo SET status = 0 WHERE id = ?", [id]);
			
			req.flash('success', '恢復事項成功');
		}else{
			req.flash('error', '找不到記錄');
		}
		
		res.redirect('/');
	},
	
	delete: function(req, res) {
		var id = req.params.id;
		
		if (id.match(/^([0-9]+)$/)) {
			db.run("DELETE FROM todo WHERE id = ?", [id]);
			
			req.flash('success', '刪除事項成功');
		}else{
			req.flash('error', '找不到記錄');
		}
		
		res.redirect('/');
	},
	
	edit: function(req, res) {
		var id = req.params.id;
		
		if (id.match(/^([0-9]+)$/)) {
			db.get("SELECT * FROM todo WHERE id = ?", [id], function(err, row) {
				res.render('edit', {
					todo: row
				});
			});
		}else{
			req.flash('error', '找不到記錄');
			res.redirect('/');
		}		
	},
	
	save: function(req, res) {
		var name = req.body.name || '',
			name = name.trim(),
			id = req.body.id;
		
		if (id.match(/^([0-9]+)$/) == false) {
			req.flash('error', '找不到記錄');
		}else if (name.length <= 0) {
			req.flash('error', '沒有輸入項目');
		}else{
			db.prepare("UPDATE todo SET topic = ? WHERE id = ?").run(name, id);
			req.flash('success', '編輯事項成功');
		}
		
		res.redirect('/');
	}
}

module.exports = todo;