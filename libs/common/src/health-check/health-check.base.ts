import { ClientProxyBase, FetchFull } from '../rpc';
import { NodeState } from './health-check.type';
import { HealthIndicator } from './health-indicator.base';

export class HealthCheck {
  private microservices: (keyof FetchFull)[] = ['player', 'matchmaking', 'lootbox', 'settings', 'gameServerApi'];
  private startTime: string;

  constructor(
    private readonly currentService: keyof FetchFull,
    private readonly client: ClientProxyBase,
    private readonly healthIndicators: { [n in string]: HealthIndicator },
  ) {
    this.startTime = new Date().toJSON()
    this.microservices = this.microservices.filter((s) => s !== currentService);
  }

  async check(parentService: string | null, isInitial = false): Promise<NodeState | NodeState[]> {
    if (isInitial) {
      const nodes: NodeState[] = [];
      try {
        const isCommunicationConnected = await this.client.isConnected();
        if (!isCommunicationConnected) {
          return [
            {
              name: this.currentService,
              status: false,
              startTime: this.startTime,
              services: {
                communication: false,
              },
            },
          ];
        }
      } catch {
        return [
          {
            name: this.currentService,
            status: false,
            startTime: this.startTime,
            services: {
              communication: false,
            },
          },
        ];
      }

      for (const serviceName of this.microservices) {
        console.log({ serviceName });
        try {
          const nodeState = await this.client.fetch(`${serviceName}.common.ping.1` as any, this.currentService);
          nodes.push(nodeState);
        } catch (error) {
          nodes.push({
            name: serviceName,
            status: false,
            startTime: this.startTime,
            services: {},
          });
        }
      }
      const node = await this.checkCurrentNode();
      nodes.push(node);
      return nodes;
    } else {
      return this.checkCurrentNode();
    }
  }

  private async checkCurrentNode() {
    const currentNode: NodeState = {
      name: this.currentService,
      status: false,
      startTime: this.startTime,
      services: {},
    };
    for (const [name, healthIndicator] of Object.entries(this.healthIndicators)) {
      try {
        const state = await healthIndicator.isHealthy(name);
        for (let indicatorName in state) {
          const indicator = state[indicatorName];
          currentNode.services[indicatorName] = indicator.status === 'up';
        }
      } catch (error) {
        currentNode.services[name] = false;
      }
      currentNode.status = Object.values(currentNode.services).every((v) => v);
    }
    return currentNode;
  }
}
