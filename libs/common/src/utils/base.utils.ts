export const BaseUtils = {
  async wait(milliseconds: number): Promise<boolean> {
    return new Promise((res) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        res(true);
      }, milliseconds);
    });
  },
};
