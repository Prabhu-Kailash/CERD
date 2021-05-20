module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must sign in to access it!');
        return res.redirect('/Login');
    }
    next(); 
}