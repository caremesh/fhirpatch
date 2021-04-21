/**
 * Generic error in applying a patch.
 */
class PatchError extends Error {
  /**
   *
   * @param  {...any} params parameters as for Error
   */
  constructor(...params) {
    super(...params);
  }
}

/**
 * Generic error in applying a patch.
 */
class PatchInvalidError extends PatchError {
  /**
   *
   * @param  {...any} params parameters as for Error
   */
  constructor(...params) {
    super(...params);
  }
}

/**
 * Generic error in applying a patch.
 */
class ResourceInvalidError extends PatchError {
  /**
   *
   * @param  {...any} params parameters as for Error
   */
  constructor(...params) {
    super(...params);
  }
}

/**
 * Generic error in applying a patch.
 */
class PathNotFoundError extends PatchError {
  /**
   *
   * @param  {...any} params parameters as for Error
   */
  constructor(...params) {
    super(...params);
  }
}

module.exports = {
  PatchError,
  PatchInvalidError,
  PathNotFoundError,
  ResourceInvalidError,
};
