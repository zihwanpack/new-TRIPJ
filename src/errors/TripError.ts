class TripError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'TripError';
    this.statusCode = statusCode;
  }
}

export default TripError;
