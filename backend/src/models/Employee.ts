import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
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
  employeeId: string;
  name: string;
  age: number;
  jobTitle: string;
  userRole: UserRole;
  department: Department;
  email: string;
  phone: string;
  location: string;
  status: Status;
  joinDate: string;
  subjects: string[];
  isFlagged: boolean;
}

const EmployeeSchema: Schema = new Schema({
  employeeId: { type: String, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 100 },
  jobTitle: { type: String, required: true },
  userRole: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.EMPLOYEE },
  department: { type: String, enum: Object.values(Department), required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: Object.values(Status), required: true },
  joinDate: { type: String, required: true },
  subjects: { type: [String], default: [] },
  isFlagged: { type: Boolean, default: false },
});

// Auto-generate employeeId before saving
EmployeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `EMP-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Indexes for performance
EmployeeSchema.index({ employeeId: 1 });
EmployeeSchema.index({ email: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ location: 1 });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
