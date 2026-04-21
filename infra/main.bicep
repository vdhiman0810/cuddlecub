@description('Globally unique Azure Storage account name. Use lowercase letters and numbers only, 3-24 characters.')
param storageAccountName string

@description('Azure region for the storage account.')
param location string = resourceGroup().location

@description('Environment tag for the deployed resources.')
param environment string = 'prod'

resource siteStorage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: true
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
  tags: {
    app: 'cuddle-cub-day-care'
    environment: environment
  }
}

output storageAccountName string = siteStorage.name
output primaryEndpoints object = siteStorage.properties.primaryEndpoints
