import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia, polygon, polygonMumbai, arbitrum, zora } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [arbitrum.id]: http(),
    [zora.id]: http(),
  },
})