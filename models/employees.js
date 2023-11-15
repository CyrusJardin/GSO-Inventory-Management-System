import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
    {
        first_name: {
            type: String,
            required: [true, "first name is required"]
        },
        last_name: {
            type: String,
            required: [true, "last name is required"]
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
            required: [true, "department is required"]
        },
        deletedAt: {
            type: Date,
            default: null
        },
        position: String,
        employment_status: String,
    },
    {
        timestamps: true
    }
)

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;