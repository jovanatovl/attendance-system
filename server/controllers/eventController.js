import Event from '../models/Event.model.js';

// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { title, description, creator, category, date, slot, desk } =
      req.body;

    const newEvent = new Event({
      title: title,
      description: description,
      creator: creator,
      category: category,
      date: date,
      slot: slot,
      desk: desk,
    });

    newEvent
      .save()
      .then((result) =>
        res.status(201).send({
          message: 'Event created successfully!',
          event: result,
        })
      )
      .catch((error) => {
        res.status(500).send({
          error: 'Something went wrong while creating the event: ' + error,
        });
      });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong createEvent: ' + error,
    });
  }
};

// GET /api/events
export const getEvents = async (req, res) => {
  const { creator, date } = req.query;

  try {
    const events = await Event.find({ creator: creator, date: date })
      .sort([['slot', 1]])
      .populate('creator')
      .populate('desk')
      .populate('category')
      .exec();

    if (!events) {
      return res.status(404).send({
        error: 'No events found',
      });
    }

    return res.status(200).send(events);
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while fetching the events: ' + error,
    });
  }
};

// GET /api/events/all
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort([['date', 1]])
      .sort([['slot', 1]])
      .populate('creator')
      .populate('desk')
      .populate('category')
      .exec();

    if (!events) {
      return res.status(404).send({
        error: 'No events found',
      });
    }

    return res.status(200).send(events);
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while fetching the getAllEvents: ' + error,
    });
  }
};

// GET /api/events/desk
export const getDeskEvents = async (req, res) => {
  const { desk } = req.query;

  try {
    const events = await Event.find({ desk: desk })
      .sort([['slot', 1]])
      .populate('creator')
      .populate('desk')
      .populate('category')
      .exec();

    if (!events) {
      return res.status(404).send({
        error: 'No events found',
      });
    }

    return res.status(200).send(events);
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while fetching the getDeskEvents: ' + error,
    });
  }
};

// GET /api/events/:id
export const getEvent = async (req, res) => {
  const { id } = req.params;

  try {
    Event.findOne({ _id: id }, (err, event) => {
      if (err) {
        return res.status(500).send({
          error: 'Something went wrong while fetching the event: ' + err,
        });
      }

      if (!event) {
        return res.status(404).send({
          error: 'No event found',
        });
      }

      return res.status(200).send(event);
    });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while fetching the event: ' + error,
    });
  }
};

// PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const body = req.body;
    Event.updateOne({ _id: id }, body, (err, data) => {
      if (err) throw err;

      return res.status(202).send({
        message: 'Event information updated',
        event: data,
      });
    });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while updating updateEvent: ' + error,
    });
  }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    await Event.deleteMany({ _id: req.params.id });

    return res.status(204).send({
      message: 'Event deleted',
    });
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong while deleteEvent: ' + error,
    });
  }
};
