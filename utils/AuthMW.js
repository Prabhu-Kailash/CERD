module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must sign in to access it!');
        return res.redirect('/Login');
    }
    next(); 
}

module.exports.isAuthorized = (req, res, next) => {
    if(req.user.responsibility == 'Staff') {
        req.flash('error', 'Oops! You dont have permission to do that!');
        return res.redirect('/dashboard');
    }
    next();
}