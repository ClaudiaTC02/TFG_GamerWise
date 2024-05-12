import ListModel from '../models/ListModel.js';
import UserModel from "../models/UserModel.js";
import ListGameModel from "../models/ListGameModel.js";
import { where } from 'sequelize';

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// create a list
export async function createListLogic(name, description, user_id) {
    try {
        if (!name || !user_id) {
            throw new Error("Name and user_id are required");
        }
        if (!validateDataTypes({ name, description, user_id })) {
            throw new Error("Invalid data type");
        }
        if (!await validateUserExists(user_id)) {
            throw new Error("The user does not exist");
        }
        const newList = await ListModel.create({ name:name, description:description, user_id:user_id });
        return { success: true, newList };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// obtain all list from a user
export async function getAllListLogic(user_id) {
    try {
        if (!user_id) {
            throw new Error("User is required");
        }
        if (!await validateUserExists(user_id)) {
            throw new Error("User not found");
        }
        const allLists = await ListModel.findAll({ where: { user_id } });
        return { success: true, allLists };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// update an existing list
export async function updateListLogic(name, description, id) {
    try {
        if (!id) {
            throw new Error("Id is required");
        }
        if (!validateDataTypesUpdate({ name, description, id })) {
            throw new Error("Invalid data type");
        }
        const listToUpdate = await foundList(id);
        if (!listToUpdate) {
            throw new Error("List not found");
        }
        await ListModel.update({ name, description }, { where: { id } });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// deleting list
export async function deleteListLogic(id) {
    try {
        if (!id) {
            throw new Error("Id is required");
        }
        if (!validateDataTypes({ id })) {
            throw new Error("Invalid data type");
        }
        const listToDelete = await foundList(id);
        if (!listToDelete) {
            throw new Error("List not found");
        }
        await ListGameModel.destroy({ where: { list_id: id } });
        listToDelete.user_id = null;
        await ListModel.destroy({ where: { id } });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// obatin list
export async function getListLogic(id, user_id){
    try {
        if(!id || !user_id){
            throw new Error("Id is required");
        }
        if(!validateDataTypes({id, user_id})){
            throw new Error("Invalid data type");
        }
        const list = await ListModel.findOne({ where: { id: id, user_id: user_id } });
        if(!list){
            throw new Error("List not found")
        }
        return {success:true, list: list}
    } catch (error) {
        return { success: false, error: error.message };
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