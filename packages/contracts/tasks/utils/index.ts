export * from '@white-matrix/ethers-execution-manager';
import fs from 'fs';
import pino from 'pino';

const DEPLOYMENT_DIR = './deployment-artifacts';
const DEPLOYMENT_PATH = `${DEPLOYMENT_DIR}/deployment.json`;
export const LOCK_DIR = './logs';
export const RETRY_NUMBER = 1;

export async function getDeployment(network: string): Promise<Deployment> {
  if (!fs.existsSync(DEPLOYMENT_DIR)) {
    await fs.promises.mkdir(DEPLOYMENT_DIR);
  }
  const deploymentFull: DeploymentFull = JSON.parse(
    (await fs.promises.readFile(DEPLOYMENT_PATH)).toString()
  );
  if (deploymentFull[network]) {
    return deploymentFull[network];
  } else {
    return {} as Deployment;
  }
}

export async function setDeployment(
  network: string,
  deployment: Deployment
): Promise<void> {
  const deploymentFull: DeploymentFull = JSON.parse(
    (await fs.promises.readFile(DEPLOYMENT_PATH)).toString()
  );
  deploymentFull[network] = deployment;
  await fs.promises.writeFile(
    DEPLOYMENT_PATH,
    JSON.stringify(deploymentFull, undefined, 2)
  );
}

export const log = pino();

export const EMPTY_CONTRACT = {
  proxyAddress: '',
  implAddress: '',
  version: '',
  contract: '',
  operator: '',
  fromBlock: 0,
};

export interface ContractInfo {
  proxyAddress: string;
  implAddress: string;
  version: string;
  contract: string;
  operator: string;
  fromBlock: number;
}

export interface Deployment {
  amethystRoleManagement: ContractInfo;
}

export interface DeploymentFull {
  [network: string]: Deployment;
}
