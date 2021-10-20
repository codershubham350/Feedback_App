module.exports = (req, res, next) => {
  //next callback is used when we have completed an request
  if (!req.user) {
    res.status(401).send({ error: 'You must log in!' });
  }

  next();
};
