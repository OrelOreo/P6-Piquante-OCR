const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Fonction pour s'inscrire
exports.signup = (req, res, next) => {
    // On récupère le password de la requête puis on le "hash" (transorme le password, en chaine aléatoire)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            // Enregistre l'utilisateur dans la DB
            user.save()
                .then(() => res.status(200).json({ message: "Utilisateur créé avec succès" }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

// Fonction pour se connecter
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        // Si l'utilisateur n'est pas inscrit mais qu'il souhaite se connecter alors renvoi un message d'erreur
        if (user === null) {
                res.status(401).json({ message: "Paire identifiant / mot de passe incorrecte" })
            }
            // Voir avec mentor pour le 2 ème argument de la fonction "compare"
            else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(400).json({ message: "Paire identifiant / mot de passe incorrecte "})
                        }
                        // Voir avec mentor par rapport au RANDOM_TOKEN_SECRET
                        else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    "RANDOM_TOKEN_SECRET",
                                    { expiresIn: "24h" }
                                )
                            })
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            }
        })
        .catch(error => res.status(500).json({ error }))
}