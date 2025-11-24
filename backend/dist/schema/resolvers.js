"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const Employee_1 = __importDefault(require("../models/Employee"));
exports.resolvers = {
    Query: {
        employees: async (_, { page = 1, pageSize = 12, filter, sort }) => {
            const query = {};
            if (filter) {
                if (filter.search) {
                    query.$or = [
                        { name: { $regex: filter.search, $options: 'i' } },
                        { email: { $regex: filter.search, $options: 'i' } },
                        { location: { $regex: filter.search, $options: 'i' } },
                    ];
                }
                if (filter.department && filter.department !== 'All') {
                    query.department = filter.department;
                }
                if (filter.status && filter.status !== 'All') {
                    query.status = filter.status === 'On_Leave' ? 'On Leave' : filter.status;
                }
                if (filter.location && filter.location !== 'All') {
                    query.location = filter.location;
                }
            }
            const sortOption = {};
            if (sort) {
                sortOption[sort.key] = sort.direction === 'asc' ? 1 : -1;
            }
            else {
                sortOption.name = 1; // Default sort
            }
            const total = await Employee_1.default.countDocuments(query);
            const employees = await Employee_1.default.find(query)
                .sort(sortOption)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean(); // Performance optimization
            return {
                data: employees.map((e) => ({ ...e, id: e._id })),
                total,
                page,
                pageSize,
            };
        },
        employee: async (_, { id }) => {
            const emp = await Employee_1.default.findById(id).lean();
            if (!emp)
                return null;
            return { ...emp, id: emp._id };
        },
        locations: async () => {
            const locations = await Employee_1.default.distinct('location');
            return locations;
        },
    },
    Mutation: {
        addEmployee: async (_, args) => {
            // Map 'On_Leave' enum from GraphQL to 'On Leave' string for DB if needed
            // But Mongoose enum validation might catch it. Let's ensure consistency.
            if (args.status === 'On_Leave')
                args.status = 'On Leave';
            const newEmployee = new Employee_1.default(args);
            const saved = await newEmployee.save();
            return { ...saved.toObject(), id: saved._id };
        },
        updateEmployee: async (_, { id, ...updates }) => {
            if (updates.status === 'On_Leave')
                updates.status = 'On Leave';
            const updated = await Employee_1.default.findByIdAndUpdate(id, updates, { new: true }).lean();
            if (!updated)
                throw new Error('Employee not found');
            return { ...updated, id: updated._id };
        },
        deleteEmployee: async (_, { id }) => {
            const result = await Employee_1.default.findByIdAndDelete(id);
            return !!result;
        },
    },
};
