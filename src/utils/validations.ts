// regex
export const urlRegex = /^(wss?:\/\/)(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})(:(\d{1,5}))?$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidUrl = (url: string) => {
  return urlRegex.test(url);
};

export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email);
};
