#!/bin/bash

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx certbot python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2

# Create Strapi user
sudo useradd -m -s /bin/bash strapi
sudo usermod -aG sudo strapi

# Create PostgreSQL database and user
sudo -u postgres psql -c "CREATE USER strapi WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "CREATE DATABASE strapi_db OWNER strapi;"

# Configure Nginx
sudo tee /etc/nginx/sites-available/strapi << EOF
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the Nginx configuration
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate
sudo certbot --nginx -d your_domain.com

# Create backup script
sudo tee /usr/local/bin/backup-strapi << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/strapi"
DATE=\$(date +%Y%m%d)

# Create backup directory if it doesn't exist
mkdir -p \$BACKUP_DIR

# Backup PostgreSQL database
pg_dump -U strapi strapi_db > \$BACKUP_DIR/strapi_db_\$DATE.sql

# Backup Strapi uploads
tar -czf \$BACKUP_DIR/uploads_\$DATE.tar.gz /home/strapi/strapi/public/uploads

# Remove backups older than 7 days
find \$BACKUP_DIR -type f -mtime +7 -delete
EOF

# Make backup script executable
sudo chmod +x /usr/local/bin/backup-strapi

# Add backup to crontab
(crontab -l 2>/dev/null; echo "0 0 * * * /usr/local/bin/backup-strapi") | crontab -

# Create systemd service for Strapi
sudo tee /etc/systemd/system/strapi.service << EOF
[Unit]
Description=Strapi server
After=network.target

[Service]
Type=simple
User=strapi
WorkingDirectory=/home/strapi/strapi
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Enable and start Strapi service
sudo systemctl daemon-reload
sudo systemctl enable strapi
sudo systemctl start strapi

# Install monitoring tools
sudo apt install -y htop iotop

# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

echo "Strapi setup complete! Please update the following in the script:"
echo "1. Replace 'your_password' with your actual PostgreSQL password"
echo "2. Replace 'your_domain.com' with your actual domain"
echo "3. Update the backup directory path if needed"
echo "4. Configure your Strapi application settings" 