# About This Directory

This directory contains docker file to bring up [Grafana](https://grafana.com/) and [Prometheus](https://prometheus.io/) all together, remember this for testing purpose only.  
Once the docker file is up (`/docker-compose.yml`), you can see Promethues client at <http://localhost:9090> and grafa dashboard at <http://localhost:9000/d/PTSqcpJWk/nodejs-application-dashboard?orgId=1&refresh=10s>. You might need to load the dashboard JSON file `nodejs_application_dashboard.json` (`/metrics/grafana/provisioning/nodejs_application_dashboard.json`)
