class VSCodeConfigMock {
  constructor(private readonly _data: { [key: string]: any }) {}

  get(key: string) {
    return this._data[key];
  }
}

export default VSCodeConfigMock;
