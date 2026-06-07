import Joi from 'joi';

const ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null),
        categories: Joi.array().items(Joi.string()).default([])
    }).required()
});

const ReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),

        comment: Joi.string()
            .trim()
            .min(1)
            .required()
            .messages({
                "string.empty": "Review cannot be empty.",
                "string.min": "Review cannot contain only spaces.",
                "any.required": "Please write a review."
            })
    }).required()
});
export default { ListingSchema, ReviewSchema };