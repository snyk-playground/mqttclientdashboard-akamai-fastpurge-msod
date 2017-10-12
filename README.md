# Sample app for Akamai DevOps features
## Node JS sample app for Akamai Fast purge and Media Service On Demand Content Preparation transcoding callback endpoint

[![Known Vulnerabilities](https://snyk.io/test/github/aarlaud/mqttclientdashboard-akamai-fastpurge-msod/badge.svg)](https://snyk.io/test/github/aarlaud/mqttclientdashboard-akamai-fastpurge-msod)


Node JS running on Raspberry Pi to demonstrate the following features:
1. Fast purging
2. MSOD Transcoding webhook/callback upon transcoding job completion

### General setup
#### Fast Purge
Built a small node/express app to run the MOSCA MQTT broker (mosca.io) and display over http the current count of mqtt clients connected.
I then setup an Akamai delivery config in front of this origin and configured sureroute-test-object as well as page caching to cache the page for 365 days.
Not knowing when mqtt clients count could change (could be every seconds or every 6 months), I then use the Akamai Fast Purge to trigger invalidation upon client count change, caching for as long as possible but quickly purging upon change.
Edgegrid library provides everything needed => https://github.com/akamai/AkamaiOPEN-edgegrid-node
That should solve most concerns around the so called uncacheable but super popular content.

#### MSOD callback
As part of a simple video on demand workflow, we often setup a watch folder on Netstorage to then trigger transcoding jobs
This is well documented in Luna but wanted to have a working demo of the callback feature that you define in the MSOD assistant in Luna Control Center.
I added a couple of endpoints to listen to the calls made by the transcoding workflow engine to illustrate the data points a customer could expect upon each stage of a job completion.
It doesn't nothing more than displaying the content of the JSON returned.


#### Packages
- mosca
- express
- edgegrid
- body-parser

# How to use
1. download repository
2. run "npm install"
3. Follow Edgegrid setup to obtain your egdegrid settings and put them in akamai/.edgerc
3. Stand up an Akamai config for a hostname of your choice and update line 33 of main.js
4. node main.js
 
