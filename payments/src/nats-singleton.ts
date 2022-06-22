import nats, { Stan } from 'node-nats-streaming';


class NatsSingleton {
  private _client?: Stan;


  get client() {
    if (!this._client) {
      throw new Error('Uninitialized NATS client!');
    }
    return this._client;
  }


  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => resolve());
      this.client.on('error', (error) => reject(error));
    });
  }
}


export const natsSingleton = new NatsSingleton();  // singleton instance
