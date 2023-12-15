export interface IResult {
  name: string;
  description: string;
  tags: string[];
  type: string;
  match: string;
  meta?: {
    image: string;
    brand: string;
    style: string;
    incense: string;
    origin: string;
  };
}
