import mongoose, { Schema } from "mongoose";
const AutoIncrementFactory = require('mongoose-sequence');

import { GENDER, UNIVERSITY} from '../app/constants/index';
import { getEnumValues } from '../app/utils/utils';

// Initialize AutoIncrement
const AutoIncrement = AutoIncrementFactory(mongoose);

// Define Applicant Schema
const applicantSchema = new Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Gender: {
            type: String,
            enum: getEnumValues(GENDER),
            required: true,
        },
        Email: {
            type: String,
            required: true,
        },
        Whatsapp: {
            type: Number,
            required: true,
        },
        University: {
            type: String,
            enum: getEnumValues(UNIVERSITY),
            required: true,
        },
    }
);

// Apply AutoIncrement plugin with custom format
applicantSchema.plugin(AutoIncrement, {
    inc_field: 'numeric_id', // Numeric ID field for auto-incrementing
    id: 'Jesa', // Prefix for the ID
    start_seq: 1, // Starting sequence number
    formatter: (id: number) => `Jesa${id.toString().padStart(2, '0')}` // Custom formatter for the ID
});

const Applicant = mongoose.models.Applicant || mongoose.model("Applicant", applicantSchema);

export default Applicant;