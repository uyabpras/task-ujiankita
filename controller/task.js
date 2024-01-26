const {Error} = require('sequelize');
const db = require('../db/connect');
const taskDB = db.task;
const Op = db.Sequelize.Op;

exports.list = async (req, res) => {
    try {
        const page = req.query.page;
        const limit = parseInt(req.query.limit)|| 10;
        const offset = page * limit - limit;
        const whereClause = {};

        if (req.query.typeTask){
            whereClause.name = req.query.typeTask;
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

//using http.request
exports.add = async (req, res) => {
    try {
        console.log(JSON.stringify(req.body, null, 2));
        const addTask = {
            userID: req.body.userID,
            typeTask: req.body.typeTask,
            dataID: req.body.data,
            status: req.body.status || "pending",
        }
        console.log(addTask);

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


    } catch (err) {
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
                typeTask: req.body.typeTask,
                dataID: req.body.dataID,
                databak: find.toJSON(),
                status: req.body.status || "pending",
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
        // const updateBak =  taskDB.update(findID,{
        //     where: {
        //             id: req.body.id
        //             }
        // })
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
exports.editStatusBulk = async(req,res)=> {
    try {
        const result = await Task.update(
            { status: req.body.status },
            {
              where: {
                typeTask: req.body.typeTask,
                [Op.or]: [
                  { userId: req.body.userId }, // Jika identifier adalah userId, cocokkan berdasarkan userId
                  { id: {
                            [Op.in]: req.body.id 
                        }
                    }, // Jika identifier adalah id, cocokkan berdasarkan id
          
                ],
              },
            }
          );

          if (result[0] === 0) {
            return res.status(404).json({
              success: false,
              data: result,
              message: 'No rows updated. No matching records found.',
            });
          }
      
          res.status(200).json({
            success: true,
            data: result,
            message: 'Successfully updated status for matching records.',
          });
    } catch (err) {
        console.error(err);
        res.status(500).json({
        success: false,
        message: 'Error updating status.',
        error: err.message,
        });
    }
};

//using kafka client
exports.addTask = async (payload) => {
    try {
        console.log(payload);
      const newTask = {
        userID: payload.userID,
        typeTask: payload.typeTask,
        dataID: payload.data,
        status: payload.status || "pending",
    }
  
      const result = await taskDB.create(newTask);
  
      if (!result) {
        console.error('Failed creating task');
        return { success: false, message: 'Failed creating task' };
      } else {
        console.log('Success creating task:', result);
        return { success: true, data: result, message: 'Success creating task' };
      }
    } catch (error) {
      console.error('Error creating task:', error.message);
      return { success: false, message: 'Error creating task' };
    }
  };

  exports.getHealth = async(req, res) => {
    const data = {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date()
    }
  
    res.status(200).send(data);
  }