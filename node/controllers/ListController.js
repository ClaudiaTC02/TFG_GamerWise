//import Model
import ListModel from "../models/ListModel.js";
import UserModel from "../models/UserModel.js";
import ListGameModel from "../models/ListGameModel.js";

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// create a new list
export const createList = async (req, res) =>{
    try {
        let {name, description, user_id} = req.body;
        // validate if it has name and user_id
        if(!name || !user_id){
            return res.status(400).json({message:"Name and user_id are required"})
        }
        if (!validateDataTypes({name, description, user_id})) {
            return res.status(400).json({ message: "Invalid data type"})
        }
        if(!await validateUserExists(user_id)){
            return res.status(404).json({message: "The user does not exist"})
        }
        const newList = await ListModel.create({name: name, description: description, user_id: user_id})
        res.status(201).json({ message: "List created successfully", list: newList})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

// obtain all list from a user
export const getAllList = async (req, res) => {
    try {
        let { user_id } = req.params
        user_id = Number(user_id)
        if(!user_id){
            return res.status(400).json({message:"User is required"})
        }
        if(!await validateUserExists(user_id)){
            return res.status(404).json({ message: "User not found"})
        }
        const allLists = await ListModel.findAll({
            where: { user_id: user_id}
        })
        res.status(200).json(allLists)
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

// update an existing list
export const updateList = async (req, res) => {
    try {
        let {name, description} = req.body
        let {id} = req.params
        id = Number(id)
        if(!id){
            return res.status(400).json({message:"Id is required"})
        }
        if (!validateDataTypesUpdate({name, description, id})) {
            return res.status(400).json({ message: "Invalid data type"})
        }
        // find list
        const listToUpdate = await foundList(id)
        if(!listToUpdate){
            return res.status(404).json({message:"List not found"})
        }
        // update list
        await ListModel.update({name, description}, {
            where: {id: id}
        })
        res.status(200).json({message:"List updated successfully"})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

// deleting list
export const deleteList = async(req, res) =>{
    try {
        let {id} = req.params
        id = Number(id)
        if(!id) {
            return res.status(400).json({message:"Id is required"})
        }
        if(!validateDataTypes({id})){
            return res.status(400).json({ message: "Invalid data type"})
        }
        const listToDelete = await foundList(id)
        if(!listToDelete){
            return res.status(404).json({message:"List not found"})
        }
        // delete relation
        await ListGameModel.destroy({where:{list_id:id}})
        listToDelete.user_id = null
        
        await ListModel.destroy({where:{id:id}})
        res.status(200).json({message:"List deleted successfully"})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

//----------------------------------------------------------------------
// Modular functions
//----------------------------------------------------------------------
const validateDataTypes = (fields) => {
    const dataTypes = {
        name: "string",
        user_id: "number",
        id: "number",
        description: ["string", "undefined"]
    };
    for (let key in fields) {
        if (!dataTypes[key] || (typeof fields[key] !== dataTypes[key] && !dataTypes[key].includes(typeof fields[key]))) {
            return false;
        }
    }
    return true;
};

const validateDataTypesUpdate = (fields) => {
    const dataTypesUpdate = {
        name: ["string", "undefined"],
        user_id: "number",
        id: "number",
        description: ["string", "undefined"]
    };
    for (let key in fields) {
        if (!dataTypesUpdate[key] || (typeof fields[key] !== dataTypesUpdate[key] && !dataTypesUpdate[key].includes(typeof fields[key]))) {
            return false;
        }
    }
    return true;
};

const validateUserExists = async (user_id) => {
    const user = await UserModel.findByPk(user_id);
    return !!user; 
}

const foundList = async (list_id) => {
    const list = await ListModel.findByPk(list_id)
    return list
}