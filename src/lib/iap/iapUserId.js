let currentUserId = null;

export const setIapUserId = (userId) => {
  currentUserId = typeof userId === "string" && userId ? userId : null;
};

export const getIapUserId = () => currentUserId;
