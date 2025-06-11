const { Book } = require('../models');


const blockBook = () => async (req, res) => {
  try {
    const bookId = req.params.id;
    const blocked = req.body.blocked;
    const reason = req.body.reason;
    const blockedBy = res.locals.id;

    console.log(`Blocking book with ID: ${bookId}`);

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { blocked: { isBlocked: blocked, reason: reason, blockedBy: blockedBy } },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found' });
    }

    res.status(200).send({ message: 'Book blocked successfully', book: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Error', msg: 'Failed to block book.' });
  }
};


module.exports = { blockBook };
