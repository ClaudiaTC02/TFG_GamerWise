import jwt from 'jsonwebtoken'
const token_secret = 'eriwekhfoiqw'

export function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401); // Unauthorized
    
    jwt.verify(token, token_secret, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}
