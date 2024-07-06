import Desk from '../models/Desk.model.js';

export const createDesk = async (req, res) => {
  try {
    const { name } = req.body;

    const newDesk = new Desk({
      name: name,
    });

    newDesk
      .save()
      .then((result) =>
        res.status(201).send({
          message: 'Desk created successfully!',
          desk: result,
        })
      )
      .catch((error) => {
        res.status(500).send({
          error: 'Something went wrong while creating the desk: ' + error,
        });
      });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong createDesk: ' + error,
    });
  }
};

export const getDesks = async (req, res) => {
  try {
    Desk.find((err, desks) => {
      if (err) {
        return res.status(500).send({
          error: 'Something went wrong while fetching the desks: ' + err,
        });
      }

      if (!desks) {
        return res.status(404).send({
          error: 'No desks found',
        });
      }

      return res.status(200).send(desks);
    });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while fetching the getDesks: ' + error,
    });
  }
};
