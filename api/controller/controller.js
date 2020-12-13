const express = require('express');
const { async } = require('q');
const db = require('../../dbConnection');
require('dotenv').config();
module.exports = {
  postRegisterNewUser: async(req, res) =>{
    const conn = await db();
    
      //res.redirect('');
    
      var f_name = req.user._json.given_name;
      var l_name = req.user._json.family_name;
      var email = req.user._json.email;
      
      try {
        await conn.query('START TRANSACTION');
        //const result = await conn.query('INSERT INTO users (f_name, l_name, email) VALUES (?, ?, ?)', [f_name, l_name, email]);
        const result1 = await conn.query('INSERT INTO users (f_name, l_name, email)SELECT * FROM (SELECT ?, ?, ?) AS tmp WHERE NOT EXISTS (SELECT email FROM users WHERE email = ?) LIMIT 1', [f_name, l_name, email, email]);

        await conn.query('COMMIT'); // this step is only when we make any changes in database
        const result2 = await conn.query(`SELECT * FROM users WHERE email = ?`, [email]);
        const result = {}
        result.result1 = result1;
        result.result2 = result2;
        res.type('json');
        res.status(200).json({
          success: 1,
          data: result,
        });
        } catch (err) {
          res.status(500).json({
            error: err,
          });
        } finally {
          await conn.release();
          await conn.destroy();
        }

      //console.log(req.user.name);
      //res.end('Logged in.');  
  },
  getProfile: async (req, res) => {
    const conn = await db();
    const body = req.body;
    try {
      await conn.query('START TRANSACTION');
      const result = await conn.query(`SELECT * FROM users WHERE email = ?`, [body.email])
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  },
  updatePassion: async (req, res) => {
    const conn = await db();
    const body = req.body;
    try {
      console.log(body.profession);
      console.log(body.interests);
      console.log(body.uid);

      await conn.query('START TRANSACTION');
      const result = await conn.query(`update \`users\` set \`interests\` = ?, \`profession\` = ? where  \`uid\` = ?`, [body.interests, body.profession, body.uid], );
      await conn.query('COMMIT'); // this step is only when we make any changes in database
      res.type('json');
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  },
  postNewRoadmap: async (req, res) => {
    const conn = await db();
    const body = req.body;
    try {
      console.log(body);

      await conn.query('START TRANSACTION');
      const result = await conn.query(`INSERT INTO roadmap (uid, title, category, motivation, deadline)
      VALUES (?, ?, ?, ?, ?)`,
        [
          body.uid,
          body.title,
          body.category,
          body.motivation,
          body.deadline
        ], );
      await conn.query('COMMIT'); // this step is only when we make any changes in database
      res.type('json');
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  },
  updateRoadmap: async (req, res) => {
    const conn = await db();
    const body = req.body;
    console.log(body.category);
    console.log(typeof (body.category));
    try {
      await conn.query('START TRANSACTION');
      const result = await conn.query(`UPDATE roadmap SET title = ?, category = ?, motivation = ?, deadline = ? WHERE uid = ?`,
        [
          body.title,
          body.category,
          body.motivation,
          body.deadline,
          body.uid
        ], );
      await conn.query('COMMIT'); // this step is only when we make any changes in database
      res.type('json');
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  },
  postRoadmapCheckpoints: async (req, res) => {
    const conn = await db();
    const body = req.body;
    let checkpoints = body.checkpoints

    try {

      let values = []
      for (checkpoint of checkpoints) {
        let v = `((Select rmid from roadmap where uid = ${body.uid}), ${body.uid}, ${checkpoint.rid}, ${checkpoint.sequence})`;
        values.push(v);
      }

      let query = `INSERT INTO roadmap_checkpoints (rmid, uid, rid, sequence) VALUES ${values.join(',')}  ON DUPLICATE KEY UPDATE rid = VALUES(rid)`;

      await conn.query('START TRANSACTION');
      const result = await conn.query(query);
      await conn.query('COMMIT'); // this step is only when we make any changes in database
      res.type('json');
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  },
  getRoadmapCheckpoints: async (req, res) => {
    const conn = await db();
    const body = req.body;
    const uid = body.uid
    try {
      await conn.query('START TRANSACTION');
      const result = await conn.query(` select r.*, c.* from resources r,  roadmap_checkpoints c where r.rid = c.rid and c.uid = ${uid} ORDER BY c.sequence`)
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  },
  getSuggestions: async (req, res) => {
    const conn = await db();
    const interests = req.body.interests
    try {
      await conn.query('START TRANSACTION');
      // var interests = `SELECT interests from users where uid = ${uid}`
      // var interests = "('web', 'ai')"
      const result = await conn.query(`SELECT * FROM \`resources\` WHERE \`type\` != \'article\' and category IN ${interests}`);
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  },
  getFeed: async (req, res) => {
    const conn = await db();
    const category = req.body.category
    try {
      await conn.query('START TRANSACTION');
      const result = await conn.query(`SELECT * FROM \`resources\` WHERE category = ?`, [category])
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  },
  updateSubmission: async (req, res) => {
    const conn = await db();
    const body = req.body;
    try {
      console.log(body)

      await conn.query('START TRANSACTION');
      const result = await conn.query(`UPDATE roadmap_checkpoints SET completion_date = SYSDATE(), completion_proof = ? WHERE rmid = (Select rmid from roadmap where uid = ?) and sequence = ?`,
       [
          body.completion_proof, 
          body.uid, 
          body.sequence
      ]);
      await conn.query('COMMIT'); // this step is only when we make any changes in database
      res.type('json');
      res.status(200).json({
        success: 1,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      await conn.release();
      await conn.destroy();
    }
  }
}