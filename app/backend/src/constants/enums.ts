export enum Categories {
  Essential = 'ESSENTIAL_EXPENSES',
  NonEssential = 'NON_ESSENTIAL_EXPENSES',
  Pleasures = 'PLEASURES',
  PersonalGrowth = 'PERSONAL_GROWTH',
}

export enum ErrorMessages {
  InvalidCredentials = 'Invalid credentials, check and try again',
  InvalidInput = 'Invalid input, check and try again',
  InternalServerError = 'Invalid server error, please contact the administrator',
  EntityNotFound = 'Entity not found',
  UniqueKeyViolation = 'Unique key constraint violation',
  Unauthorized = 'You are not authenticated, please log in and try again',
}
