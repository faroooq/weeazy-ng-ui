# PROCESS TO RUN UI APPLICATION

Inspired by: https://github.com/wisniewskib

Login to server:
https://github.com/faroooq/weeazy-app.git
1. In server, goto: cd /home/bitnami/
2. Pull the changes from git
3. git pull -> username: faroooq, password: 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
4. npm i
5. sudo killall node
6. Restart apache: sudo /opt/bitnami/ctlscript.sh restart apache
7. Start server: forever start dist/weeazy-app/server/main.js

npm run build:ssr
git push origin main:main --no-verify

cd dist/weaazy-app/browser
http-server -c-1 .

Note: If deleted the dist folder from server, then need to copy 
templates (mails) folder to dist/server/ directory.

# Restart mongodb only if required
Note: No need to start mongodb database. once you restart the instance it will auto start. but apache needs to start
sudo service mongod restart

# Root
cd /home/bitnami/stackmi/dist/server

# Apache configs for new application
https://docs.bitnami.com/general/infrastructure/lamp/administration/use-htaccess/
https://daily-dev-tips.com/posts/hosting-angular-universal-on-a-server/
Remember: No changes need to the below commented locations.
<!-- /opt/bitnami/apache2/conf/
/opt/bitnami/apache/conf/bitnami -->
Below are newly created files:
------------------------------
/opt/bitnami/apache2/conf/vhosts/stackmi-https-vhost.conf
/opt/bitnami/apache2/conf/vhosts/stackmi-vhost.conf
# project root
/home/bitnami/projects/stackmi/dist/server
# Angular CLI commands
Create Component in specific module:
ng g c academy/home --module learnings

Create Module:
ng g m academy --routing learnings

# Others
Font-Awesome Icons:
https://fontawesome.com/v5.15/icons

Side Navbar:
https://bootstrapious.com/tutorial/sidebar/index5.html

# Git Personal access token
https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
username: faroooq
password: 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

# Open SSH AWS
ssh -i LightsailDefaultKey-ap-south-1.pem bitnami@15.65.1.254.143

# Issues:
ERR: Certificate invalid error or expired.

https://aws.amazon.com/premiumsupport/knowledge-center/linux-lightsail-ssl-bitnami/

Step 1: sudo /opt/bitnami/bncert-tool
Step 2: Answer necessary questions

# MongoDB compass client connect:
mongodb://root:3JoUhoD941Yx@65.1.254.143:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false

# Simple Angular Upgrade:
npm install -g npm-check-updates
ncu -u
npm update

# Caching is enabled by default. To disable caching run the following command:
ng config cli.cache.enabled false
To re-enable caching, set cli.cache.enabled to true.

# Cache environments
# By default, disk cache is only enabled for local environments.
To enable caching for all environments, run the following command:
ng config cli.cache.environment all

# Code deploy to aws CI/CD 
https://dev.to/aws-builders/application-deployment-in-amazon-lightsail-instance-using-aws-codepipeline-and-aws-codedeploy-5ae7