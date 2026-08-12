#!/bin/bash

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$IP" ]; then
  echo "IP를 가져올 수 없습니다."
  exit 1
fi

echo "현재 IP: $IP"

# FE/.env
sed -i '' "s|VITE_API_BASE_URL=http://[0-9.]*:8080|VITE_API_BASE_URL=http://$IP:8080|" FE/.env

# BE/application.yml
sed -i '' "s|redirect-uri: http://[0-9.]*:8080|redirect-uri: http://$IP:8080|" BE/src/main/resources/application.yml
sed -i '' "s|url: http://[0-9.]*:5173|url: http://$IP:5173|" BE/src/main/resources/application.yml

echo "완료: FE/.env, BE/application.yml 업데이트됨"
