export const API_ENDPOINTS = {
  authors: {
    base: '/authors',
    byId: (id: number | string) => `/authors/${id}`,
  },
  books: {
    base: '/books',
    byId: (id: number) => `/books/${id}`,
  },
};
