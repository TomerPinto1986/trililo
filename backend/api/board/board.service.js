const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy);
    // const sortBy = filterBy.sort ? { [filterBy.sort]: 1 } : {};
    const collection = await dbService.getCollection('board');
    try {
        // return await collection.find(criteria).sort(sortBy).toArray();
        return await collection.find(criteria).toArray();
    } catch (err) {
        console.log('ERROR: cannot find boards');
        throw err;
    }
}

async function getById(boardId) {
    const collection = await dbService.getCollection('board');
    try {
        return await collection.findOne({ '_id': ObjectId(boardId) });
    } catch (err) {
        console.log(`ERROR: while finding board ${boardId}`);
        throw err;
    }
}

async function remove(boardId) {
    const collection = await dbService.getCollection('board');
    try {
        await collection.deleteOne({ '_id': ObjectId(boardId) });
    } catch (err) {
        console.log(`ERROR: cannot remove board ${boardId}`);
        throw err;
    }
}

async function add(board) {
    console.log('board:', board)
    const collection = await dbService.getCollection('board');
    try {
        await collection.insertOne(board);
        return board;
    } catch (err) {
        console.log(`ERROR: cannot insert board`);
        throw err;
    }
}

async function update(board) {
    const collection = await dbService.getCollection('board');
    board._id = ObjectId(board._id);
    try {
        await collection.updateOne({ _id: board._id }, { $set: board });
        return board;
    } catch (err) {
        console.log(`ERROR: cannot update board ${board._id}`);
        throw err;
    }
}

module.exports = {
    query,
    getById,
    remove,
    add,
    update
};

// private functions

function _buildCriteria(filterBy) {
    const criteria = {};
    // if (filterBy.name) {
    //     criteria.name = { $regex: filterBy.name, $options: "$i" };
    // }
    // if (filterBy.type && filterBy.type !== 'all') {
    //     criteria.type = filterBy.type;
    // }
    // if (filterBy.inStock && filterBy.inStock !== 'all') {
    //     criteria.inStock = filterBy.inStock === 'true' ? true : false;
    // }
    return criteria;
}