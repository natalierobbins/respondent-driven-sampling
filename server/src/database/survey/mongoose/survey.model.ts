import mongoose, { InferSchemaType, Model, Schema, Types } from 'mongoose';
import { SiteLocation } from '../../utils/constants';
import { injectSurveyHooks } from './survey.hooks';

const surveySchema = new Schema({
    surveyCode: { type: String, required: true, unique: true, immutable: true },
    parentSurveyCode: { type: String, required: true, immutable: true },
    childSurveyCodes: [ { type: String, required: true } ], // immutable via pre-save hook
    responses: { type: Object, default: {}, required: true }, // mutable
    createdByUserObjectId: { type: Types.ObjectId, ref: 'User', required: true, immutable: true },
    siteLocation: { type: String, enum: SiteLocation, required: true, immutable: true },
    coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
    }, // optional, immutable via pre-save hook
    isCompleted: { type: Boolean, default: false }, // optional, mutable
    deletedAt: { type: Date, default: null, select: false }, // optional, mutable
}, { 
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    strict: 'throw', 
    indexes: [ // Faster queries on these fields
        { fields: 'surveyCode', unique: true },
        { fields: 'parentSurveyCode' },
        { fields: 'childSurveyCodes', unique: true },
        { fields: 'createdByUserObjectId' },
        { fields: 'siteLocation' },
    ]
});

// Pre-save hooks to enforce validation on all database writes
injectSurveyHooks(surveySchema);

export type ISurvey = InferSchemaType<typeof surveySchema>;
const Survey: Model<ISurvey> = mongoose.model<ISurvey>('Survey', surveySchema);
export default Survey;