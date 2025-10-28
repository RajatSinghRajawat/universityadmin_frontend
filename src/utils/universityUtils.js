// University utility functions
export const getUniversityCode = () => {
  const universityCode = localStorage.getItem('universityCode');
  if (!universityCode) {
    console.warn('University code not found in localStorage');
    return null;
  }
  return universityCode;
};

export const validateUniversityCode = () => {
  const universityCode = getUniversityCode();
  if (!universityCode) {
    throw new Error('University code not found. Please login again.');
  }
  return universityCode;
};

export const getUniversityInfo = () => {
  const universityCode = getUniversityCode();
  const universities = {
    'GYAN001': 'Kishangarh Girls College',
    'GYAN002': 'Kishangarh Law College'
  };
  
  return {
    code: universityCode,
    name: universities[universityCode] || 'Unknown University'
  };
};

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  const universityCode = localStorage.getItem('universityCode');
  return !!(token && universityCode);
};
