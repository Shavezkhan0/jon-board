import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Job } from '@/types'

interface SeedJob {
  title: string
  company: string
  location: string
  category:
    | 'technology'
    | 'marketing'
    | 'design'
    | 'finance'
    | 'healthcare'
    | 'education'
    | 'legal'
    | 'operations'
    | 'other'
  jobType: 'full-time' | 'part-time' | 'remote' | 'freelance' | 'internship' | 'contract'
  experienceLevel: 'fresher' | 'junior' | 'mid-level' | 'senior' | 'lead' | 'manager'
  salaryMin: number
  salaryMax: number
  salaryCurrency: 'INR' | 'USD'
  description: any
  requirements: any
  niceToHave: any
  applyLink: string
  applyEmail: string
  skills: Array<{ skill: string }>
  benefits: Array<{ benefit: string }>
  isFeatured: boolean
  isUrgent: boolean
  postedAt: string
  expiresAt: string
}

const seedJobs: SeedJob[] = [
  {
    title: 'Senior Frontend Developer',
    company: 'Tata Consultancy Services',
    location: 'Mumbai',
    category: 'technology',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 1800000,
    salaryMax: 2500000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: 'We are looking for an experienced Frontend Developer to join our dynamic team at TCS. You will be responsible for building responsive web applications using modern JavaScript frameworks.',
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '5+ years of experience in frontend development' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Strong proficiency in React, TypeScript, and modern CSS' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Experience with state management libraries (Redux, Zustand)' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with Next.js and server-side rendering' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://tcs.com/careers/senior-frontend-developer',
    applyEmail: 'careers@tcs.com',
    skills: [{ skill: 'React' }, { skill: 'TypeScript' }, { skill: 'CSS' }, { skill: 'Next.js' }],
    benefits: [
      { benefit: 'Health Insurance' },
      { benefit: 'Provident Fund' },
      { benefit: 'Flexible Work Hours' },
    ],
    isFeatured: true,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'UX Designer',
    company: 'Zomato',
    location: 'Bangalore',
    category: 'design',
    jobType: 'full-time',
    experienceLevel: 'mid-level',
    salaryMin: 1200000,
    salaryMax: 1800000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Join Zomato's design team to create amazing user experiences for millions of food lovers across India.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '3-5 years of UX design experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Proficiency in Figma, Sketch, and Adobe Creative Suite' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with food tech or e-commerce platforms' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://zomato.com/careers/ux-designer',
    applyEmail: 'design@zomato.com',
    skills: [
      { skill: 'Figma' },
      { skill: 'UX Research' },
      { skill: 'Prototyping' },
      { skill: 'User Testing' },
    ],
    benefits: [
      { benefit: 'Free Food' },
      { benefit: 'Gym Membership' },
      { benefit: 'Transport Allowance' },
    ],
    isFeatured: true,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Full Stack Developer',
    company: 'Infosys',
    location: 'Hyderabad',
    category: 'technology',
    jobType: 'remote',
    experienceLevel: 'mid-level',
    salaryMin: 1500000,
    salaryMax: 2000000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: 'Looking for a talented Full Stack Developer to work on enterprise applications for our global clients.',
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '4+ years of full stack development experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Strong knowledge of Node.js, React, and databases' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with cloud platforms (AWS, Azure)' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://infosys.com/careers/full-stack-developer',
    applyEmail: 'hiring@infosys.com',
    skills: [{ skill: 'Node.js' }, { skill: 'React' }, { skill: 'MongoDB' }, { skill: 'AWS' }],
    benefits: [
      { benefit: 'Remote Work' },
      { benefit: 'Health Insurance' },
      { benefit: 'Learning Budget' },
    ],
    isFeatured: false,
    isUrgent: true,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Digital Marketing Manager',
    company: 'Swiggy',
    location: 'Delhi',
    category: 'marketing',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 1400000,
    salaryMax: 2000000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Lead Swiggy's digital marketing initiatives to drive user acquisition and engagement.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '5+ years of digital marketing experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Proven track record in managing large-scale campaigns' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience in food delivery or e-commerce industry' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://swiggy.com/careers/marketing-manager',
    applyEmail: 'marketing@swiggy.com',
    skills: [{ skill: 'SEO' }, { skill: 'SEM' }, { skill: 'Social Media' }, { skill: 'Analytics' }],
    benefits: [
      { benefit: 'Performance Bonus' },
      { benefit: 'Stock Options' },
      { benefit: 'Flexible Hours' },
    ],
    isFeatured: false,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Financial Analyst',
    company: 'HDFC Bank',
    location: 'Mumbai',
    category: 'finance',
    jobType: 'full-time',
    experienceLevel: 'junior',
    salaryMin: 800000,
    salaryMax: 1200000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Join HDFC Bank's finance team to analyze financial data and support strategic decision making.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '2-3 years of financial analysis experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Strong Excel skills and knowledge of financial modeling' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'CFA certification or equivalent' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://hdfcbank.com/careers/financial-analyst',
    applyEmail: 'finance@hdfcbank.com',
    skills: [
      { skill: 'Financial Analysis' },
      { skill: 'Excel' },
      { skill: 'Financial Modeling' },
      { skill: 'Banking' },
    ],
    benefits: [
      { benefit: 'Banking Perks' },
      { benefit: 'Health Insurance' },
      { benefit: 'Provident Fund' },
    ],
    isFeatured: false,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Software Engineer Intern',
    company: 'Razorpay',
    location: 'Bangalore',
    category: 'technology',
    jobType: 'internship',
    experienceLevel: 'fresher',
    salaryMin: 300000,
    salaryMax: 500000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: 'Exciting internship opportunity at Razorpay for freshers to work on cutting-edge payment solutions.',
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [
          { text: 'Currently pursuing B.Tech/M.Tech in Computer Science or related field' },
        ],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Strong programming skills in any modern language' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with web development or mobile apps' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://razorpay.com/careers/software-engineer-intern',
    applyEmail: 'internships@razorpay.com',
    skills: [
      { skill: 'Programming' },
      { skill: 'Web Development' },
      { skill: 'Problem Solving' },
      { skill: 'Algorithms' },
    ],
    benefits: [
      { benefit: 'Stipend' },
      { benefit: 'Pre-placement Offer' },
      { benefit: 'Mentorship' },
    ],
    isFeatured: true,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Product Manager',
    company: 'PhonePe',
    location: 'Bangalore',
    category: 'operations',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 2000000,
    salaryMax: 3000000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Lead product strategy and development for PhonePe's innovative payment solutions.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '5+ years of product management experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Experience in fintech or digital payments' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'MBA from top business school' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://phonepe.com/careers/product-manager',
    applyEmail: 'product@phonepe.com',
    skills: [
      { skill: 'Product Management' },
      { skill: 'Strategy' },
      { skill: 'Analytics' },
      { skill: 'Fintech' },
    ],
    benefits: [{ benefit: 'ESOPs' }, { benefit: 'Health Insurance' }, { benefit: 'Flexible Work' }],
    isFeatured: false,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Data Scientist',
    company: 'Flipkart',
    location: 'Bangalore',
    category: 'technology',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 2200000,
    salaryMax: 3000000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Join Flipkart's data science team to build ML models that power India's largest e-commerce platform.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '4+ years of data science and machine learning experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Strong Python skills and experience with ML frameworks' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with big data technologies (Spark, Hadoop)' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://flipkart.com/careers/data-scientist',
    applyEmail: 'data-science@flipkart.com',
    skills: [
      { skill: 'Python' },
      { skill: 'Machine Learning' },
      { skill: 'Data Analysis' },
      { skill: 'Big Data' },
    ],
    benefits: [
      { benefit: 'ESOPs' },
      { benefit: 'Health Insurance' },
      { benefit: 'Learning Budget' },
    ],
    isFeatured: true,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Nursing Staff',
    company: 'Apollo Hospitals',
    location: 'Chennai',
    category: 'healthcare',
    jobType: 'full-time',
    experienceLevel: 'junior',
    salaryMin: 600000,
    salaryMax: 900000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          { text: "Join Apollo Hospitals' healthcare team to provide exceptional patient care." },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: 'B.Sc in Nursing with valid registration' }],
        type: 'paragraph',
      },
      {
        children: [{ text: '1-2 years of clinical experience' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Specialization in critical care or emergency medicine' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://apollohospitals.com/careers/nursing-staff',
    applyEmail: 'nursing@apollohospitals.com',
    skills: [
      { skill: 'Patient Care' },
      { skill: 'Medical Knowledge' },
      { skill: 'Clinical Skills' },
      { skill: 'Communication' },
    ],
    benefits: [
      { benefit: 'Health Insurance' },
      { benefit: 'Accommodation' },
      { benefit: 'Training Programs' },
    ],
    isFeatured: false,
    isUrgent: true,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Graphic Designer',
    company: 'Ola',
    location: 'Pune',
    category: 'design',
    jobType: 'freelance',
    experienceLevel: 'mid-level',
    salaryMin: 800000,
    salaryMax: 1200000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Create stunning visual designs for Ola's marketing campaigns and brand initiatives.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '3+ years of graphic design experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Proficiency in Adobe Creative Suite and modern design tools' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with motion graphics and video editing' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://ola.com/careers/graphic-designer',
    applyEmail: 'design@ola.com',
    skills: [
      { skill: 'Adobe Creative Suite' },
      { skill: 'Graphic Design' },
      { skill: 'Brand Design' },
      { skill: 'Motion Graphics' },
    ],
    benefits: [
      { benefit: 'Flexible Work' },
      { benefit: 'Creative Freedom' },
      { benefit: 'Portfolio Building' },
    ],
    isFeatured: false,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Legal Counsel',
    company: 'ICICI Bank',
    location: 'Mumbai',
    category: 'legal',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 1800000,
    salaryMax: 2500000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Provide legal guidance and support for ICICI Bank's banking operations and compliance.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: 'LL.B/LL.M from recognized university' }],
        type: 'paragraph',
      },
      {
        children: [{ text: '5+ years of experience in banking law or financial regulations' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with fintech or digital banking regulations' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://icicibank.com/careers/legal-counsel',
    applyEmail: 'legal@icicibank.com',
    skills: [
      { skill: 'Banking Law' },
      { skill: 'Compliance' },
      { skill: 'Legal Research' },
      { skill: 'Contract Drafting' },
    ],
    benefits: [
      { benefit: 'Legal Benefits' },
      { benefit: 'Health Insurance' },
      { benefit: 'Provident Fund' },
    ],
    isFeatured: false,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Education Counselor',
    company: "Byju's",
    location: 'Bangalore',
    category: 'education',
    jobType: 'part-time',
    experienceLevel: 'junior',
    salaryMin: 400000,
    salaryMax: 600000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Guide students and parents through educational programs and career planning at Byju's.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: "Bachelor's degree in any field" }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Excellent communication and interpersonal skills' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience in education counseling or sales' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://byjus.com/careers/education-counselor',
    applyEmail: 'careers@byjus.com',
    skills: [
      { skill: 'Communication' },
      { skill: 'Counseling' },
      { skill: 'Sales' },
      { skill: 'Education' },
    ],
    benefits: [
      { benefit: 'Flexible Hours' },
      { benefit: 'Training' },
      { benefit: 'Performance Bonus' },
    ],
    isFeatured: false,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'DevOps Engineer',
    company: 'Microsoft',
    location: 'Hyderabad',
    category: 'technology',
    jobType: 'full-time',
    experienceLevel: 'mid-level',
    salaryMin: 1600000,
    salaryMax: 2400000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: 'Join Microsoft India to build and maintain scalable cloud infrastructure and deployment pipelines.',
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '3-5 years of DevOps experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Strong knowledge of CI/CD, Docker, Kubernetes, and cloud platforms' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with Azure cloud services' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://microsoft.com/careers/devops-engineer',
    applyEmail: 'careers@microsoft.com',
    skills: [{ skill: 'DevOps' }, { skill: 'Docker' }, { skill: 'Kubernetes' }, { skill: 'Azure' }],
    benefits: [
      { benefit: 'Global Exposure' },
      { benefit: 'Stock Options' },
      { benefit: 'Health Insurance' },
    ],
    isFeatured: true,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Marketing Intern',
    company: 'Paytm',
    location: 'Noida',
    category: 'marketing',
    jobType: 'internship',
    experienceLevel: 'fresher',
    salaryMin: 200000,
    salaryMax: 300000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: 'Exciting marketing internship opportunity at Paytm for freshers to work on digital campaigns.',
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: 'Currently pursuing MBA or marketing degree' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Strong understanding of digital marketing concepts' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with social media marketing or content creation' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://paytm.com/careers/marketing-intern',
    applyEmail: 'internships@paytm.com',
    skills: [
      { skill: 'Digital Marketing' },
      { skill: 'Social Media' },
      { skill: 'Content Creation' },
      { skill: 'Analytics' },
    ],
    benefits: [
      { benefit: 'Stipend' },
      { benefit: 'Pre-placement Offer' },
      { benefit: 'Mentorship' },
    ],
    isFeatured: false,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Backend Developer',
    company: 'Amazon',
    location: 'Bangalore',
    category: 'technology',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryMin: 2500000,
    salaryMax: 3500000,
    salaryCurrency: 'INR',
    description: [
      {
        children: [
          {
            text: "Build scalable backend systems for Amazon India's e-commerce platform serving millions of customers.",
          },
        ],
        type: 'paragraph',
      },
    ],
    requirements: [
      {
        children: [{ text: '5+ years of backend development experience' }],
        type: 'paragraph',
      },
      {
        children: [{ text: 'Strong proficiency in Java, Python, or Go and distributed systems' }],
        type: 'paragraph',
      },
    ],
    niceToHave: [
      {
        children: [{ text: 'Experience with microservices and cloud architecture' }],
        type: 'paragraph',
      },
    ],
    applyLink: 'https://amazon.com/careers/backend-developer',
    applyEmail: 'careers@amazon.com',
    skills: [
      { skill: 'Java' },
      { skill: 'Python' },
      { skill: 'Distributed Systems' },
      { skill: 'AWS' },
    ],
    benefits: [
      { benefit: 'Stock Options' },
      { benefit: 'Health Insurance' },
      { benefit: 'Global Relocation' },
    ],
    isFeatured: true,
    isUrgent: false,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    const payload = await getPayload({ config })

    // Clear existing jobs
    console.log('🗑️ Clearing existing jobs...')
    const existingJobs = await payload.find({
      collection: 'jobs',
      limit: 1000,
      overrideAccess: false,
    })

    for (const job of existingJobs.docs) {
      await payload.delete({
        collection: 'jobs',
        id: job.id,
        overrideAccess: false,
      })
    }

    console.log(`✅ Deleted ${existingJobs.totalDocs} existing jobs`)

    // Insert new jobs
    console.log('📝 Inserting seed jobs...')

    for (const jobData of seedJobs) {
      try {
        await payload.create({
          collection: 'jobs',
          draft: false,
          data: {
            ...jobData,
            slug: `${jobData.title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`,
            isActive: true,
            viewCount: Math.floor(Math.random() * 1000),
            applicationCount: Math.floor(Math.random() * 50),
            workMode: 'office',
            responsibilities: jobData.description?.slice(0, 500) || '',
          },
          overrideAccess: false,
        })

        console.log(`✅ Created job: ${jobData.title} at ${jobData.company}`)
      } catch (error) {
        console.error(`❌ Error creating job ${jobData.title}:`, error)
      }
    }

    console.log('🎉 Database seeding completed successfully!')

    // Summary
    const createdJobs = await payload.find({
      collection: 'jobs',
      limit: 1000,
      overrideAccess: false,
    })

    console.log(`
📊 Seeding Summary:
Total Jobs Created: ${createdJobs.totalDocs}
Featured Jobs: ${createdJobs.docs.filter((job) => job.isFeatured).length}
Urgent Jobs: ${createdJobs.docs.filter((job) => job.isUrgent).length}
Categories: ${[...new Set(createdJobs.docs.map((job) => job.category))].join(', ')}
Cities: ${[...new Set(createdJobs.docs.map((job) => job.location))].join(', ')}
    `)
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedDatabase()
