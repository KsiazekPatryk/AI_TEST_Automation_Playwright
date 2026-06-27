export const API_ENDPOINTS = {
  authors: {
    base: '/authors',
    byId: (id: number) => `/authors/${id}`,
  },
  books: {
    base: '/books',
    byId: (id: number) => `/books/${id}`,
  },
};
