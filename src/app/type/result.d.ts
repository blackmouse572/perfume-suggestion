export interface IResult {
  name: string;
  description: string;
  tags: string[];
  type: string;
  match: string;
  meta?: {
    image?: {
      src: string;
      height: number;
      width: number;
      contextLink?: string;
    };
    brand?: string;
    style?: string;
    incense?: string;
    origin?: string;
  };
}
