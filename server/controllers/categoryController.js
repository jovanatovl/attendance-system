import Category from '../models/Category.model.js';

export const createCategory = async (req, res) => {
  try {
    const { name, bgClass, iconTag } = req.body;

    const newCategory = new Category({
      name: name,
      bgClass: bgClass,
      iconTag: iconTag,
    });

    newCategory
      .save()
      .then((result) =>
        res.status(201).send({
          message: 'Category created successfully!',
          category: result,
        })
      )
      .catch((error) => {
        res.status(500).send({
          error: 'Something went wrong while creating the category: ' + error,
        });
      });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong createCategory: ' + error,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    Category.find((err, categories) => {
      if (err) {
        return res.status(500).send({
          error: 'Something went wrong while fetching the categories: ' + err,
        });
      }

      if (!categories) {
        return res.status(404).send({
          error: 'No categories found',
        });
      }

      return res.status(200).send(categories);
    });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while fetching the getCategories: ' + error,
    });
  }
};
