const {Error} = require('sequelize');
const db = require('../db/connect');
const taskDB = db.task;

exports.list = async (req, res) => {
    try {
        const page = req.query.page;
        const limit = parseInt(req.query.limit)|| 10;
        const offset = page * limit - limit;
        const whereClause = {};

        if (req.query.name){
            whereClause.name = req.query.name;
        }

        if(req.query.status){
            whereClause.status = req.query.status;
        }

        const result = await taskDB.findAndCount({
            where: whereClause,
            order: [["createdAt", req.query.order || "ASC"]],
            limit: limit,
            offset: offset
          });
        
        const totalpages = Math.ceil(result.count / limit);
        if (page > totalpages) {
            res.status(400).json({
              success: false,
              message: "Invalid page number, exceeds total pages.",
              totalpages: totalpages
            });
          } else {
            res.status(200).json({
              success: true,
              data: result.rows,
              totalpages: totalpages
            });
          }
    } catch (err) {
        res.status(500).send({
            message: err.message || "error getting task"
        });
    }
}

exports.get = async (req, res) => {
    try{
        const result = await taskDB.findByPk(req.params.id)
        if (!result) {
            res.status(404).send({ 
                success: false,
                data: null,
                message: "soal not task by id:" + req.params.id
            });
        } else {
            res.status(200).send({
                success: true,
                data: result,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "error getting task"
        });
    }
};

exports.add = async (req, res) => {
    try {
        const addTask = {
            userID: req.body.userID,
            name: req.body.name,
            typeTask: req.body.typeTask,
            data: req.body.data,
            status: req.body.status
        }

        const result = await taskDB.create(addTask)
        if(!result){
            res.status(400).send({
                success: false,
                message: "failed creating task",
                err: Error,
            });
        }else{
            res.status(200).send({
                success: true,
                data: result,
                message: "success creating task"
            });
        };


    } catch (error) {
        res.status(500).send({
            message: err.message || "error creating task"
        });
    }
};

exports.editTask = async (req, res) => { 
    try {
        const find = await taskDB.findByPk(req.body.id)
        if(!find){
            res.status(404).send({
                success: false,
                message: "task not found by id: " + req.body.id,
                err: Error,
            });
        }else{
            const updateTask = {
                userID: req.body.userID,
                name: req.body.name,
                typeTask: req.body.typeTask,
                dataID: req.body.dataID,
                databak: find.toJSON(),
                status: req.body.status
            }
            const updatedTask = taskDB.update(updateTask,{
                where:{
                    id: req.body.id}
                });
            if(!updatedTask){
                res.status(400).send({ 
                    success: false,
                    data: updatedModul,
                    message: "update task is failed by id:" + req.params.id,
                    error: err
                });
            };

            res.status(200).send({
                success: true,
                data: updatedTask,
                message: "successfully updated data by id:" + req.params.id
            });
        };
    } catch (err) {
        res.status(500).send({
            message: err.message || "error connect service"
        }); 
    }
};

exports.delete = async(req,res)=>{
    try {
        const findID = await taskDB.findByPk(req.params.id);
      // If no results found, return document not found
      if (!findID) {
        res.status(404).json({
          success: false,
          result: null,
          message: "No task found by this id: " + req.params.id,
        });
    }else{
        const result = await taskDB.destroy({where: {id: req.params.id}})
        res.status(200).json({
          success: true,
          data: result,
          message: "Successfully Deleted the task by id: " + req.params.id,
        });
    }  
    } catch (err) {
        res.status(500).send({
            message: err.message || "error connect service"
        }); 
    }
};