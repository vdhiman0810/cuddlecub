@description('Name of the Azure Static Web App resource.')
param staticWebAppName string

@description('Azure Static Web Apps region. East US 2 is broadly supported for Static Web Apps.')
param location string = 'eastus2'

@description('Environment tag for the deployed resources.')
param environment string = 'prod'

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: ''
    branch: 'main'
    buildProperties: {
      appLocation: '/'
      outputLocation: ''
      skipGithubActionWorkflowGeneration: true
    }
  }
  tags: {
    app: 'cuddle-cub-day-care'
    environment: environment
  }
}

output defaultHostname string = staticWebApp.properties.defaultHostname
output staticWebAppName string = staticWebApp.name
