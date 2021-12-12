'use strict';

/**
 * Примитивный класс очереди (FIFO), для удобства.
 */
class Queue {
  constructor() {
    this._data = [];
  }

  enqueue(v) {
    this._data.push(v);
  }

  dequeue() {
    return this._data.shift();
  }

  isEmpty() {
    return this._data.length === 0;
  }

  size() {
    return this._data.length;
  }
}
