# Walrus Sites Setup Guide

## 1. Walrus CLI Kurulumu

### Windows

1. **Walrus CLI İndir**:
   ```powershell
   # GitHub releases sayfasından Windows binary'yi indirin
   # https://github.com/MystenLabs/walrus-docs/releases
   
   # İndirdiğiniz walrus.exe dosyasını bir klasöre taşıyın
   # Örnek: C:\walrus\walrus.exe
   ```

2. **PATH'e Ekleyin**:
   ```powershell
   # PowerShell'i Admin olarak açın
   $env:Path += ";C:\walrus"
   [Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::User)
   ```

3. **Test Edin**:
   ```powershell
   walrus --version
   ```

### macOS/Linux

```bash
# Walrus binary'yi indirin
curl -LO https://github.com/MystenLabs/walrus-docs/releases/latest/download/walrus

# Çalıştırılabilir yapın
chmod +x walrus

# PATH'e taşıyın
sudo mv walrus /usr/local/bin/

# Test edin
walrus --version
```

## 2. Walrus Konfigürasyonu

```bash
# Walrus config dizinini oluşturun
mkdir -p ~/.config/walrus

# Testnet konfigürasyonu
# Config dosyası otomatik oluşturulacak ilk çalıştırmada
```

## 3. Site Builder Kurulumu

### Cargo ile (Önerilen)

```bash
cargo install --git https://github.com/MystenLabs/walrus-sites.git site-builder
```

### Binary İndirme

1. https://github.com/MystenLabs/walrus-sites/releases adresine gidin
2. OS'nize uygun binary'yi indirin
3. PATH'e ekleyin

## 4. Deployment

Araçlar yüklendikten sonra:

```bash
cd sui-linktree/frontend

# Deploy et (10 epoch için)
site-builder deploy ./dist --epochs 10
```

## 5. Alternatif: Manuel Deployment

Walrus araçlarını yükleyemezseniz:

### Vercel Deployment

```bash
cd sui-linktree/frontend

# Vercel CLI yükleyin
npm install -g vercel

# Deploy edin
vercel --prod
```

### Netlify Deployment

```bash
# Netlify CLI yükleyin
npm install -g netlify-cli

# Deploy edin
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. GitHub repo oluşturun
2. `dist` klasörünü push edin
3. Settings → Pages → Deploy from branch

## 6. Test Etme

Deploy sonrası:

1. URL'yi tarayıcıda açın
2. Cüzdan bağlayın
3. Profil oluşturun
4. Link ekleyin

## Kaynaklar

- Walrus Docs: https://docs.wal.app/
- Walrus Sites Tutorial: https://docs.wal.app/walrus-sites/tutorial.html
- Site Builder Docs: https://docs.wal.app/walrus-sites/tutorial-install.html

