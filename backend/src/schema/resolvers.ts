import Employee, { IEmployee } from '../models/Employee';

export const resolvers = {
  Query: {
    employees: async (_: any, { page = 1, pageSize = 12, filter, sort }: any) => {
      const query: any = {};

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

      const sortOption: any = {};
      if (sort) {
        sortOption[sort.key] = sort.direction === 'asc' ? 1 : -1;
      } else {
        sortOption.name = 1; // Default sort
      }

      const total = await Employee.countDocuments(query);
      const employees = await Employee.find(query)
        .sort(sortOption)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(); // Performance optimization

      return {
        data: employees.map((e: any) => ({ ...e, id: e._id })),
        total,
        page,
        pageSize,
      };
    },

    employee: async (_: any, { id }: { id: string }) => {
      const emp = await Employee.findById(id).lean();
      if (!emp) return null;
      return { ...emp, id: (emp as any)._id };
    },

    locations: async () => {
      const locations = await Employee.distinct('location');
      return locations;
    },
  },

  Mutation: {
    addEmployee: async (_: any, args: any) => {
      // Map 'On_Leave' enum from GraphQL to 'On Leave' string for DB if needed
      // But Mongoose enum validation might catch it. Let's ensure consistency.
      if (args.status === 'On_Leave') args.status = 'On Leave';
      
      const newEmployee = new Employee(args);
      const saved = await newEmployee.save();
      return { ...saved.toObject(), id: saved._id };
    },

    updateEmployee: async (_: any, { id, ...updates }: any) => {
      if (updates.status === 'On_Leave') updates.status = 'On Leave';

      const updated = await Employee.findByIdAndUpdate(id, updates, { new: true }).lean();
      if (!updated) throw new Error('Employee not found');
      return { ...updated, id: (updated as any)._id };
    },

    deleteEmployee: async (_: any, { id }: { id: string }) => {
      const result = await Employee.findByIdAndDelete(id);
      return !!result;
    },
  },
};
