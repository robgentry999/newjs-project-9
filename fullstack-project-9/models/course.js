// Import "Sequelize"
const {Model, DataTypes} = require('sequelize')

// Initiate, extend and export the course modal from sequelize
module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Title-STRING,
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Title is required'
                },
                notEmpty: {
                    msg: "Please provide a Title"
                }
            }
        },
        // Description-TEXT
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Description is required'
                },
                notEmpty: {
                    msg: "Please provide a description"
                }
            }
        },
        // EstimatedTime-STRING
        estimatedTime: {
            type: DataTypes.STRING
        },
        // MaterialsNeeded-STRING
        materialsNeeded: {
            type: DataTypes.STRING
        },

    }, {sequelize});
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: "User",
            foreignKey: {
                fieldName: "userId",
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Please provide a UserID"
                    },
                    notEmpty: {
                        msg: "Please provide a UserID"
                    }
                }
            },

        })
    }
    return Course
}