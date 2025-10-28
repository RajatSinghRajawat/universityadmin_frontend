// Validation schemas for all API data
export const validationSchemas = {
  // Authentication validations
  login: {
    email: {
      required: true,
      type: 'email',
      message: 'Valid email is required'
    },
    password: {
      required: true,
      minLength: 6,
      message: 'Password must be at least 6 characters'
    },
    universityCode: {
      required: false,
      type: 'string',
      message: 'University code must be a string'
    }
  },

  register: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      message: 'Name must be between 2 and 50 characters'
    },
    email: {
      required: true,
      type: 'email',
      message: 'Valid email is required'
    },
    password: {
      required: true,
      minLength: 6,
      message: 'Password must be at least 6 characters'
    },
    role: {
      required: true,
      enum: ['admin', 'superadmin'],
      message: 'Role must be either admin or superadmin'
    },
    universityCode: {
      required: false,
      enum: ['GYAN001', 'GYAN002'],
      message: 'University code must be GYAN001 or GYAN002'
    }
  },

  // Student validations
  student: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Name must be between 2 and 100 characters'
    },
    email: {
      required: true,
      type: 'email',
      message: 'Valid email is required'
    },
    phone: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      message: 'Valid 10-digit phone number is required'
    },
    address: {
      required: true,
      minLength: 10,
      message: 'Address must be at least 10 characters'
    },
    department: {
      required: true,
      enum: ['Computer Science', 'Business Administration', 'Engineering', 'Liberal Arts', 'Sciences'],
      message: 'Valid department is required'
    },
    year: {
      required: true,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      message: 'Valid academic year is required'
    },
    guardianName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      message: 'Guardian name is required'
    },
    guardianPhone: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      message: 'Valid guardian phone number is required'
    },
    emergencyContact: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      message: 'Valid emergency contact is required'
    },
    universityCode: {
      required: true,
      enum: ['GYAN001', 'GYAN002'],
      message: 'Valid university code is required'
    },
    enrollmentId: {
      required: true,
      minLength: 3,
      maxLength: 20,
      message: 'Enrollment ID is required'
    },
    JoiningDate: {
      required: true,
      type: 'date',
      message: 'Joining date is required'
    },
    DateOfBirth: {
      required: true,
      type: 'date',
      message: 'Date of birth is required'
    },
    Gender: {
      required: true,
      enum: ['Male', 'Female', 'Other'],
      message: 'Gender is required'
    },
    aadharNo: {
      required: true,
      pattern: /^\d{12}$/,
      message: 'Valid 12-digit Aadhar number is required'
    }
  },

  // Employee validations
  employee: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Name must be between 2 and 100 characters'
    },
    email: {
      required: true,
      type: 'email',
      message: 'Valid email is required'
    },
    phone: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      message: 'Valid 10-digit phone number is required'
    },
    address: {
      required: true,
      type: 'array',
      minItems: 1,
      message: 'Address array is required'
    },
    department: {
      required: true,
      enum: ['Computer Science', 'Mathematics', 'Engineering', 'Administration', 'Library', 'Finance'],
      message: 'Valid department is required'
    },
    designation: {
      required: true,
      enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Office Manager', 'Librarian', 'Accountant'],
      message: 'Valid designation is required'
    },
    salary: {
      required: true,
      type: 'number',
      min: 0,
      message: 'Valid salary amount is required'
    },
    joiningDate: {
      required: true,
      type: 'date',
      message: 'Joining date is required'
    },
    qualification: {
      required: true,
      minLength: 2,
      message: 'Qualification is required'
    },
    experience: {
      required: true,
      type: 'number',
      min: 0,
      message: 'Experience in years is required'
    },
    emergencyContact: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      message: 'Valid emergency contact is required'
    },
    universityCode: {
      required: true,
      enum: ['GYAN001', 'GYAN002'],
      message: 'Valid university code is required'
    },
    employeeId: {
      required: true,
      minLength: 3,
      maxLength: 20,
      message: 'Employee ID is required'
    },
    status: {
      required: true,
      enum: ['active', 'inactive'],
      message: 'Valid status is required'
    },
    dateOfBirth: {
      required: true,
      type: 'date',
      message: 'Date of birth is required'
    },
    gender: {
      required: true,
      enum: ['Male', 'Female', 'Other'],
      message: 'Gender is required'
    },
    aadharNo: {
      required: true,
      pattern: /^\d{12}$/,
      message: 'Valid 12-digit Aadhar number is required'
    },
    accountStatus: {
      required: true,
      enum: ['active', 'inactive'],
      message: 'Account status is required'
    },
    accountType: {
      required: true,
      enum: ['savings', 'current'],
      message: 'Account type is required'
    },
    accountNumber: {
      required: true,
      minLength: 9,
      maxLength: 18,
      message: 'Valid account number is required'
    },
    accountHolderName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Account holder name is required'
    },
    accountBankName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Bank name is required'
    },
    accountIFSCCode: {
      required: true,
      pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
      message: 'Valid IFSC code is required'
    }
  },

  // Course validations
  course: {
    courseName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Course name is required'
    },
    courseCode: {
      required: true,
      minLength: 2,
      maxLength: 20,
      message: 'Course code is required'
    },
    department: {
      required: true,
      enum: ['Computer Science', 'Mathematics', 'Engineering', 'Business Administration', 'Liberal Arts', 'Sciences'],
      message: 'Valid department is required'
    },
    semester: {
      required: true,
      type: 'number',
      min: 1,
      max: 8,
      message: 'Valid semester is required'
    },
    credits: {
      required: true,
      type: 'number',
      min: 1,
      max: 6,
      message: 'Valid credits are required'
    },
    instructor: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Instructor name is required'
    },
    description: {
      required: false,
      maxLength: 500,
      message: 'Description cannot exceed 500 characters'
    },
    universityCode: {
      required: true,
      enum: ['GYAN001', 'GYAN002'],
      message: 'Valid university code is required'
    }
  },

  // Session validations
  session: {
    session_year: {
      required: true,
      type: 'number',
      min: 2000,
      max: new Date().getFullYear() + 5,
      message: 'Valid session year is required'
    },
    startDate: {
      required: true,
      type: 'date',
      message: 'Start date is required'
    },
    endDate: {
      required: true,
      type: 'date',
      message: 'End date is required'
    },
    description: {
      required: false,
      type: 'string',
      maxLength: 500,
      message: 'Description must be less than 500 characters'
    },
    is_default: {
      required: false,
      type: 'boolean',
      message: 'Default status must be boolean'
    },
    status: {
      required: false,
      enum: ['active', 'completed', 'upcoming'],
      message: 'Valid status is required'
    },
    totalStudents: {
      required: false,
      type: 'number',
      min: 0,
      message: 'Total students must be a positive number'
    },
    totalCourses: {
      required: false,
      type: 'number',
      min: 0,
      message: 'Total courses must be a positive number'
    },
    totalFaculty: {
      required: false,
      type: 'number',
      min: 0,
      message: 'Total faculty must be a positive number'
    },
    universityCode: {
      required: true,
      enum: ['GYAN001', 'GYAN002'],
      message: 'Valid university code is required'
    }
  },

  // Attendance validations
  attendance: {
    enrollment_id: {
      required: true,
      minLength: 3,
      maxLength: 20,
      message: 'Valid enrollment ID is required'
    },
    status: {
      required: true,
      enum: ['present', 'absent', 'half day'],
      message: 'Valid attendance status is required'
    },
    attendance_date: {
      required: true,
      type: 'date',
      message: 'Attendance date is required'
    },
    in_time: {
      required: false,
      type: 'time',
      message: 'Valid in time is required'
    },
    out_time: {
      required: false,
      type: 'time',
      message: 'Valid out time is required'
    }
  },

  // AdmitCard validations
  admitCard: {
    student_id: {
      required: true,
      type: 'objectId',
      message: 'Valid student ID is required'
    },
    university_id: {
      required: true,
      type: 'objectId',
      message: 'Valid university ID is required'
    },
    course_id: {
      required: true,
      type: 'objectId',
      message: 'Valid course ID is required'
    },
    semester: {
      required: true,
      type: 'number',
      min: 1,
      max: 8,
      message: 'Valid semester is required'
    },
    exam_type: {
      required: true,
      enum: ['midterm', 'final', 'quiz', 'assignment'],
      message: 'Valid exam type is required'
    },
    exam_date: {
      required: true,
      type: 'date',
      message: 'Exam date is required'
    },
    exam_time: {
      required: true,
      type: 'time',
      message: 'Exam time is required'
    },
    exam_center: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Exam center is required'
    },
    room_no: {
      required: true,
      minLength: 1,
      maxLength: 20,
      message: 'Room number is required'
    },
    status: {
      required: true,
      enum: ['active', 'inactive', 'cancelled'],
      message: 'Valid status is required'
    },
    subjects: {
      required: true,
      type: 'array',
      minItems: 1,
      message: 'At least one subject is required'
    },
    universityCode: {
      required: true,
      enum: ['GYAN001', 'GYAN002'],
      message: 'Valid university code is required'
    }
  },

  // Payment validations
  payment: {
    student_id: {
      required: true,
      type: 'objectId',
      message: 'Valid student ID is required'
    },
    amount: {
      required: true,
      type: 'number',
      min: 0,
      message: 'Valid amount is required'
    },
    emi_duedate: {
      required: true,
      type: 'date',
      message: 'EMI due date is required'
    },
    is_paid: {
      required: false,
      type: 'boolean',
      message: 'Payment status must be boolean'
    },
    payment_date: {
      required: false,
      type: 'date',
      message: 'Valid payment date is required'
    },
    txn_id: {
      required: false,
      minLength: 3,
      maxLength: 50,
      message: 'Valid transaction ID is required'
    },
    universityCode: {
      required: false,
      enum: ['GYAN001', 'GYAN002'],
      message: 'Valid university code is required'
    }
  }
};

// Validation utility functions
export const validateField = (value, rules) => {
  if (rules.required && (!value || value === '')) {
    return rules.message || 'This field is required';
  }

  if (value && rules.type) {
    switch (rules.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'number':
        if (isNaN(value) || isNaN(parseFloat(value))) {
          return 'Please enter a valid number';
        }
        break;
      case 'date':
        if (isNaN(Date.parse(value))) {
          return 'Please enter a valid date';
        }
        break;
      case 'time':
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(value)) {
          return 'Please enter a valid time (HH:MM)';
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          return 'Value must be true or false';
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          return 'Value must be an array';
        }
        break;
    }
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters long`;
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters long`;
  }

  if (value && rules.min && parseFloat(value) < rules.min) {
    return `Must be at least ${rules.min}`;
  }

  if (value && rules.max && parseFloat(value) > rules.max) {
    return `Must be no more than ${rules.max}`;
  }

  if (value && rules.enum && !rules.enum.includes(value)) {
    return `Must be one of: ${rules.enum.join(', ')}`;
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return rules.message || 'Invalid format';
  }

  if (value && rules.type === 'array' && rules.minItems && value.length < rules.minItems) {
    return `Must have at least ${rules.minItems} items`;
  }

  return null;
};

export const validateForm = (data, schema) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePartialForm = (data, schema, fieldsToValidate) => {
  const errors = {};
  
  fieldsToValidate.forEach(field => {
    if (schema[field]) {
      const error = validateField(data[field], schema[field]);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
