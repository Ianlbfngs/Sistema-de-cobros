import axios from 'axios';

export const verifyBackendStatus = async (setApiOnline) => {
  try {
    await axios.get('http://localhost:8080/actuator/health');
    console.log('backend OK');
    setApiOnline(true);
    return true;
  } catch (error) {
    console.warn('backend is down');
    setApiOnline(false);
    return false;
  }
};