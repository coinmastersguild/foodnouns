declare module 'bs-custom-file-input';

declare module '*.svg' {
  const content: string;
}

declare module '*.png' {
  const content: string;

}
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
