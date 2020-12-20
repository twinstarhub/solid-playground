declare module "global" {
  var $rollup: typeof import("rollup").rollup;
  var $babel: (
    code: string
  ) => ReturnType<typeof import("@babel/standalone").transform>;

  export { $rollup, $babel };
}

declare module "url:*" {
  var asset: string;
  export default asset;
}
