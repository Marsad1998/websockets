# WebSockets Setup Guide for Bitnami/Laravel

## Overview

This guide provides the complete configuration for setting up WebSockets in a Bitnami/Laravel environment using Laravel Reverb and Apache proxy configuration.

## ✅ Required Configuration Files

### 1. Apache WebSocket Configuration

**File:** `/opt/bitnami/apache2/conf/extra/httpd-websockets.conf` (New file)

```apache
<VirtualHost *:8081>
    ProxyPass "/" "ws://localhost:8080/app/aaokmzip3cio74osv4im"
    ProxyPassReverse "/" "ws://localhost:8080/app/aaokmzip3cio74osv4im"
</VirtualHost>
Listen 8081
```

### 2. Main Apache Configuration

**File:** `/opt/bitnami/apache2/conf/httpd.conf`

Add at the bottom of the file:

```apache
Include conf/extra/httpd-websockets.conf
```

### 3. Laravel Reverb Configuration

**File:** `/opt/bitnami/projects/websockets/config/reverb.php`

Modify the allowed_origins section:

```php
'allowed_origins' => [
    'http://websock.leads.ae',
    'https://websock.leads.ae',
    'http://localhost'
],
```

### 4. Supervisor Configuration

**File:** `/etc/supervisor/conf.d/reverb.conf`

Update the command line:

```text
command=/opt/bitnami/php/bin/php /opt/bitnami/projects/websockets/artisan reverb:start --port=8080
```

## 🔄 Files You Can Revert

These files can return to their original state since we're using dedicated port 8081:

-   `/opt/bitnami/apache2/conf/bitnami/bitnami.conf` (Remove WebSocket rules)
-   `/opt/bitnami/apache2/conf/bitnami/bitnami-ssl.conf`

## 🎯 Why This Configuration Works

### 1. Isolation

-   **Dedicated Port 8081**: Avoids conflicts with Bitnami's default VirtualHost configurations
-   **Clean Separation**: WebSocket traffic is completely isolated from web traffic

### 2. Simplicity

-   **Direct Proxy**: Simple proxy configuration without complex URL rewrites
-   **Minimal Changes**: Only 4 files need modification

### 3. Security

-   **Explicit Origin Whitelisting**: Only specified domains can establish WebSocket connections
-   **Controlled Access**: Clear security boundaries

### 4. Persistence

-   **Supervisor Management**: Keeps Laravel Reverb running automatically
-   **Auto-restart**: Service restarts on failure

## 📊 Verification & Testing

### WebSocket Connection Test

```bash
curl -i \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: $(openssl rand -base64 16)" \
  http://localhost:8081
```

**Expected Response:** HTTP 101 Switching Protocols

### Service Status Commands

```bash
# Check Apache status
sudo /opt/bitnami/ctlscript.sh status apache

# Check Supervisor status
sudo supervisorctl status reverb

# Restart services
sudo supervisorctl restart reverb
sudo /opt/bitnami/ctlscript.sh restart apache
```

## 🚀 Implementation Steps

1. **Create WebSocket Apache config:**

    ```bash
    sudo nano /opt/bitnami/apache2/conf/extra/httpd-websockets.conf
    ```

2. **Update main Apache config:**

    ```bash
    sudo nano /opt/bitnami/apache2/conf/httpd.conf
    # Add: Include conf/extra/httpd-websockets.conf
    ```

3. **Configure Laravel Reverb:**

    ```bash
    sudo nano /opt/bitnami/projects/websockets/config/reverb.php
    ```

4. **Update Supervisor config:**

    ```bash
    sudo nano /etc/supervisor/conf.d/reverb.conf
    ```

5. **Restart services:**

    ```bash
    sudo supervisorctl reread
    sudo supervisorctl update
    sudo supervisorctl restart reverb
    sudo /opt/bitnami/ctlscript.sh restart apache
    ```

6. **Verify configuration:**
    ```bash
    # Test WebSocket endpoint
    curl -i -H "Connection: Upgrade" -H "Upgrade: websocket" \
         -H "Sec-WebSocket-Key: $(openssl rand -base64 16)" \
         http://localhost:8081
    ```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use:**

    ```bash
    sudo netstat -tlnp | grep :8081
    sudo lsof -i :8081
    ```

2. **Apache Module Missing:**

    ```bash
    # Ensure proxy modules are enabled
    sudo a2enmod proxy
    sudo a2enmod proxy_http
    sudo a2enmod proxy_wstunnel
    ```

3. **Supervisor Not Starting:**
    ```bash
    sudo supervisorctl tail reverb
    sudo supervisorctl status
    ```

### Log Files

-   **Apache Logs:** `/opt/bitnami/apache2/logs/error_log`
-   **Laravel Logs:** `/opt/bitnami/projects/websockets/storage/logs/laravel.log`
-   **Supervisor Logs:** `/var/log/supervisor/reverb.log`

## 📝 Notes

-   Replace `aaokmzip3cio74osv4im` with your actual Pusher app key
-   Update domain names in `allowed_origins` to match your environment
-   This configuration uses port 8080 for Reverb and 8081 for the Apache proxy
-   The setup preserves Bitnami's default configuration while adding WebSocket support

## 🔐 Security Considerations

-   Always use HTTPS in production environments
-   Restrict `allowed_origins` to your specific domains
-   Consider implementing authentication for WebSocket connections
-   Monitor WebSocket traffic and connections
-   Regular security updates for all components

---

**Last Updated:** June 2025  
**Tested Environment:** Bitnami LAMP Stack with Laravel 10+
