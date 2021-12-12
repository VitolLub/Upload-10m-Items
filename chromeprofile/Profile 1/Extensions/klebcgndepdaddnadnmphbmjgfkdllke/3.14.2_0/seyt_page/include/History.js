'use strict';

class History {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items.length = [];
  }
}
