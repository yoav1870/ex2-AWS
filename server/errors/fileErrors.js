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
module.exports = { NotFoundCRUD, NotFoundUrlError };
