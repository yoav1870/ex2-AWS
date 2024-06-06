class NotFoundCRUD extends Error {
  constructor() {
    super("Not Found CRUD error");
    this.status = 404;
    this.name = "NotFoundCRUD";
  }
}
class NotFoundUrlError extends Error {
  constructor() {
    super("Not Found url error");
    this.status = 404;
    this.name = "NotFoundUrlError";
  }
}
class NoFileError extends Error {
  constructor() {
    super("No file uploaded");
    this.status = 400;
    this.name = "NoFileError";
  }
}
module.exports = { NotFoundCRUD, NotFoundUrlError, NoFileError };
