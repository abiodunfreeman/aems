const Category = require('../models/Category');
const Item = require('../models/Item');
// @desc    Create a new Category
// @route   POST /category/new
// @access  Public
exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    console.log(`${err}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};
// @desc    View All Categories
// @route   GET /category/all
// @access  Public
exports.viewCategories = async (req, res, next) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json(allCategories);
  } catch (err) {
    console.log(`${err}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};
// @desc    View One Category
// @route   GET /category/:name
// @access  Public
exports.viewOneCategory = async (req, res, next) => {
  try {
    const oneCategory = await Category.findOne({ name: req.params.name });
    res.status(200).json(oneCategory);
  } catch (err) {
    console.log(`${err}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};
// @desc    Delete One Category
// @route   DELETE /category/:name
// @access  Public
exports.deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.name);
    const deletedItems = await Item.deleteMany({
      category: deletedCategory._id,
    });
    res.status(200).json({ success: true, deletedCategory });
  } catch (err) {
    console.log(`${err}`.red);
    res.status(400).json({ success: false, err: err.message });
  }
};