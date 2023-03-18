const Sauce = require('../models/Sauce')
const fs = require('fs')


// Voir cette partie avec le mentor
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    delete sauceObject.userId
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(200).json({ message: "Objet enregistré " }))
        .catch(error => res.status(400).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

// A voir avec le mentor
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    delete sauceObject._userId
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(400).json({ message: "Non autorisé" })
            } else {
                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet modifié" }))
                    .catch(error => res.status(400).json({ error }))
            }
        })
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Non autorisé"})
            } else {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Objet supprimé" }))
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch(error => res.status(500).json({ error }))
}

// A voir avec mentor pour récapituler cette fonction
exports.postSauce = (req, res, next) => {
    const like = req.body.like
    const userId = req.body.userId

    if (like === 0) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                 // Si l'utilisateur a déjà liké la sauce, on retire le like et on décrémente le compteur de likes
                 if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        // The $pull operator removes from an existing array all instances of a value or values that match a specified condition
                        {
                            $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 },
                            _id: req.params.id
                        }
                    )
                    .then(() => res.status(200).json({ message: "Like retiré" }))
                    .catch((error) => res.status(400).json({ error }))
                 } 
                 // Si l'utilisateur a déjà disliké la sauce, on retire le dislike et on décrémente le compteur de dislikes
                 if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1},
                            _id: req.params.id
                        }
                    )
                    .then(() => res.status(200).json({ message: "Dislike retiré" }))
                    .catch((error) => res.status(400).json({ error }))
                 }
            })
            .catch((error) => res.status(400).json({ error }))
    }
    if (like === 1) {
        // On ajoute l'utilisateur à la liste des personnes ayant liké la sauce et on incrémente le compteur de likes
        Sauce.updateOne(
            { _id: req.params.id },
            {
                // The $push operator appends a specified value to an array
                $push: { usersLiked: userId },
                $inc: { likes: 1 }
            }
        )
        .then(() => res.status(200).json({ message: "Like ajouté" }))
        .catch((error) => res.status(400).json({ error }))
    }
    // L'user dislike la sauce
    if (like === -1) {
         // On ajoute l'utilisateur à la liste des personnes ayant disliké la sauce et on incrémente le compteur de dislikes
         Sauce.updateOne(
            { _id: req.params.id },
            {
                $push: { usersDisliked: userId },
                $inc: { dislikes : 1}
            }
         )
         .then(() => res.status(200).json({ message: "Dislike ajouté" }))
         .catch((error) => res.status(400).json({ error }))
    }
}