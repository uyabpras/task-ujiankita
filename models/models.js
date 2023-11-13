module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          typeTask: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          dataID: {
            type: DataTypes.JSON,
            allowNull: false
          },
          dataBak: {
            type: DataTypes.JSON,
            allowNull: true
          },
          status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          }
    })
};