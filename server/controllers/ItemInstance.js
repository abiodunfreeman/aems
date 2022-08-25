const debug = require('debug')('ItemInstance');
const User = require('../models/User');
const ItemInstance = require('../models/ItemInstance');
// @desc    Create an Item Instance
// @route   POST /iteminstance/new
// @access  Public
exports.createItemInstance = async (req, res, next) => {
  try {
    // pass user id and item id by req.body
    // console.log(req.body);
    res.status(200).json({});
  } catch (err) {
    console.log(`${err.message}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};
// @desc    Delete ItemInstace
// @route   PUT /item/instance/:id
// @access  Public
exports.deleteInstance = async (req, res, next) => {
  try {
    const deletedItem = await ItemInstance.findByIdAndDelete(
      req.params.id
    ).populate('item');
    res.status(200).json({ success: true, deletedItem });
  } catch (err) {
    console.log(`${err}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};
// @desc    Get all item instances
// @route   GET /iteminstance/all
// @access  Public
exports.getInstances = async (req, res, next) => {
  try {
    const itemInstances = await ItemInstance.find()
      .populate('owner')
      .populate({
        path: 'item',
        populate: { path: 'category', model: 'Category' },
      });

    itemInstances.forEach(async instance => {
      if (
        instance.owner === null ||
        instance.owner === undefined ||
        instance.item === null ||
        instance.item === undefined
      ) {
        let deletedInstances = await ItemInstance.findByIdAndDelete(
          instance._id
        );
      }
    });
    res.status(200).json({ success: true, itemInstances });
  } catch (err) {
    debug(`get instances error: ${err}`);
    res.status(400).json({ success: false, err: err.message });
  }
};
// @desc    post new note
// @route   post /iteminstance/:id
// @access  Public
exports.newNote = async (req, res, next) => {
  try {
    const instance = await ItemInstance.findByIdAndUpdate(
      req.body.instanceId,
      {
        $push: { notes: req.body.note },
      },
      { new: true }
    );

    res.status(200).json({ success: true, updatedInstance: instance });
  } catch (err) {
    console.log(`${err}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};
// @desc    delete a note
// @route   delete /iteminstance/notes/:id
// @access  Public
exports.deleteNote = async (req, res, next) => {
  try {
    const instance = await ItemInstance.findByIdAndUpdate(
      req.body.instanceId,
      { $pull: { notes: req.body.note } },
      { new: true }
    );
    res.status(200).json({ success: true, instance });
  } catch (err) {
    console.log(`${err}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.editInstanceOwner = async (req, res, next) => {
  try {
    const newOwner = await User.findById(req.body.owner);
    console.log(newOwner);
    const instance = await ItemInstance.findByIdAndUpdate(
      req.params.id,
      {
        owner: req.body.owner,
        $push: { notes: `reassigned to ${newOwner.username}` },
      },
      { new: true }
    ).populate('owner');

    res.status(200).json({ success: true, updatedInstance: instance });
  } catch (err) {
    console.log(`${err}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};
// @desc    change ItemInstance status
// @route   patch /iteminstance/status/:id
// @access  Public
exports.editStatus = async (req, res, next) => {
  try {
    const instance = await ItemInstance.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        $push: { notes: `status set to - ${req.body.status}` },
      },
      { new: true }
    );
    res.status(200).json({ success: true, updatedInstance: instance });
  } catch (err) {
    debug(`edit status err: ${err}`);
    res.status(400).json({ success: false, err: err.message });
  }
};
