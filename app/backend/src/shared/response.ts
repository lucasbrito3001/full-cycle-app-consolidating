export class RequestOutput {
  constructor(
    public statusCode: number,
    public message: string,
    public data: any,
  ) {}
}
