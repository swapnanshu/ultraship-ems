import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
}

export enum Department {
  ENGINEERING = 'Engineering',
  DESIGN = 'Design',
  MARKETING = 'Marketing',
  HR = 'HR',
  SALES = 'Sales',
  OPERATIONS = 'Operations',
}

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_LEAVE = 'On Leave',
}

export interface IEmployee extends Document {
  name: string;
  role: Role;
  department: Department;
  email: string;
  phone: string;
  location: string;
  status: Status;
  joinDate: string;
  isFlagged: boolean;
}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), required: true },
  department: { type: String, enum: Object.values(Department), required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: Object.values(Status), required: true },
  joinDate: { type: String, required: true },
  isFlagged: { type: Boolean, default: false },
});

// Indexes for performance
EmployeeSchema.index({ email: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ location: 1 });
// Compound index for common filter combinations could be added here if needed
// e.g. EmployeeSchema.index({ department: 1, status: 1 });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
