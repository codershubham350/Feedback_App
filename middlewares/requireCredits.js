module.exports = (req, res, next) => {
  //next callback is used when we have completed an request
  if (req.user.credits < 1) {
    res.status(403).send({ error: 'Not enough credits' });
  }

  next();
};
