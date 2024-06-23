export type NodeState = {
  status: boolean;
  name: string;
  startTime: string;
  services: {
    [n in string]: boolean;
  };
};
