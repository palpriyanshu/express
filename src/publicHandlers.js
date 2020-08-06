const statusCodes = require('./statusCodes.json');

const serveHomepage = function (req, res, next) {
  if (req.user && req.user.isSignedIn) {
    next();
    return;
  }
  res.render('index');
};

const checkUsernameAvailability = async function (req, res) {
  const { users } = req.app.locals;
  const usersList = await users.list();
  let available = true;

  if (usersList.includes(req.params.userName)) {
    available = false;
  }

  res.json({ available });
};

const serveBlogImage = function (req, res) {
  const { blogImagePath } = req.app.locals;
  const [, root] = __dirname.match(/(.*express\/)(.*)/);
  res.sendFile(root + blogImagePath + req.params.imageID, (err) => {
    if (err) {
      res.status(statusCodes.notFound).send('<h1>Image Not Found</h1>');
    }
  });
};

const getClapsDetails = async function (req, res, next) {
  const { claps } = req.app.locals;
  const { storyID } = req.params;
  req.params.isClapped = false;
  if (req.user) {
    req.params.isClapped = await claps.isClapped(storyID, req.user.id);
  }
  req.params.clapsCount = await claps.clapCount(storyID);
  next();
};

const serveBlogPage = function (req, res) {
  const { stories } = req.app.locals;
  const { storyID, clapsCount, isClapped } = req.params;

  stories
    .getStoryPage(storyID)
    .then((blog) => {
      res.render(
        'blogPage',
        Object.assign(blog, req.user, clapsCount, { isClapped })
      );
    })
    .catch(() => res.sendStatus(statusCodes.notFound));
};

const serveComments = async function (req, res) {
  const { stories } = req.app.locals;
  const comments = await stories.listCommentsOn(req.params.storyID);
  res.render('comments', { comments });
};

const serveProfilePage = async function (req, res) {
  const { users } = req.app.locals;
  const profileID = req.params.profileID;
  users
    .getUserProfile(profileID)
    .then((userProfile) => {
      res.render('profile', Object.assign(userProfile, req.user));
    })
    .catch(() => {
      res.sendStatus(statusCodes.notFound);
    });
};

module.exports = {
  serveHomepage,
  checkUsernameAvailability,
  serveBlogImage,
  getClapsDetails,
  serveBlogPage,
  serveComments,
  serveProfilePage,
};