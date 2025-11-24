import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ultraship-ems';

const seedEmployees = [
  {
    name: 'Rajesh Kumar',
    age: 32,
    jobTitle: 'Senior Software Engineer',
    userRole: 'Employee',
    department: 'Engineering',
    email: 'rajesh.kumar@ultraship.com',
    phone: '+919876543210',
    location: 'Bangalore, Karnataka',
    status: 'Active',
    joinDate: '2022-03-15',
    subjects: ['React', 'Node.js', 'MongoDB'],
    isFlagged: false
  },
  {
    name: 'Priya Sharma',
    age: 28,
    jobTitle: 'UI/UX Designer',
    userRole: 'Employee',
    department: 'Design',
    email: 'priya.sharma@ultraship.com',
    phone: '+919123456789',
    location: 'Mumbai, Maharashtra',
    status: 'Active',
    joinDate: '2023-01-10',
    subjects: ['Figma', 'Adobe XD', 'Sketch'],
    isFlagged: false
  },
  {
    name: 'Amit Patel',
    age: 35,
    jobTitle: 'Engineering Manager',
    userRole: 'Admin',
    department: 'Engineering',
    email: 'amit.patel@ultraship.com',
    phone: '+919988776655',
    location: 'Ahmedabad, Gujarat',
    status: 'Active',
    joinDate: '2021-06-20',
    subjects: ['Team Management', 'System Design', 'AWS'],
    isFlagged: false
  },
  {
    name: 'Sneha Reddy',
    age: 26,
    jobTitle: 'Marketing Specialist',
    userRole: 'Employee',
    department: 'Marketing',
    email: 'sneha.reddy@ultraship.com',
    phone: '+919445566778',
    location: 'Hyderabad, Telangana',
    status: 'Active',
    joinDate: '2023-08-05',
    subjects: ['Digital Marketing', 'SEO', 'Content Strategy'],
    isFlagged: false
  },
  {
    name: 'Vikram Singh',
    age: 40,
    jobTitle: 'VP of Sales',
    userRole: 'Admin',
    department: 'Sales',
    email: 'vikram.singh@ultraship.com',
    phone: '+919223344556',
    location: 'Delhi, NCR',
    status: 'Active',
    joinDate: '2020-02-10',
    subjects: ['Sales Strategy', 'CRM', 'Negotiations'],
    isFlagged: false
  },
  {
    name: 'Anita Desai',
    age: 29,
    jobTitle: 'HR Manager',
    userRole: 'Employee',
    department: 'HR',
    email: 'anita.desai@ultraship.com',
    phone: '+919556677889',
    location: 'Pune, Maharashtra',
    status: 'On Leave',
    joinDate: '2022-11-12',
    subjects: ['Recruitment', 'Employee Relations', 'Compliance'],
    isFlagged: false
  },
  {
    name: 'Karthik Menon',
    age: 31,
    jobTitle: 'DevOps Engineer',
    userRole: 'Employee',
    department: 'Engineering',
    email: 'karthik.menon@ultraship.com',
    phone: '+919667788990',
    location: 'Chennai, Tamil Nadu',
    status: 'Active',
    joinDate: '2022-07-22',
    subjects: ['Docker', 'Kubernetes', 'CI/CD'],
    isFlagged: false
  },
  {
    name: 'Meera Iyer',
    age: 27,
    jobTitle: 'Data Analyst',
    userRole: 'Employee',
    department: 'Operations',
    email: 'meera.iyer@ultraship.com',
    phone: '+919778899001',
    location: 'Bangalore, Karnataka',
    status: 'Active',
    joinDate: '2023-04-18',
    subjects: ['SQL', 'Python', 'Tableau'],
    isFlagged: false
  },
  {
    name: 'Rohit Malhotra',
    age: 34,
    jobTitle: 'Product Manager',
    userRole: 'Employee',
    department: 'Engineering',
    email: 'rohit.malhotra@ultraship.com',
    phone: '+919889900112',
    location: 'Gurgaon, Haryana',
    status: 'Active',
    joinDate: '2021-09-30',
    subjects: ['Product Strategy', 'Agile', 'JIRA'],
    isFlagged: true
  },
  {
    name: 'Divya Nair',
    age: 25,
    jobTitle: 'Junior Designer',
    userRole: 'Employee',
    department: 'Design',
    email: 'divya.nair@ultraship.com',
    phone: '+919990011223',
    location: 'Kochi, Kerala',
    status: 'Active',
    joinDate: '2024-01-05',
    subjects: ['Illustrator', 'Photoshop', 'UI Design'],
    isFlagged: false
  },
  {
    name: 'Arjun Kapoor',
    age: 38,
    jobTitle: 'Chief Technology Officer',
    userRole: 'Admin',
    department: 'Engineering',
    email: 'arjun.kapoor@ultraship.com',
    phone: '+919001122334',
    location: 'Mumbai, Maharashtra',
    status: 'Active',
    joinDate: '2019-05-01',
    subjects: ['Architecture', 'Leadership', 'Cloud Computing'],
    isFlagged: false
  },
  {
    name: 'Pooja Gupta',
    age: 30,
    jobTitle: 'Content Writer',
    userRole: 'Employee',
    department: 'Marketing',
    email: 'pooja.gupta@ultraship.com',
    phone: '+919112233445',
    location: 'Jaipur, Rajasthan',
    status: 'Active',
    joinDate: '2022-12-20',
    subjects: ['Copywriting', 'Blogging', 'Email Marketing'],
    isFlagged: false
  },
  {
    name: 'Sameer Khan',
    age: 33,
    jobTitle: 'QA Lead',
    userRole: 'Employee',
    department: 'Engineering',
    email: 'sameer.khan@ultraship.com',
    phone: '+919223344556',
    location: 'Lucknow, Uttar Pradesh',
    status: 'Active',
    joinDate: '2021-10-15',
    subjects: ['Selenium', 'Test Automation', 'API Testing'],
    isFlagged: false
  },
  {
    name: 'Nisha Verma',
    age: 26,
    jobTitle: 'Business Analyst',
    userRole: 'Employee',
    department: 'Operations',
    email: 'nisha.verma@ultraship.com',
    phone: '+919334455667',
    location: 'Noida, Uttar Pradesh',
    status: 'Active',
    joinDate: '2023-03-08',
    subjects: ['Requirements Analysis', 'Process Mapping', 'Excel'],
    isFlagged: false
  },
  {
    name: 'Rakesh Joshi',
    age: 42,
    jobTitle: 'Finance Director',
    userRole: 'Admin',
    department: 'Operations',
    email: 'rakesh.joshi@ultraship.com',
    phone: '+919445566778',
    location: 'Mumbai, Maharashtra',
    status: 'Active',
    joinDate: '2018-08-12',
    subjects: ['Financial Planning', 'Budgeting', 'Compliance'],
    isFlagged: false
  },
  {
    name: 'Tanvi Rao',
    age: 24,
    jobTitle: 'Social Media Manager',
    userRole: 'Employee',
    department: 'Marketing',
    email: 'tanvi.rao@ultraship.com',
    phone: '+919556677889',
    location: 'Bangalore, Karnataka',
    status: 'Active',
    joinDate: '2024-02-14',
    subjects: ['Instagram', 'Twitter', 'Analytics'],
    isFlagged: false
  },
  {
    name: 'Harsh Agarwal',
    age: 29,
    jobTitle: 'Full Stack Developer',
    userRole: 'Employee',
    department: 'Engineering',
    email: 'harsh.agarwal@ultraship.com',
    phone: '+919667788990',
    location: 'Indore, Madhya Pradesh',
    status: 'On Leave',
    joinDate: '2022-05-25',
    subjects: ['Angular', 'Spring Boot', 'PostgreSQL'],
    isFlagged: false
  },
  {
    name: 'Kavya Pillai',
    age: 27,
    jobTitle: 'Graphic Designer',
    userRole: 'Employee',
    department: 'Design',
    email: 'kavya.pillai@ultraship.com',
    phone: '+919778899001',
    location: 'Trivandrum, Kerala',
    status: 'Active',
    joinDate: '2023-06-10',
    subjects: ['Branding', 'Print Design', 'InDesign'],
    isFlagged: false
  },
  {
    name: 'Siddharth Bhat',
    age: 36,
    jobTitle: 'Security Engineer',
    userRole: 'Employee',
    department: 'Engineering',
    email: 'siddharth.bhat@ultraship.com',
    phone: '+919889900112',
    location: 'Bengaluru, Karnataka',
    status: 'Active',
    joinDate: '2021-04-03',
    subjects: ['Penetration Testing', 'OWASP', 'Cybersecurity'],
    isFlagged: true
  },
  {
    name: 'Lakshmi Krishnan',
    age: 31,
    jobTitle: 'Operations Manager',
    userRole: 'Employee',
    department: 'Operations',
    email: 'lakshmi.krishnan@ultraship.com',
    phone: '+919990011223',
    location: 'Coimbatore, Tamil Nadu',
    status: 'Active',
    joinDate: '2022-02-28',
    subjects: ['Logistics', 'Supply Chain', 'Lean Six Sigma'],
    isFlagged: false
  },
  {
    name: 'Nikhil Chopra',
    age: 28,
    jobTitle: 'Backend Developer',
    userRole: 'Employee',
    department: 'Engineering',
    email: 'nikhil.chopra@ultraship.com',
    phone: '+919001122334',
    location: 'Chandigarh, Punjab',
    status: 'Active',
    joinDate: '2023-07-19',
    subjects: ['Django', 'FastAPI', 'Redis'],
    isFlagged: false
  },
  {
    name: 'Ritu Saxena',
    age: 32,
    jobTitle: 'Talent Acquisition Lead',
    userRole: 'Employee',
    department: 'HR',
    email: 'ritu.saxena@ultraship.com',
    phone: '+919112233445',
    location: 'Delhi, NCR',
    status: 'Active',
    joinDate: '2021-11-07',
    subjects: ['Interviewing', 'Sourcing', 'Employer Branding'],
    isFlagged: false
  },
  {
    name: 'Gaurav Mehta',
    age: 37,
    jobTitle: 'Account Manager',
    userRole: 'Employee',
    department: 'Sales',
    email: 'gaurav.mehta@ultraship.com',
    phone: '+919223344556',
    location: 'Ahmedabad, Gujarat',
    status: 'Active',
    joinDate: '2020-09-22',
    subjects: ['Client Relations', 'Salesforce', 'Proposals'],
    isFlagged: false
  },
  {
    name: 'Ishita Bansal',
    age: 25,
    jobTitle: 'Junior Developer',
    userRole: 'Employee',
    department: 'Engineering',
    email: 'ishita.bansal@ultraship.com',
    phone: '+919334455667',
    location: 'Jaipur, Rajasthan',
    status: 'Active',
    joinDate: '2024-03-01',
    subjects: ['JavaScript', 'HTML/CSS', 'Git'],
    isFlagged: false
  },
  {
    name: 'Manish Bhardwaj',
    age: 39,
    jobTitle: 'Sales Director',
    userRole: 'Admin',
    department: 'Sales',
    email: 'manish.bhardwaj@ultraship.com',
    phone: '+919445566778',
    location: 'Mumbai, Maharashtra',
    status: 'Active',
    joinDate: '2019-12-01',
    subjects: ['Revenue Growth', 'Team Building', 'Market Analysis'],
    isFlagged: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing employees
    await Employee.deleteMany({});
    console.log('Cleared existing employees');

    // Insert seed data one by one to trigger pre-save hook
    console.log('Seeding employees...');
    for (const employeeData of seedEmployees) {
      await Employee.create(employeeData);
    }
    
    const count = await Employee.countDocuments();
    console.log(`✅ Successfully seeded ${count} employees`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
