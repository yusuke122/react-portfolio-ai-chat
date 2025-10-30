// Debug utility for checking environment variables
export const debugEnvVars = () => {
  console.log('🔍 Environment Variables Debug:');
  console.log('VITE_HUGGINGFACE_API_TOKEN:', import.meta.env.VITE_HUGGINGFACE_API_TOKEN ? 
    `${import.meta.env.VITE_HUGGINGFACE_API_TOKEN.substring(0, 10)}...` : 'NOT SET');
  console.log('All env vars:', import.meta.env);
  
  const token = import.meta.env.VITE_HUGGINGFACE_API_TOKEN;
  const isValid = token && token !== 'your_token_here' && token.startsWith('hf_');
  
  console.log('Token is valid:', isValid);
  
  return {
    hasToken: !!token,
    isValid,
    tokenPreview: token ? `${token.substring(0, 10)}...` : 'N/A'
  };
};

export default debugEnvVars;