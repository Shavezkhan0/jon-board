import { getPayload } from 'payload'
import importConfig from '@payload-config'

export async function getPayloadClient() {
  return await getPayload({
    config: importConfig,
  })
}