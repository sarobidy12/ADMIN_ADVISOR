export default interface Post {
  _id: string;
  title: string;
  description: string;
  imageWeb: any;
  imageMobile: any;
  postedAt: string;
  updatedAt: string;
  urlMobile: string;
  url: string;
  priority: number;
}